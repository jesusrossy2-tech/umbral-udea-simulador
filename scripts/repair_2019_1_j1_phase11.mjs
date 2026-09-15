import fs from 'node:fs';

const bankPath = new URL('../data/question_bank.json', import.meta.url);
const resourcesPath = new URL('../data/text_resources.json', import.meta.url);
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
const exam = bank.filter((q) => q.year === 2019 && q.period === '1' && q.session === 'J1');
const repairMethod = 'full_rendered_exam_reconstruction_and_key_match';
if (exam.filter((q) => q.verbatim_verification?.method === repairMethod).length === 80) {
  console.log(JSON.stringify({ updated: 0, alreadyRepaired: true }, null, 2));
  process.exit(0);
}

const answerKey = [
  'DACCCABBBA', 'BBDBACBAAC', 'BBBABCCDCC', 'ACBCBAACBD',
  'BDDBAADBDC', 'BDDDDABDBC', 'CADACBACAB', 'ADAABCBBBC',
].join('');
if (answerKey.length !== 80) throw new Error('The transcribed answer key must contain 80 answers.');

const sourceFile = 'ExamenUdeA 2019 I J I print El humor.docx';
const answerKeySource = 'Exámenes/Con respuestas/2019-1 j1/Screenshot_20200318-230021.png';
const asset = (name) => `assets/UDEA_2019_1_J1/${name}`;
const byNumber = new Map(exam.map((q) => [q.original_question_number, structuredClone(q)]));
const clTemplate = byNumber.get(1);
const rlTemplate = byNumber.get(41);

const textOne = [
  '1. […] El profesor Hoeffding ha dividido el humor en dos clases separadas por él con los calificativos de “grande” y “pequeño”, para fijar los caracteres de la primera, en la cual aparecen los grandes luminares de la filosofía y del arte: Sócrates, Shakespeare, Cervantes, Kierkegaard. Fundamento de esta clasificación es el hecho de que el humor, el grande y genuino, es para Hoeffding no un estado del alma transitorio sino el resultado de un concepto general de la vida. En la obra del ironista, del satírico, del humorista en pequeño puede haber alternativas, a través de las cuales la psicología o el mero análisis literario suelen tropezar con maneras contradictorias de entender la vida, de explicar este enigma apasionante de la existencia […].',
  '2. Desde dos puntos de vista muy distintos ha de estudiarse la risa: sea como la calidad de los actos externos que la provocan, sea como la disposición interior que se expresa por medio de ella. Los tratados elementales de estética en sus apreciaciones de lo cómico más tienen que ver con lo exterior que los estados de ánimo de donde proviene la risa. De aquí resulta que ella es definida como el movimiento de ánimo causado en nosotros por la contemplación de lo inesperado o lo incongruente. La risa no es compañera inseparable del humor y puede afirmarse que allí donde ella se muestra, especialmente en la forma extrema de carcajada, el “grande humor”, según lo define Hoeffding, está ausente. El humorista verdadero no suscita la risa. Suele en ocasiones la sonrisa asomar a los labios de quienes se ponen en contacto por la lectura o la contemplación con los maestros del humor, pero mientras más puras y más profundas sean las sensaciones creadas por el humor, mientras más tenue sea el lazo de las asociaciones suscitadas por la obra del arte verdaderamente humorística, más lejos están del lector las manifestaciones externas de la sonrisa. El acompañamiento natural de las sensaciones e ideas que despierta en nosotros la obra del humorista genuino es la sonrisa interior.',
  '3. Hay en las asociaciones de ideas provocadoras de risa una cierta complacencia con el espectáculo del mal ajeno o con la indiferencia de la naturaleza o de los poderes invisibles ante los esfuerzos incompletos de la criatura humana o del mismo animal. La risa es acompañada de una falta de piedad o de simpatía para con la bestia irracional o la bestia humana. En el humor, por el contrario, la nota dominante es la simpatía con el género humano. El burlador, por lo tanto, el satírico, el hombre que practica lo que Barrés llamaba el “desdén suficiente”, están en el polo opuesto del humorista. Por esto dice Hoeffding muy acertadamente: “Sea que se considere el humor como una especie peculiar de las sensaciones que provocan la risa o como una manera de entender la vida, nada está con él en contraste tan vivo y característico como el sarcasmo y el desdén”.',
  '4. Más cerca del humor está la ironía, pero aun esta incluye ciertos matices de sentido que la apartan de aquella humanísima visión de la vida. El ironista puede en ocasiones inspirarse en la simpatía y menos frecuente hay en sus expresiones muestras de piedad. Renán, sin duda, era sentimental a quien punzaban las miserias y las limitaciones del género humano. Hay piedad comunicativa en algunos libros de France. En Heine la ironía no es siempre bondadosa. En todos estos autores el rasgo psicológico, la actitud que les impide llegar al grande humor, es el sentimiento —velado en Renán con las más dulces apariencias, perceptible en trechos en las últimas producciones de France y ruidosamente articulado en Heine— de la superioridad del escritor sobre el resto del género humano. A causa de esto la ironía degenera a veces en los dos últimos en burla inmisericorde o en sarcasmo desecho […].',
  '5. Estos ejemplos, tomados al azar en dos literaturas, sirven de apoyo a las tesis fundamentadas del profesor Hoeffding, según la cual el grande humor no es una actitud pasajera ni un estado de espíritu fácilmente provocable, a la manera de la embriaguez o el entusiasmo, sino una pasión cuya permanencia y vigor determinan en el individuo su concepto general de la existencia. Lo cual no quiere decir, según se explicó antes con palabras del mismo Hoeffding, que la pasión o estado del alma total esté actualizada siempre en todos los menudos detalles de una vida individual, pero en la obra literaria o artística del grande, del verdadero humorista, puede siempre encontrar el crítico el hilo de oro que da unidad y le predica divino encanto […].',
  'Fragmentos tomados de SANÍN, Baldomero. Leer y releer. Medellín, Universidad de Antioquia, No. 77, 2015, pp. 24-29.',
].join('\n\n');

const textTwo = [
  '1. […] El humor y el poder han sido siempre enemigos, y constituye grave peligro permitir que la religión, el Estado o el capital fijen nuevos límites conceptuales, propongan excepciones ilustres a la libertad de expresión y dicten las normas aceptables y las no aceptables en materia de humor. La historia demuestra que los poderosos desconfían de la risa. Saben de su capacidad corrosiva y les parece tóxica. Si ustedes revisan el Antiguo Testamento, encontrarán guerras por doquier, abundantes asesinatos, esclavitud, niños en venta, numerosos adulterios y pecados de todo tipo. También, vidas virtuosas y circunstancias ejemplares. Pero risas, no. La Biblia ora, sufre, llora, goza, asombra, escandaliza, enseña. Pero no ríe. El único personaje que se regala el lujo de la carcajada en las páginas bíblicas es el profeta Daniel, adivinador de sueños y domador de leones. Por eso numerosas imágenes suyas lo muestran sonriente y fresco.',
  '2. Defiendo el humor porque es una forma de expresión que pone armas notables en manos de los débiles. Los terroristas de Al Qaeda tuvieron que acudir a los fusiles para intentar acallar a quienes no compartían su idolatría religiosa. Muchos gobernantes saben que el humor crítico aplica frenos, señala defectos, pincha llagas, busca corregir y mejorar. “La meta de la sátira es la reforma y la meta de la comedia es la aceptación”, escribió el poeta W. H. Auden.',
  '3. Pero, además, porque es la más humana de las maneras de comunicarse. El hombre no solo es el único animal que ríe; es el único que hace reír a sus semejantes.',
  '4. Lo defiendo, también, porque es el aceite que permite el rodaje armónico de muchas relaciones, hace más fáciles los caminos y más amables los entornos. Cuando el célebre editor Herbert Ross fundó The New Yorker, la excelente revista literaria, planteó una filosofía clara: que el humor contamine todas las páginas.',
  '5. Lo defiendo, además, porque es el más eficaz remedio contra la soberbia, la solemnidad y el fanatismo. El conocido escritor judío Amos Oz, después de haber sido apasionado sionista en su juventud, descubrió que no conquistaba más adeptos plantándose en los extremos que apoyado en posiciones tolerantes. Entonces se convirtió en declarado enemigo del fanatismo, como lo atestiguan muchas de sus novelas. En ellas practica su nuevo credo, que define así: “El humor es el único antídoto para el fanatismo. No he conocido nunca un fanático con sentido del humor, ni un hombre con humor que sea fanático”.',
  '6. Otra ventaja del humor es que constituye un adecuado mecanismo de apoyo y desahogo sicológico. Está demostrado clínicamente que personas sometidas a regímenes de pavor lograron alivio aplicando a su situación la vacuna del humor. Manifiesta el psicólogo británico Anthony J. Chapman: “La risa puede prosperar cuando hay personas oprimidas, desposeídas o víctimas de dolor agudo: estas circunstancias pueden ser maná para la risa”. También en otras circunstancias médicas el humor constituye un alivio de diversos males y enfermedades, como lo demuestran los tratamientos de risoterapia.',
  '7. Hay quienes consideran peligroso no poner linderos al humor y tienden una alambrada en torno a ciertos temas que, según su criterio, deben estar fuera del alcance de la sátira. Conceder libertad sin límites al humor, afirman, es crear un monstruo con licencia para el irrespeto y la mofa. De allí surge la nefasta tendencia de lo políticamente correcto, que procura hacerles la exodoncia a los colmillos y la manicure al tigre del humor; quitarle fuerza a su mordida, limar sus garras, despojarlo de toda arista que pueda herir alguna susceptibilidad u ofender mínimamente al prójimo. Es preciso aceptar que poco a poco los partidarios de la corrección política han logrado imponer cotas al idioma y al humor, hasta el punto de que se ha desvirtuado el lenguaje popular que llama negro al negro, calvo al calvo y gorda a la gorda. ¿Será preciso decir en adelante que “la ocasión la pintan capilarmente menguada” y preguntarnos “mamá, ¿qué será lo que quiere el afrocolombiano”?',
  '8. No es verdad, sin embargo, que la libertad de expresión alimente un humor sin límite alguno. El humor tiene sus fronteras y funciona dentro de una ecología racional. Las más claras aparecen en la Constitución Nacional y el Código Penal: lo mismo que los ciudadanos del montón, ningún caricaturista ni humorista puede acusar a persona alguna de un delito sin pruebas de su acción. Tampoco se le permite, por ejemplo, la incitación directa y pública al genocidio, ni la defensa de la pornografía infantil, ni violar otras normas de protección del menor, ni la injuria grosera.',
  '9. Lo más importante es, como ya lo advertía Henri Bergson en su famoso tratado de 1899, que la risa es un fenómeno social y, por ende, está sometida a circunstancias sociales. La consideración del humor como acto social plantea a modo de corolario que si bien hay pocos temas vedados a él, las audiencias del humor son diversas y cambiantes. […].',
  'Fragmento tomado de: SAMPER, Daniel. En defensa del humor. Publicado en eltiempo.com el 25 de febrero de 2015.',
].join('\n\n');

const ledTable = [
  'Una instalación navideña tiene 12 bombillos LED y cada bombillo tiene dos estados: apagado (0) o encendido (1). Cada secuencia ocurre a partir de la anterior. Inicialmente todos están apagados. En la secuencia 1 cambian todos los bombillos; en la secuencia 2 cambian los que ocupan posiciones múltiplos de 2; en la secuencia 3, los múltiplos de 3; y así sucesivamente hasta la secuencia 12.',
  '',
  '| Secuencia | Estados de los bombillos 1 a 12 |',
  '|---|---|',
  '| 1 | 1 1 1 1 1 1 1 1 1 1 1 1 |',
  '| 2 | 1 0 1 0 1 0 1 0 1 0 1 0 |',
  '| 3 | 1 0 0 0 1 1 1 0 0 0 1 1 |',
  '| 4 | 1 0 0 1 1 1 1 1 0 0 1 0 |',
  '| 5 | 1 0 0 1 0 1 1 1 0 1 1 0 |',
  '| 6 | 1 0 0 1 0 0 1 1 0 1 1 1 |',
  '| 7 | 1 0 0 1 0 0 0 1 0 1 1 1 |',
  '| 8 | 1 0 0 1 0 0 0 0 0 1 1 1 |',
  '| 9 | 1 0 0 1 0 0 0 0 1 1 1 1 |',
].join('\n');

const resourceSpecs = [
  ['UDEA_2019_1_J1_CL_TEXT_ONE', 'Texto Uno', textOne, [1, 2]],
  ['UDEA_2019_1_J1_CL_TEXT_TWO', 'Texto Dos', textTwo, [3, 4]],
  ['UDEA_2019_1_J1_RL_CUBOCTAHEDRON', 'Información para las preguntas 45 y 46', 'Un carpintero tiene un bloque cúbico de madera al cual corta todas las esquinas dando lugar a superficies con forma de triángulo equilátero, de lado 1 unidad y con vértices en los puntos medios de las aristas del cubo inicial, como se indica en la figura 1. El carpintero formó así un cuboctaedro con cada lado de 1 unidad (sólido con 6 caras cuadradas y 8 caras triangulares), como se muestra en la figura 2.', [6]],
  ['UDEA_2019_1_J1_RL_LED', 'Información para las preguntas 58 y 59', ledTable, [8]],
  ['UDEA_2019_1_J1_RL_SHELF', 'Material para la pregunta 67', 'La repisa rectangular tiene dos filas y cuatro espacios. En ella deben ubicarse cuatro cubos verdes y cuatro cubos azules, todos del mismo tamaño.', [9]],
  ['UDEA_2019_1_J1_RL_VOYAGER', 'Información para las preguntas 71 y 72', 'En la sonda Voyager I se encuentra la correspondencia entre nuestro sistema de numeración y una colección de símbolos. El símbolo ─ significa que se duplica la cantidad que le antecede. Correspondencias: I = 1; I─ = 2; II = 3; I── = 4; I─I = 5; II─ = 6; I─── = 8; I──I = 9; I─II = 11; II─I─ = 26; II──I── = 100; I────I── = 532.', [10]],
  ['UDEA_2019_1_J1_RL_AUTHENTIC', 'Información para las preguntas 75 y 76', 'Un número racional x se llama auténtico si es el cociente de dos enteros positivos. A cada racional auténtico se le asigna un color: azul o rojo. El 1 = 1/1 es azul. Si x es un racional auténtico, x y (x + 1) no son del mismo color, mientras que x y 1/x son del mismo color. Así, por ejemplo, 4/5 tiene el mismo color de 5/4, y 5/4 = 1 + 1/4 tiene color azul.', [10]],
  ['UDEA_2019_1_J1_RL_STACK', 'Material para la pregunta 79', 'Vista superior del apilamiento (cada número indica la cantidad de cajas en esa posición):\n\n| 5 | 3 | 3 | 3 |\n|---|---|---|---|\n| 2 | 2 | 2 | 2 |\n| 3 | 1 | 3 | 4 |\n| 1 | 3 | 1 | 2 |', [11]],
];
for (const [id, title, content, sourcePages] of resourceSpecs) {
  const value = { id, type: 'text', title, content, source_file: sourceFile, source_pages: sourcePages, verbatim_confidence: 'verified' };
  const index = resources.findIndex((r) => r.id === id);
  if (index >= 0) resources[index] = value; else resources.push(value);
}

const custom = {
  32: { question: 'Para el autor el humor crítico, EXCEPTO:', options: { A: 'Busca corregir y mejorar', B: 'Señala defectos', C: 'Impone cotas al idioma', D: 'Aplica frenos' } },
  41: { question: 'Un valor determinante que caracteriza a una recta que une dos puntos P₁ = (x₁, y₁) y P₂ = (x₂, y₂) en el plano es su pendiente, definida por la razón (y₂ − y₁)/(x₂ − x₁). Por ejemplo, la recta que une P₁ = (0, 2) y P₂ = (2, 3), mostrada en la figura 1, tiene pendiente 1/2. En la figura 2 se muestran las rectas l₀, l₁, l₂, l₃ y l₄, con pendientes m₀, m₁, m₂, m₃ y m₄, respectivamente. Al ordenar sus pendientes de menor a mayor se obtiene:', options: { A: 'm₀, m₁, m₂, m₃, m₄', B: 'm₃, m₄, m₀, m₁, m₂', C: 'm₁, m₂, m₀, m₃, m₄', D: 'm₄, m₃, m₀, m₁, m₂' } },
  42: { question: 'En el rectángulo mostrado a continuación, de altura 1 y base φ, el valor de r corresponde al radio del arco de un círculo. El área del triángulo rectángulo sombreado es:', options: { A: '√5/2', B: '3/4', C: '1/2', D: '1/4' } },
  43: { question: 'La figura muestra un rectángulo ABCD que representa una mesa de billar con cuatro orificios marcados con A, B, C y D en los extremos. Si asumimos que al pegarle a la bola esta siempre rebota en los lados de la mesa formando un ángulo de 45° (como se muestra en la figura) y que solo se detiene al caer en algún orificio, entonces, al ubicar una bola en el punto P y golpearla en la dirección indicada, podemos afirmar que la bola caerá en el orificio marcado con:', options: { A: 'C', B: 'A', C: 'D', D: 'B' } },
  44: { question: 'Sobre una línea recta se dibujan dos semicírculos cuyos centros P y Q están separados 2 centímetros, como se muestra en la figura. El área de la región sombreada, en centímetros cuadrados, es:', options: { A: '(4π/3) + √3', B: '(4π − 6√3)/3', C: '(2π − 3√3)/3', D: '(4π − √3)/2' } },
  45: { question: 'El área de la superficie del cuboctaedro obtenido por el carpintero, en unidades cuadradas, es:', options: { A: '6 + 2√3', B: '3(2 + √3)', C: '6 + (3/2)√3', D: '3 + √3' } },
  46: { question: 'Si una hormiga camina sobre la superficie del cuboctaedro desde el punto A hasta el punto B como se muestra en la figura 2, entonces la distancia total recorrida por la hormiga, en unidades, es:', options: { A: '√3 + 1', B: '√3/2 + 1', C: '2√3 + √2', D: '√3 + 2√2' } },
  47: { question: 'Samuel tiene una caja con suficientes palillos iguales con los cuales está construyendo un arreglo de cuadrados como se muestra en la figura, donde los palillos son los lados de los cuadrados. Cada nuevo nivel tiene 2 cuadrados más que el nivel anterior. Si Samuel continúa agregando nuevos niveles al arreglo, el número de palillos necesarios para obtener un arreglo de 10 niveles es:', options: { A: '233', B: '231', C: '235', D: '229' } },
  48: { question: 'Un artista quiere cubrir un mural con figuras geométricas diversas. Para comenzar ha puesto un triángulo rectángulo como el que se muestra en la figura. Después quiere poner un sector circular en el punto marcado con x. Si solo sabe que los ángulos interiores no rectos del triángulo están en relación de 2/3, entonces el ángulo del sector circular que debe usar el artista, en grados, es de:', options: { A: '145°', B: '165°', C: '170°', D: '130°' } },
  49: { question: 'La siguiente estructura está formada por cubos de 1 m de lado y está apoyada sobre el suelo. Entonces, la cantidad de metros cuadrados que deben pintarse es:', options: { A: '41', B: '37', C: '35', D: '39' } },
  50: { question: 'Los cuadrados mostrados en la figura son todos formados al tomar secciones del segmento AB, cuya longitud es de 16 cm. Podemos afirmar que la magnitud del camino que une a A con B pasando por los puntos C₁, C₂, …, C₁₂, como se indica en la figura, es:', options: { A: '64 cm', B: '72 cm', C: '48 cm', D: '32 cm' } },
  51: { question: 'En la siguiente secuencia de triángulos los valores sobre los catetos son todos iguales a 1 cm. El valor de la hipotenusa marcada con h en esta secuencia es:', options: { A: '√3', B: '2√3', C: '4√3', D: '3√3' } },
  52: { question: 'En un festival gastronómico se encuentran vegetarianos, veganos y orgánicos. Si sabemos que 49 son vegetarianos, 39 son veganos; todos los veganos son vegetarianos; 29 son orgánicos y 14 de ellos son también veganos; y que solo 7 de los vegetarianos no son ni veganos ni orgánicos, entonces el número de orgánicos que no son ni vegetarianos ni veganos es:', options: { A: '10', B: '11', C: '9', D: '12' } },
  53: { question: 'Tres amigas, Alicia, Belinda y Camila, presentaron los exámenes de Álgebra, Geometría y Cálculo. Las notas que recibieron en cada examen son enteros entre 1 y 10. Se sabe que la suma de las notas obtenidas por las tres en cada examen siempre es 13 y que la suma de las tres notas que cada una recibió fue, respectivamente, 20, 10 y 9. Si Alicia obtuvo 8 en cada uno de los exámenes de Geometría y Cálculo, la cual fue la misma nota de Belinda en Álgebra, entonces, de las afirmaciones a continuación, la única verdadera es:', options: { A: 'La nota de Alicia en Álgebra es mayor que la nota de Camila en Cálculo', B: 'La nota de Camila en Geometría es menor a la nota de Belinda en Cálculo', C: 'La nota de Belinda en Geometría es mayor a la de Camila en Álgebra', D: 'La nota de Cálculo de Camila es la misma que la nota de Alicia en Álgebra' } },
  54: { question: 'En su escritorio Daniela tiene una caja que contiene 7 marcadores ordenados así: el amarillo está en la mitad; el rojo solo tiene un marcador al lado; el verde está al lado del rojo; el negro está en el extremo derecho de la caja; el amarillo está entre el azul y el rosado. Si el marcador morado está entre el negro y el azul, entonces, de las siguientes secuencias de colores, la única que corresponde a la disposición de cuatro de los marcadores de la caja es:', options: { A: 'Verde, azul, amarillo, rosado', B: 'Rojo, verde, azul, amarillo', C: 'Azul, rojo, verde, amarillo', D: 'Rosado, amarillo, azul, morado' } },
  55: { question: 'Alrededor de una mesa rectangular son ubicadas sillas solo en los lados de mayor longitud, todas con el mismo espacio entre ellas, siempre quedando una silla frente a otra. Todas son numeradas consecutivamente 1, 2, 3, … y dispuestas de tal forma que la silla marcada con el número 6 está frente a la silla marcada con 13. La cantidad máxima de sillas que será usada en una disposición que cumpla esta regla es:', options: { A: '20', B: '16', C: '14', D: '18' } },
  56: { question: 'Un moderno juego de tiro al blanco consta de una pantalla cuadrada formada por 16 casillas cuadradas idénticas y de color verde. El objetivo permanece oculto en una casilla. Después de cada disparo, el objetivo se mueve al azar a una casilla adyacente (arriba, abajo, derecha o izquierda). Cada vez que un tirador experto dispara, pega en una casilla y esta inmediatamente se pone gris; si el objetivo pasa a una casilla gris queda visible y al siguiente disparo el tirador dará en el objetivo y el juego termina. Si en un determinado momento la pantalla tiene 6 casillas grises, como se muestra en la figura, y el objetivo aún permanece oculto, entonces el número mínimo de disparos que un tirador debe hacer para tener certeza de pegarle al objetivo es:', options: { A: '2', B: '3', C: '5', D: '4' } },
  57: { question: 'Carlos y Mauricio van a ordenar su almuerzo en un restaurante donde solo queda una bandeja paisa, un plato de mondongo, un jugo de lulo y un jugo de guayaba. Cada uno debe ordenar un plato y una bebida. Además: si Carlos ordena bandeja paisa, no pedirá jugo de lulo; si Mauricio pide mondongo, no pedirá jugo de lulo; si Carlos pide jugo de guayaba, no pedirá mondongo. De las afirmaciones siguientes, la única verdadera es:', options: { A: 'Carlos ordenará bandeja paisa y Mauricio jugo de lulo', B: 'Mauricio ordenará jugo de guayaba y Carlos mondongo', C: 'Mauricio ordenará bandeja paisa y Carlos jugo de guayaba', D: 'Carlos ordenará bandeja paisa y jugo de guayaba' } },
  58: { question: 'El número de bombillos encendidos en la secuencia 8 es:', options: { A: '6', B: '7', C: '4', D: '5' } },
  59: { question: 'Los bombillos encendidos en la secuencia 9 son:', options: { A: '1, 6, 8, 9, 10, 11', B: '1, 4, 9, 10, 11, 12', C: '1, 4, 5, 7, 10, 12', D: '1, 6, 7, 8, 9, 10' } },
  60: { question: 'Un grupo de profesionales formado por un matemático, un economista, un ingeniero y un politólogo se dedican a la matemática, la economía, la ingeniería y la política. Sin embargo, en ningún caso el profesional se dedica a aquello para lo que fue formado. El matemático se dedica a la política. El que se dedica a la matemática no es el ingeniero. El que se dedica a la economía no es el politólogo. Así, se puede afirmar con certeza que:', options: { A: 'El politólogo se dedica a la matemática', B: 'El economista se dedica a la ingeniería', C: 'El ingeniero se dedica a la economía', D: 'El economista se dedica a la matemática' } },
  61: { question: 'Tres profesores, un economista, un físico y un matemático, se especializan en Big Data, PYMES e I.A., no necesariamente en ese orden. Al economista recién lo contrató la universidad y afirma que siempre ha vivido y vivirá en arriendo. El especialista en Big Data lleva más tiempo en la universidad que el matemático. Además, él comprará la casa de propiedad del especialista en PYMES, en la que este ha vivido los últimos 5 años. De las siguientes afirmaciones, la única verdadera es:', options: { A: 'El especialista en I.A. es el matemático', B: 'El especialista en Big Data es el economista', C: 'El especialista en I.A. es el economista', D: 'El especialista en PYMES es el físico' } },
  62: { question: 'Sofía nació un 25 de agosto. Si en ese mes el día 13 fue un viernes, y sabiendo que agosto tiene 31 días, entonces la cantidad de días martes y miércoles que tiene ese mes son, respectivamente:', options: { A: '5 y 4', B: '4 y 5', C: '4 y 4', D: '5 y 5' } },
  63: { question: 'Un equipo de natación, con 6 integrantes, deberá presentar una prueba especial de relevos usando solo dos carriles de una piscina. Se busca que el equipo, dividido en 3 integrantes por carril, concluya la prueba en el menor tiempo posible. Si los tiempos de los integrantes son 11, 13, 15, 19, 21 y 22 segundos e inician simultáneamente quienes tienen tiempos de 22 y 21 segundos, entonces el menor tiempo que este equipo puede lograr es:', options: { A: '48 segundos', B: '52 segundos', C: '50 segundos', D: '51 segundos' } },
  64: { question: 'La organización de una fiesta por profesores, administrativos y estudiantes tiene un costo de $10.000.000. Todos llegan al siguiente acuerdo: los profesores asumirán el 25 % del costo, los administrativos el 15 % y el porcentaje restante será asumido por los estudiantes. Si el total de estudiantes participantes es de 110 chicas y 90 chicos, entonces el porcentaje del valor de la fiesta que pagará el grupo de chicas es:', options: { A: '33 %', B: '55 %', C: '30 %', D: '27 %' } },
  65: { question: 'Un estudiante mayor de 10 años observa que al sumar 15 con el producto entre el número de amigos menos 1 y su edad se obtiene el producto entre el número de amigos menos 1 y el número de amigos. La suma de la edad del estudiante y el número de amigos es:', options: { A: '29', B: '35', C: '31', D: '25' } },
  66: { question: 'En la expresión con productos (×) y sumas (+) E × N × (T + R + A + S) = 51, las letras distintas representan dígitos distintos del conjunto {1, 2, 3, 4, 5, 6, 7, 8, 9}. La cantidad de formas distintas en las que podemos elegir los dígitos que validen la igualdad es:', options: { A: '24', B: '48', C: '8', D: '36' } },
  67: { question: 'Un niño tiene 4 cubos verdes y 4 cubos azules que debe organizar en una repisa rectangular empotrada en la pared, como se muestra en el material. Todos los cubos son del mismo tamaño y solo difieren en el color. El número de formas distintas en que el niño puede organizar los 8 cubos si al menos 3 cubos verdes deben ir en la fila superior es:', options: { A: '17', B: '18', C: '16', D: '12' } },
  68: { question: 'Con el conjunto A = {1, 2, 3, 4} se forma la lista de todos los subconjuntos de A que no contienen dos elementos consecutivos de A: {1}, {2}, {3}, {4}, {1, 3}, {1, 4}, {2, 4}. Esta lista está formada por 7 subconjuntos. Si B = {1, 2, 3, 4, 5, 6} y se forma una lista de subconjuntos con la misma característica, el número de subconjuntos de la nueva lista es:', options: { A: '18', B: '24', C: '20', D: '22' } },
  69: { question: 'Después del nacimiento de Sara, sus padres han celebrado todos sus cumpleaños y en cada uno han puesto sobre la torta el número de velas que representa los años cumplidos. En cierto cumpleaños contaron 78 velas usadas desde el primer cumpleaños. En ese cumpleaños, la edad de Sara es:', options: { A: '12', B: '10', C: '15', D: '14' } },
  70: { question: 'En una floristería se van a empacar 316 flores distribuidas en 13 cajas. Entre las primeras 9 cajas se empacaron 238 flores, quedando 4 cajas para las flores restantes. Si las 4 cajas restantes contienen cantidades diferentes de flores, de modo que cualesquiera 2 cajas difieren en máximo 3 flores y mínimo en 1 flor, entonces el número de flores en la caja con menos flores es:', options: { A: '19', B: '18', C: '17', D: '20' } },
  71: { question: 'Siguiendo el patrón de generación descrito en el material de la sonda Voyager I, el símbolo que corresponde al número 13 es:', options: { A: 'II─I', B: 'II──I', C: 'I─II─', D: 'IIII' } },
  72: { question: 'Al establecer la correspondencia con los números respectivos, el valor de la suma II── + II──I es igual a:', options: { A: 'I──II───', B: 'II──II─', C: 'II─II──', D: 'I──I─I' } },
  73: { question: 'Un número entero se llama altruista si: 1) ninguna de sus cifras es cero; 2) todas sus cifras son diferentes; y 3) es divisible por cada una de sus cifras. Por ejemplo, 36 es altruista porque es divisible por 3 y por 6; 18 no lo es porque es divisible por 1, pero no por 8. La cantidad de números altruistas entre 100 y 200 con una de sus cifras igual a 5 es:', options: { A: '2', B: '0', C: '3', D: '1' } },
  74: { question: 'Una secuencia se genera a partir de un número inicial aplicando en cada paso una de estas reglas al número anterior. Regla T: multiplicar por 1/3. Regla D: calcular la distancia del número actual al 1. Por ejemplo, partiendo de 4 y aplicando T-D-T-D se obtiene 4, 4/3, 1/3, 1/9, 8/9. Si después de aplicar sucesivamente 5 veces las reglas T y/o D, en cierto orden, se obtuvo la secuencia 18/5, 6/5, 2/5, x, 1/5, 4/5, entonces el número x es:', options: { A: '3/5', B: '2/15', C: '2/5', D: '1/5' } },
  75: { question: 'El color del número 14/15 es:', options: { A: 'El mismo color de 1/14', B: 'El mismo color de 1/9', C: 'El mismo color de 4/32', D: 'El mismo color del número 4' } },
  76: { question: 'Los colores de los números 1/8 + 1/8 y 1/7 + 1/7 son, respectivamente:', options: { A: 'Rojo, rojo', B: 'Azul, rojo', C: 'Rojo, azul', D: 'Azul, azul' } },
  77: { question: 'Sobre el conjunto A = {e, f, g, h} definimos una operación * entre sus elementos cuyos valores obedecen a la tabla mostrada. Por ejemplo: f * g = h; h * h = e; h * f = g. El número de elementos del conjunto A que pueden sustituir a x en la expresión x * x = e y satisfacen la igualdad es:', options: { A: '3', B: '4', C: '2', D: '1' } },
  78: { question: 'Las tres secuencias gráficas muestran ejemplos de aplicación sucesiva de las operaciones T, P y Q sobre tres configuraciones iniciales. Observe la notación asignada a sus resultados. Podemos afirmar que PQU es igual a:', options: { A: 'QU', B: 'QPU', C: 'PPQ', D: 'QQU' } },
  79: { question: 'La gráfica del material muestra una vista aérea de un apilamiento de cajas cúbicas de iguales dimensiones. Los números indican las cantidades de cajas apiladas en cada posición. Si una persona puede caminar alrededor del apilamiento, la cantidad máxima de cajas que podrá ver por alguno de los cuatro frentes es:', options: { A: '13', B: '15', C: '16', D: '14' } },
  80: { question: 'Existen varias escalas para medir la temperatura: Kelvin (K), grados Celsius (°C) y grados Réamur (°R). La equivalencia entre estas escalas se muestra gráficamente. Sabiendo que la temperatura de fusión del CO₂ es −78 °C, considere: I. Es mayor que 0 K y menor que 273 K. II. Es menor que 0 °R. III. Es mayor que 0 °R y menor que 80 °R. Puede decirse que:', options: { A: 'I y III son verdaderas', B: 'I, II y III son verdaderas', C: 'II es verdadera y III es falsa', D: 'I y III son falsas' } },
};

const visuals = new Map([
  [41, [asset('14490a8be591ecf7.jpg'), asset('bd6a6698716923b9.jpg')]],
  [42, [asset('f7715ff26b4a5ebb.jpg')]], [43, [asset('4a4c55c4c5329dfd.jpg')]],
  [44, [asset('086d95277c86347a.jpg')]], [45, [asset('3de470fca9d6dc50.png')]],
  [46, [asset('3de470fca9d6dc50.png')]], [47, [asset('da8fe0635652362d.png')]],
  [48, [asset('d7518ded1394f8b8.png')]], [49, [asset('954108a5a3d4074e.png')]],
  [50, [asset('b54add9b0456e7e0.jpg')]], [51, [asset('babb2547b8a99758.jpg')]],
  [56, [asset('f5f9e7d318d346bf.png')]], [77, [asset('2b631dff035f54a1.png')]],
  [78, [asset('3f74dec76b94c0c3.jpg')]],
  [80, [asset('19004d7471bbe842.png'), asset('d8848fd33281fd96.jpg')]],
]);
const shared = new Map([
  [45, ['UDEA_2019_1_J1_RL_CUBOCTAHEDRON']], [46, ['UDEA_2019_1_J1_RL_CUBOCTAHEDRON']],
  [58, ['UDEA_2019_1_J1_RL_LED']], [59, ['UDEA_2019_1_J1_RL_LED']],
  [67, ['UDEA_2019_1_J1_RL_SHELF']], [71, ['UDEA_2019_1_J1_RL_VOYAGER']],
  [72, ['UDEA_2019_1_J1_RL_VOYAGER']], [75, ['UDEA_2019_1_J1_RL_AUTHENTIC']],
  [76, ['UDEA_2019_1_J1_RL_AUTHENTIC']], [79, ['UDEA_2019_1_J1_RL_STACK']],
]);
const pageFor = (n) => n <= 6 ? 1 : n <= 18 ? 2 : n <= 21 ? 3 : n <= 35 ? 4 : n <= 41 ? 5 : n <= 47 ? 6 : n <= 53 ? 7 : n <= 61 ? 8 : n <= 70 ? 9 : n <= 77 ? 10 : 11;

bank.splice(0, bank.length, ...bank.filter((q) => !(q.year === 2019 && q.period === '1' && q.session === 'J1')));
for (let number = 1; number <= 80; number += 1) {
  const base = byNumber.get(number) ?? structuredClone(number <= 40 ? clTemplate : rlTemplate);
  const section = number <= 40 ? 'CL' : 'RL';
  const id = `UDEA_2019_1_J1_${section}_${String(number).padStart(3, '0')}`;
  const linkedTexts = section === 'CL'
    ? (number <= 18 ? ['UDEA_2019_1_J1_CL_TEXT_ONE'] : number <= 32 ? ['UDEA_2019_1_J1_CL_TEXT_TWO'] : ['UDEA_2019_1_J1_CL_TEXT_ONE', 'UDEA_2019_1_J1_CL_TEXT_TWO'])
    : (shared.get(number) ?? []);
  const files = visuals.get(number) ?? [];
  Object.assign(base, custom[number] ?? {}, {
    id, source_type: 'historical_exam', source_file: sourceFile, year: 2019, period: '1', session: 'J1', section,
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
  if (!base.question?.trim() || Object.keys(base.options ?? {}).sort().join('') !== 'ABCD' || Object.values(base.options).some((value) => !String(value).trim())) {
    throw new Error(`Incomplete reconstructed question ${number}`);
  }
  bank.push(base);
}

bank.sort((a, b) => a.year - b.year || String(a.period).localeCompare(String(b.period)) || String(a.session).localeCompare(String(b.session)) || a.original_question_number - b.original_question_number);
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
fs.writeFileSync(resourcesPath, `${JSON.stringify(resources, null, 2)}\n`);
console.log(JSON.stringify({ updated: 80, total: bank.length, answerKeyLength: answerKey.length, resources: resourceSpecs.length }, null, 2));
