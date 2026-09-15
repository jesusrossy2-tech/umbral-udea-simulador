import { bank, eligibleQuestions, examId } from '../../../lib/exam-engine';
import { topicLabel } from '../../../lib/display-labels';

export async function GET() {
  const eligible = eligibleQuestions(new Set());
  const sourceMap = new Map<string, { id: string; label: string; total: number; cl: number; rl: number }>();
  for (const question of bank.filter((item) => item.confidence === 'confirmed_by_key')) {
    const id = examId(question);
    const current = sourceMap.get(id) ?? { id, label: `${question.year}-${question.period} ${question.session || 'jornada sin confirmar'}`, total: 0, cl: 0, rl: 0 };
    if (question.official_exam_eligible) {
      current.total += 1;
      if (question.section === 'CL') current.cl += 1;
      if (question.section === 'RL') current.rl += 1;
    }
    sourceMap.set(id, current);
  }
  const topics = [...new Set(eligible.map((question) => question.topic))].sort().map((topic) => ({
    value: topic,
    label: topicLabel(topic),
    sections: [...new Set(eligible.filter((question) => question.topic === topic).map((question) => question.section))],
    count: eligible.filter((question) => question.topic === topic).length,
  }));
  return Response.json({
    bank: { total: bank.length, eligible: eligible.length, sources: new Set(eligible.map(examId)).size },
    historicalExams: [...sourceMap.values()].map((item) => ({ ...item, ready: item.cl === 40 && item.rl === 40 })),
    topics,
    difficulties: [...new Set(eligible.map((question) => question.difficulty).filter(Boolean))],
  });
}
