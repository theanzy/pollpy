import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!cookies.get('pollpy_guest_session')) {
		cookies.set('pollpy_guest_session', crypto.randomUUID(), {
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
