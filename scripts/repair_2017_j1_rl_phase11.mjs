import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const asset = (name) => `assets/UDEA_2017_1_J1/${name}`;

const repairs = {
  44: {
    question: 'En la figura se representan dos cortes de planos en un cubo: uno contiene la diagonal de la cara frontal y el segundo pasa por los puntos medios de esa misma cara. La fracción del volumen sombreado del cubo es',
    options: { A: '1/2', B: '1/4', C: '3/4', D: '2/5' },
    answer: 'C', topic: 'geometry', page: 7,
    stimulus: [asset('367fe199c99ae195.png')],
  },
  47: {
    question: 'Se tiene la operación * definida por m*n = m·n - m - n. El valor de [(2*2)*2]*2 es',
    options: { A: '0', B: '-2', C: '2', D: '-4' },
    answer: 'D', topic: 'arithmetic', page: 7,
  },
  48: {
    question: 'Se tienen las operaciones a ■ b = a² + b² + 2ab y a △ b = a² + b² - 2ab. El valor de y en [(2 ■ 3) + (4 △ 5)]y + 1 = 0 es',
    options: { A: '25', B: '-1/26', C: '1/25', D: '-26' },
    answer: 'B', topic: 'algebra', page: 8,
  },
  49: {
    question: 'El sistema binario representa los números usando únicamente 0 y 1. Para convertir un número binario al sistema decimal se numeran sus posiciones de derecha a izquierda desde 0, se asocia cada posición con la potencia de 2 correspondiente y se suman las potencias cuyas posiciones contienen 1. En el ejemplo visual, 11001011 equivale a 1 + 2 + 8 + 64 + 128 = 203. Si se tiene el conjunto de números binarios {100111, 101101, 101010, 110001}, ordenados de menor a mayor se obtiene',
    options: {
      A: '101101, 100111, 110001, 101010',
      B: '110001, 101101, 101010, 100111',
      C: '101010, 100111, 110001, 101101',
      D: '100111, 101010, 101101, 110001',
    },
    answer: 'D', topic: 'number_systems', page: 8,
    stimulus: [asset('ac8db2a84a0de3cb.png')],
  },
  50: {
    question: 'Luisa quiere sumar 2 números distintos del conjunto {9, 10, 8} y Andrés quiere multiplicar 2 números distintos del conjunto {3, 5, 6}. ¿En cuántos casos es posible que la suma de los números de Luisa sea mayor que la multiplicación de los números de Andrés?',
    options: { A: '1', B: '2', C: '3', D: '4' },
    answer: 'D', topic: 'counting', page: 8,
  },
  51: {
    question: 'Ana y Bernardo tienen el siguiente diálogo. Ana le pide a Bernardo que piense un número, le sume 2, multiplique el resultado por el número inicial y finalmente sume 1. Cuando Bernardo dice el resultado, Ana descubre de inmediato el número que pensó. El mínimo número de operaciones que Ana debe efectuar para descubrirlo es',
    options: { A: '4', B: '3', C: '2', D: '1' },
    answer: 'C', topic: 'algebra', page: 8,
  },
  52: {
    question: 'Ana tiene 18 dulces menos que Beatriz y Carolina juntas. Beatriz tiene 8 dulces menos que Ana y Carolina juntas. Son verdaderas: I. Ana tiene menos dulces que Beatriz. II. Carolina tiene 13 dulces. III. La diferencia entre los dulces de Beatriz y Ana es 5.',
    options: { A: 'II y III', B: 'I y II', C: 'I y III', D: 'I, II y III' },
    answer: 'D', topic: 'algebra', page: 8,
  },
  53: {
    question: 'Cuatro dados cuyas caras opuestas suman 7 están unidos por las caras con el mismo valor, como muestra la figura. El valor de ? es',
    options: { A: '5', B: '4', C: '3', D: '2' },
    answer: 'A', topic: 'spatial_reasoning', page: 8,
    stimulus: [asset('9060de168fa8294d.png')],
  },
  57: {
    question: 'Se forma un cubo con 64 cubitos. Se pintan 3 caras del cubo de color negro y 3 de color blanco, de tal forma que ningún cubito tenga tres caras pintadas de negro. El número de cubitos que tienen solo una cara pintada de negro y otra de blanco es',
    options: { A: '30', B: '24', C: '20', D: '16' },
    answer: 'D', topic: 'geometry', page: 9,
  },
  58: {
    question: 'Un piso cuadrado se recubre con baldosines cuadrados iguales. Los baldosines de las dos diagonales son negros y el resto son blancos. Si hay exactamente 101 baldosines negros, el número total de baldosines que cubren el piso es',
    options: { A: '3600', B: '2500', C: '2401', D: '2601' },
    answer: 'D', topic: 'arithmetic', page: 9,
  },
  59: {
    question: 'En la figura se tiene un hexágono regular y un cuadrado cuyo lado es igual al lado del hexágono. El cociente entre el área del hexágono y el área del cuadrado es',
    options: { A: '√2/3', B: '3√3/2', C: '2√2/3', D: '√3/3' },
    answer: 'B', topic: 'geometry', page: 9,
    stimulus: [asset('q59_hexagono_cuadrado.png')],
  },
  67: {
    question: 'Si x = 10 + 10² + 10³ + … + 10²⁰, la suma de los dígitos de x es',
    options: { A: '19', B: '20', C: '21', D: '22' },
    answer: 'B', topic: 'arithmetic', page: 10,
  },
  72: {
    question: 'En un colegio hay 300 estudiantes y todos reciben clase al mismo tiempo. Cada estudiante recibe 4 cursos y cada profesor dicta clase en 4 de estos cursos. Si cada curso está formado por 4 profesores y 25 estudiantes, el número de profesores del colegio es',
    options: { A: '12', B: '24', C: '36', D: '48' },
    answer: 'A', topic: 'arithmetic', page: 10,
  },
  73: {
    question: 'Los arreglos de platos P, Q y R de la primera figura están colocados en orden creciente de peso. Se quiere acomodar el arreglo S de la segunda figura conservando el mismo orden. El lugar donde debe situarse S es',
    options: { A: 'Antes de P', B: 'Entre P y Q', C: 'Entre Q y R', D: 'Después de R' },
    answer: 'C', topic: 'logical_relations', page: 10,
    stimulus: [asset('85ece73cd1acfcc1.png'), asset('a005f642dbc87b7a.png')],
  },
  78: {
    question: 'En la siguiente secuencia: fila 1, 1 + 2 = 3; fila 2, 4 + 5 + 6 = 7 + 8; fila 3, 9 + 10 + 11 + 12 = 13 + 14 + 15. El primero y el último de la fila 30 son',
    options: { A: '900 y 960', B: '850 y 900', C: '841 y 902', D: '925 y 999' },
    answer: 'A', topic: 'sequences', page: 11,
  },
};

const answerKeySource = 'Exámenes/Con respuestas/2017-1 j1/Screenshot_20200318-223714.png';
const touched = [];

for (const question of bank) {
  if (question.year !== 2017 || question.period !== '1' || question.session !== 'J1' || question.section !== 'RL') continue;
  const repair = repairs[question.original_question_number];
  if (!repair) continue;

  const stimulus = repair.stimulus ?? [];
  const visualResources = stimulus.map((file) => ({ type: 'image', asset: file, placement: 'question' }));
  Object.assign(question, {
    question: repair.question,
    options: repair.options,
    correct_answer: repair.answer,
    topic: repair.topic,
    subtopic: repair.topic,
    skill: repair.topic,
    source_page: repair.page,
    confidence: 'confirmed_by_key',
    verification_status: 'verified_by_visual_review',
    review_reasons: [],
    answer_key_source: answerKeySource,
    answer_key_verification: 'manual_visual_transcription',
    official_exam_eligible: true,
    eligibility_reasons: [],
    assets: stimulus,
    asset_candidates_nearby: [],
    asset_link_status: stimulus.length ? 'direct' : 'none',
    source_category: 'EXAM_WITH_ANSWERS_UDEA',
    visual_resources: visualResources,
    option_assets: {},
    verbatim_confidence: 'verified',
    verbatim_verification: {
      method: 'manual_rendered_page_transcription_and_key_match_with_source_numbering_normalized',
      source_text_match: true,
      rendered_page_located: true,
    },
    admin_status: 'verified',
    text_resource_ids: [],
    required_supporting_material: stimulus.length ? ['visual'] : [],
    supporting_material_status: stimulus.length ? 'complete_verified' : 'not_required',
    embedded_image_markers: stimulus.length,
    extraction_method: 'manual_rendered_page_transcription',
  });
  touched.push(question.id);
}

if (touched.length !== Object.keys(repairs).length) {
  throw new Error(`Expected ${Object.keys(repairs).length} repairs, updated ${touched.length}.`);
}

bank.sort((a, b) => a.year - b.year
  || String(a.period).localeCompare(String(b.period))
  || String(a.session).localeCompare(String(b.session))
  || a.original_question_number - b.original_question_number);

fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(JSON.stringify({ updated: touched.length, ids: touched }, null, 2));
