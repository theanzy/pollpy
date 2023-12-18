ALTER TABLE "pollpy"."polls" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pollpy"."polls" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pollpy"."polls" ADD COLUMN "closed_at" date;