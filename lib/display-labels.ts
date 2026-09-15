const TOPIC_LABELS: Record<string, string> = {
  literal_comprehension: 'Comprensión literal',
  inference: 'Inferencia',
  meaning_in_context: 'Significado en contexto',
  rhetoric_and_discourse: 'Retórica y discurso',
  main_idea_and_structure: 'Idea principal y estructura',
  intertextual_relations: 'Relaciones intertextuales',
  cohesion_and_reference: 'Cohesión y referencia',
  geometry: 'Geometría',
  arithmetic: 'Aritmética',
  algebra: 'Álgebra',
  number_systems: 'Sistemas numéricos',
  counting: 'Conteo',
  spatial_reasoning: 'Razonamiento espacial',
  logical_relations: 'Relaciones lógicas',
  arithmetic_quantitative: 'Razonamiento aritmético y cuantitativo',
  percentages_and_proportions: 'Porcentajes y proporciones',
  sequences_and_patterns: 'Secuencias y patrones',
  probability: 'Probabilidad',
  data_interpretation: 'Interpretación de datos',
  sequences: 'Secuencias',
  sets: 'Conjuntos',
  algebra_and_equations: 'Álgebra y ecuaciones',
  combinatorics: 'Combinatoria',
  unclassified: 'Sin clasificar',
};

const MODE_LABELS: Record<string, string> = {
  full: 'Simulacro completo',
  historical: 'Examen histórico',
  practice: 'Práctica personalizada',
};

const humanize = (value: string) => value
  .replaceAll('_', ' ')
  .replace(/^./, (letter) => letter.toUpperCase());

export const topicLabel = (value: string) => TOPIC_LABELS[value] ?? humanize(value);
export const modeLabel = (value: string) => MODE_LABELS[value] ?? humanize(value);

