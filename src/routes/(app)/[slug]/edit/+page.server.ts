import { fail } from '@sveltejs/kit';
import { and, eq, isNull, lte, or } from 'drizzle-orm';
import { db } from '$lib/server/drizzle.js';

import {
	answers,
	polls,
	votes,
	updatePollRequest,
	type PollWithAnswers
} from '$lib/server/schema/poll.js';
import { users } from '$lib/server/schema/user.js';
import { base64toUUID } from '$lib/server/utils.js';
import { parseISO } from 'date-fns';

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
				image: polls.image,
				description: polls.description,
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

export const actions = {
	async edit({ locals, params, request }) {
		try {
			const session = await locals.auth.validate();

			const user = session?.user;

			// validation
			// auth validation
			if (!user) {
				return fail(401, {
					status: 'unauthorized',
					error: 'Please sign in'
				});
			}

			// input validation
			const form = await request.formData();
			const formdata = Object.fromEntries(form) as unknown as Record<
				string,
				string | number | Date
			>;
			formdata.answers = JSON.parse(formdata.answers as string);
			formdata.maxChoice = parseInt(formdata.maxChoice as string);
			if (formdata.closedAt) {
				formdata.closedAt = parseISO(formdata.closedAt as string);
			}

			const parsed = updatePollRequest.safeParse(formdata);
			if (parsed.success === false) {
				console.log('err', JSON.stringify(parsed.error, null, 2));
				const errors = Object.entries(parsed.error.flatten().fieldErrors)
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					.map(([_, v]) => v?.[0])
					.join('. ');
				console.log('errors ', errors);
				return fail(400, {
					status: 'invalid',
					error: errors
				});
			}

			const pollId = base64toUUID(params.slug);

			// poll validation
			const existingPolls = await db
				.select({ id: polls.id, createdBy: polls.createdBy, closed: polls.closedAt })
				.from(polls)
				.where(
					and(eq(polls.id, pollId), or(isNull(polls.closedAt), lte(polls.closedAt, new Date())))
				);
			const poll = existingPolls?.[0];
			if (!poll) {
				return fail(400, {
					status: 'invalid',
					error: 'Cannot edit this poll'
				});
			}

			if (poll.createdBy !== user.userId) {
				return fail(400, {
					status: 'unauthorized',
					error: 'Not allowed to edit this poll'
				});
			}
			// check votes
			const existingVotes = await db
				.select({ id: votes.id })
				.from(votes)
				.where(eq(votes.pollId, poll.id));
			if (existingVotes.length) {
				return fail(400, {
					status: 'invalid',
					error: 'This poll already has votes.'
				});
			}

			// update
			const data = parsed.data;
			const res = await db.transaction(async (tx) => {
				console.log('update iamge', data.image);
				const updatedPoll = await tx
					.update(polls)
					.set({
						title: data.title,
						image: data.image || null,
						description: data.description,
						maxChoice: data.maxChoice,
						type: data.type,
						identifyVoteBy: data.identifyVoteBy,
						closedAt: data.closedAt
					})
					.where(eq(polls.id, poll.id))
					.returning({
						id: polls.id
					});
				if (!updatedPoll[0]?.id) {
					tx.rollback();
					return {
						status: 'fail'
					};
				}

				const oldAnswers = await tx
					.delete(answers)
					.where(eq(answers.pollId, poll.id))
					.returning({ id: answers.id });

				if (oldAnswers.length === 0) {
					tx.rollback();
					return {
						status: 'fail'
					};
				}

				const insertedAnswers = await tx
					.insert(answers)
					.values(
						data.answers.map((answer) => {
							return {
								pollId: updatedPoll[0].id,
								label: answer.label,
								image: answer.image
							};
						})
					)
					.returning({ id: answers.id });

				if (insertedAnswers.length !== data.answers.length) {
					tx.rollback();
					return {
						status: 'fail'
					};
				}
				return {
					status: 'success',
					pollId: updatedPoll[0]?.id
				};
			});

			if (res.status === 'fail') {
				return fail(400, {
					status: 'error',
					error: 'Cannot update poll'
				});
			}
			return {
				status: 'success'
			};
		} catch (error) {
			console.log('edit poll error', error);
			return fail(500, {
				error: 'Something went wrong'
			});
		}
	}
};
