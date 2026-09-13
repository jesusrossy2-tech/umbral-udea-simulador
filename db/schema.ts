import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const attempts = sqliteTable('attempts', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id').notNull(),
  examId: text('exam_id').notNull(),
  submittedAt: text('submitted_at').notNull(),
  elapsedSeconds: integer('elapsed_seconds').notNull(),
  timedOut: integer('timed_out', { mode: 'boolean' }).notNull().default(false),
  totalCorrect: integer('total_correct').notNull(),
  totalIncorrect: integer('total_incorrect').notNull(),
  totalOmitted: integer('total_omitted').notNull(),
  percentage: integer('percentage').notNull(),
  clCorrect: integer('cl_correct').notNull(),
  rlCorrect: integer('rl_correct').notNull(),
  detailsJson: text('details_json').notNull(),
}, (table) => [
  index('idx_attempts_learner_submitted').on(table.learnerId, table.submittedAt),
]);
