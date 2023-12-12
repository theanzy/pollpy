import { auth } from '$lib/server/lucia';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formdata = await request.formData();
		const data = Object.fromEntries(formdata) as Record<string, string>;

		// basic check
		if (typeof data.username !== 'string' || data.username.length < 1) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof data.password !== 'string' || data.password.length < 1) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: data.username.toLowerCase(), // unique id when using "username" auth method
					password: data.password // hashed by Lucia
				},
				attributes: {
					username: data.username
				}
			});
			console.log('session', user);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			// this part depends on the database you're using
			// check for unique constraint error in user table
			// if (e instanceof SomeDatabaseError && e.message === USER_TABLE_UNIQUE_CONSTRAINT_ERROR) {
			// 	return fail(400, {
			// 		message: 'Username already taken'
			// 	});
			// }
			console.log('error register', e);
			return fail(500, {
				message: 'Fail to register'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		console.log('redirect');
		throw redirect(302, '/');
	}
};
