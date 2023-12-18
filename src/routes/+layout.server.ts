import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!cookies.get('pollpy_guess_session')) {
		cookies.set('pollpy_guess_session', crypto.randomUUID(), {
			httpOnly: true,
			sameSite: 'lax',
			secure: dev,
			path: '/'
		});
	}
	return {
		user: session?.user
	};
};
