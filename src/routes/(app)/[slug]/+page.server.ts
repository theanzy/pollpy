import { db } from '$lib/server/drizzle.js';
import { answers, polls, votes } from '$lib/server/schema/poll.js';
import { users } from '$lib/server/schema/user.js';
import { base64toUUID, sha256 } from '$lib/server/utils.js';
import { fail } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';

export async function load({ params }) {
	const slug = params.slug;
	try {
		const res = await db
			.select({
				id: polls.id,
				title: polls.title,
				type: polls.type,
				createdBy: polls.createdBy,
				creatorName: users.username,
				createdAt: polls.createdAt,
				maxChoice: polls.maxChoice,
				identifyVoteBy: polls.identifyVoteBy,
				answer: answers
			})
			.from(polls)
			.leftJoin(users, eq(users.id, polls.createdBy))
			.innerJoin(answers, eq(polls.id, answers.pollId))
			.where(eq(polls.id, base64toUUID(slug)));

		type PollWithAnswers = Omit<(typeof res)[0], 'answer'> & {
			answers: Array<(typeof res)[0]['answer']>;
		};

		if (res[0]) {
			res[0].creatorName = res[0].creatorName ?? 'a guest';
			const result = res.reduce(
				(result, poll) => {
					if (!result.answers) {
						result.answers = [];
					}
					result.answers.push(poll.answer);
					return result;
				},
				res[0] as unknown as PollWithAnswers
			);
			if ('answer' in result) {
				delete result['answer'];
			}
			console.log('res[0]', result);
			return {
				poll: result
			};
		}
		return {
			poll: null
		};
	} catch (error) {
		console.log('error', error);
		return {
			poll: null
		};
	}
}

export const actions = {
	async vote({ request, locals, cookies, getClientAddress }) {
		const formdata = await request.formData();
		const answersStr = formdata.get('answers') as string;
		const answerIds = JSON.parse(answersStr) as string[];
		const pollId = formdata.get('pollId') as string;
		const session = await locals.auth.validate();
		const guestSessionId = cookies.get('pollpy_guess_session');

		// validation
		if (Array.isArray(answerIds) === false) {
			return fail(400, {
				status: 'invalid',
				error: 'Invalid vote'
			});
		}

		const existingPolls = await db
			.select({
				id: polls.id,
				identifyVoteBy: polls.identifyVoteBy,
				maxChoice: polls.maxChoice
			})
			.from(polls)
			.innerJoin(answers, eq(answers.pollId, polls.id))
			.where(() => eq(polls.id, pollId));

		if (!existingPolls[0]) {
			return fail(400, {
				status: 'invalid',
				error: 'Invalid vote'
			});
		}
		const poll = existingPolls[0];

		let voterKey: string = '';
		const identifyVoteBy = poll.identifyVoteBy;
		if (identifyVoteBy === 'ip') {
			const ip = getClientAddress();
			const ipHashed = await sha256(ip);
			voterKey = ipHashed;
		} else if (identifyVoteBy === 'cookie session') {
			voterKey = guestSessionId ?? '';
		} else if (identifyVoteBy === 'free user') {
			voterKey = session?.user.userId ?? '';
		}

		if (!voterKey?.length) {
			console.log('error: invalid voterId');
			return fail(400, {
				status: 'invalid',
				error: 'Invalid vote'
			});
		}

		const existingVotes = await db
			.select({ id: votes.id })
			.from(votes)
			.where(() => and(eq(votes.pollId, poll.id), eq(votes.voterKey, voterKey)));
		if (existingVotes.length) {
			return fail(400, {
				status: 'invalid',
				error: 'You have already voted on this poll'
			});
		}

		// find valid poll answers
		const pollAnswers = await db
			.select({
				answerId: answers.id
			})
			.from(polls)
			.innerJoin(answers, eq(answers.pollId, polls.id))
			.where(() => and(eq(polls.id, poll.id), inArray(answers.id, answerIds)));

		if (pollAnswers.length === 0) {
			return fail(400, {
				status: 'invalid',
				error: 'Please choose at least one valid vote'
			});
		}

		if (pollAnswers.length > poll.maxChoice) {
			return fail(400, {
				status: 'invalid',
				error: `Votes cannot be more than ${poll.maxChoice}`
			});
		}

		// insert votes
		await db.insert(votes).values(
			pollAnswers.map((answer) => ({
				pollId: poll.id,
				answerId: answer.answerId,
				voterKey: voterKey
			}))
		);

		console.log('poll', pollAnswers);
		return {
			status: 'success'
		};
	}
};
