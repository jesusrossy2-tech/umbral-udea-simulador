import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const examQuestions = bank.filter((question) => question.year === 2017 && question.period === '2' && question.session === 'J1');
const byNumber = new Map(examQuestions.map((question) => [question.original_question_number, structuredClone(question)]));
const asset = (name) => `assets/UDEA_2017_2_J1/${name}`;

const answerKey = [
  'BADACBCCDB', 'ACBDCACBCD', 'BACBCBBCAD', 'AADDCBCDDA',
  'ABBBBCDDBA', 'ACCCCCCACB', 'BDCCCACCBA', 'CDBDBDCADC',
].join('');

// El extractor omitió las preguntas impresas 46 y 80, y contó como preguntas
// dos estímulos compartidos (antes 63 y 71). Esta tabla restituye la secuencia
// impresa 41-80 usando los registros que sí contienen cada enunciado.
const sourceRecordForTarget = new Map([
  [41, 41], [42, 42], [43, 43], [44, 44], [45, 45],
  [47, 46], [48, 47], [49, 48], [50, 49], [51, 50],
  [52, 51], [53, 52], [54, 53], [55, 54], [56, 55],
  [57, 56], [58, 57], [59, 58], [60, 59], [61, 60],
  [62, 61], [63, 62], [64, 64], [65, 65], [66, 66],
  [67, 67], [68, 68], [69, 69], [70, 70], [71, 72],
  [72, 73], [73, 74], [74, 75], [75, 76], [76, 77],
  [77, 78], [78, 79], [79, 80],
]);

const pages = new Map([
  ...Array.from({ length: 10 }, (_, index) => [41 + index, 6]),
  [51, 6], ...Array.from({ length: 6 }, (_, index) => [52 + index, 7]),
  ...Array.from({ length: 8 }, (_, index) => [58 + index, 8]),
  ...Array.from({ length: 7 }, (_, index) => [66 + index, 9]),
  ...Array.from({ length: 8 }, (_, index) => [73 + index, 10]),
]);

const visuals = new Map([
  [50, { question: [asset('6bb07d024a8cd974.png')] }],
  [51, { question: [asset('17cb31d003bc4cd9.png')] }],
  [53, { options: {
    A: asset('fb70e856322c5534.png'), B: asset('930cca3093065867.png'),
    C: asset('5e1ce873c22eee77.png'), D: asset('b0bd437eaf0658b5.png'),
  } }],
  [54, { question: [asset('deeef7d36aa92e36.png')] }],
  [55, { question: [asset('36983b92b0751198.png')] }],
  [56, { question: [asset('e0f1b6d7610aed74.png')] }],
  [59, { question: [asset('364cc63704796e28.png')] }],
  [61, { question: [asset('54d565531c717606.png')] }],
  [72, { question: [asset('09b8492567e234f5.png')] }],
  [73, { question: [asset('e41bcc374825585d.png')] }],
]);

const custom = {
  41: {
    question: 'Si A es el 1/4 % de B, entonces el porcentaje de A que representa B es',
    options: { A: '40.000%', B: '400.000%', C: '400%', D: '4.000%' },
    topic: 'arithmetic',
  },
  46: {
    question: 'A, B y C son tres cantidades positivas tales que el producto de A y B es igual a 4C. Si A aumenta en un 60% y B disminuye en un 25%, el porcentaje en que deberá aumentar C para que se mantenga la igualdad es',
    options: { A: '35%', B: '25%', C: '20%', D: '30%' },
    topic: 'algebra',
  },
  50: {
    question: 'En el cuadro de la figura deben escribirse los números del 3 al 11, sin repetir, de manera que la suma de los tres números de cada fila, columna y diagonal sea la misma. El valor de m es',
    options: { A: '7', B: '5', C: '6', D: '8' },
  },
  52: {
    options: { A: '2(x + y - 14)', B: '2(x + y - 7)', C: '2(x + y)', D: '2(x - y)' },
  },
  57: {
    options: { A: '9√3', B: '18√2', C: '9√5/2', D: '27/2' },
  },
  58: {
    question: 'Se tiene un terreno rectangular de 204 m por 108 m. Se va a partir en el menor número posible de parcelas cuadradas iguales. Si se planta una lechuga en cada esquina de los cuadrados, el número de lechugas que se plantarán es',
  },
  62: {
    question: 'Juan tiene ahorrado el número de dos cifras ab y diariamente gana el número de dos cifras ba dólares. Si al cabo de 30 días tiene un total de a0b dólares y no ha gastado nada, el valor de a + b es. Nota: las expresiones ab y ba representan números de dos cifras; en a0b, el carácter central es cero.',
  },
  64: {
    question: 'Cinco niñas van al parque con pelotas, todas de diferente color, e intercambian todas las pelotas. Se sabe que Ana está sentada, triste, porque quisiera tener la pelota blanca de Lucía; Lina juega con la pelota negra de su amiga; la dueña de la pelota roja juega con la pelota verde de Rosa; y Julia juega con su propia pelota mientras mira a la dueña de la pelota azul. De lo anterior se concluye que las dueñas respectivas de la pelota roja y la pelota negra son',
  },
  65: {
    question: 'Cinco niñas van al parque con pelotas, todas de diferente color, e intercambian todas las pelotas. Se sabe que Ana está sentada, triste, porque quisiera tener la pelota blanca de Lucía; Lina juega con la pelota negra de su amiga; la dueña de la pelota roja juega con la pelota verde de Rosa; y Julia juega con su propia pelota mientras mira a la dueña de la pelota azul. La proposición que entra directamente en contradicción con el color de la pelota con la que juegan las niñas es',
  },
  72: {
    question: 'Se tiene la operación arbitraria * representada en la tabla. Se lee primero la letra de la fila y luego la de la columna; así, a*b = b y b*a = d. Además, x² = x*x. El resultado de (((a*b)*c)*d)² es',
  },
  78: {
    question: 'Se tienen los primeros cinco términos a, b, c, d y e de una secuencia. A partir del tercer término, cada término es la suma de los dos anteriores, y se sabe que a = e = 9. La suma a + b + c + d + e es',
  },
  79: {
    question: 'Se tienen cinco luces de colores diferentes. Se encienden, respectivamente, cada 4, 5, 6, 7 y 8 minutos. Si todas se encienden simultáneamente a las 8:00 a. m., el siguiente instante en que las cinco coinciden es',
    options: { A: '10:40 p. m.', B: '12:40 p. m.', C: '6:00 p. m.', D: '10:00 p. m.' },
  },
  80: {
    question: 'Tres números naturales son múltiplos consecutivos de 5. El triple del menor es igual al doble del mayor. Acerca del mayor se puede afirmar que es',
    options: { A: 'un cuadrado perfecto', B: 'múltiplo de 4', C: 'múltiplo de 3', D: 'un número impar' },
    topic: 'arithmetic',
  },
};

const answerKeySource = 'Exámenes/Con respuestas/2017-2 j1/Screenshot_20200318-224037.png';
const touched = [];

for (let number = 41; number <= 80; number += 1) {
  const target = bank.find((question) => question.id === `UDEA_2017_2_J1_RL_${String(number).padStart(3, '0')}`);
  if (!target) throw new Error(`Missing target record for question ${number}.`);
  const sourceNumber = sourceRecordForTarget.get(number);
  const source = sourceNumber ? byNumber.get(sourceNumber) : target;
  const identity = { id: target.id, original_question_number: number };
  Object.assign(target, structuredClone(source), identity, custom[number] ?? {});

  const spec = visuals.get(number) ?? {};
  const questionAssets = spec.question ?? [];
  const optionAssets = spec.options ?? {};
  const visualResources = [
    ...questionAssets.map((file) => ({ type: 'image', asset: file, placement: 'question' })),
    ...Object.entries(optionAssets).map(([letter, file]) => ({ type: 'image', asset: file, placement: `option_${letter}` })),
  ];
  const assets = [...questionAssets, ...Object.values(optionAssets)];

  Object.assign(target, {
    correct_answer: answerKey[number - 1],
    source_page: pages.get(number),
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
      method: 'full_rendered_rl_sequence_reconstruction_and_key_match',
      source_text_match: true,
      rendered_page_located: true,
    },
    admin_status: 'verified',
    text_resource_ids: [],
    required_supporting_material: assets.length ? ['visual'] : [],
    supporting_material_status: assets.length ? 'complete_verified' : 'not_required',
    embedded_image_markers: assets.length,
    extraction_method: 'manual_rendered_page_transcription',
  });
  touched.push(target.id);
}

const cl32 = bank.find((question) => question.id === 'UDEA_2017_2_J1_CL_032');
if (!cl32) throw new Error('Missing UDEA_2017_2_J1_CL_032.');
Object.assign(cl32, {
  question: 'La expresión «nos dicen» del texto señala a',
  confidence: 'confirmed_by_key',
  verification_status: 'verified_by_visual_review',
  review_reasons: [],
  official_exam_eligible: true,
  eligibility_reasons: [],
  verbatim_confidence: 'verified',
  verbatim_verification: {
    method: 'manual_rendered_page_transcription_and_key_match',
    source_text_match: true,
    rendered_page_located: true,
  },
  admin_status: 'verified',
  supporting_material_status: 'complete_verified',
});

bank.sort((a, b) => a.year - b.year
  || String(a.period).localeCompare(String(b.period))
  || String(a.session).localeCompare(String(b.session))
  || a.original_question_number - b.original_question_number);
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(JSON.stringify({ updatedRl: touched.length, updatedCl: [cl32.id] }, null, 2));
