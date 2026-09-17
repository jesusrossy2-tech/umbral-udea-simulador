import { createRemoteJWKSet, jwtVerify } from 'jose';
import { getD1 } from '../../../../../db';
import { clearCookie, getGoogleConfig, oauthNonceCookieName, oauthStateCookieName, oauthVerifierCookieName, randomToken, readCookie, secureCookie, secureEqual, sessionCookieName, sessionLifetimeSeconds, sha256Hex } from '../../../../../lib/auth';

type TokenResponse = { id_token?: string; error?: string };
type GoogleClaims = { sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string; nonce?: string };

function redirectWithError(origin: string) {
  const headers = new Headers({ Location: `${origin}/?authError=google`, 'Cache-Control': 'no-store' });
  headers.append('Set-Cookie', clearCookie(oauthStateCookieName));
  headers.append('Set-Cookie', clearCookie(oauthVerifierCookieName));
  headers.append('Set-Cookie', clearCookie(oauthNonceCookieName));
  return new Response(null, { status: 302, headers });
}

export async function GET(request: Request) {
  let config;
  try {
    config = getGoogleConfig();
  } catch {
    return Response.json({ error: 'La autenticación con Google todavía no está configurada.' }, { status: 503 });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = readCookie(request, oauthStateCookieName);
  const verifier = readCookie(request, oauthVerifierCookieName);
  const nonce = readCookie(request, oauthNonceCookieName);
  if (!code || !state || !savedState || !verifier || !nonce || !(await secureEqual(state, savedState))) {
    return redirectWithError(config.origin);
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
        code_verifier: verifier,
      }),
    });
    if (!tokenResponse.ok) return redirectWithError(config.origin);
    const tokens = await tokenResponse.json() as TokenResponse;
    if (!tokens.id_token) return redirectWithError(config.origin);

    const jwks = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
    const { payload } = await jwtVerify(tokens.id_token, jwks, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: config.clientId,
    });
    const claims = payload as GoogleClaims;
    if (!claims.sub || !claims.email || claims.email_verified !== true || !claims.nonce || !(await secureEqual(claims.nonce, nonce))) {
      return redirectWithError(config.origin);
    }

    const db = getD1();
    const existing = await db.prepare('SELECT id FROM users WHERE google_sub = ?').bind(claims.sub).first<{id:string}>();
    const userId = existing?.id ?? crypto.randomUUID();
    const now = new Date();
    const nowIso = now.toISOString();
    await db.prepare(`INSERT INTO users (id, google_sub, email, name, picture_url, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(google_sub) DO UPDATE SET email = excluded.email, name = excluded.name,
        picture_url = excluded.picture_url, last_login_at = excluded.last_login_at`)
      .bind(userId, claims.sub, claims.email, claims.name || claims.email, claims.picture || null, nowIso, nowIso).run();

    const sessionToken = randomToken();
    const sessionHash = await sha256Hex(sessionToken);
    const expiresAt = new Date(now.getTime() + sessionLifetimeSeconds * 1000).toISOString();
    await db.batch([
      db.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(nowIso),
      db.prepare('INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
        .bind(sessionHash, userId, nowIso, expiresAt),
    ]);

    const headers = new Headers({ Location: `${config.origin}/?login=ok`, 'Cache-Control': 'no-store' });
    headers.append('Set-Cookie', secureCookie(sessionCookieName, sessionToken, sessionLifetimeSeconds));
    headers.append('Set-Cookie', clearCookie(oauthStateCookieName));
    headers.append('Set-Cookie', clearCookie(oauthVerifierCookieName));
    headers.append('Set-Cookie', clearCookie(oauthNonceCookieName));
    return new Response(null, { status: 302, headers });
  } catch (error) {
    console.error(JSON.stringify({ event: 'google_auth_callback_failed', message: error instanceof Error ? error.message : 'unknown' }));
    return redirectWithError(config.origin);
  }
}
