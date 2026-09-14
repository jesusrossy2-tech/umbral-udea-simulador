import { getD1 } from '../../../../db';
import { bank, examId } from '../../../../lib/exam-engine';

const statuses = new Set(['verified', 'needs_review', 'incomplete', 'excluded']);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = (url.searchParams.get('search') ?? '').toLocaleLowerCase();
  const status = url.searchParams.get('status') ?? '';
  const overrides = await getD1().prepare('SELECT question_id, status, note, updated_at FROM question_reviews').all<{question_id:string;status:string;note:string|null;updated_at:string}>();
  const byId = new Map(overrides.results.map((item) => [item.question_id, item]));
  const questions = bank.map((question) => {
    const override = byId.get(question.id);
    return { ...question, exam_id: examId(question), admin_status: override?.status ?? question.admin_status, review_note: override?.note ?? null, review_updated_at: override?.updated_at ?? null };
  }).filter((question) => (!search || `${question.id} ${question.question} ${question.source_file}`.toLocaleLowerCase().includes(search))
    && (!status || question.admin_status === status)).slice(0, 200);
  return Response.json({ questions, totalBank: bank.length, returned: questions.length });
}

export async function POST(request: Request) {
  const body = await request.json() as { questionId?: string; status?: string; note?: string };
  if (!body.questionId || !bank.some((question) => question.id === body.questionId) || !body.status || !statuses.has(body.status)) {
    return Response.json({ error: 'Revisión inválida.' }, { status: 400 });
  }
  const updatedAt = new Date().toISOString();
  await getD1().prepare(`INSERT INTO question_reviews (question_id, status, note, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(question_id) DO UPDATE SET status=excluded.status, note=excluded.note, updated_at=excluded.updated_at`)
    .bind(body.questionId, body.status, (body.note ?? '').slice(0, 500), updatedAt).run();
  return Response.json({ questionId: body.questionId, status: body.status, updatedAt });
}
