import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const bankPath = path.join(root, 'data/question_bank.json');
const resourcesPath = path.join(root, 'data/text_resources.json');
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
const byId = new Map(bank.map((question) => [question.id, question]));

const sharedResources = [
  {
    id: 'UDEA_2017_1_J1_RL_BINARY_SET', type: 'text', title: 'Información para responder',
    content: 'Se tiene el siguiente conjunto de números binarios: {100111, 101101, 101010, 110001}.',
    source_file: 'ExamenUdeA 2017 I  J1 print La utilidad de la luna.docx', source_pages: [8], verbatim_confidence: 'verified',
  },
  {
    id: 'UDEA_2017_1_J1_RL_BOXES', type: 'text', title: 'Información para responder',
    content: 'Sobre una mesa hay 3 cajas y 3 objetos, cada objeto en una caja diferente: un clavo, una llave, una moneda. Se sabe que:\n\n- La caja verde está a la izquierda de la azul.\n- El clavo está inmediatamente a la izquierda de la moneda.\n- La roja está inmediatamente a la derecha de la llave.\n- La moneda está a la derecha de la roja.',
    source_file: 'ExamenUdeA 2017 I  J1 print La utilidad de la luna.docx', source_pages: [9], verbatim_confidence: 'verified',
  },
  {
    id: 'UDEA_2017_1_J1_RL_PARK', type: 'text', title: 'Información para las preguntas relacionadas',
    content: 'José da una vuelta al parque caminando a una velocidad constante, María da la vuelta corriendo también a una velocidad constante que es mayor que la de José. Si ambos salen del mismo punto y al mismo tiempo, María pasa a José dos veces y llegan juntos al lugar de partida.',
    source_file: 'ExamenUdeA 2017 I  J1 print La utilidad de la luna.docx', source_pages: [9], verbatim_confidence: 'verified',
  },
  {
    id: 'UDEA_2017_2_J1_RL_BALLS', type: 'text', title: 'Información para las preguntas 64 y 65',
    content: 'Cinco niñas van al parque con pelotas todas ellas de diferente color, intercambian todas las pelotas. Se sabe que:\n\n- Ana está sentada, triste y mira con envidia porque quisiera tener la pelota blanca de Lucía.\n- Lina juega alegremente con la pelota negra de su amiga.\n- La dueña de la pelota roja está jugando con la pelota verde de Rosa.\n- Julia juega a la pelota, mientras mira con envidia a la dueña de la pelota azul.',
    source_file: 'ExamenUdeA 2017 II J1 print El arte.docx', source_pages: [8], verbatim_confidence: 'verified',
  },
];

for (const resource of sharedResources) {
  const index = resources.findIndex((item) => item.id === resource.id);
  if (index >= 0) resources[index] = resource;
  else resources.push(resource);
}

const repairs = {
  UDEA_2017_1_J1_RL_050: { text_resource_ids: ['UDEA_2017_1_J1_RL_BINARY_SET'] },
  UDEA_2017_1_J1_RL_060: { text_resource_ids: ['UDEA_2017_1_J1_RL_BOXES'] },
  UDEA_2017_1_J1_RL_062: { text_resource_ids: ['UDEA_2017_1_J1_RL_PARK'] },
  UDEA_2017_2_J1_RL_048: { question: 'Se tiene un número de dos dígitos. Al intercambiar los dígitos de A se crea un segundo número de dos dígitos, B. Si se debe cumplir que A/B = 4/7, entonces la suma de los dos dígitos del mayor valor que puede tomar A es:' },
  UDEA_2017_2_J1_RL_054: {
    question: 'En el cuadrado ABCD con centro en X, de área igual a 64 cm², se tiene el punto E que está a 1/4 de la distancia de A a B, y F está a 1/4 de la distancia de B a C. El área de la región sombreada es:',
    visual_resources: [{ type: 'image', asset: 'assets/UDEA_2017_2_J1/36983b92b0751198.png', placement: 'question' }],
  },
  UDEA_2017_2_J1_RL_064: { text_resource_ids: ['UDEA_2017_2_J1_RL_BALLS'] },
  UDEA_2017_2_J1_RL_065: { text_resource_ids: ['UDEA_2017_2_J1_RL_BALLS'] },
  UDEA_2017_2_J1_RL_066: { question: 'En la siguiente suma cada letra diferente corresponde a un número diferente y letras iguales corresponden a números iguales: HE + HE + HE + HE = AH. El resultado de la suma de los dígitos A, H y E es:' },
  UDEA_2017_2_J1_RL_070: {
    question: 'En una obra civil se va a construir un muro de 9 m de alto por 24 m de ancho con ladrillos color marrón y color blanco. Todos los ladrillos son iguales y tienen 80 cm de ancho y 60 cm de alto, y no importa el grosor de estos. El muro se construye siguiendo las siguientes reglas: en la primera fila todos los ladrillos son marrones; en la segunda fila todos los ladrillos son marrones excepto uno; en la tercera fila todos los ladrillos son marrones excepto dos; y así sucesivamente. El cociente entre el número de ladrillos blancos y el total de ladrillos usados para construir el muro es:',
    options: { A: '7/30', B: '2/5', C: '1/2', D: '2/15' },
  },
  UDEA_2017_2_J1_RL_077: { question: 'Un terreno rectangular de 120 m de ancho por 84 m de alto se va a dividir en parcelas cuadradas iguales y que cada parcela tenga la mayor cantidad de m²; entonces la cantidad de parcelas que se obtienen es:' },
  UDEA_2018_1_J2_RL_049: { question: 'El valor de a en la siguiente ecuación es: 3⁹ - 3⁷ + 3⁸ = a·3⁷.' },
  UDEA_2018_1_J2_RL_062: { question: 'El profesor en un salón escribe los siguientes números y pide hallar su promedio: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11. Cuatro estudiantes obtienen los siguientes resultados: Camilo: 6,5; Luisa: 6,0; Andrés: 5,5; Juanita: 5,0. De entre ellos tres realizaron bien la suma, pero dejaron de coger un número, mientras que el último escogió todos los números, pero hizo una operación mal. El estudiante que no omitió algún número fue:' },
  UDEA_2018_1_J2_RL_065: { question: 'Se tienen dos números enteros a y b mayores que cero y menores que 20 tales que a/3 - b/2 = 1/6. El número de parejas posibles que cumplen con la ecuación es:' },
  UDEA_2018_1_J2_RL_068: {
    question: 'Se tiene un número de tres cifras mayor que 200, con las siguientes condiciones: la diferencia entre el mayor y el menor dígito es siete; las cifras de las decenas y las unidades son impares consecutivos; el número es divisible entre nueve. El número que va en la mitad es:',
    options: { A: '3', B: '5', C: '7', D: '8' },
  },
};

for (const [id, repair] of Object.entries(repairs)) {
  const question = byId.get(id);
  if (!question) throw new Error(`Missing question ${id}`);
  Object.assign(question, repair);
  const requires = new Set(question.required_supporting_material ?? []);
  if (repair.text_resource_ids) requires.add('text');
  if (repair.visual_resources) requires.add('visual');
  question.required_supporting_material = [...requires].sort();
  question.supporting_material_status = 'complete_verified';
  question.verification_status = 'verified_by_visual_review';
  question.verbatim_confidence = 'verified';
  question.admin_status = 'verified';
  question.official_exam_eligible = true;
  question.eligibility_reasons = [];
  question.verbatim_verification = { method: 'manual_visual_reconstruction_from_rendered_source_phase11', rendered_page_located: true, supporting_material_verified: true };
}

const invalid = byId.get('UDEA_2017_1_J1_RL_059');
invalid.verification_status = 'incomplete';
invalid.verbatim_confidence = 'needs_review';
invalid.admin_status = 'incomplete';
invalid.official_exam_eligible = false;
invalid.supporting_material_status = 'incomplete';
invalid.eligibility_reasons = ['extracted_shared_stimulus_as_standalone_question'];

fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
fs.writeFileSync(resourcesPath, `${JSON.stringify(resources, null, 2)}\n`);
console.log(JSON.stringify({ repaired: Object.keys(repairs).length, blocked: [invalid.id] }, null, 2));
