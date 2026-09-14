import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/question_bank.json'), 'utf8'));
const textResources = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/text_resources.json'), 'utf8'));
const textResourceIds = new Set(textResources.map((resource) => resource.id));
const ids = new Set();

for (const question of bank) {
  if (ids.has(question.id)) throw new Error(`Duplicate id: ${question.id}`);
  ids.add(question.id);
  for (const resource of question.visual_resources ?? []) {
    if (!['stimulus', 'question', 'option_A', 'option_B', 'option_C', 'option_D'].includes(resource.placement)) {
      throw new Error(`Invalid placement in ${question.id}: ${resource.placement}`);
    }
    if (!fs.existsSync(path.join(projectRoot, 'public', resource.asset))) {
      throw new Error(`Missing asset in ${question.id}: ${resource.asset}`);
    }
  }
  if (!question.official_exam_eligible) continue;
  if (question.verbatim_confidence !== 'verified' || question.admin_status !== 'verified') {
    throw new Error(`Eligible question is not verified: ${question.id}`);
  }
  if (!['A', 'B', 'C', 'D'].includes(question.correct_answer)) {
    throw new Error(`Eligible question lacks a confirmed answer: ${question.id}`);
  }
  if (Object.keys(question.options ?? {}).sort().join('') !== 'ABCD' || Object.values(question.options).some((value) => !String(value).trim())) {
    throw new Error(`Eligible question lacks four complete options: ${question.id}`);
  }
  if (question.section === 'CL' && (!question.text_resource_ids?.length || question.text_resource_ids.some((id) => !textResourceIds.has(id)))) {
    throw new Error(`Eligible CL question lacks a valid source text: ${question.id}`);
  }
  if (question.required_supporting_material?.includes('visual') && !(question.visual_resources ?? []).length) {
    throw new Error(`Eligible question lacks its required visual material: ${question.id}`);
  }
  if (question.required_supporting_material?.includes('text') && (!question.text_resource_ids?.length || question.text_resource_ids.some((id) => !textResourceIds.has(id)))) {
    throw new Error(`Eligible question lacks its required text material: ${question.id}`);
  }
}

const eligible = bank.filter((question) => question.official_exam_eligible);
const sections = Object.groupBy(eligible, (question) => question.section);
const sources = new Set(eligible.map((question) => `${question.year}-${question.period}-${question.session}`));
const visual = eligible.filter((question) => (question.visual_resources ?? []).length > 0);
const j3Rl = eligible
  .filter((question) => question.year === 2018 && question.period === '1' && question.session === 'J3' && question.section === 'RL')
  .map((question) => question.original_question_number)
  .sort((a, b) => a - b);
const j1_2017 = eligible
  .filter((question) => question.year === 2017 && question.period === '1' && question.session === 'J1')
  .sort((a, b) => a.original_question_number - b.original_question_number);
const j1_2017_answerKey = [
  'DDCCCCBBBD', 'BBDBACDCCD', 'CABDBCCDCB', 'DADBADBCAD',
  'DBBCDBDBDD', 'CDAAACDDBB', 'DCADBABBCD', 'CACCABCAAC',
].join('');
const j1_2017_2 = eligible
  .filter((question) => question.year === 2017 && question.period === '2' && question.session === 'J1')
  .sort((a, b) => a.original_question_number - b.original_question_number);
const j1_2017_2_answerKey = [
  'BADACBCCDB', 'ACBDCACBCD', 'BACBCBBCAD', 'AADDCBCDDA',
  'ABBBBCDDBA', 'ACCCCCCACB', 'BDCCCACCBA', 'CDBDBDCADC',
].join('');
if ((sections.CL?.length ?? 0) < 40 || (sections.RL?.length ?? 0) < 40) throw new Error('The eligible bank cannot support 40 CL + 40 RL.');
if (sources.size < 2) throw new Error('The eligible bank does not contain multiple historical exams.');
if (visual.length < 23) throw new Error(`Expected at least 23 eligible visual questions, found ${visual.length}.`);
if (j3Rl.length !== 37 || j3Rl.some((number, index) => number !== index + 41)) {
  throw new Error('UDEA 2018-1 J3 logical reasoning must contain the verified consecutive block 41-77.');
}
if (j1_2017.length !== 80
  || j1_2017.filter((question) => question.section === 'CL').length !== 40
  || j1_2017.filter((question) => question.section === 'RL').length !== 40
  || j1_2017.some((question, index) => question.original_question_number !== index + 1)) {
  throw new Error('UDEA 2017-1 J1 must be a verified consecutive historical exam with 40 CL + 40 RL.');
}
if (j1_2017_answerKey.length !== 80
  || j1_2017.some((question, index) => question.correct_answer !== j1_2017_answerKey[index])) {
  throw new Error('UDEA 2017-1 J1 does not match the independently transcribed 80-answer key.');
}
for (const [number, expectedVisuals] of new Map([[41, 1], [42, 1], [44, 1], [49, 1], [53, 1], [56, 1], [59, 1], [64, 1], [73, 2], [80, 1]])) {
  const question = j1_2017.find((item) => item.original_question_number === number);
  if ((question?.visual_resources?.length ?? 0) !== expectedVisuals) {
    throw new Error(`UDEA 2017-1 J1 question ${number} does not have its complete verified visual material.`);
  }
}
if (j1_2017_2.length !== 80
  || j1_2017_2.filter((question) => question.section === 'CL').length !== 40
  || j1_2017_2.filter((question) => question.section === 'RL').length !== 40
  || j1_2017_2.some((question, index) => question.original_question_number !== index + 1)) {
  throw new Error('UDEA 2017-2 J1 must be a verified consecutive historical exam with 40 CL + 40 RL.');
}
if (j1_2017_2_answerKey.length !== 80
  || j1_2017_2.some((question, index) => question.correct_answer !== j1_2017_2_answerKey[index])) {
  throw new Error('UDEA 2017-2 J1 does not match the independently transcribed 80-answer key.');
}
for (const [number, expectedVisuals] of new Map([[50, 1], [51, 1], [53, 4], [54, 1], [55, 1], [56, 1], [59, 1], [61, 1], [72, 1], [73, 1]])) {
  const question = j1_2017_2.find((item) => item.original_question_number === number);
  if ((question?.visual_resources?.length ?? 0) !== expectedVisuals) {
    throw new Error(`UDEA 2017-2 J1 question ${number} does not have its complete verified visual material.`);
  }
}

const readyHistoricalExams = [j1_2017, j1_2017_2]
  .filter((questions) => questions.length === 80
    && questions.filter((question) => question.section === 'CL').length === 40
    && questions.filter((question) => question.section === 'RL').length === 40)
  .map((questions) => `UDEA_${questions[0].year}_${questions[0].period}_${questions[0].session}`);

console.log(JSON.stringify({
  total: bank.length,
  eligible: eligible.length,
  sections: { CL: sections.CL?.length ?? 0, RL: sections.RL?.length ?? 0 },
  eligibleSources: sources.size,
  eligibleWithVisualResources: visual.length,
  linkedEligibleClQuestions: eligible.filter((question) => question.section === 'CL' && question.text_resource_ids?.length).length,
  readyHistoricalExams,
  pendingReview: bank.filter((question) => question.admin_status === 'needs_review').length,
  incomplete: bank.filter((question) => question.admin_status === 'incomplete').length,
}, null, 2));
