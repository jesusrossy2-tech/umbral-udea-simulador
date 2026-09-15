CREATE TABLE `question_reviews` (
	`question_id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`note` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `simulations` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`mode` text NOT NULL,
	`source_exam_id` text,
	`question_ids_json` text NOT NULL,
	`started_at` text NOT NULL,
	`duration_seconds` integer NOT NULL,
	`submitted_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_simulations_learner_started` ON `simulations` (`learner_id`,`started_at`);--> statement-breakpoint
ALTER TABLE `attempts` ADD `mode` text DEFAULT 'full' NOT NULL;
--> statement-breakpoint
PRAGMA optimize;
