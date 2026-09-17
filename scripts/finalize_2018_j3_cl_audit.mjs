import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const projectRoot = path.resolve(import.meta.dirname, '..');
const bankPath = path.join(projectRoot, 'data/question_bank.json');
const resourcesPath = path.join(projectRoot, 'data/text_resources.json');
const supplementaryZip = process.argv[2];

if (!supplementaryZip || !fs.existsSync(supplementaryZip)) {
  throw new Error('Usage: node scripts/finalize_2018_j3_cl_audit.mjs /absolute/path/banco_preguntas_udea_simulacro.zip');
}

const sourceFile = 'ExamenUdeA 2018 I J3 print Hacemos cosas con palabras.docx';
const answerKeySource = 'Screenshot_20200318-225258.png';
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
const extracted = JSON.parse(execFileSync('unzip', ['-p', supplementaryZip, 'preguntas_udea_simulacro.json'], {
  encoding: 'utf8',
  maxBuffer: 20 * 1024 * 1024,
}));

const sourceRows = extracted.filter((row) => String(row.source_document ?? '').endsWith(sourceFile));
if (sourceRows.length !== 13) {
  throw new Error(`Expected 13 extracted 2018-1 J3 rows, found ${sourceRows.length}.`);
}

const resourceSpecs = [
  {
    id: 'UDEA_2018_1_J3_CL_TEXT_1',
    title: 'Texto I - Hacemos cosas con palabras, según Austin',
    content: sourceRows.slice(0, 5).map((row) => row.text.trim()).join('\n\n'),
    source_pages: [1, 2, 3],
  },
  {
    id: 'UDEA_2018_1_J3_CL_TEXT_2',
    title: 'Texto II - Diatriba contra el incumplimiento',
    content: sourceRows.slice(6, 11).map((row, index) => {
      const text = row.text.trim();
      return index === 4 ? text.split('\nEl término ladinos')[0].trim() : text;
    }).join('\n\n'),
    source_pages: [3, 4],
  },
].map((resource) => ({
  ...resource,
  type: 'text',
  source_file: sourceFile,
  verbatim_confidence: 'verified',
  verification_method: 'direct_docx_text_and_rendered_pdf_review',
}));

for (const resource of resourceSpecs) {
  const index = resources.findIndex((item) => item.id === resource.id);
  if (index >= 0) resources[index] = resource;
  else resources.push(resource);
}

const existing = bank
  .filter((question) => question.year === 2018
    && question.period === '1'
    && question.session === 'J3'
    && question.section === 'CL')
  .sort((a, b) => a.original_question_number - b.original_question_number);
const byNumber = new Map(existing.map((question) => [question.original_question_number, question]));
const alreadyRepaired = existing.length === 40
  && existing.every((question, index) => question.original_question_number === index + 1);

const inserted = new Map([
  [5, {
    question: 'El término afinar (párrafo 1) se entiende, conservando el sentido del párrafo, como',
    options: { A: 'criticar', B: 'transitar', C: 'construir', D: 'perfeccionar' },
    topic: 'contextual_vocabulary',
    subtopic: 'contextual_vocabulary',
    skill: 'infer_word_meaning_from_context',
  }],
  [24, {
    question: 'En el texto se expresa que “somos un país lleno de merengues”. El término subrayado equivale a decir',
    options: { A: 'quisquillosos', B: 'indecisos', C: 'hipersensibles', D: 'cobardes' },
    topic: 'contextual_vocabulary',
    subtopic: 'contextual_vocabulary',
    skill: 'infer_word_meaning_from_context',
  }],
  [39, {
    question: 'Una diferencia fundamental entre ambos textos es que',
    options: {
      A: 'mientras el texto uno es expositivo, el dos es argumentativo',
      B: 'mientras el texto dos es expositivo, el uno es argumentativo',
      C: 'mientras el texto uno se fundamenta teóricamente para argumentar, el dos lo hace desde la percepción del autor',
      D: 'el texto uno está escrito en tercera persona, mientras el dos lo está en primera persona',
    },
    topic: 'intertextual_comparison',
    subtopic: 'text_type_and_argumentation',
    skill: 'compare_discursive_structure',
  }],
]);

function oldNumberFor(sourceNumber) {
  if (alreadyRepaired) return sourceNumber;
  if (sourceNumber <= 4) return sourceNumber;
  if (sourceNumber <= 23) return sourceNumber - 1;
  if (sourceNumber <= 38) return sourceNumber - 2;
  if (sourceNumber === 40) return 40;
  return null;
}

function pageFor(number) {
  if (number <= 16) return 2;
  if (number <= 23) return 3;
  if (number <= 37) return 4;
  return 5;
}

function textResourcesFor(number) {
  if (number <= 18) return ['UDEA_2018_1_J3_CL_TEXT_1'];
  if (number <= 35) return ['UDEA_2018_1_J3_CL_TEXT_2'];
  return ['UDEA_2018_1_J3_CL_TEXT_1', 'UDEA_2018_1_J3_CL_TEXT_2'];
}

const template = existing[0];
const repaired = [];
for (let number = 1; number <= 40; number += 1) {
  const insertedQuestion = inserted.get(number);
  const oldNumber = oldNumberFor(number);
  const previous = oldNumber == null ? null : byNumber.get(oldNumber);
  if (!insertedQuestion && !previous) {
    throw new Error(`Missing source material for 2018-1 J3 CL question ${number}.`);
  }
  const content = insertedQuestion ?? {
    question: previous.question,
    options: previous.options,
    topic: previous.topic,
    subtopic: previous.subtopic,
    skill: previous.skill,
  };
  repaired.push({
    ...(previous ?? template),
    ...content,
    id: `UDEA_2018_1_J3_CL_${String(number).padStart(3, '0')}`,
    source_type: 'historical_exam',
    source_file: sourceFile,
    year: 2018,
    period: '1',
    session: 'J3',
    section: 'CL',
    original_question_number: number,
    correct_answer: null,
    source_page: pageFor(number),
    source_pages: [pageFor(number)],
    confidence: 'high',
    verification_status: 'clean',
    review_reasons: [],
    official_exam_eligible: false,
    eligibility_reasons: ['answer_key_missing_in_source', 'excluded_until_verified_answer_key_available'],
    answer_key_source: answerKeySource,
    answer_key_verification: 'source_key_contains_blank_cl_column',
    source_category: 'EXAM_WITH_PARTIAL_ANSWERS_UDEA',
    visual_resources: [],
    option_assets: {},
    verbatim_confidence: 'verified',
    verbatim_verification: {
      method: 'manual_rendered_pdf_transcription_and_direct_docx_text_match',
      source_text_match: true,
      rendered_page_located: true,
      answer_key_audited: true,
      answer_key_result: 'blank_for_cl_questions_1_40',
    },
    admin_status: 'excluded',
    text_resource_ids: textResourcesFor(number),
    required_supporting_material: ['text'],
    supporting_material_status: 'complete',
  });
}

const firstIndex = bank.findIndex((question) => question.year === 2018
  && question.period === '1'
  && question.session === 'J3'
  && question.section === 'CL');
const withoutOldCl = bank.filter((question) => !(question.year === 2018
  && question.period === '1'
  && question.session === 'J3'
  && question.section === 'CL'));
withoutOldCl.splice(firstIndex, 0, ...repaired);

fs.writeFileSync(bankPath, `${JSON.stringify(withoutOldCl, null, 2)}\n`);
fs.writeFileSync(resourcesPath, `${JSON.stringify(resources, null, 2)}\n`);

console.log(JSON.stringify({
  repaired: repaired.length,
  insertedQuestions: [...inserted.keys()],
  correctedNumberingRanges: ['6-23', '25-38'],
  linkedTextResources: resourceSpecs.map((resource) => resource.id),
  excludedBecauseAnswerKeyIsBlank: repaired.length,
  totalBankQuestions: withoutOldCl.length,
}, null, 2));
