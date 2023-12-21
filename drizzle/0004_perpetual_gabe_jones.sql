CREATE TABLE IF NOT EXISTS "pollpy"."votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"answer_id" uuid NOT NULL,
	"voter_key" text NOT NULL,
	CONSTRAINT "votes_poll_id_answer_id_voter_key_unique" UNIQUE("poll_id","answer_id","voter_key")
);
--> statement-breakpoint
ALTER TABLE "pollpy"."polls" ADD COLUMN "status" varchar(256) DEFAULT 'active';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pollpy"."votes" ADD CONSTRAINT "votes_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "pollpy"."polls"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pollpy"."votes" ADD CONSTRAINT "votes_answer_id_answers_id_fk" FOREIGN KEY ("answer_id") REFERENCES "pollpy"."answers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
