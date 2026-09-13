import exam from '../../../data/exam.json';
import { getD1 } from '../../../db';

const publicFields = exam.map(({ correct_answer: _answer, ...question }) => question);

export async function GET() {
  return Response.json({
    id: 'UDEA-FULL-DEMO-001',
    durationSeconds: 10800,
    questions: publicFields,
  });
}

export async function POST(request: Request) {
  const body = await request.json() as { answers?: Record<string, string>; elapsedSeconds?: number; timedOut?: boolean; learnerId?: string };
  const answers = body.answers ?? {};
  const details = exam.map((question) => {
    const answer = answers[question.id] ?? null;
    const outcome = answer === null ? 'omitted' : answer === question.correct_answer ? 'correct' : 'incorrect';
    return { id: question.id, section: question.section, topic: question.topic, answer, correctAnswer: question.correct_answer, outcome };
  });
  const summarize = (rows: typeof details) => ({
    questions: rows.length,
    correct: rows.filter((x) => x.outcome === 'correct').length,
    incorrect: rows.filter((x) => x.outcome === 'incorrect').length,
    omitted: rows.filter((x) => x.outcome === 'omitted').length,
    percentage: Number((100 * rows.filter((x) => x.outcome === 'correct').length / rows.length).toFixed(2)),
  });
  const elapsedSeconds = Math.min(10800, Math.max(0, body.elapsedSeconds ?? 0));
  const totals = summarize(details);
  const sections = {
    CL: summarize(details.filter((x) => x.section === 'CL')),
    RL: summarize(details.filter((x) => x.section === 'RL')),
  };
  let attemptId: string | null = null;
  let savedAt: string | null = null;
  if (body.learnerId && /^[a-zA-Z0-9-]{16,80}$/.test(body.learnerId)) {
    try {
      attemptId = crypto.randomUUID();
      savedAt = new Date().toISOString();
      await getD1().prepare(`INSERT INTO attempts
        (id, learner_id, exam_id, submitted_at, elapsed_seconds, timed_out, total_correct, total_incorrect, total_omitted, percentage, cl_correct, rl_correct, details_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(attemptId, body.learnerId, 'UDEA-FULL-DEMO-001', savedAt, elapsedSeconds, body.timedOut ? 1 : 0,
          totals.correct, totals.incorrect, totals.omitted, Math.round(totals.percentage * 100), sections.CL.correct, sections.RL.correct, JSON.stringify(details))
        .run();
    } catch (error) {
      console.error('Could not save attempt', error);
      attemptId = null;
      savedAt = null;
    }
  }
  return Response.json({
    status: body.timedOut ? 'timed_out' : 'submitted',
    elapsedSeconds,
    totals,
    sections,
    attemptId,
    savedAt,
    historySaved: Boolean(attemptId),
    standardizedScoring: { available: false, score: null, reason: 'No disponible con suficiente evidencia para reproducir fielmente el método oficial.' },
    details,
  });
}
