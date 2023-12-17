import { db } from '$lib/server/drizzle';
import { answers, insertPollRequest, polls } from '$lib/server/schema/poll';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		console.log('create poll... session', session);
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

		try {
			const res = await db.transaction(async (tx) => {
				const poll = await tx
					.insert(polls)
					.values({
						title: parsed.data.title,
						maxChoice: parsed.data.maxChoice,
						type: parsed.data.type,
						identifyVoteBy: 'cookie session',
						image: parsed.data.image
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
						parsed.data.answers.map((answer) => {
							return {
								pollId: poll[0].id,
								label: answer.label,
								image: answer.image
							};
						})
					)
					.returning({ id: answers.id });

				if (insertedAnswers.length !== parsed.data.answers.length) {
					tx.rollback();
					return {
						status: 'fail'
					};
				}

				return {
					status: 'success'
				};
			});
			if (res.status === 'fail') {
				return fail(500, {
					status: 'error',
					error: 'fail to insert poll'
				});
			}

			return {
				status: 'success',
				error: null
			};
		} catch (error) {
			console.log('error insert poll', error);
			return fail(500, {
				status: 'error',
				error: 'fail to insert poll'
			});
		}
	}
};
