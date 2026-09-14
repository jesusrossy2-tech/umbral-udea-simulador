import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const asset = (name) => `assets/UDEA_2018_1_J3/${name}`;

const starScenario = 'La anterior figura tiene seis regiones, todas ellas con un área diferente y correspondiente a un número entero menor que 10. El área total de toda la figura es de 29 unidades cuadradas.';
const pyramidScenario = 'Se tiene una pirámide con diez cajones en la base, nueve en la siguiente y así sucesivamente hasta llegar a la punta en donde hay un solo cajón. Se sabe que a partir de los cajones de la base cada uno de los números de los cajones corresponde al promedio de los números de los dos cajones de inmediatamente abajo.';
const landScenario = 'Se tiene un terreno el cual se ha dividido en una parte cuadrada para la huerta de lado x con 0 < x ≤ 50 y el resto para el césped.';
const codeScenario = 'Un código secreto entre dos personas consta de darle un valor numérico a las 27 letras y una función lineal, tales que los valores que toma la función en cada valor asignado a la letra corresponden a un mensaje. Por ejemplo: A=1, B=2, C=3 y D=4; además la primera persona ha escogido la función f(x)=2x+1. La otra persona debe despejar la letra x de la función, entonces la palabra EDAD corresponde a 11, 9, 3, 9.';

const repairs = {
  47: {
    question: `${starScenario} Si se sabe que el área del triángulo AFD es un número par, lo mismo que el área del triángulo BFD, entonces sobre las áreas de las regiones A, F, B y D se tienen las siguientes afirmaciones: I. Todas son pares. II. Todas son impares. III. Una de estas es par, mientras que el resto impar. ¿Cuáles de las anteriores afirmaciones no son posibles?`,
    options: { A: 'Solo la II', B: 'Solo la III', C: 'La I y la II', D: 'La I y la III' },
    answer: 'C', topic: 'logical_relations', page: 6, visual: asset('42670f7c1bc1db46.png'),
  },
  48: {
    question: `${starScenario} Si se sabe que el área de cada uno de los triángulos formados por tres regiones es par, entonces el área de la región F es`,
    options: { A: '2', B: '4', C: '3', D: '7' },
    answer: 'B', topic: 'logical_relations', page: 6, visual: asset('42670f7c1bc1db46.png'),
  },
  49: {
    question: 'Se tienen a, b y c perteneciente a los números reales distintos entre sí y diferentes de cero que satisfacen la expresión: 1/a = 1/b + 1/c. Si a y c se duplican, entonces el valor de 1/b para que se mantenga la misma relación',
    options: { A: 'Se duplica', B: 'Se reduce a la mitad', C: 'Se reduce a un tercio', D: 'Se triplica' },
    answer: 'B', topic: 'algebra_and_equations', page: 6,
  },
  50: {
    question: 'Una maquina trabaja 100 hora con 12,5 litros de gasolina. En un instante solo contiene 1 litro. El número máximo de horas que esta máquina podrá funcionar es',
    options: { A: '6', B: '8', C: '10', D: '12' },
    answer: 'B', topic: 'percentages_and_proportions', page: 6,
  },
  51: {
    question: 'Dos relojes solo marcan la hora y los minutos. Si en un momento se muestran las 12:05 y 12:07, entonces el resultado de restar la diferencia máxima y la mínima en segundos entre estos dos relojes es',
    options: { A: '124', B: '122', C: '120', D: '118' },
    answer: 'D', topic: 'arithmetic', page: 6,
  },
  52: {
    question: 'Si se sabe que △(5)=3 y △(x+5)=△(x)·△(5), entonces hallar el valor de △(-5)',
    options: { A: '1', B: '½', C: '1/3', D: '2' },
    answer: 'C', topic: 'algebra_and_equations', page: 6,
  },
  53: {
    question: 'Dado un número positivo con varios dígitos es posible borrarle algunos dígitos para obtener otro número. Por ejemplo: si al número 2336 le borramos el 2 y el 3 obtenemos 36 y si borramos el 2 y 6 obtenemos 33. ¿Cuántos son los números diferentes que se obtienen al borrar dos dígitos del número 55667788?',
    options: { A: '10', B: '11', C: '12', D: '13' },
    answer: 'A', topic: 'counting', page: 6,
  },
  54: {
    question: `${pyramidScenario} El número que corresponde al cajón de la punta es`,
    options: { A: '50', B: '55', C: '60', D: '75' },
    answer: 'B', topic: 'sequences_and_patterns', page: 6, visual: asset('be3ef5ca6658a17a.png'),
  },
  55: {
    question: `${pyramidScenario} El número de veces que aparece el número 50 en la pirámide es`,
    options: { A: '0', B: '3', C: '5', D: '10' },
    answer: 'C', topic: 'sequences_and_patterns', page: 6, visual: asset('be3ef5ca6658a17a.png'),
  },
  56: {
    question: 'Se tiene la expresión z = ax² + bx + c perteneciente a los números reales. Se sabe que cuando x es igual a 0, entonces z es igual a 3 y cuando x es igual a -3, entonces z es igual a 6. El valor de 3a - b es',
    options: { A: '1', B: '2', C: '3', D: '4' },
    answer: 'A', topic: 'algebra_and_equations', page: 7,
  },
  57: {
    question: `${landScenario} Considera: I. El área total del terreno es menor o igual a 3.000 m². II. El perímetro del terreno antes de ser dividido es x² + x + 520. Son verdaderas`,
    options: { A: 'Solo I', B: 'Solo II', C: 'I y II', D: 'Ninguna' },
    answer: 'A', topic: 'geometry', page: 7, visual: asset('35fdf935526d2083.png'),
  },
  58: {
    question: `${landScenario} Si se supone que x es igual a 15 metros y el costo lineal de cada metro es de $5.000, entonces el costo para cercar el terreno del césped es`,
    options: { A: '$650.000', B: '$800.000', C: '$950.000', D: '$985.000' },
    answer: 'A', topic: 'geometry', page: 7, visual: asset('35fdf935526d2083.png'),
  },
  59: {
    question: `${codeScenario} Utilizando la misma función y valores, entonces los valores que recibirá la palabra MEDIA son`,
    options: { A: '27, 13, 9, 17, 3', B: '21, 11, 13, 19, 1', C: '27, 11, 9, 19, 3', D: '20, 8, 11, 15, 5' },
    answer: 'C', topic: 'algebra_and_equations', page: 7,
  },
  60: {
    question: `${codeScenario} Con una numeración diferente y la función f(x)=2x-2 usando la palabra AMOR y los números 4, 76, 94 y 112, entonces la numeración inicial a la que corresponden las letras M, O, R son`,
    options: { A: '39, 45, 51', B: '39, 48, 57', C: '31, 43, 54', D: '31, 45, 51' },
    answer: 'B', topic: 'algebra_and_equations', page: 7,
  },
};

const answerKeySource = 'Exámenes/Con respuestas/2018-1 j3/Screenshot_20200318-225258.png';
const touched = [];

for (const question of bank) {
  if (question.year !== 2018 || question.period !== '1' || question.session !== 'J3' || question.section !== 'RL') continue;
  const repair = repairs[question.original_question_number];
  if (!repair) continue;
  const visualResources = repair.visual ? [{ type: 'image', asset: repair.visual, placement: 'stimulus' }] : [];
  Object.assign(question, {
    question: repair.question,
    options: repair.options,
    correct_answer: repair.answer,
    topic: repair.topic,
    subtopic: repair.topic,
    skill: repair.topic,
    source_page: repair.page,
    confidence: 'confirmed_by_key',
    verification_status: 'clean',
    review_reasons: [],
    answer_key_source: answerKeySource,
    answer_key_verification: 'manual_visual_transcription',
    official_exam_eligible: true,
    eligibility_reasons: [],
    assets: repair.visual ? [repair.visual] : [],
    asset_candidates_nearby: [],
    asset_link_status: repair.visual ? 'direct' : 'none',
    source_category: 'EXAM_WITH_ANSWERS_UDEA',
    visual_resources: visualResources,
    verbatim_confidence: 'verified',
    verbatim_verification: {
      method: 'manual_rendered_page_transcription_and_key_match',
      source_text_match: true,
      rendered_page_located: true,
    },
    admin_status: 'verified',
    text_resource_ids: [],
    required_supporting_material: repair.visual ? ['visual'] : [],
    supporting_material_status: repair.visual ? 'complete_verified' : 'not_required',
  });
  touched.push(question.id);
}

if (touched.length !== Object.keys(repairs).length) {
  throw new Error(`Expected ${Object.keys(repairs).length} repairs, updated ${touched.length}.`);
}

fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(JSON.stringify({ updated: touched.length, ids: touched }, null, 2));
