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
  mode: text('mode').notNull().default('full'),
}, (table) => [
  index('idx_attempts_learner_submitted').on(table.learnerId, table.submittedAt),
]);

export const simulations = sqliteTable('simulations', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id').notNull(),
  mode: text('mode').notNull(),
  sourceExamId: text('source_exam_id'),
  questionIdsJson: text('question_ids_json').notNull(),
  startedAt: text('started_at').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  submittedAt: text('submitted_at'),
}, (table) => [
  index('idx_simulations_learner_started').on(table.learnerId, table.startedAt),
]);

export const questionReviews = sqliteTable('question_reviews', {
  questionId: text('question_id').primaryKey(),
  status: text('status').notNull(),
  note: text('note'),
  updatedAt: text('updated_at').notNull(),
});
