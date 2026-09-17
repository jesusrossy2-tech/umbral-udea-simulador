import { env } from 'cloudflare:workers';
import { timingSafeEqual } from 'node:crypto';
import { getD1 } from '../db';

export const sessionCookieName = '__Host-umbral_session';
export const oauthStateCookieName = '__Host-umbral_oauth_state';
export const oauthVerifierCookieName = '__Host-umbral_oauth_verifier';
export const oauthNonceCookieName = '__Host-umbral_oauth_nonce';
export const sessionLifetimeSeconds = 30 * 24 * 60 * 60;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  pictureUrl: string | null;
};

type SessionRow = {
  id: string;
  email: string;
  name: string;
  picture_url: string | null;
};

export function getGoogleConfig() {
  const origin = env.APP_ORIGIN?.replace(/\/$/, '');
  if (!origin || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error('La autenticación con Google todavía no está configurada.');
  }
  return {
    origin,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${origin}/api/auth/google/callback`,
  };
}

export function requestHasTrustedOrigin(request: Request) {
  const expected = env.APP_ORIGIN?.replace(/\/$/, '');
  const supplied = request.headers.get('Origin')?.replace(/\/$/, '');
  return Boolean(expected && supplied && supplied === expected);
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get('Cookie') ?? '';
  for (const entry of header.split(';')) {
    const [key, ...rest] = entry.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export function secureCookie(name: string, value: string, maxAge: number) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearCookie(name: string) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function secureEqual(first: string, second: string) {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(first)),
    crypto.subtle.digest('SHA-256', encoder.encode(second)),
  ]);
  return timingSafeEqual(new Uint8Array(a), new Uint8Array(b));
}

export async function getSessionUser(request: Request): Promise<AuthUser | null> {
  const token = readCookie(request, sessionCookieName);
  if (!token || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) return null;
  const tokenHash = await sha256Hex(token);
  const row = await getD1().prepare(`SELECT users.id, users.email, users.name, users.picture_url
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?`)
    .bind(tokenHash, new Date().toISOString()).first<SessionRow>();
  return row ? { id: row.id, email: row.email, name: row.name, pictureUrl: row.picture_url } : null;
}

export async function resolveLearnerId(request: Request, anonymousLearnerId: string | null | undefined) {
  const user = await getSessionUser(request);
  if (user) return user.id;
  const candidate = anonymousLearnerId ?? '';
  return /^[a-zA-Z0-9-]{16,80}$/.test(candidate) ? candidate : null;
}
