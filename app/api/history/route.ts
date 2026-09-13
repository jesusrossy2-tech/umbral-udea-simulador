import { getD1 } from '../../../db';

type AttemptRow = {
  id: string;
  submitted_at: string;
  elapsed_seconds: number;
  timed_out: number;
  total_correct: number;
  total_incorrect: number;
  total_omitted: number;
  percentage: number;
  cl_correct: number;
  rl_correct: number;
};

export async function GET(request: Request) {
  const learnerId = new URL(request.url).searchParams.get('learnerId') ?? '';
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(learnerId)) {
    return Response.json({ error: 'Identificador de historial inválido.' }, { status: 400 });
  }

  const result = await getD1().prepare(`SELECT id, submitted_at, elapsed_seconds, timed_out,
      total_correct, total_incorrect, total_omitted, percentage, cl_correct, rl_correct
    FROM attempts WHERE learner_id = ? ORDER BY submitted_at DESC LIMIT 30`)
    .bind(learnerId).all<AttemptRow>();
  const attempts = result.results.map((row) => ({
    id: row.id,
    submittedAt: row.submitted_at,
    elapsedSeconds: row.elapsed_seconds,
    timedOut: Boolean(row.timed_out),
    totalCorrect: row.total_correct,
    totalIncorrect: row.total_incorrect,
    totalOmitted: row.total_omitted,
    percentage: row.percentage / 100,
    clCorrect: row.cl_correct,
    rlCorrect: row.rl_correct,
  }));
  return Response.json({ attempts });
}
