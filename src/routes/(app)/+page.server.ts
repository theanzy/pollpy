import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	return {
		user: session?.user
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/login');
	}
};
