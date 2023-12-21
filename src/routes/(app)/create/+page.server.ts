import { db } from '$lib/server/drizzle';
import { answers, insertPollRequest, polls, type InsertPollRequest } from '$lib/server/schema/poll';
import { uuidToBase64 } from '$lib/server/utils';
import { fail, type Actions } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	return {
		user: session?.user
	};
};

export const actions: Actions = {
	add: async ({ locals, request, cookies }) => {
		const session = await locals.auth.validate();
		// if no session use browser session
		const formdata = await request.formData();
		console.log('formdata...', formdata);
		const data = Object.fromEntries(formdata) as unknown as Record<string, string | number>;
		data.answers = JSON.parse(data.answers as string);
		data.maxChoice = parseInt(data.maxChoice as string);
		console.log('data', data);
		const parsed = insertPollRequest.safeParse(data);
		console.log('parsed', parsed);
		if (!parsed.success) {
			console.log('err', parsed.error);
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
		const creatorId = session?.user?.userId ?? (cookies.get('pollpy_guest_session') as string);
		if (!creatorId) {
			return fail(401, {
				status: 'Unauthorized',
				error: 'You are not allowed do perform this action'
			});
		}
		try {
			const res = await insertPoll(parsed.data, creatorId);
			if (res.status === 'fail') {
				return fail(500, {
					status: 'error',
					error: 'fail to insert poll'
				});
			}

			return {
				status: 'success',
				slug: uuidToBase64(res.pollId as string),
				error: null
			};
		} catch (error) {
			console.log('error insert poll', error);
			return fail(500, {
				status: 'error',
				error: 'fail to insert poll'
			});
		}
	},
	draft: async ({ locals, request }) => {
		try {
			const session = await locals.auth.validate();
			if (!session?.user) {
				return fail(401, {
					status: 'unauthorized',
					message: 'Sign in to use this function'
				});
			}

			// input
			const formdata = await request.formData();
			const data = Object.fromEntries(formdata) as unknown as Record<string, string | number>;
			data.answers = JSON.parse(data.answers as string);
			data.maxChoice = parseInt(data.maxChoice as string);

			// validation
			const parsed = insertPollRequest.safeParse(data);
			if (!parsed.success) {
				console.log('err', parsed.error);
				const errors = Object.entries(parsed.error.flatten().fieldErrors)
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					.map(([_, v]) => v?.[0])
					.join('. ');
				return fail(400, {
					status: 'invalid',
					error: errors
				});
			}

			const creatorId = session.user.userId;
			const pollData = parsed.data;
			pollData.status = 'draft';
			const res = await insertPoll(pollData, creatorId);
			if (res.status === 'fail') {
				return fail(500, {
					status: 'error',
					error: 'fail to insert poll'
				});
			}
			return {
				status: 'success',
				slug: uuidToBase64(res.pollId as string),
				error: null
			};
		} catch (error) {
			console.log('error save as draft', error);
			return fail(500, {
				status: 'error',
				error: 'something went wrong'
			});
		}
	}
};

async function insertPoll(data: InsertPollRequest, creatorId: string) {
	const res = await db.transaction(async (tx) => {
		const poll = await tx
			.insert(polls)
			.values({
				title: data.title,
				maxChoice: data.maxChoice,
				type: data.type,
				identifyVoteBy: 'cookie session',
				image: data.image,
				createdBy: creatorId,
				status: data.status
			})
			.returning({
				id: polls.id
			});
		if (!poll[0]?.id) {
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
						pollId: poll[0].id,
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
			pollId: poll[0]?.id
		};
	});
	return res;
}
