import { hmac } from "@noble/hashes/hmac.js";
import { pbkdf2Async } from "@noble/hashes/pbkdf2.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";

/**
 * Client half of the auth scheme in app/core/auth.py.
 *
 * The password is never sent. It becomes a verifier locally, which proves
 * itself against a one-shot challenge at login and then signs every request.
 *
 * @noble/hashes rather than `crypto.subtle`, because SubtleCrypto only exists
 * in a secure context — it is undefined when the app is served over plain
 * HTTP, which is exactly the case this scheme exists for. `getRandomValues`
 * is not restricted that way, so nonces are still properly random.
 */

export interface Session {
  /** Public: travels in the clear on every request, useless on its own. */
  id: string;
  /** Secret: derived on both sides, never transmitted. Hex. */
  key: string;
  /** serverTime - clientTime, in seconds. Keeps a skewed clock from 401ing. */
  offset: number;
}

const STORAGE_KEY = "resource-monitor-session";

export async function deriveVerifier(
  password: string,
  saltHex: string,
  iterations: number,
): Promise<Uint8Array> {
  // asyncTick yields to the event loop so the login form stays responsive
  // through several hundred thousand iterations.
  return pbkdf2Async(sha256, utf8ToBytes(password), hexToBytes(saltHex), {
    c: iterations,
    dkLen: 32,
    asyncTick: 10,
  });
}

export function proveChallenge(verifier: Uint8Array, challenge: string): string {
  return bytesToHex(hmac(sha256, verifier, utf8ToBytes(challenge)));
}

export function deriveSessionKey(verifier: Uint8Array, sessionId: string): string {
  return bytesToHex(hmac(sha256, verifier, utf8ToBytes(sessionId)));
}

/** Signature params for one request. Single-use and short-lived by design. */
export function signRequest(session: Session, method: string, path: string) {
  const ts = (Date.now() / 1000 + session.offset).toFixed(3);
  const nonce = bytesToHex(crypto.getRandomValues(new Uint8Array(12)));
  const msg = `${method.toUpperCase()}\n${path}\n${ts}\n${nonce}`;
  const sig = bytesToHex(hmac(sha256, hexToBytes(session.key), utf8ToBytes(msg)));
  return { ts, nonce, sig };
}

export function authHeaders(session: Session, method: string, path: string) {
  const { ts, nonce, sig } = signRequest(session, method, path);
  return {
    "X-Auth-Session": session.id,
    "X-Auth-Timestamp": ts,
    "X-Auth-Nonce": nonce,
    "X-Auth-Signature": sig,
  };
}

/** Same credentials as query params, for EventSource — it cannot set headers. */
export function authQuery(session: Session, path: string): string {
  const { ts, nonce, sig } = signRequest(session, "GET", path);
  return new URLSearchParams({ s: session.id, t: ts, n: nonce, g: sig }).toString();
}

// -- Persistence --------------------------------------------------------------
// localStorage, so a reload does not force a re-login. Same exposure as a
// non-HttpOnly cookie: an XSS on this origin takes the key either way.
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* private mode: the session just does not survive a reload */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}
