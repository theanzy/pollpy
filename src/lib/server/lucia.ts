import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql';
import { google } from '@lucia-auth/oauth/providers';

import { dev } from '$app/environment';
import postgres from 'postgres';
import {
	DATABASE_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URL
} from '$env/static/private';

const sql = postgres(DATABASE_URL);

// expect error (see next section)
export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: postgresAdapter(sql, {
		user: 'pollpy.users',
		key: 'pollpy.user_keys',
		session: 'pollpy.user_sessions'
	}),
	getUserAttributes: (data) => {
		return {
			username: data.username
		};
	}
});

export const googleAuth = google(auth, {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: GOOGLE_REDIRECT_URL
});

export type Auth = typeof auth;
