import { getD1 } from '../../../../db';
import { getSessionUser, requestHasTrustedOrigin } from '../../../../lib/auth';

export async function POST(request: Request) {
  if (!requestHasTrustedOrigin(request)) return Response.json({ error: 'Origen no permitido.' }, { status: 403 });
  const user = await getSessionUser(request);
  if (!user) return Response.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  const body = await request.json() as { anonymousLearnerId?: string };
  const anonymousId = body.anonymousLearnerId ?? '';
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(anonymousId) || anonymousId === user.id) {
    return Response.json({ linked: false }, { status: 400 });
  }
  const db = getD1();
  await db.batch([
    db.prepare('UPDATE attempts SET learner_id = ? WHERE learner_id = ?').bind(user.id, anonymousId),
    db.prepare('UPDATE simulations SET learner_id = ? WHERE learner_id = ?').bind(user.id, anonymousId),
  ]);
  return Response.json({ linked: true }, { headers: { 'Cache-Control': 'no-store' } });
}
