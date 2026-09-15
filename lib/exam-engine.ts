import bankData from '../data/question_bank.json';
import textResourceData from '../data/text_resources.json';

export type BankQuestion = (typeof bankData)[number];
export type ExamMode = 'full' | 'historical' | 'practice';

export const bank = bankData as BankQuestion[];
const textResources = new Map(textResourceData.map((resource) => [resource.id, resource]));
export const examId = (question: BankQuestion) => `UDEA_${question.year}_${question.period}_${question.session || 'J?'}`;

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
};

export function eligibleQuestions(blockedIds: Set<string>) {
  return bank.filter((question) => question.official_exam_eligible && question.source_type === 'historical_exam'
    && question.confidence !== 'uncertain' && question.verbatim_confidence === 'verified'
    && question.admin_status === 'verified' && !blockedIds.has(question.id));
}

function ranked<T extends BankQuestion>(items: T[], seen: Set<string>) {
  return shuffle(items).sort((a, b) => Number(seen.has(a.id)) - Number(seen.has(b.id)));
}

function stratifiedSection(pool: BankQuestion[], section: 'CL' | 'RL', count: number, seen: Set<string>) {
  const sectionPool = pool.filter((question) => question.section === section);
  const groups = new Map<string, BankQuestion[]>();
  for (const question of sectionPool) groups.set(question.topic, [...(groups.get(question.topic) ?? []), question]);
  const quotas = [...groups.entries()].map(([topic, questions]) => {
    const exact = count * questions.length / sectionPool.length;
    return { topic, questions, quota: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let assigned = quotas.reduce((sum, item) => sum + item.quota, 0);
  for (const item of [...quotas].sort((a, b) => b.remainder - a.remainder)) {
    if (assigned >= count) break;
    item.quota += 1;
    assigned += 1;
  }
  const selected = quotas.flatMap((item) => ranked(item.questions, seen).slice(0, item.quota));
  if (selected.length < count) {
    const ids = new Set(selected.map((question) => question.id));
    selected.push(...ranked(sectionPool.filter((question) => !ids.has(question.id)), seen).slice(0, count - selected.length));
  }
  return shuffle(selected.slice(0, count));
}

export function buildFullExam(pool: BankQuestion[], seen: Set<string>) {
  const selected = [...stratifiedSection(pool, 'CL', 40, seen), ...stratifiedSection(pool, 'RL', 40, seen)];
  if (selected.length !== 80 || selected.filter((question) => question.section === 'CL').length !== 40) {
    throw new Error('El banco validado no permite construir el contrato 40+40.');
  }
  if (new Set(selected.map(examId)).size < 2) throw new Error('El simulacro debe combinar más de un examen histórico.');
  return selected;
}

export function buildPractice(pool: BankQuestion[], seen: Set<string>, filters: { section?: string; topic?: string; subtopic?: string; difficulty?: string; count?: number }) {
  const count = Math.min(40, Math.max(5, filters.count ?? 10));
  const candidates = pool.filter((question) => (!filters.section || question.section === filters.section)
    && (!filters.topic || question.topic === filters.topic)
    && (!filters.subtopic || question.subtopic === filters.subtopic)
    && (!filters.difficulty || question.difficulty === filters.difficulty));
  return ranked(candidates, seen).slice(0, Math.min(count, candidates.length));
}

export function publicQuestion(question: BankQuestion, position: number) {
  const { correct_answer: _correct, answer_key_source: _key, eligibility_reasons: _reasons, ...safe } = question;
  return { ...safe, position, exam_id: examId(question), text_resources: question.text_resource_ids.map((id) => textResources.get(id)).filter(Boolean) };
}
