import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const projectRoot = path.resolve(import.meta.dirname, '..');
const sourceDir = process.argv[2];
const partialKeyImage = process.argv[3];
const reportPath = path.join(projectRoot, 'artifacts/audit/final_question_fidelity_audit.json');

if (!sourceDir || !fs.existsSync(sourceDir)) {
  throw new Error('Usage: node scripts/audit_source_fidelity.mjs /absolute/source/dir [/absolute/2018-j3-key.png]');
}

const expectedSources = new Map([
  ['ExamenUdeA 2017 I  J1 print La utilidad de la luna.docx', '47a25bed68cd071b39d7a1972d63fa07262408b5a5b7b3882df02da603032200'],
  ['ExamenUdeA 2017 II J1 print El arte.docx', '821f66ae98514f05dac6111715b59bb087e25760d4aa99c68eeaaa6b8b51b788'],
  ['ExamenUdeA 2018 I J2 print Fútbol Galeano.docx', '92c5185deedac0853640b1b648daf9800fe4e226a799b51970680a8f36614ed1'],
  ['ExamenUdeA 2018 I J3 print Hacemos cosas con palabras.docx', '4d835fe46d6489ec9f7e15dd33d564f11e3079d305fa2004fc3af3cfa41f0f0c'],
  ['ExamenUdeA 2019 I J I print El humor.docx', '7ecbb64f3ac968591bb403b954932119e8858e26b5c9fe42dbc97ba588571126'],
  ['Documento de Cristian Molina.docx', '94fbf2fc124e8597d93a703b2c5682afe4b1ed010eba458319db00f22b575b2b'],
]);

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[“”«»‘’]/g, '"')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const sourceAudit = {};
const normalizedSources = new Map();
for (const [file, expectedHash] of expectedSources) {
  const absolutePath = path.join(sourceDir, file);
  if (!fs.existsSync(absolutePath)) throw new Error(`Missing audited source: ${absolutePath}`);
  const actualHash = sha256(absolutePath);
  if (actualHash !== expectedHash) throw new Error(`Source hash mismatch: ${file}`);
  const extractedText = execFileSync('/usr/bin/textutil', ['-convert', 'txt', '-stdout', absolutePath], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  normalizedSources.set(file, normalize(extractedText));
  sourceAudit[file] = { sha256: actualHash, hash_matches_audited_copy: true };
}

const bank = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/question_bank.json'), 'utf8'));
const resources = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/text_resources.json'), 'utf8'));
const resourceIds = new Set(resources.map((resource) => resource.id));
const bySource = {};
const unsupported = [];

for (const question of bank) {
  const sourceText = normalizedSources.get(question.source_file);
  if (!sourceText) throw new Error(`Question references a source outside the audited set: ${question.id}`);
  const questionMatch = sourceText.includes(normalize(question.question));
  const optionMatches = Object.values(question.options ?? {}).filter((option) => sourceText.includes(normalize(option))).length;
  const directCompleteMatch = questionMatch && optionMatches === 4;
  const bucket = bySource[question.source_file] ??= {
    total: 0,
    eligible: 0,
    excluded: 0,
    direct_complete_matches: 0,
    question_text_matches: 0,
    option_text_matches: 0,
    option_text_total: 0,
    manual_or_visual_reconstruction: 0,
  };
  bucket.total += 1;
  bucket.eligible += question.official_exam_eligible ? 1 : 0;
  bucket.excluded += question.admin_status === 'excluded' ? 1 : 0;
  bucket.direct_complete_matches += directCompleteMatch ? 1 : 0;
  bucket.question_text_matches += questionMatch ? 1 : 0;
  bucket.option_text_matches += optionMatches;
  bucket.option_text_total += Object.keys(question.options ?? {}).length;
  bucket.manual_or_visual_reconstruction += directCompleteMatch ? 0 : 1;

  const hasValidTexts = (question.text_resource_ids ?? []).every((id) => resourceIds.has(id));
  const hasRenderedLocator = question.verbatim_verification?.rendered_page_located === true;
  const hasManualEvidence = question.verbatim_verification?.source_text_match === true
    && /(manual|rendered|reconstruction|transcription)/.test(String(question.verbatim_verification?.method ?? ''));
  if (!directCompleteMatch && (!hasRenderedLocator || !hasManualEvidence || !hasValidTexts)) {
    unsupported.push(question.id);
  }
}

if (unsupported.length) {
  throw new Error(`Questions without direct or manual/visual source support: ${unsupported.join(', ')}`);
}

const eligible = bank.filter((question) => question.official_exam_eligible);
const excluded = bank.filter((question) => question.admin_status === 'excluded');
const readyExams = [...new Set(eligible.map((question) => `${question.year}-${question.period}-${question.session}`))]
  .filter((exam) => eligible.filter((question) => `${question.year}-${question.period}-${question.session}` === exam).length === 80);

if (bank.length !== 477 || eligible.length !== 437 || excluded.length !== 40 || readyExams.length !== 5) {
  throw new Error('Final bank totals do not match the audited closure contract.');
}
if (bank.some((question) => ['needs_review', 'incomplete'].includes(question.admin_status))) {
  throw new Error('The final bank still contains pending or incomplete records.');
}

let partialKey = null;
if (partialKeyImage) {
  const expectedPartialKeyHash = 'd2d2e59edc51470ebd55f7fcab62106ebc944536a2b1c254912594926c3e873d';
  const actualHash = sha256(partialKeyImage);
  if (actualHash !== expectedPartialKeyHash) throw new Error('2018-1 J3 answer-key image hash mismatch.');
  partialKey = {
    file: path.basename(partialKeyImage),
    sha256: actualHash,
    observed_scope: 'RL 41-77 only',
    cl_1_40: 'blank',
    rl_78_80: 'blank_and_absent_from_source_exam',
  };
}

const report = {
  generated_at: new Date().toISOString(),
  result: 'PASS_WITH_DOCUMENTED_EXCLUSIONS',
  totals: {
    records: bank.length,
    eligible: eligible.length,
    excluded_without_key: excluded.length,
    pending_review: 0,
    incomplete: 0,
    ready_historical_exams: readyExams.length,
  },
  source_integrity: sourceAudit,
  direct_text_comparison: bySource,
  partial_answer_key_2018_1_j3: partialKey,
  closure_decision: {
    enabled: 'Five complete 80-question historical exams plus the verified 2018-1 J3 RL block 41-77.',
    excluded: '2018-1 J3 CL 1-40: literal text verified, but no answers exist in the supplied key.',
    not_invented: '2018-1 J3 RL 78-80: absent from both the source exam and supplied key.',
  },
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
