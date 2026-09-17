import { getD1 } from '../../../db';
import { bank, buildFullExam, buildPractice, eligibleQuestions, examId, publicQuestion, type ExamMode } from '../../../lib/exam-engine';

const validLearner = (value: string) => /^[a-zA-Z0-9-]{16,80}$/.test(value);
const noStore = { 'Cache-Control': 'no-store' };
const maxSimulationsPerHour = 20;
const staleSimulationMs = 24 * 60 * 60 * 1000;

async function selectionContext(learnerId: string) {
  const db = getD1();
  const [reviews, attempts] = await Promise.all([
    db.prepare("SELECT question_id FROM question_reviews WHERE status != 'verified'").all<{question_id:string}>(),
    db.prepare('SELECT details_json FROM attempts WHERE learner_id = ? ORDER BY submitted_at DESC LIMIT 10').bind(learnerId).all<{details_json:string}>(),
  ]);
  const blocked = new Set(reviews.results.map((item) => item.question_id));
  const seen = new Set<string>();
  for (const row of attempts.results) {
    try { for (const detail of JSON.parse(row.details_json) as {id:string}[]) seen.add(detail.id); } catch { /* ignore corrupt historical rows */ }
  }
  return { pool: eligibleQuestions(blocked), seen };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const learnerId = url.searchParams.get('learnerId') ?? '';
  const mode = (url.searchParams.get('mode') ?? 'full') as ExamMode;
  if (!validLearner(learnerId) || !['full','historical','practice'].includes(mode)) return Response.json({ error: 'Solicitud de examen inválida.' }, { status: 400, headers: noStore });
  const now = Date.now();
  const db = getD1();
  await db.prepare(`DELETE FROM simulations
    WHERE learner_id = ? AND submitted_at IS NULL AND started_at < ?`)
    .bind(learnerId, new Date(now - staleSimulationMs).toISOString()).run();
  const recent = await db.prepare(`SELECT COUNT(*) AS total FROM simulations
    WHERE learner_id = ? AND started_at >= ?`)
    .bind(learnerId, new Date(now - 60 * 60 * 1000).toISOString()).first<{total:number}>();
  if ((recent?.total ?? 0) >= maxSimulationsPerHour) {
    return Response.json(
      { error: 'Has iniciado demasiadas sesiones en poco tiempo. Espera antes de comenzar otra.' },
      { status: 429, headers: { ...noStore, 'Retry-After': '3600' } },
    );
  }
  const { pool, seen } = await selectionContext(learnerId);
  let selected;
  let durationSeconds = 10800;
  let sourceExamId: string | null = null;
  if (mode === 'full') selected = buildFullExam(pool, seen);
  else if (mode === 'practice') {
    selected = buildPractice(pool, seen, {
      section: url.searchParams.get('section') || undefined,
      topic: url.searchParams.get('topic') || undefined,
      subtopic: url.searchParams.get('subtopic') || undefined,
      difficulty: url.searchParams.get('difficulty') || undefined,
      count: Number(url.searchParams.get('count') || 10),
    });
    durationSeconds = Math.max(300, selected.length * 90);
    if (!selected.length) return Response.json({ error: 'No hay preguntas verificadas para esos filtros.' }, { status: 409, headers: noStore });
  } else {
    sourceExamId = url.searchParams.get('source') ?? '';
    selected = pool.filter((question) => examId(question) === sourceExamId).sort((a,b) => a.original_question_number - b.original_question_number);
    if (selected.length !== 80 || selected.filter((question) => question.section === 'CL').length !== 40) {
      return Response.json({ error: 'Este examen todavía no tiene 80 preguntas verificadas y no puede recrearse fielmente.' }, { status: 409, headers: noStore });
    }
  }
  const simulationId = crypto.randomUUID();
  await db.prepare(`INSERT INTO simulations (id, learner_id, mode, source_exam_id, question_ids_json, started_at, duration_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(simulationId, learnerId, mode, sourceExamId, JSON.stringify(selected.map((question) => question.id)), new Date().toISOString(), durationSeconds).run();
  return Response.json({ id: simulationId, mode, durationSeconds, sources: [...new Set(selected.map(examId))], questions: selected.map(publicQuestion) }, { headers: noStore });
}

export async function POST(request: Request) {
  const body = await request.json() as { simulationId?: string; learnerId?: string; answers?: Record<string,string>; elapsedSeconds?: number; timedOut?: boolean };
  if (!body.simulationId || !body.learnerId || !validLearner(body.learnerId)) return Response.json({ error: 'Entrega inválida.' }, { status: 400, headers: noStore });
  const simulation = await getD1().prepare(`SELECT id, mode, source_exam_id, question_ids_json, started_at, duration_seconds, submitted_at FROM simulations
    WHERE id = ? AND learner_id = ?`).bind(body.simulationId, body.learnerId).first<{id:string;mode:ExamMode;source_exam_id:string|null;question_ids_json:string;started_at:string;duration_seconds:number;submitted_at:string|null}>();
  if (!simulation || simulation.submitted_at) return Response.json({ error: 'El simulacro no existe o ya fue entregado.' }, { status: 409, headers: noStore });
  const questionIds = JSON.parse(simulation.question_ids_json) as string[];
  const selected = questionIds.map((id) => bank.find((question) => question.id === id)).filter(Boolean) as typeof bank;
  const answers = body.answers ?? {};
  const details = selected.map((question) => {
    const submitted = answers[question.id];
    const answer = ['A', 'B', 'C', 'D'].includes(submitted) ? submitted : null;
    const outcome = answer === null ? 'omitted' : answer === question.correct_answer ? 'correct' : 'incorrect';
    return { id: question.id, section: question.section, topic: question.topic, outcome };
  });
  const summarize = (rows: typeof details) => ({
    questions: rows.length,
    correct: rows.filter((item) => item.outcome === 'correct').length,
    incorrect: rows.filter((item) => item.outcome === 'incorrect').length,
    omitted: rows.filter((item) => item.outcome === 'omitted').length,
    percentage: rows.length ? Number((100 * rows.filter((item) => item.outcome === 'correct').length / rows.length).toFixed(2)) : 0,
  });
  const parsedStart = Date.parse(simulation.started_at);
  const measuredElapsed = Number.isFinite(parsedStart)
    ? Math.max(0, Math.floor((Date.now() - parsedStart) / 1000))
    : Math.max(0, body.elapsedSeconds ?? 0);
  const elapsedSeconds = Math.min(simulation.duration_seconds, measuredElapsed);
  const timedOut = measuredElapsed >= simulation.duration_seconds || Boolean(body.timedOut);
  const totals = summarize(details);
  const sections = { CL: summarize(details.filter((item) => item.section === 'CL')), RL: summarize(details.filter((item) => item.section === 'RL')) };
  const savedAt = new Date().toISOString();
  const attemptId = crypto.randomUUID();
  const db = getD1();
  await db.batch([
    db.prepare('UPDATE simulations SET submitted_at = ? WHERE id = ?').bind(savedAt, simulation.id),
    db.prepare(`INSERT INTO attempts
      (id, learner_id, exam_id, submitted_at, elapsed_seconds, timed_out, total_correct, total_incorrect, total_omitted, percentage, cl_correct, rl_correct, details_json, mode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(attemptId, body.learnerId, simulation.source_exam_id || simulation.id, savedAt, elapsedSeconds, timedOut ? 1 : 0,
        totals.correct, totals.incorrect, totals.omitted, Math.round(totals.percentage * 100), sections.CL.correct, sections.RL.correct, JSON.stringify(details), simulation.mode),
  ]);
  return Response.json({ status: timedOut ? 'timed_out' : 'submitted', mode: simulation.mode, elapsedSeconds, totals, sections, attemptId, savedAt, historySaved: true,
    standardizedScoring: { available: false, score: null, reason: 'No disponible con suficiente evidencia para reproducir fielmente el método oficial.' } }, { headers: noStore });
}
