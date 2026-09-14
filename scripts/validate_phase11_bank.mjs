import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const bank = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/question_bank.json'), 'utf8'));
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
}

const eligible = bank.filter((question) => question.official_exam_eligible);
const sections = Object.groupBy(eligible, (question) => question.section);
const sources = new Set(eligible.map((question) => `${question.year}-${question.period}-${question.session}`));
const visual = eligible.filter((question) => (question.visual_resources ?? []).length > 0);
if ((sections.CL?.length ?? 0) < 40 || (sections.RL?.length ?? 0) < 40) throw new Error('The eligible bank cannot support 40 CL + 40 RL.');
if (sources.size < 2) throw new Error('The eligible bank does not contain multiple historical exams.');
if (visual.length !== 20) throw new Error(`Expected 20 eligible visual questions, found ${visual.length}.`);

console.log(JSON.stringify({
  total: bank.length,
  eligible: eligible.length,
  sections: { CL: sections.CL?.length ?? 0, RL: sections.RL?.length ?? 0 },
  eligibleSources: sources.size,
  eligibleWithVisualResources: visual.length,
  pendingReview: bank.filter((question) => question.admin_status === 'needs_review').length,
  incomplete: bank.filter((question) => question.admin_status === 'incomplete').length,
}, null, 2));
