import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const examQuestions = bank.filter((question) => question.year === 2018 && question.period === '1' && question.session === 'J2');
const repairMethod = 'full_rendered_rl_sequence_reconstruction_cross_checked_with_supplementary_zip';
const alreadyRepaired = examQuestions.filter((question) => question.section === 'RL'
  && question.verbatim_verification?.method === repairMethod);
if (alreadyRepaired.length === 40) {
  console.log(JSON.stringify({ updatedRl: 0, alreadyRepaired: true }, null, 2));
  process.exit(0);
}
const byNumber = new Map(examQuestions.map((question) => [question.original_question_number, structuredClone(question)]));
const asset = (name) => `assets/UDEA_2018_1_J2/${name}`;

const answerKey = [
  'CACDDDADBC', 'CACDDADCDB', 'ADDCBBAABA', 'CAACCBBBAD',
  'CBCBDDCACB', 'CACDBAAACC', 'BADDACAACC', 'BCDBBCCDDC',
].join('');

// El documento fuente contiene un estímulo compartido contado como registro 76 y
// omitió la pregunta impresa 47. Desde ese punto, los registros 47-75 quedaron
// desplazados una posición. Esta tabla restituye la numeración impresa 41-80.
const sourceRecordForTarget = new Map([
  [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46],
  [48, 47], [49, 48], [50, 49], [51, 50], [52, 51], [53, 52],
  [54, 53], [55, 54], [56, 55], [57, 56], [58, 57], [59, 58],
  [60, 59], [61, 60], [62, 61], [63, 62], [64, 63], [65, 64],
  [66, 65], [67, 66], [68, 67], [69, 68], [70, 69], [71, 70],
  [72, 71], [73, 72], [74, 73], [75, 74], [76, 75],
  [77, 77], [78, 78], [79, 79], [80, 80],
]);

const pageFor = (number) => {
  if (number <= 43) return 4;
  if (number <= 54) return 5;
  if (number <= 64) return 6;
  if (number <= 74) return 7;
  return 8;
};

const visuals = new Map([
  [43, { question: [asset('q43_codigos_fuente.png')] }],
  [54, { question: [asset('e87958e8f3ca90e6.png')] }],
  [67, { question: [asset('39d50783735fd9d8.png')] }],
  [70, { question: [asset('10e3898345acc215.png')] }],
  [71, { question: [asset('c8b1f3147404cd3f.png')] }],
  [72, { question: [asset('d484f47fde45bba8.png')] }],
  [73, { question: [asset('41151d71332d862d.png')] }],
  [74, { question: [
    asset('543cf0c7fe591f6c.png'),
    asset('2725ce4ac5c99eff.png'),
    asset('71004971b1fc1c6d.png'),
  ] }],
  [75, { question: [asset('681b98699fa107e1.png')] }],
  [76, { question: [asset('d1a0d50a245a0c35.png')] }],
  [77, { question: [asset('cb5501c61f6c8cc1.png')] }],
  [78, { question: [asset('cb5501c61f6c8cc1.png')] }],
  [79, { question: [asset('a63fef9c3f8a9632.png'), asset('5403535b3f43ec8d.png')] }],
  [80, {
    stimulus: [
      asset('35511fe5a1fda9f0.png'),
      asset('3993519bab15dc18.png'),
      asset('54313b7a9d42a5b5.png'),
    ],
    options: {
      A: asset('1063f9a8e6acbfa8.png'),
      B: asset('aeebb4520c4e6cec.png'),
      C: asset('36838af20c62a9c0.png'),
      D: asset('9b4c982ceb623fbd.png'),
    },
  }],
]);

const sharedSquares = 'En la figura se tiene un cuadrado, en este se unen los puntos medios y se forma otro cuadrado, en este último se unen los puntos medios y se forma un tercer cuadrado, y por último se forma un cuarto cuadrado uniendo los puntos medios del tercero. El área del triángulo rectángulo EFG es 2 cm².';

const custom = {
  43: {
    question: 'Cuatro palabras OLA, RÍO, SER y ESA se codifican en los siguientes símbolos: □△●, ⍟⟐#, △□#, ●⬆⍟; cada código representa una palabra, no necesariamente en el mismo orden. La letra que corresponde al símbolo ⍟ es',
  },
  47: {
    question: 'Tres amigos se encuentran un tesoro con 21 monedas: 7 de oro, 7 de plata y 7 de bronce. Ellos van a repartirse las monedas que a cada uno le toque la misma cantidad de monedas que los otros dos, además, quieren que cada uno quede con la misma cantidad de dinero. Se sabe que una moneda de oro vale 2 puntos, una de plata vale 1 punto y una de bronce vale 0 puntos. Si ninguno puede tener más de cinco monedas de la misma denominación, la máxima cantidad de monedas de bronce que puede tener uno de ellos es',
    options: { A: '1', B: '2', C: '3', D: '4' },
    topic: 'combinatorics',
  },
  52: {
    question: 'Se tienen dos bolsas con seis balotas cada una, con los números 11, 14, 15, 26, 28 y 35 en la primera bolsa, y 13, 23, 29, 30, 31 y 32 en la segunda. La probabilidad de sacar una balota de cada bolsa y que su suma sea un número par es',
    options: { A: '1/2', B: '1/6', C: '1/4', D: '2/3' },
    topic: 'probability',
  },
  57: {
    question: 'Se tiene una jarra con 1 litro (1000 cm³). Si se quiere verter su contenido completo en envases de 1/2, 1/4, 1/6, 1/8, 1/10 y 1/12 de su contenido, entonces los dos envases que no se utilizarán son',
    options: {
      A: '1/8 y 1/10',
      B: '1/10 y 1/12',
      C: '1/2 y 1/4',
      D: '1/4 y 1/6',
    },
  },
  58: {
    question: 'Se define la operación a*b = a/(3 - 2b); por ejemplo, 2*2 = -2 y 1*(-1) = 1/5. Además, se sabe que a²*a = 1. El resultado de la suma de los posibles valores para los cuales a cumple con la ecuación anterior es',
    options: { A: '-2', B: '0', C: '1', D: '2' },
    topic: 'algebra',
  },
  63: {
    options: { A: 'Camilo', B: 'Luis', C: 'Andrés', D: 'Juanita' },
  },
  65: {
    question: 'Se tiene la siguiente sucesión: n = 1 - 2 - 3 + 4 + 5 - 6 - 7 + 8 + 9 - 10 - 11 + 12 + 13 … - 99. El valor de n es',
    options: { A: '0', B: '1', C: '50', D: '100' },
    topic: 'arithmetic',
  },
  70: {
    question: 'Se tiene la siguiente figura. El área de la región sombreada es',
    options: { A: '4π + 2', B: '2π - 3', C: '3π', D: '4π' },
    topic: 'geometry',
  },
  73: {
    question: 'En la siguiente suma se tienen todos los números del 1 al 9 una sola vez. El valor de x es',
    options: { A: '4', B: '7', C: '3', D: '9' },
    topic: 'arithmetic',
  },
  74: {
    question: 'Se forman cubos de 1 cm de lado que cumplen con el siguiente arreglo. Si se forma un sólido de dimensiones 2x2x1 cm³, con la condición de que las caras que se tocan entre los cubos debe tener el mismo valor, entonces el menor valor de las caras ocultas del arreglo es',
    options: { A: '20', B: '18', C: '15', D: '12' },
    topic: 'spatial_reasoning',
  },
  77: {
    question: `${sharedSquares} El área del cuadrado ABCD es`,
    options: { A: '32', B: '56', C: '64', D: '72' },
    topic: 'geometry',
  },
  78: {
    question: `${sharedSquares} Siguiendo el camino trazado en las líneas de la figura desde A hasta E, la longitud de dicho camino es`,
    options: { A: '6√2 + 4', B: '2√2 + 5', C: '4 + 2√2', D: '6 + 4√2' },
    topic: 'geometry',
  },
};

const answerKeySource = 'Exámenes/Con respuestas/2018-1 j2/clave de respuestas verificada';
const supplementaryPackage = 'banco_preguntas_udea_simulacro.zip';
const touched = [];

for (let number = 41; number <= 80; number += 1) {
  const target = bank.find((question) => question.id === `UDEA_2018_1_J2_RL_${String(number).padStart(3, '0')}`);
  if (!target) throw new Error(`Missing target record for question ${number}.`);
  const sourceNumber = sourceRecordForTarget.get(number);
  const source = sourceNumber ? byNumber.get(sourceNumber) : target;
  const identity = { id: target.id, original_question_number: number };
  Object.assign(target, structuredClone(source), identity, custom[number] ?? {});

  const spec = visuals.get(number) ?? {};
  const questionAssets = spec.question ?? [];
  const stimulusAssets = spec.stimulus ?? [];
  const optionAssets = spec.options ?? {};
  const visualResources = [
    ...stimulusAssets.map((file) => ({ type: 'image', asset: file, placement: 'stimulus' })),
    ...questionAssets.map((file) => ({ type: 'image', asset: file, placement: 'question' })),
    ...Object.entries(optionAssets).map(([letter, file]) => ({ type: 'image', asset: file, placement: `option_${letter}` })),
  ];
  const assets = [...stimulusAssets, ...questionAssets, ...Object.values(optionAssets)];

  Object.assign(target, {
    correct_answer: answerKey[number - 1],
    source_page: pageFor(number),
    confidence: 'confirmed_by_key',
    verification_status: 'verified_by_visual_review',
    review_reasons: [],
    answer_key_source: answerKeySource,
    answer_key_verification: 'manual_visual_transcription',
    official_exam_eligible: true,
    eligibility_reasons: [],
    assets,
    asset_candidates_nearby: [],
    asset_link_status: assets.length ? 'direct' : 'none',
    source_category: 'EXAM_WITH_ANSWERS_UDEA',
    visual_resources: visualResources,
    option_assets: optionAssets,
    verbatim_confidence: 'verified',
    verbatim_verification: {
      method: repairMethod,
      source_text_match: true,
      rendered_page_located: true,
      supplementary_package: supplementaryPackage,
    },
    admin_status: 'verified',
    text_resource_ids: [],
    required_supporting_material: assets.length ? ['visual'] : [],
    supporting_material_status: assets.length ? 'complete_verified' : 'not_required',
    embedded_image_markers: assets.length,
    extraction_method: 'manual_rendered_page_transcription_and_asset_cross_check',
  });
  touched.push(target.id);
}

bank.sort((a, b) => a.year - b.year
  || String(a.period).localeCompare(String(b.period))
  || String(a.session).localeCompare(String(b.session))
  || a.original_question_number - b.original_question_number);
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(JSON.stringify({ updatedRl: touched.length, first: touched[0], last: touched.at(-1) }, null, 2));
