import exam from '../../../data/exam.json';

const publicFields = exam.map(({ correct_answer: _answer, ...question }) => question);

export async function GET() {
  return Response.json({
    id: 'UDEA-FULL-DEMO-001',
    durationSeconds: 10800,
    questions: publicFields,
  });
}

export async function POST(request: Request) {
  const body = await request.json() as { answers?: Record<string, string>; elapsedSeconds?: number; timedOut?: boolean };
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
  return Response.json({
    status: body.timedOut ? 'timed_out' : 'submitted',
    elapsedSeconds: Math.min(10800, Math.max(0, body.elapsedSeconds ?? 0)),
    totals: summarize(details),
    sections: {
      CL: summarize(details.filter((x) => x.section === 'CL')),
      RL: summarize(details.filter((x) => x.section === 'RL')),
    },
    standardizedScoring: { available: false, score: null, reason: 'No disponible con suficiente evidencia para reproducir fielmente el método oficial.' },
    details,
  });
}
