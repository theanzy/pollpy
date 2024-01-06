import { db } from '$lib/server/drizzle.js';
import { polls } from '$lib/server/schema/poll.js';
import { uuidToBase64 } from '$lib/server/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';

export async function load({ locals, url, depends }) {
	depends('/polls');
	const session = await locals.auth.validate();
	if (!session?.user) {
		throw redirect(301, '/');
	}
	const searchParams = url.searchParams;
	let pollStatus = 'active';
	const searchStatus = searchParams.get('status');
	if (searchStatus) {
		pollStatus = searchStatus;
	}
	console.log('pollStatus', pollStatus);
	try {
		const pollRes = await db
			.select({
				id: polls.id,
				title: polls.title,
				identifyVoteBy: polls.identifyVoteBy,
				createdAt: polls.createdAt,
				closedAt: polls.closedAt,
				slug: sql<string>`${polls.id}`.mapWith((v) => uuidToBase64(v))
			})
			.from(polls)
			.where(() => and(eq(polls.createdBy, session.user.userId), eq(polls.status, pollStatus)))
			.orderBy(polls.createdAt);
		return {
			polls: pollRes
		};
	} catch (error) {
		console.log('err load user polls', error);
		return fail(500, {
			status: 'error',
			error: 'Something went wrong'
		});
	}
}
