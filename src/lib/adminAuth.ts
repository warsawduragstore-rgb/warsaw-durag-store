export const ADMIN_COOKIE_NAME = 'wds_admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dni

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'wds-warsaw-secret-token-key-2026';
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'wds-warszawa-2026!';
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const signature = await hmacSha256(timestamp, getSecretKey());
  return `${timestamp}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Sprawdź wygaśnięcie tokena (7 dni)
  const age = Date.now() - timestamp;
  if (age < 0 || age > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const expectedSignature = await hmacSha256(timestampStr, getSecretKey());
  return expectedSignature === providedSignature;
}
