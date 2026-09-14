import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const bankPath = path.join(projectRoot, 'data/question_bank.json');
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

const verified = {
  UDEA_2017_1_J1_RL_041: { sourceQuestion: 41, pages: [7] },
  UDEA_2017_1_J1_RL_042: { sourceQuestion: 42, pages: [7] },
  UDEA_2017_1_J1_RL_043: { sourceQuestion: 43, pages: [7], visuals: [] },
  UDEA_2017_1_J1_RL_056: { sourceQuestion: 57, pages: [9] },
  UDEA_2017_1_J1_RL_064: { sourceQuestion: 64, pages: [9] },
  UDEA_2017_1_J1_RL_075: { sourceQuestion: 75, pages: [10], visuals: [] },
  UDEA_2017_1_J1_RL_080: {
    sourceQuestion: 80,
    pages: [10, 11],
    visuals: [['question', 'assets/UDEA_2017_1_J1/5fd8f84d6ea122e6.png']],
  },
  UDEA_2017_2_J1_RL_050: { sourceQuestion: 51, pages: [6, 7] },
  UDEA_2017_2_J1_RL_052: {
    sourceQuestion: 53,
    pages: [7],
    visuals: [
      ['option_A', 'assets/UDEA_2017_2_J1/fb70e856322c5534.png'],
      ['option_B', 'assets/UDEA_2017_2_J1/930cca3093065867.png'],
      ['option_C', 'assets/UDEA_2017_2_J1/5e1ce873c22eee77.png'],
      ['option_D', 'assets/UDEA_2017_2_J1/b0bd437eaf0658b5.png'],
    ],
    optionAssets: {
      A: 'assets/UDEA_2017_2_J1/fb70e856322c5534.png',
      B: 'assets/UDEA_2017_2_J1/930cca3093065867.png',
      C: 'assets/UDEA_2017_2_J1/5e1ce873c22eee77.png',
      D: 'assets/UDEA_2017_2_J1/b0bd437eaf0658b5.png',
    },
  },
  UDEA_2017_2_J1_RL_053: { sourceQuestion: 54, pages: [7] },
  UDEA_2017_2_J1_RL_055: { sourceQuestion: 56, pages: [7] },
  UDEA_2017_2_J1_RL_058: {
    sourceQuestion: 59,
    pages: [8],
    question: 'Se hace una figura de alambre que consta de una circunferencia de radio igual a 4 cm y dos diámetros perpendiculares. Si una hormiga recorre toda la estructura sin hacer interrupciones, la mínima longitud que recorre es:',
    options: { A: '4(3π + 4)', B: '6(2π + 3)', C: '2(5π + 8)', D: '2(5π + 9)' },
  },
  UDEA_2017_2_J1_RL_060: { sourceQuestion: 61, pages: [8] },
  UDEA_2017_2_J1_RL_073: {
    sourceQuestion: 72,
    pages: [9],
    question: 'Se tiene la siguiente operación arbitraria *, representada en la tabla, en donde se lee primero la letra de la fila y luego la letra de la columna, así, el resultado de a*b es b, y el resultado de b*c es d; además, si x² es igual a x*x, entonces, el resultado de la operación (((a*b)*c)*d)² es:',
  },
  UDEA_2017_2_J1_RL_074: { sourceQuestion: 73, pages: [10] },
  UDEA_2018_1_J2_RL_053: { sourceQuestion: 54, pages: [5] },
  UDEA_2018_1_J2_RL_066: { sourceQuestion: 67, pages: [7] },
  UDEA_2018_1_J2_RL_070: { sourceQuestion: 71, pages: [7] },
  UDEA_2018_1_J2_RL_071: { sourceQuestion: 72, pages: [7] },
  UDEA_2018_1_J2_RL_074: { sourceQuestion: 75, pages: [8] },
  UDEA_2018_1_J2_RL_075: { sourceQuestion: 76, pages: [8] },
  UDEA_2018_1_J2_RL_079: { sourceQuestion: 79, pages: [8] },
  UDEA_2018_1_J2_RL_080: {
    sourceQuestion: 80,
    pages: [8, 9],
    question: 'Se tienen dos figuras, un cuadrado y un triángulo rectángulo y se escriben flechas en su interior que representan el lado hacía donde es posible que roten. Si se forma un arreglo de dos figuras, hay uno en donde son compatibles y otro en donde no, como se ve a continuación. En el siguiente arreglo, el único que es compatible es:',
  },
};

const remainIncomplete = {
  UDEA_2017_1_J1_RL_049: { sourceQuestion: 49, pages: [8] },
  UDEA_2017_1_J1_RL_072: { sourceQuestion: 72, pages: [10], visuals: [] },
};

function resources(entries) {
  return entries.map(([placement, asset]) => ({ type: 'image', asset, placement }));
}

const byId = new Map(bank.map((question) => [question.id, question]));
for (const [id, review] of Object.entries({ ...verified, ...remainIncomplete })) {
  const question = byId.get(id);
  if (!question) throw new Error(`Missing question ${id}`);
  question.source_question_number = review.sourceQuestion;
  question.source_page = review.pages[0];
  question.source_pages = review.pages;
  if ('question' in review) question.question = review.question;
  if ('options' in review) question.options = review.options;
  if ('visuals' in review) question.visual_resources = resources(review.visuals);
  if ('optionAssets' in review) question.option_assets = review.optionAssets;
}

for (const [id] of Object.entries(verified)) {
  const question = byId.get(id);
  question.verification_status = 'verified_by_visual_review';
  question.verbatim_confidence = 'verified';
  question.admin_status = 'verified';
  question.official_exam_eligible = true;
  question.eligibility_reasons = [];
  question.verbatim_verification = {
    method: 'manual_visual_review_against_rendered_source_phase11',
    source_text_match: true,
    rendered_page_located: true,
    visual_resource_placement_verified: true,
  };
}

for (const [id] of Object.entries(remainIncomplete)) {
  const question = byId.get(id);
  question.verbatim_confidence = 'needs_review';
  question.admin_status = 'incomplete';
  question.official_exam_eligible = false;
  question.eligibility_reasons = [...new Set([
    ...(question.eligibility_reasons ?? []),
    'question_or_options_incomplete_after_visual_review',
  ])];
}

for (const question of bank) {
  for (const resource of question.visual_resources ?? []) {
    const assetPath = path.join(projectRoot, 'public', resource.asset);
    if (!fs.existsSync(assetPath)) throw new Error(`Missing visual asset ${resource.asset}`);
  }
  if (question.official_exam_eligible) {
    if (question.correct_answer == null || !['A', 'B', 'C', 'D'].includes(question.correct_answer)) {
      throw new Error(`Eligible question lacks a valid answer: ${question.id}`);
    }
    if (Object.keys(question.options ?? {}).sort().join('') !== 'ABCD' || Object.values(question.options).some((value) => !String(value).trim())) {
      throw new Error(`Eligible question lacks four options: ${question.id}`);
    }
  }
}

fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);

const eligible = bank.filter((question) => question.official_exam_eligible);
const eligibleWithVisuals = eligible.filter((question) => (question.visual_resources ?? []).length > 0);
console.log(JSON.stringify({
  total: bank.length,
  eligible: eligible.length,
  eligibleWithVisuals: eligibleWithVisuals.length,
  verifiedThisPass: Object.keys(verified).length,
  remainingIncompleteThisPass: Object.keys(remainIncomplete).length,
}, null, 2));
