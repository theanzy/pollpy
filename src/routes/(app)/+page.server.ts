import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { polls } from '$lib/server/schema/poll';
import { db } from '$lib/server/drizzle';
import { and, eq, inArray } from 'drizzle-orm';

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
		throw redirect(302, '/');
	},
	batchDelete: async ({ request, locals }) => {
		const form = await request.formData();
		const idsStr = form.get('ids') as string;
		const ids = JSON.parse(idsStr) as string[];
		if (!Array.isArray(ids) || !ids.length) {
			return fail(400, {
				error: 'Must have ids'
			});
		}

		const session = await locals.auth.validate();
		const user = session?.user;
		if (!user) {
			return fail(401, {
				error: 'You are not allowed to perform this action'
			});
		}

		const toDelete = await db
			.select()
			.from(polls)
			.where(and(eq(polls.createdBy, user.userId), inArray(polls.id, ids)));

		const idNotMatch = toDelete.find((p) => !ids.includes(p.id));
		if (idNotMatch) {
			return fail(400, {
				error: 'Cannot delete poll not owned by you'
			});
		}
		// delete ids
		await db.delete(polls).where(
			inArray(
				polls.id,
				toDelete.map((p) => p.id)
			)
		);
		return {
			status: 'success'
		};
	}
};
