import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data/question_bank.json'), 'utf8'));
const page = fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
const adminRoute = fs.readFileSync(path.join(root, 'app/api/admin/questions/route.ts'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'lib/exam-engine.ts'), 'utf8');

for (const required of ['dist/server/index.js', 'dist/.openai/hosting.json']) {
  if (!fs.existsSync(path.join(root, required))) throw new Error(`Missing production artifact: ${required}`);
}
if (page.includes('Panel de revisión') || page.includes("view==='admin'") || !page.includes('Privacidad')) {
  throw new Error('The learner interface still exposes administration or lacks privacy controls.');
}
if (!adminRoute.includes('status: 404') || adminRoute.includes('correct_answer') || adminRoute.includes("from '../../../../lib/exam-engine'")) {
  throw new Error('The administrative endpoint is not safely closed.');
}
if (!engine.includes('correct_answer: _correct') || !engine.includes('answer_key_source: _key')) {
  throw new Error('The learner response sanitizer no longer removes answer-key data.');
}

const eligible = bank.filter((question) => question.official_exam_eligible
  && question.source_type === 'historical_exam'
  && question.confidence !== 'uncertain'
  && question.verbatim_confidence === 'verified'
  && question.admin_status === 'verified');
const exams = Object.groupBy(eligible, (question) => `UDEA_${question.year}_${question.period}_${question.session || 'J?'}`);
const ready = Object.entries(exams).filter(([, questions]) => questions.length === 80
  && questions.filter((question) => question.section === 'CL').length === 40
  && questions.filter((question) => question.section === 'RL').length === 40);
if (eligible.length !== 437 || ready.length !== 5) throw new Error('The verified production catalog is incomplete.');
if (eligible.some((question) => !question.question?.trim()
  || Object.keys(question.options ?? {}).sort().join('') !== 'ABCD'
  || Object.values(question.options).some((option) => !String(option).trim()))) {
  throw new Error('An eligible production question is incomplete.');
}

console.log(JSON.stringify({
  workerArtifacts: 'present',
  administration: 'closed',
  privacyControl: 'present',
  eligibleQuestions: eligible.length,
  readyHistoricalExams: ready.length,
  historicalExamContract: '80 questions; 40 CL + 40 RL',
  learnerAnswerSanitizer: 'present',
}, null, 2));
