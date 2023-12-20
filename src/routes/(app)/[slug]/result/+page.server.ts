import { eq, sql } from 'drizzle-orm';

import { db } from '$lib/server/drizzle';
import { answers, polls, votes } from '$lib/server/schema/poll';
import { base64toUUID } from '$lib/server/utils';
import { users } from '$lib/server/schema/user';

export async function load({ params }) {
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
				creatorName: sql<string>`coalesce(${users.username}, 'a guest')`
			})
			.from(polls)
			.leftJoin(users, eq(users.id, polls.createdBy))
			.where(() => eq(polls.id, pollId));
		const poll = pollRes[0];
		if (!poll?.id) {
			return {
				pollResult: null
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
		console.log('result', result);
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
