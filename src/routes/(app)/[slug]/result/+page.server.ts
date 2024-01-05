import { and, eq, sql } from 'drizzle-orm';

import { db } from '$lib/server/drizzle';
import { answers, polls, votes, type ResultVisibility } from '$lib/server/schema/poll';
import { base64toUUID, sha256 } from '$lib/server/utils';
import { users } from '$lib/server/schema/user';
import { differenceInSeconds } from 'date-fns';

export async function load({ params, getClientAddress, locals, cookies }) {
	const session = await locals.auth.validate();
	const slug = params.slug;
	const pollId = base64toUUID(slug);
	try {
		// existing poll
		const pollRes = await db
			.select({
				id: polls.id,
				title: polls.title,
				image: polls.image,
				type: polls.type,
				maxChoice: polls.maxChoice,
				identifyVoteBy: polls.identifyVoteBy,
				createdBy: polls.createdBy,
				createdAt: polls.createdAt,
				closedAt: polls.closedAt,
				resultVisibility: polls.resultVisibility,
				creatorName: sql<string>`coalesce(${users.username}, 'a guest')`
			})
			.from(polls)
			.leftJoin(users, eq(users.id, polls.createdBy))
			.where(() => and(eq(polls.id, pollId), eq(polls.status, 'active')));
		const poll = pollRes[0];
		if (!poll?.id) {
			return {
				pollResult: null
			};
		}

		const resultVisibility = poll.resultVisibility as ResultVisibility;
		let isVisible = resultVisibility === 'public';

		// get voter key
		let voterKey: string = '';
		const identifyVoteBy = poll.identifyVoteBy;
		const guestSessionId = cookies.get('pollpy_guest_session');
		if (identifyVoteBy === 'ip') {
			const ip = getClientAddress();
			const ipHashed = await sha256(ip);
			voterKey = ipHashed;
		} else if (identifyVoteBy === 'cookie session') {
			voterKey = guestSessionId ?? '';
		} else if (identifyVoteBy === 'free user') {
			voterKey = session?.user.userId ?? '';
		}

		if (resultVisibility === 'after vote') {
			const userVoteResult = await db
				.select({
					id: votes.id
				})
				.from(votes)
				.where(and(eq(votes.pollId, poll.id), eq(votes.voterKey, voterKey)));
			isVisible = userVoteResult.length > 0;
		} else if (resultVisibility === 'after poll end') {
			if (poll.closedAt) {
				console.log(
					'differenceInSeconds(poll.closedAt, new Date())',
					differenceInSeconds(poll.closedAt, new Date())
				);
				isVisible = differenceInSeconds(poll.closedAt, new Date()) >= 0;
			}
		}

		if (!isVisible) {
			return {
				pollResult: {
					isVisible: false,
					poll,
					result: [],
					totalVotes: 0
				}
			};
		}

		const voteCountQuery = db.$with('vote_count').as(
			db
				.select({
					answerId: answers.id,
					voteCount: sql<number>`cast(count(${votes.answerId}) as int)`.as('vote_count')
				})
				.from(answers)
				.leftJoin(votes, eq(votes.answerId, answers.id))
				.groupBy(answers.id, votes.answerId)
				.where(eq(answers.pollId, pollId))
		);

		const result = await db
			.with(voteCountQuery)
			.select({
				answer: answers,
				count: voteCountQuery.voteCount
			})
			.from(answers)
			.innerJoin(voteCountQuery, eq(answers.id, voteCountQuery.answerId));
		if (result.length === 0) {
			return {
				pollResult: null
			};
		}
		const totalVotes = result.reduce((total, r) => {
			return r.count + total;
		}, 0);

		return {
			pollResult: {
				isVisible: true,
				poll,
				result,
				totalVotes
			}
		};
	} catch (error) {
		console.log('error', error);
		return {
			pollResult: null
		};
	}
}
