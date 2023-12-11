import { bigint, text } from 'drizzle-orm/pg-core';
import { mySchema } from './schema';

export const users = mySchema.table('users', {
	id: text('id').primaryKey(),
	username: text('username')
});

export const userKeys = mySchema.table('user_keys', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	hashedPassword: text('hashed_password')
});

export const userSessions = mySchema.table('user_sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull()
});
