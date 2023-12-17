CREATE TABLE IF NOT EXISTS "pollpy"."answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(256),
	"image" text,
	"poll_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pollpy"."polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"image" text,
	"type" varchar(256) NOT NULL,
	"max_choices" integer NOT NULL,
	"identify_vote_by" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pollpy"."answers" ADD CONSTRAINT "answers_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "pollpy"."polls"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
