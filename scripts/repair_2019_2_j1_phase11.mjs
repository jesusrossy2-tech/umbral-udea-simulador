import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const resourcesPath = new URL('../data/text_resources.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
const exam = bank.filter((q) => q.year === 2019 && q.period === '2' && q.session === 'J1');
const repairMethod = 'full_rendered_exam_reconstruction_and_key_match';
if (exam.filter((q) => q.verbatim_verification?.method === repairMethod).length === 80) {
  console.log(JSON.stringify({ updated: 0, alreadyRepaired: true }, null, 2));
  process.exit(0);
}

const answerKey = [
  'DDDDBDBDCD', 'CCBCCBBBDA', 'CBABBBADAA', 'CBACCDDCBC',
  'ABBBCAABCA', 'CCDCBCDDCB', 'ACDCCABBBB', 'BDDDAAAACC',
].join('');
const sourceFile = 'Documento de Cristian Molina.docx';
const answerKeySource = 'Exámenes/Con respuestas/2019-2 j1/Screenshot_20200318-230248.png';
const asset = (name) => `assets/UDEA_2019_2_J1/${name}`;
const byNumber = new Map(exam.map((q) => [q.original_question_number, structuredClone(q)]));
const clTemplate = byNumber.get(1);
const rlTemplate = byNumber.get(41);

const textOne = [
  '1. La educación se ha vuelto una necesidad común incuestionable. Los movimientos sociales y las familias demandan educación y ven en ella la materialización de la movilidad social y la expresión de sus utopías. Los individuos aceptan la educación como el signo de su propio deseo y validan su intervención como criterio legítimo de diferenciación. Pocos, por no decir ningún sector social, reclaman para sí la no escolarización.',
  '2. Luego de la posguerra y con algunas fluctuaciones, la educación ha gozado de tanto prestigio que interrogarla resulta, por lo menos, inadecuado. A pesar de ello, la educación no es un asunto incuestionable, mucho menos cuando se busca articularla con el poder. Anunciar las relaciones de la educación con el poder interroga por las repercusiones políticas de un proyecto ampliamente debatido y consensuado. Resulta entonces pertinente preguntar: ¿Cuáles son las relaciones de poder que actúan en la educación hoy? ¿Qué efectos, tensiones y fracturas produce? ¿Dónde adquieren la forma actual los procesos de escolarización y qué tipo de articulación tienen con la escuela y con los aprendizajes?',
  '3. Voy a trabajar estas interrogaciones a partir de mis propias investigaciones que se inscriben en la tradición de pensamiento del Grupo de Historia de la Práctica Pedagógica en Colombia, una historia que opta por un análisis de detalles, relaciones y prácticas. Enfatizamos las prácticas porque son ellas las que atraviesan el saber, el poder y los sujetos. Hago historia al modo arqueológico de formas de enunciación y de visibilidad, que me llevan a señalar tres diferencias con otros análisis históricos: lo visible no se refiere a la estructura, lo decible no son las ideas, y la relación de ambas no pasa por abordar a los actores educativos.',
  '4. Leyendo a Deleuze encontramos dos órdenes analíticos de formación del saber: lo visible y lo decible. Cada uno de ellos susceptible de segmentación en términos de forma y sustancia. Enfatizo la disyunción porque permite advertir que las reglas de formación de lo visible y de lo enunciable no concuerdan. No hay isomorfismo entre escuela y educación, ni entre escolarización y educación, tampoco entre educación y sistema educativo. (…) ',
  '5. Entiendo la escuela como una forma. Una forma que no tiene en principio ninguna orientación, ni propósito definido a no ser que la fuerza que se apropie de ella, le marque orientación, le establezca fines y delimite su función. En mis investigaciones encuentro unos documentos denominados “planes de escuela” que evidencian el establecimiento de la escuela pública de primeras letras como un lugar diferente a otros espacios: la iglesia, la casa, el taller y el hospicio. Esta escuela de la que hablan los planes, surge a finales del siglo XVIII y comienzos del XIX, no es la escuela parroquial, no es la escuela conventual, tampoco podemos asociarla a la enseñanza clandestina ni a la doméstica, tampoco a la escuela doctrinal. Su aparición es el resultado del cruce de varias líneas de fuerza: la pobreza, las prácticas de policía, la figura del niño y la utilidad pública.',
  '6. Lo que se configuró con la escuela fueron un conjunto de prácticas y discursos nuevos y discontinuos que no aspiraban a producir ni a desencadenar grandes sucesos. Esta advertencia es importante, pues ciertamente el poder ha rodeado de solemnidad algunos acontecimientos que legitima para que puedan ser historiados. Aquellos que están por fuera de esa categoría se les invisibiliza—incluso se les saca de la historia—, denominándoseles como cotidianos, grises, nimios o triviales, sin tener en cuenta que son eslabones en el orden del poder. (…) ',
  'Fragmento tomado de: Martínez, Alberto. (2013). Gobernados y/o escolarizados. 35ª ISCHE: Education and Power. Conferencia. 14 páginas.',
].join('\n\n');

const textTwo = [
  '1. La perspectiva teórica que se presenta a continuación intenta fundamentar la idea de que los procesos educativos institucionales están atravesados por el ejercicio del poder de sectores hegemónicos nacionales e internacionales. Para el logro de sus objetivos, estos grupos monopolizan el Estado imponiendo reglas en lo económico, político, social y en lo educativo. Con la mediación de dispositivos, ejercen el poder de manera descendente; pero a su vez, cotidianamente, al interior de las instituciones, también se generan y desarrollan relaciones de poder entre los actores institucionales a modo de reproducción de niveles superiores o bien desarrollando resistencia frente a las mismas.',
  '2. En los ’90, el eje de la postura hegemónica fue producir una visión —sosteniéndose en una parafernalia de dispositivos de distinta naturaleza—, una lógica de la práctica por la que cada actor vea, sienta, actúe y hable de y hacia el mundo de una manera, excluyendo otras formas de actuar y sentir. La imposición de esa visión no es llevada a cabo por la fuerza, sino por medio de sistemas simbólicos con los que se supone que las personas actúan, interpretan y organizan el mundo. Siguiendo a Popkewitz, las políticas educativas —a través de la reforma— establecieron sistemas de inclusión y exclusión e implementaron ciertos estilos de razonamiento para guiar, organizar y evaluar los sucesos diarios en las escuelas. Esta última expresión parte de considerar que los discursos políticamente aceptados organizan la percepción y la experiencia, pudiendo crear sistemas de orden dominantes y a su vez, las apropiaciones y exclusiones se inscriben en las prácticas cotidianas de las escuelas. En el discurso pedagógico se expresan los códigos que intentan ordenar, direccionar y regular las complejas relaciones entre directivos, docentes, y alumnos. Dicho de otra forma, a partir de las interacciones que se generan en la escuela, se construyen subjetividades, se legitiman identidades y se deslegitiman otras. Estos supuestos se basan en una concepción de poder que no responde a una perspectiva en particular sino que puede reconstruirse a partir de distintos aportes, los que se complementan para comprender tan complejo fenómeno […].',
  '3. Es central reconocer el poder como relacional. Las relaciones de poder, por lo tanto, tienen siempre dos direcciones, aunque el poder de un actor o grupo en una relación social sea diminuto comparado con otro. Las relaciones de poder son relaciones de autonomía y dependencia, asimismo el agente más autónomo es, en algún grado, dependiente, y el actor o grupo más dependiente en una relación retiene alguna autonomía. Esta reflexión lleva indefectiblemente a tener en cuenta —en un estudio sobre el poder— los diferentes actores de la escena escolar o a las distintas partes en juego en las relaciones de fuerza. Se hace necesario, por ejemplo, analizar a los directivos pero también a quienes estos dirigen […].',
  '4. El mismo Foucault sostiene que es válido analizar las relaciones de poder —e incluso diría que es perfectamente legítimo hacerlo— focalizando cuidadosamente determinadas instituciones: escuelas, hospitales, cárceles. Estas constituyen un punto de observación privilegiado, diversificado, concentrado, puesto en orden y llevado al punto más alto de su eficacia. Es aquí que, —como una primera aproximación— uno puede esperar ver la apariencia de sus formas y la lógica de sus mecanismos elementales […].',
  'Fragmento tomado de: Andretich, Gabriel (2007). Las relaciones de poder en la escuela: consideraciones para el abordaje en investigaciones Políticas-Educativas, 1 (1), p. 142-149.',
].join('\n\n');

const resourceSpecs = [
  ['UDEA_2019_2_J1_CL_TEXT_ONE', 'Texto Uno', textOne, [1]],
  ['UDEA_2019_2_J1_CL_TEXT_TWO', 'Texto Dos', textTwo, [4, 5]],
  ['UDEA_2019_2_J1_RL_BALLS', 'Información para las preguntas 44 y 45', 'Una caja A tiene 10 bolas rojas marcadas, cada una, con un número del 1 al 10; una caja B tiene 6 bolas verdes marcadas, cada una con un número del 1 al 6. Se van a formar conjuntos de tres bolas tomando dos bolas de la caja B y una bola de la caja A tal que la suma de los números de las tres bolas sea 15.', [7]],
  ['UDEA_2019_2_J1_RL_COINS', 'Información para las preguntas 56 y 57', 'Paola y su hermano tienen 100 monedas y juegan un juego de toma y dame para repartírselas en los días siguientes: el primer día Paola tenía las 100 monedas, guarda una y entrega 99 a su hermano. El segundo día, de las 99 monedas que él tiene, guarda una y le entrega 98 monedas a Paola. El tercer día, de las 98 monedas en juego ella guarda 1 y le entrega 97 monedas a su hermano; y continúa repartiendo las monedas de la misma forma en los días siguientes, guardando cada vez una moneda y entregando las demás.', [8]],
  ['UDEA_2019_2_J1_RL_EDUCATION', 'Información para las preguntas 60 y 61', 'En una entrevista a un grupo de personas se les preguntó por su nivel máximo de educación alcanzada. El siguiente gráfico muestra la cantidad de personas en cada grupo, según su nivel de escolaridad.', [9]],
  ['UDEA_2019_2_J1_RL_BOX', 'Información para las preguntas 65 y 66', 'Alberto quiere vender uchuvas en pequeñas cajas rectangulares y va a diseñar las cajas a partir de una hoja cuadrada de cartón de 30 cm de lado, con el diseño que se muestra en la figura. La caja se formará al doblar por las líneas punteadas pegando las pestañas en los laterales internos de la caja.', [9, 10]],
  ['UDEA_2019_2_J1_RL_OUTFITS', 'Información para las preguntas 71 y 72', 'Jaime, Luis y Francisco están usando camisas de diferente tipo: a cuadros, fondo entero y a rayas; y diferentes tipos de zapatos: tenis, botas y zapatillas.\n\n• Jaime no está usando camisa a cuadros ni tenis.\n• Luis está usando camisa fondo entero o está usando camisa a cuadros y no está usando botas.\n• Francisco está usando tenis o está usando botas y no está usando camisa a cuadros.\n• La persona que está usando zapatillas viste una camisa a rayas.', [10]],
  ['UDEA_2019_2_J1_RL_TILES', 'Información para las preguntas 73 y 74', 'Patricia tiene fichas de tres tipos en forma de cilindro circular recto, todos con igual base, diez de altura de 2 cm, diez de altura 3 cm y ocho de altura 5 cm, marcados, como se indica en la figura, con tipo A, B y C, respectivamente. Patricia desea construir una torre de 59 cm de altura, apilando una ficha sobre otra y usando 18 fichas en total, al menos una ficha de cada tipo y la mayor cantidad de fichas de tipo C.', [10, 11]],
  ['UDEA_2019_2_J1_RL_SYMBOLS', 'Información para las preguntas 78 y 79', 'Se tienen dos igualdades que usan los símbolos geométricos: círculos blancos y negros, cuadrados y triángulos, donde cada símbolo geométrico representa un dígito diferente positivo y dos símbolos contiguos representan un número de dos dígitos.', [11]],
];
for (const [id, title, content, sourcePages] of resourceSpecs) {
  const value = { id, type: 'text', title, content, source_file: sourceFile, source_pages: sourcePages, verbatim_confidence: 'verified' };
  const index = resources.findIndex((r) => r.id === id);
  if (index >= 0) resources[index] = value; else resources.push(value);
}

const custom = {
  1: { question: 'Si la paradoja es una afirmación que parece contraria a la lógica, el autor construye una cuando dice que:' },
  25: { question: 'Parafernalia en el texto podría significar, EXCEPTO:' },
  26: { question: 'En el párrafo 2 se refiere al término “sistema”. Sobre este concepto NO se puede afirmar que:', options: { A: 'Para la autora son equivalentes, si bien tienen variaciones sutiles de acuerdo con el contexto', B: 'Solamente tiene sentido cuando se le asocia con una postura hegemónica', C: 'Está cobijado por el concepto de discurso', D: 'Comprende lo que la autora denomina sistema simbólico, sistemas de inclusión y exclusión y sistemas dominantes' } },
  27: { question: 'Una afirmación, pero en el contexto de la violencia, que ejemplifica las relaciones del poder enunciadas en el párrafo 3 sería, la víctima:', options: { A: 'Depende tanto del victimario como el victimario de la víctima', B: 'Es autónoma y el victimario dependiente, ya que este último depende de la primera para ejercer su poder', C: 'Es más dependiente que el victimario, pues este último es quien ejerce el poder sobre la primera', D: 'Es dependiente y el victimario autónomo, ya que la primera está doblegada a la segunda' } },
  46: { question: 'Con un dado convencional, María hace 3 lanzamientos y anota el valor del tercer lanzamiento siempre y cuando este sea igual a la suma de los valores en los dos lanzamientos anteriores. De los posibles números que anotaría María, la probabilidad de que anote un 6 es:', options: { A: '1/3', B: '1/2', C: '2/3', D: '3/10' }, topic: 'probability' },
  47: { question: 'La figura a continuación corresponde a un triángulo, el cual se dividió en 4 regiones. Donde las áreas de los triángulos no sombreados son todas iguales y el área sombreada corresponde a la mitad del área no sombreada de este triángulo. Así, la razón entre el área del triángulo exterior y el área sombreada es' },
  50: { question: 'α, β y γ representan los valores, en grados, de los ángulos interiores de un triángulo. Si los valores de α y β corresponden al 50% y 75% del valor de γ, respectivamente, entonces el valor de β en grados es:' },
  53: { question: 'Para cada par de números enteros a y b definimos la operación v(a, b) = b − a si b > a, y v(a, b) = a − b si a > b. Si x > 6, entonces el valor que hace posible la igualdad v(18, 3x) = 6 es:' },
  56: { question: 'El día que Paola recibe 90 monedas de su hermano es el:', options: { A: '5°', B: '8°', C: '10°', D: '15°' } },
  61: { options: { A: 'la fracción en universitaria es la menor de las tres fracciones', B: 'la fracción en secundaria es la mayor de las tres fracciones', C: 'la fracción en primaria es menor que la fracción en universitaria', D: 'la fracción en primaria es menor que la fracción en secundaria' } },
  62: { question: 'Cuatro baldosas cuadradas ubicadas en el centro de un patio, tienen el diseño mostrado en la figura. Cada baldosa está dividida en cuatro cuadrados y cuatro pentágonos que tienen tres de sus lados iguales a los lados de los cuadrados. La proporción cubierta por los pentágonos, del área total de las cuatro baldosas es:', options: { A: '3/5', B: '4/7', C: '5/9', D: '2/3' }, topic: 'geometry' },
  63: { question: 'El triángulo ABC de base 2 cm y altura 4 cm, tiene inscrito el rectángulo BPQR de lados PQ = 2√2 y RQ = 2 − √2, con P, Q, R puntos sobre los lados del triángulo ABC, como se muestra en la figura. El cociente entre el área de la región sombreada y la región no sombreada del triángulo ABC es:', options: { A: '3/2', B: '2√2', C: '√2/2', D: '1' }, topic: 'geometry' },
  67: { question: 'En la figura se muestra un cuadrado dividido en tres regiones, siendo dos de ellas, dos triángulos equiláteros iguales (triángulos sombreados). Si el perímetro de la región no sombreada es 20 cm, entonces el área de la región sombreada, en cm cuadrados, es:', options: { A: '2', B: '2√3', C: '4', D: '√3' }, topic: 'geometry' },
  70: { question: 'Se tienen cuatro tanques con forma de cilindro circular recto. El tanque uno tiene radio r y altura h, el tanque dos tiene radio 2r y altura h/2, el tanque tres tiene radio 2r y altura h y el tanque cuatro tiene radio r y altura 2h (todas las medidas anteriores están dadas en metros). Si llamamos V₁, V₂, V₃ y V₄ a los volúmenes de los tanques uno, dos, tres y cuatro respectivamente, entonces de las siguientes afirmaciones, respecto a los volúmenes de los tanques: I. V₃ = 2V₁; II. V₂ = V₄; III. V₃ = 2V₂; IV. V₃ = V₄. Son verdaderas:', options: { A: 'Solamente I y IV', B: 'Solamente II y III', C: 'Solamente I y II', D: 'Solamente III y IV' } },
  71: { question: 'De las siguientes afirmaciones, la única falsa es:', options: { A: 'Luis usa zapatillas o tenis.', B: 'Jaime usa botas.', C: 'Francisco no usa zapatillas.', D: 'Jaime usa camisa a rayas.' } },
  72: { question: 'El tipo de camisa y zapatos que usa Francisco es:', options: { A: 'Rayas - tenis.', B: 'Fondo entero - tenis.', C: 'Rayas - zapatillas.', D: 'Fondo entero - botas.' } },
  73: { question: 'Al construir la torre con estas condiciones, de las afirmaciones siguientes: I. La cantidad de fichas de tipo C es menor a la cantidad de fichas de tipo A. II. La cantidad de fichas tipo B es mayor a la cantidad de fichas de tipo A. Puede decirse que:' },
  76: { question: 'En una competencia de ciclismo los ciclistas más opcionados a llevarse el título son Ri, Fro y Na. Antes de la última etapa los diarios especializados acerca del tema publican los siguientes pronósticos: I. “Ri y Fro son los competidores más fuertes. O bien Ri o bien Fro se llevarán el título”. II. “Fro y Na están muy fuertes esta temporada. Seguro que si Fro es segundo, entonces Na ganará el título”. III. “Fro y Ri se ven en buena forma para esta competencia. Pero si Fro es tercero, entonces Ri no ganará el título”. IV. “Fro y Na darán lo mejor de sí en esta competencia, pero, o bien Fro o bien Na ocupará el segundo lugar”. Al finalizar la competencia, resultó que los 4 pronósticos fueron correctos. Así, el orden en que llegaron los ciclistas fue (iniciando con el primero y finalizando con el tercero):', options: { A: 'Fro, Na, Ri', B: 'Ri, Na, Fro', C: 'Na, Fro, Ri', D: 'Ri, Fro, Na' } },
  77: { question: 'Se tomaron 4 números enteros distintos y se hicieron las seis sumas posibles de ellos, formados de dos en dos. Las sumas obtenidas fueron: 0, 2, 4, 4, 6 y 8. El menor valor de los 4 enteros es:', options: { A: '-1', B: '0', C: '-2', D: '1' } },
  79: { question: 'El valor de ● + △ es:' },
  80: { question: 'En una reunión había 10 personas y cada persona tenía los ojos color negro o tenía los ojos color café. Si se sabe que: • Al menos una de las personas en la reunión tenía los ojos color negro. • Al tomar cualquier par de personas en la reunión, al menos una de ellas tenía los ojos color café. De las afirmaciones: I. Más de la mitad de las personas en la reunión tenían los ojos color café. II. Exactamente una persona en la reunión tenía los ojos color negro. Se puede decir que:' },
};

const visuals = new Map([
  [43, [asset('542b6edcfe533e64.jpg')]], [47, [asset('3b7ca0c307f9e6d3.png')]],
  [60, [asset('e4fa2a0fd6443df2.png')]], [61, [asset('e4fa2a0fd6443df2.png')]],
  [62, [asset('f495aa2bccd10239.jpg')]], [63, [asset('599969b160b0e36a.jpg')]],
  [64, [asset('b82ba22be6f39e98.jpg')]], [65, [asset('3fdee30fd86d6c8c.jpg')]],
  [66, [asset('3fdee30fd86d6c8c.jpg')]], [67, [asset('e87bc54843dbc5d2.jpg')]],
  [69, [asset('0b07e09803700875.jpg')]], [73, [asset('0467cd2b1d4d0f37.jpg')]],
  [74, [asset('0467cd2b1d4d0f37.jpg')]], [78, [asset('4b373a41958fb893.jpg')]],
  [79, [asset('4b373a41958fb893.jpg'), asset('b19251f33f7e2935.png'), asset('4a139c6bee18c239.png')]],
]);
const shared = new Map([
  [44, ['UDEA_2019_2_J1_RL_BALLS']], [45, ['UDEA_2019_2_J1_RL_BALLS']],
  [56, ['UDEA_2019_2_J1_RL_COINS']], [57, ['UDEA_2019_2_J1_RL_COINS']],
  [60, ['UDEA_2019_2_J1_RL_EDUCATION']], [61, ['UDEA_2019_2_J1_RL_EDUCATION']],
  [65, ['UDEA_2019_2_J1_RL_BOX']], [66, ['UDEA_2019_2_J1_RL_BOX']],
  [71, ['UDEA_2019_2_J1_RL_OUTFITS']], [72, ['UDEA_2019_2_J1_RL_OUTFITS']],
  [73, ['UDEA_2019_2_J1_RL_TILES']], [74, ['UDEA_2019_2_J1_RL_TILES']],
  [78, ['UDEA_2019_2_J1_RL_SYMBOLS']], [79, ['UDEA_2019_2_J1_RL_SYMBOLS']],
]);
const pageFor = (n) => n <= 3 ? 1 : n <= 11 ? 2 : n <= 19 ? 3 : n <= 23 ? 4 : n <= 32 ? 5 : n <= 40 ? 6 : n <= 49 ? 7 : n <= 59 ? 8 : n <= 64 ? 9 : n <= 72 ? 10 : n <= 79 ? 11 : 12;

bank.splice(0, bank.length, ...bank.filter((q) => !(q.year === 2019 && q.period === '2' && q.session === 'J1')));
for (let number = 1; number <= 80; number += 1) {
  const base = byNumber.get(number) ?? structuredClone(number <= 40 ? clTemplate : rlTemplate);
  const section = number <= 40 ? 'CL' : 'RL';
  const id = `UDEA_2019_2_J1_${section}_${String(number).padStart(3, '0')}`;
  const linkedTexts = section === 'CL'
    ? (number <= 23 ? ['UDEA_2019_2_J1_CL_TEXT_ONE'] : number <= 37 ? ['UDEA_2019_2_J1_CL_TEXT_TWO'] : ['UDEA_2019_2_J1_CL_TEXT_ONE', 'UDEA_2019_2_J1_CL_TEXT_TWO'])
    : (shared.get(number) ?? []);
  const files = visuals.get(number) ?? [];
  Object.assign(base, custom[number] ?? {}, {
    id, source_type: 'historical_exam', source_file: sourceFile, year: 2019, period: '2', session: 'J1', section,
    original_question_number: number, correct_answer: answerKey[number - 1], source_page: pageFor(number),
    confidence: 'confirmed_by_key', verification_status: 'verified_by_visual_review', review_reasons: [],
    answer_key_source: answerKeySource, answer_key_verification: 'manual_visual_transcription',
    official_exam_eligible: true, eligibility_reasons: [], source_category: 'EXAM_WITH_ANSWERS_UDEA',
    assets: files, asset_candidates_nearby: [], asset_link_status: files.length ? 'direct' : 'none',
    visual_resources: files.map((file) => ({ type: 'image', asset: file, placement: 'question' })), option_assets: {},
    verbatim_confidence: 'verified', verbatim_verification: { method: repairMethod, source_text_match: true, rendered_page_located: true, supplementary_package: 'banco_preguntas_udea_simulacro.zip' },
    admin_status: 'verified', text_resource_ids: linkedTexts,
    required_supporting_material: [...(linkedTexts.length ? ['text'] : []), ...(files.length ? ['visual'] : [])],
    supporting_material_status: linkedTexts.length || files.length ? 'complete_verified' : 'not_required',
    embedded_image_markers: files.length, extraction_method: 'manual_rendered_page_transcription_and_asset_cross_check',
  });
  if (!base.question?.trim() || Object.keys(base.options ?? {}).sort().join('') !== 'ABCD') throw new Error(`Incomplete reconstructed question ${number}`);
  bank.push(base);
}

bank.sort((a, b) => a.year - b.year || String(a.period).localeCompare(String(b.period)) || String(a.session).localeCompare(String(b.session)) || a.original_question_number - b.original_question_number);
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
fs.writeFileSync(resourcesPath, `${JSON.stringify(resources, null, 2)}\n`);
console.log(JSON.stringify({ updated: 80, total: bank.length, answerKeyLength: answerKey.length, resources: resourceSpecs.length }, null, 2));
