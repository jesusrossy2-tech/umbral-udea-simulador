CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`learner_id` text NOT NULL,
	`exam_id` text NOT NULL,
	`submitted_at` text NOT NULL,
	`elapsed_seconds` integer NOT NULL,
	`timed_out` integer DEFAULT false NOT NULL,
	`total_correct` integer NOT NULL,
	`total_incorrect` integer NOT NULL,
	`total_omitted` integer NOT NULL,
	`percentage` integer NOT NULL,
	`cl_correct` integer NOT NULL,
	`rl_correct` integer NOT NULL,
	`details_json` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_attempts_learner_submitted` ON `attempts` (`learner_id`,`submitted_at`);
--> statement-breakpoint
PRAGMA optimize;
