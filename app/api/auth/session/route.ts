import { getD1 } from '../../../../db';
import { clearCookie, getSessionUser, readCookie, requestHasTrustedOrigin, sessionCookieName, sha256Hex } from '../../../../lib/auth';

const noStore = { 'Cache-Control': 'no-store' };

export async function GET(request: Request) {
  const user = await getSessionUser(request);
  return Response.json({ authenticated: Boolean(user), user }, { headers: noStore });
}

export async function DELETE(request: Request) {
  if (!requestHasTrustedOrigin(request)) return Response.json({ error: 'Origen no permitido.' }, { status: 403, headers: noStore });
  const token = readCookie(request, sessionCookieName);
  if (token) await getD1().prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run();
  const headers = new Headers(noStore);
  headers.append('Set-Cookie', clearCookie(sessionCookieName));
  return Response.json({ signedOut: true }, { headers });
}
