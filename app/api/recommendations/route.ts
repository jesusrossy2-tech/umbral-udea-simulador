import { getD1 } from '../../../db';
import { eligibleQuestions } from '../../../lib/exam-engine';

type Detail = { section: 'CL' | 'RL'; topic: string; outcome: 'correct' | 'incorrect' | 'omitted' };
type AttemptDetailRow = { details_json: string };

const label = (value: string) => value.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());

export async function GET(request: Request) {
  const learnerId = new URL(request.url).searchParams.get('learnerId') ?? '';
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(learnerId)) {
    return Response.json({ error: 'Identificador de historial inválido.' }, { status: 400 });
  }

  const result = await getD1().prepare(`SELECT details_json FROM attempts
    WHERE learner_id = ? ORDER BY submitted_at DESC LIMIT 10`).bind(learnerId).all<AttemptDetailRow>();
  const details = result.results.flatMap((row) => {
    try { return JSON.parse(row.details_json) as Detail[]; } catch { return []; }
  });
  const topicStats = new Map<string, { topic: string; section: 'CL' | 'RL'; total: number; correct: number }>();
  for (const item of details) {
    if (!item.topic || item.topic === 'unclassified') continue;
    const key = `${item.section}:${item.topic}`;
    const current = topicStats.get(key) ?? { topic: item.topic, section: item.section, total: 0, correct: 0 };
    current.total += 1;
    if (item.outcome === 'correct') current.correct += 1;
    topicStats.set(key, current);
  }
  const availableByTopic = new Map<string, number>();
  for (const question of eligibleQuestions(new Set())) availableByTopic.set(`${question.section}:${question.topic}`, (availableByTopic.get(`${question.section}:${question.topic}`) ?? 0) + 1);
  const stats = [...topicStats.values()].map((item) => ({
    ...item,
    label: label(item.topic),
    accuracy: Math.round(item.correct / item.total * 100),
    historicalQuestionsAvailable: availableByTopic.get(`${item.section}:${item.topic}`) ?? 0,
  }));
  const priorities = [...stats].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total).slice(0, 3).map((item, index) => ({
    ...item,
    rank: index + 1,
    recommendedQuestions: Math.min(15, item.historicalQuestionsAvailable),
    recommendation: `Practica ${Math.min(15, item.historicalQuestionsAvailable)} preguntas históricas de ${item.label.toLowerCase()} antes del próximo simulacro completo.`,
  }));
  const strengths = [...stats].filter((item) => item.total >= 2).sort((a, b) => b.accuracy - a.accuracy || b.total - a.total).slice(0, 3);
  const overallAccuracy = details.length ? Math.round(details.filter((item) => item.outcome === 'correct').length / details.length * 100) : 0;

  return Response.json({
    attemptsAnalyzed: result.results.length,
    questionsAnalyzed: details.length,
    overallAccuracy,
    priorities,
    strengths,
    methodology: 'Las prioridades se ordenan por precisión observada en hasta 10 intentos recientes. No se infieren causas conceptuales sin evidencia.',
  });
}
