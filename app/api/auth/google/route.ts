import { getGoogleConfig, oauthNonceCookieName, oauthStateCookieName, oauthVerifierCookieName, randomToken, secureCookie, sha256Hex } from '../../../../lib/auth';

export async function GET() {
  try {
    const config = getGoogleConfig();
    const state = randomToken();
    const nonce = randomToken();
    const verifier = randomToken(48);
    const challengeHex = await sha256Hex(verifier);
    const challengeBytes = new Uint8Array(challengeHex.match(/.{2}/g)!.map((value) => Number.parseInt(value, 16)));
    let binary = '';
    for (const byte of challengeBytes) binary += String.fromCharCode(byte);
    const challenge = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
    const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authorizationUrl.search = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      nonce,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      access_type: 'online',
      prompt: 'select_account',
    }).toString();
    const headers = new Headers({ Location: authorizationUrl.toString(), 'Cache-Control': 'no-store' });
    headers.append('Set-Cookie', secureCookie(oauthStateCookieName, state, 600));
    headers.append('Set-Cookie', secureCookie(oauthVerifierCookieName, verifier, 600));
    headers.append('Set-Cookie', secureCookie(oauthNonceCookieName, nonce, 600));
    return new Response(null, { status: 302, headers });
  } catch {
    return Response.json({ error: 'El acceso con Google todavía no está disponible.' }, { status: 503 });
  }
}
