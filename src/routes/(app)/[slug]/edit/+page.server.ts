import { db } from '$lib/server/drizzle.js';
import { answers, polls, votes, type PollWithAnswers } from '$lib/server/schema/poll.js';
import { users } from '$lib/server/schema/user.js';
import { base64toUUID } from '$lib/server/utils.js';
import { eq } from 'drizzle-orm';

export async function load({ params, locals, cookies, depends }) {
	depends('poll');
	const session = await locals.auth.validate();
	const slug = params.slug;
	try {
		const pollId = base64toUUID(slug);
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
				status: polls.status,
				answer: answers
			})
			.from(polls)
			.leftJoin(users, eq(users.id, polls.createdBy))
			.innerJoin(answers, eq(polls.id, answers.pollId))
			.where(eq(polls.id, pollId));
		const poll = res[0];
		if (!poll) {
			return {
				error: 'Poll not found',
				poll: null
			};
		}

		if (poll.status === 'draft' && poll.createdBy !== session?.user.userId) {
			return {
				error: 'You are not allowed to edit this poll',
				poll: null
			};
		}

		const pollVotes = await db
			.select({ id: votes.id })
			.from(votes)
			.where(eq(votes.pollId, pollId))
			.limit(1);
		if (pollVotes.length) {
			return {
				error: 'Cannot delete this poll. There are already votes in this poll.',
				poll: null
			};
		}

		const creatorId = session?.user?.userId ?? cookies.get('pollpy_guest_session');
		console.log('creatorId', poll.createdBy, creatorId);
		if (creatorId !== poll.createdBy) {
			return {
				error: 'You are not allowed to edit this poll',
				poll: null
			};
		}

		poll.creatorName = poll.creatorName ?? 'a guest';

		const result = res.reduce(
			(result, poll) => {
				if (!result.answers) {
					result.answers = [];
				}
				result.answers.push(poll.answer);
				return result;
			},
			poll as unknown as PollWithAnswers
		);
		if ('answer' in result) {
			delete result['answer'];
		}
		console.log('result poll', result);

		return {
			poll: result
		};
	} catch (error) {
		console.log('error', error);
		return {
			poll: null
		};
	}
}
