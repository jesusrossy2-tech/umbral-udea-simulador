import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const asset = (name) => `assets/UDEA_2018_1_J3/${name}`;

const setScenario = 'Sea n perteneciente a los números naturales pares, entonces consideremos el conjunto de los números A: A={n², (n+3)², (n+6)², (n+9)², …, (n+60)², (n+63)²}.';
const classScenario = 'Una escuela de idiomas ofrece un curso intensivo de mandarín durante los meses calendario de 31 días. La metodología es de clases diarias en las tardes, excepto los domingos y en la mañana los días martes, jueves y sábado.';
const cardScenario = 'Una persona realiza un juego de cartas para jugar sola. Inicialmente se debe separar la baraja en dos montos y en donde cada jugada obedece a solo uno de los siguientes pasos: I. Del monto de la izquierda solo puede tomar tres cartas. II. Del monto de la derecha solo puede tomar dos cartas. III. De cada uno de los montos puede tomar simultáneamente una carta. El objetivo del juego es tomar todas las cartas de ambos montones.';
const intervalScenario = 'Un intervalo abierto es un conjunto de números entre dos números dados (puntos finales), sin incluirlos. Se representa entre paréntesis. A=(-3, 2), B=(-∞, 1) y C=(0, ∞).';

const repairs = {
  61: { question: `${setScenario} La cantidad de elementos de A es`, options: {A:'21',B:'22',C:'23',D:'24'}, answer:'B', topic:'sets', page:7 },
  62: { question: `${setScenario} La probabilidad de que al tomar un número al azar del conjunto A este sea par es`, options: {A:'1/3',B:'½',C:'1/5',D:'1/7'}, answer:'B', topic:'probability', page:7 },
  63: { question: 'Tomando elementos del conjunto de los números enteros del 1 al 10. Se quiere formar el mayor subconjunto que cumple que el MCD entre cualquier par de números del subconjunto sea diferente de 1. La mayor cantidad de números de este subconjunto es', options: {A:'2',B:'3',C:'4',D:'5'}, answer:'D', topic:'sets', page:7 },
  64: { question: `${classScenario} Si el mes inicia un lunes, entonces el número de clases de este curso de mandarín es`, options: {A:'30',B:'35',C:'40',D:'42'}, answer:'C', topic:'arithmetic', page:7 },
  65: { question: `${classScenario} El día en que podría iniciar el mes para que el número de clases sea máximo`, options: {A:'Martes',B:'Miércoles',C:'Viernes',D:'Sábado'}, answer:'A', topic:'arithmetic', page:7 },
  66: { question: 'Mauricio y Nicolás están jugando un juego en el que en cada ronda uno de ellos pierde y debe triplicar el dinero que el ganador tiene. Por ejemplo, si el que ganó tiene $50 el otro debe darle $100, para que el ganador triplique la cantidad que tenía. En una partida se jugaron dos rondas, en la cual se sabe que en la primera perdió Mauricio y en la segunda perdió Nicolás. Si ambos quedaron con $18.000, entonces la cantidad de dinero que tenía inicialmente Nicolás era', options: {A:'$20.000',B:'$12.000',C:'$10.000',D:'$6.000'}, answer:'C', topic:'arithmetic', page:7 },
  67: { question: `${cardScenario} Se inicia en el monto de la izquierda con 10 cartas y en el de la derecha con 7. El mínimo número de jugadas para alcanzar el objetivo es`, options: {A:'6',B:'8',C:'13',D:'7'}, answer:'D', topic:'logical_relations', page:8 },
  68: { question: `${cardScenario} En esta jugada se inicia con 7 en el monto de la izquierda y con 10 en el de la derecha. La única afirmación verdadera acerca del número de jugadas con relación a lo anterior`, options: {A:'es mayor que 10',B:'es mayor o igual a 12',C:'es mayor que 14',D:'es menor o igual a 8'}, answer:'D', topic:'logical_relations', page:8 },
  69: { question: 'En la anterior gráfica las líneas L1, L2 y L3 son paralelas y los triángulos ABD y ABC tienen áreas de 13 y 7 unidades cuadradas respectivamente. Si entre L1 y L3 hay una distancia de 8 unidades, entonces el valor del segmento AB es', options: {A:'4 unidades',B:'5 unidades',C:'6 unidades',D:'7 unidades'}, answer:'B', topic:'geometry', page:8, stimulus:[asset('fa5da41421588bb6.png')] },
  70: { question: 'Un cuerpo de masa m se encuentra en reposo sobre una superficie horizontal sin fricción. Se aplica una fuerza horizontal y constante desde t=0 hasta un tiempo t1, en este instante se retira la fuerza aplicada. La gráfica que representa la situación anterior es', options: {A:'Gráfica A',B:'Gráfica B',C:'Gráfica C',D:'Gráfica D'}, answer:'A', topic:'data_interpretation', page:8, optionAssets:{A:asset('51eb9c703c44ceda.png'),B:asset('dc82322d20b50fca.png'),C:asset('325ca9801af427c3.png'),D:asset('00a5a239dd488fd1.png')} },
  71: { question: 'A un cuadrado de 4 x 4 se le traza una de sus diagonales y se sombrea una de sus mitades de la siguiente forma: Figura 1. Haciendo uso de la diagonal principal y sin adicionar líneas en esta figura se identifican triángulos diferentes con las siguientes formas. Si se quieren conocer la cantidad de triángulos en total para el cuadrado, por simetría es suficiente contar los triángulos de la región sombreada y después multiplicar por 2. En total, la figura 1 tiene 20 triángulos formados con estas condiciones. En un cuadrado de 5 x 5 la cantidad de triángulos que se forman es', options: {A:'25',B:'30',C:'40',D:'100'}, answer:'B', topic:'geometry', page:8, stimulus:[asset('fdbd4c4e2bc63bc7.png'),asset('7da66df99a2e5457.png'),asset('445a30e8d5a58346.png'),asset('88f2723eafa25513.png'),asset('aaede67c3ad340d0.png')] },
  72: { question: `${intervalScenario} Utilizando la anterior información, podemos decir que la ubicación del intervalo (0, 1) es`, options: {A:'C ∪ (A ∪ B)',B:'B ∩ C',C:'C ∩ (B ∪ A)',D:'C ∩ A'}, answer:'B', topic:'sets', page:9, stimulus:[asset('16c0cc494bbe76fc.png'),asset('6b84f0a3554b1d3e.png'),asset('a664a1066d6c2d0a.png')] },
  73: { question: `${intervalScenario} Al respecto de la región de A ∩ C es igual a`, options: {A:'A ∩ (B ∪ C), la intersección de A con la intersección de B unido C.',B:'C ∩ (A ∪ B), la intersección de C con la intersección de A unido B.',C:'A ∩ (C ∩ B), la intersección de A con la intersección de B y C.',D:'A ∪ (C ∩ B), la unión de A con la intersección de C y B.'}, answer:'B', topic:'sets', page:9, stimulus:[asset('16c0cc494bbe76fc.png'),asset('6b84f0a3554b1d3e.png'),asset('a664a1066d6c2d0a.png')] },
  74: { question: 'Un cubo se partió en 64 cubitos iguales y se le hicieron 3 perforaciones de lado a lado como muestra la figura. El área superficial de la figura que queda después de las perforaciones es', options: {A:'24 cm²',B:'96 cm²',C:'120 cm²',D:'124 cm²'}, answer:'C', topic:'geometry', page:9, stimulus:[asset('0747d7673f280a52.png')] },
  75: { question: 'De 1914 a 1963 hubo 4 papas cuyos nombres papales fueron Juan XXIII, Pio XI, Benedicto XV, Pio XII, aunque sus verdaderos nombres eran Achille, Giacomo, Giuseppe y Eugenio no necesariamente en ese orden. De la correspondencia de los nombres y los nombres papales se sabe que: -El sucesor del papa Pio XI se llamaba Eugenio y fue papa más tiempo que Pio XII. -Giacomo eligió como nombre papal Benedicto XV. -El predecesor de Pio XII se llamaba Achille y fue menos popular que Juan XXIII. De lo anterior se puede decir que el nombre papal de Giuseppe era', options: {A:'Benedicto XV',B:'Pio XI',C:'Pio XII',D:'Juan XXIII'}, answer:'C', topic:'logical_relations', page:9 },
  76: { question: 'Ana tiene 7 libros de varios tamaños y los está mirando desde la izquierda como se muestra en la figura a escala. La vista posible que tiene Ana de sus libros es', options: {A:'Vista A',B:'Vista B',C:'Vista C',D:'Vista D'}, answer:'B', topic:'spatial_reasoning', page:9, stimulus:[asset('f24e5f51293bf1bd.png'),asset('40973b762f5f4cff.png')], optionAssets:{A:asset('aba6c6e9233ad108.png'),B:asset('a17e41ee00ffcf28.png'),C:asset('9ccf04b422264e97.png'),D:asset('1785c6fee11f83f4.png')} },
  77: { question: 'La diferencia entre 2 volúmenes de las cajas cúbicas de lado x, y con x>y (figura 1) se puede describir por la suma de los volúmenes de 3 cuerpos (figura 2). El volumen del cuerpo III se puede expresar en relación de las medidas x y y como', options: {A:'y²(x-y)',B:'x²(x-y)',C:'y²x',D:'y³'}, answer:'A', topic:'geometry', page:10, stimulus:[asset('9d22ed0807c46bfa.png')] },
};

const template = bank.find((q) => q.id === 'UDEA_2018_1_J3_RL_074');
for (const number of [75, 76, 77]) {
  const id = `UDEA_2018_1_J3_RL_${String(number).padStart(3, '0')}`;
  if (!bank.some((q) => q.id === id)) bank.push({ ...structuredClone(template), id, original_question_number: number });
}

const answerKeySource = 'Exámenes/Con respuestas/2018-1 j3/Screenshot_20200318-225258.png';
const touched = [];
for (const question of bank) {
  if (question.year !== 2018 || question.period !== '1' || question.session !== 'J3' || question.section !== 'RL') continue;
  const repair = repairs[question.original_question_number];
  if (!repair) continue;
  const optionAssets = repair.optionAssets ?? {};
  const stimulus = repair.stimulus ?? [];
  const visualResources = [
    ...stimulus.map((file) => ({ type: 'image', asset: file, placement: 'stimulus' })),
    ...Object.entries(optionAssets).map(([letter, file]) => ({ type: 'image', asset: file, placement: `option_${letter}` })),
  ];
  const assets = [...stimulus, ...Object.values(optionAssets)];
  Object.assign(question, {
    question: repair.question, options: repair.options, correct_answer: repair.answer,
    topic: repair.topic, subtopic: repair.topic, skill: repair.topic, source_page: repair.page,
    confidence: 'confirmed_by_key', verification_status: 'clean', review_reasons: [],
    answer_key_source: answerKeySource, answer_key_verification: 'manual_visual_transcription',
    official_exam_eligible: true, eligibility_reasons: [], assets, asset_candidates_nearby: [],
    asset_link_status: assets.length ? 'direct' : 'none', source_category: 'EXAM_WITH_ANSWERS_UDEA',
    visual_resources: visualResources, option_assets: optionAssets,
    verbatim_confidence: 'verified',
    verbatim_verification: { method: 'manual_rendered_page_transcription_and_key_match', source_text_match: true, rendered_page_located: true },
    admin_status: 'verified', text_resource_ids: [],
    required_supporting_material: assets.length ? ['visual'] : [],
    supporting_material_status: assets.length ? 'complete_verified' : 'not_required',
  });
  touched.push(question.id);
}

if (touched.length !== Object.keys(repairs).length) throw new Error(`Expected ${Object.keys(repairs).length} repairs, updated ${touched.length}.`);
bank.sort((a, b) => a.year - b.year || String(a.period).localeCompare(String(b.period)) || String(a.session).localeCompare(String(b.session)) || a.original_question_number - b.original_question_number);
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(JSON.stringify({ updated: touched.length, ids: touched }, null, 2));
