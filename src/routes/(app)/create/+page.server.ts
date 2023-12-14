import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		console.log('session', session);
		// if no session use browser session
	}
};
