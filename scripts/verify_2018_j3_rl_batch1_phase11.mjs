import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

const answers = new Map([
  ['UDEA_2018_1_J3_RL_041', 'C'],
  ['UDEA_2018_1_J3_RL_042', 'D'],
  ['UDEA_2018_1_J3_RL_043', 'A'],
  ['UDEA_2018_1_J3_RL_044', 'D'],
  ['UDEA_2018_1_J3_RL_045', 'B'],
  ['UDEA_2018_1_J3_RL_046', 'A'],
]);

const answerKeySource = 'Exámenes/Con respuestas/2018-1 j3/Screenshot_20200318-225258.png';
let updated = 0;

for (const question of bank) {
  const answer = answers.get(question.id);
  if (!answer) continue;

  question.correct_answer = answer;
  question.answer_key_source = answerKeySource;
  question.answer_key_verification = 'manual_visual_transcription';
  question.source_category = 'EXAM_WITH_ANSWERS_UDEA';
  question.source_page = 5;
  question.confidence = 'confirmed_by_key';
  question.verification_status = 'clean';
  question.review_reasons = [];
  question.official_exam_eligible = true;
  question.eligibility_reasons = [];
  question.verbatim_confidence = 'verified';
  question.verbatim_verification = {
    method: 'source_text_match_plus_rendered_page_locator',
    source_text_match: true,
    rendered_page_located: true,
  };
  question.admin_status = 'verified';
  question.supporting_material_status = question.id.endsWith('_045')
    ? 'complete_verified'
    : 'not_required';
  updated += 1;
}

if (updated !== answers.size) {
  throw new Error(`Expected ${answers.size} questions, updated ${updated}.`);
}

fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(JSON.stringify({ updated, ids: [...answers.keys()] }, null, 2));
