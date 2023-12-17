import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		console.log('create poll... session', session);
		// if no session use browser session
		const formdata = await request.formData();
		console.log('formdata...', formdata);
	}
};
