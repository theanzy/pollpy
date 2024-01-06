import { db } from '$lib/server/drizzle.js';
import { answers, polls, votes, type PollWithAnswers } from '$lib/server/schema/poll.js';
import { users } from '$lib/server/schema/user.js';
import { base64toUUID, sha256 } from '$lib/server/utils.js';
import { fail } from '@sveltejs/kit';
import { differenceInSeconds } from 'date-fns';
import { and, eq, inArray } from 'drizzle-orm';

export async function load({ params, locals, cookies, depends }) {
	depends('poll');
	const session = await locals.auth.validate();
	const slug = params.slug;
	try {
		const res = await db
			.select({
				id: polls.id,
				description: polls.description,
				image: polls.image,
				title: polls.title,
				type: polls.type,
				createdBy: polls.createdBy,
				creatorName: users.username,
				createdAt: polls.createdAt,
				maxChoice: polls.maxChoice,
				identifyVoteBy: polls.identifyVoteBy,
				status: polls.status,
				answer: answers,
				closedAt: polls.closedAt,
				flags: polls.flags
			})
			.from(polls)
			.leftJoin(users, eq(users.id, polls.createdBy))
			.innerJoin(answers, eq(polls.id, answers.pollId))
			.where(eq(polls.id, base64toUUID(slug)));
		const poll = res[0];

		if (poll.status === 'draft' && poll.createdBy !== session?.user.userId) {
			return {
				poll: null
			};
		}

		if (poll) {
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
			const creatorId = session?.user?.userId ?? cookies.get('pollpy_guest_session');
			console.log('createdId', res[0].createdBy, creatorId);
			return {
				createdByMe: creatorId === res[0].createdBy,
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
		const guestSessionId = cookies.get('pollpy_guest_session');

		// validation
		if (Array.isArray(answerIds) === false) {
			return fail(400, {
				status: 'invalid',
				error: 'Invalid vote'
			});
		}

		try {
			const existingPolls = await db
				.select({
					id: polls.id,
					identifyVoteBy: polls.identifyVoteBy,
					maxChoice: polls.maxChoice,
					closedAt: polls.closedAt
				})
				.from(polls)
				.innerJoin(answers, eq(answers.pollId, polls.id))
				.where(() => and(eq(polls.id, pollId), eq(polls.status, 'active')));

			if (!existingPolls[0]) {
				return fail(400, {
					status: 'invalid',
					error: 'Invalid vote'
				});
			}
			const poll = existingPolls[0];

			if (poll.identifyVoteBy === 'free user' && !session?.user) {
				return fail(401, {
					status: 'unauthorized',
					error: 'Please sign in to vote'
				});
			}

			// check poll closed
			if (poll.closedAt && differenceInSeconds(poll.closedAt, new Date()) < 0) {
				return fail(401, {
					status: 'invalid',
					error: 'This poll is already closed'
				});
			}
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
		} catch (error) {
			console.log('vote poll error', error);
			return fail(500, {
				status: 'failure',
				error: 'Something went wrong'
			});
		}
	},
	async delete({ locals, cookies, params }) {
		try {
			const session = await locals.auth.validate();
			const guestid = cookies.get('pollpy_guest_session');
			if (!session && guestid) {
				const userRes = await db
					.select({ id: users.id })
					.from(users)
					.where(() => eq(users.id, guestid));
				if (userRes[0]) {
					return fail(400, {
						status: 'unauthorized',
						error: 'You are not allowed to delete this poll'
					});
				}
			}

			const creatorId = session?.user.userId ?? guestid;
			if (!creatorId) {
				return fail(400, {
					status: 'unauthorized',
					error: 'You are not allowed to delete this poll'
				});
			}
			const pollRes = await db
				.select({ id: polls.id })
				.from(polls)
				.where(() => and(eq(polls.createdBy, creatorId), eq(polls.id, base64toUUID(params.slug))));
			const poll = pollRes[0];
			if (!poll) {
				return fail(400, {
					status: 'unauthorized',
					error: 'You are not allowed to delete this poll'
				});
			}
			await db.delete(polls).where(eq(polls.id, poll.id));

			return {
				status: 'success'
			};
		} catch (error) {
			console.log('delete poll error', error);
			return fail(500, {
				status: 'error',
				error: 'Something went wrong'
			});
		}
	},
	async activate({ locals, params }) {
		try {
			const session = await locals.auth.validate();
			if (!session?.user) {
				return fail(401, {
					status: 'unauthorized',
					error: 'You are not allowed to perform this action'
				});
			}

			const pollId = base64toUUID(params.slug);
			const pollRes = await db
				.select({ id: polls.id })
				.from(polls)
				.where(() => and(eq(polls.id, pollId), eq(polls.createdBy, session.user.userId)));
			if (!pollRes[0]) {
				return fail(400, {
					status: 'invalid',
					error: 'Cannot activate this poll'
				});
			}
			await db
				.update(polls)
				.set({
					status: 'active'
				})
				.where(eq(polls.id, pollId));
			return {
				status: 'success'
			};
		} catch (error) {
			console.log('error activate poll', error);
			return fail(500, {
				status: 'error',
				error: 'someting went wrong'
			});
		}
	}
};
