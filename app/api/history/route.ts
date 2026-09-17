import { getD1 } from '../../../db';
import { requestHasTrustedOrigin, resolveLearnerId } from '../../../lib/auth';

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
  const learnerId = await resolveLearnerId(request, new URL(request.url).searchParams.get('learnerId'));
  if (!learnerId) {
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

export async function DELETE(request: Request) {
  if (!requestHasTrustedOrigin(request)) return Response.json({ error: 'Origen no permitido.' }, { status: 403 });
  const learnerId = await resolveLearnerId(request, new URL(request.url).searchParams.get('learnerId'));
  if (!learnerId) {
    return Response.json({ error: 'Identificador de historial inválido.' }, { status: 400 });
  }

  const db = getD1();
  await db.batch([
    db.prepare('DELETE FROM attempts WHERE learner_id = ?').bind(learnerId),
    db.prepare('DELETE FROM simulations WHERE learner_id = ?').bind(learnerId),
  ]);
  return Response.json({ deleted: true }, { headers: { 'Cache-Control': 'no-store' } });
}
