import { db } from '$lib/server/drizzle.js';
import { answers, polls } from '$lib/server/schema/poll.js';
import { users } from '$lib/server/schema/user.js';
import { base64toUUID } from '$lib/utils.js';
import { eq } from 'drizzle-orm';

// HVFCzy6uRgqcBK7o9OtRpQ
// NDRjNjc4M2QtMjI2OC00MTRkLWIyYTMtMTI1YmZmOGJmZGJj

export async function load({ params }) {
	const slug = params.slug;

	const res = await db
		.select({
			id: polls.id,
			title: polls.title,
			type: polls.type,
			createdBy: polls.createdBy,
			creatorName: users.username,
			createdAt: polls.createdAt,
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
}
