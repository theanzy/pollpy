import { date, integer, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { mySchema } from './schema';
import { sql } from 'drizzle-orm';

export const polls = mySchema.table('polls', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	title: varchar('title', {
		length: 256
	}).notNull(),
	image: text('image'),
	type: varchar('type', {
		length: 256
	}).notNull(),
	maxChoice: integer('max_choices').notNull(),
	identifyVoteBy: varchar('identify_vote_by', {
		length: 256
	}).notNull(),
	createdBy: text('created_by').notNull(),
	createdAt: date('created_at').notNull().defaultNow(),
	closedAt: date('closed_at')
});

export const insertPollSchema = createInsertSchema(polls, {
	title: (schema) => schema.title.min(1, 'title is required').max(256, 'title is too long'),
	image: (schema) =>
		schema.image
			.url('invalid image url')
			.startsWith('https://', {
				message: 'image url must be https'
			})
			.optional(),
	type: (schema) => schema.type.min(1, 'type is required').max(256, 'type is too long'),
	maxChoice: (schema) => schema.maxChoice.min(1, 'maxChoice is too low. minimum is 1'),
	identifyVoteBy: (schema) =>
		schema.identifyVoteBy.min(1, 'maxChoice is too low. minimum is 1').optional(),
	createdBy: (schema) => schema.createdBy.optional(),
	createdAt: (schema) => schema.createdAt.datetime('created At is not a valid date').optional()
});

export const answers = mySchema.table('answers', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	label: varchar('label', {
		length: 256
	}),
	image: text('image'),
	pollId: uuid('poll_id')
		.references(() => polls.id, { onDelete: 'cascade' })
		.notNull()
});

const insertImageAnswerSchema = createInsertSchema(answers, {
	pollId: (schema) => schema.pollId.optional(),
	label: (schema) => schema.label.max(256, 'label is too long').optional(),
	image: (schema) =>
		schema.image
			.url('image url is invalid')
			.startsWith('https://', {
				message: 'image url must be https'
			})
			.min(1, 'image is required')
})
	.required({
		image: true
	})
	.omit({
		id: true
	});

const insertTextAnswerSchema = createInsertSchema(answers, {
	pollId: (schema) => schema.pollId.optional(),
	label: (schema) => schema.label.min(1, 'label is too short').max(256, 'label is too long')
})
	.required({
		label: true
	})
	.omit({
		id: true
	});

export const insertPollRequest = z
	.discriminatedUnion('type', [
		insertPollSchema.merge(
			z.object({
				type: z.literal('image'),
				answers: z.array(insertImageAnswerSchema).min(1, 'no answers for this question')
			})
		),
		insertPollSchema.merge(
			z.object({
				type: z.literal('text'),
				answers: z.array(insertTextAnswerSchema).min(1, 'no answers for this question')
			})
		)
	])
	.superRefine((val, ctx) => {
		if (val.maxChoice > val.answers.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_big,
				type: 'number',
				maximum: val.answers.length,
				inclusive: true,
				path: ['maxChoice'],
				message: `maximum choice is ${val.answers.length}`
			});
		}
	});

export type InsertPollRequest = z.infer<typeof insertPollRequest>;
