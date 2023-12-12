import { fail, type Actions, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';

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
			const username = data.username.toLowerCase();
			const password = data.password;
			const key = await auth.useKey('username', username, password);

			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			console.log('error login', e);
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}

			return fail(500, {
				message: 'Fail to sign in'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		console.log('redirect');
		throw redirect(302, '/');
	}
};
