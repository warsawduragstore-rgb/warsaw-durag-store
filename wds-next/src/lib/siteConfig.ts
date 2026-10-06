/**
 * Global Site Configuration
 *
 * Defaults to the active deployed URL. When the custom domain `warsawduragstore.pl`
 * is fully switched over in DNS and Vercel, simply set `NEXT_PUBLIC_SITE_URL=https://warsawduragstore.pl`
 * or update the fallback below.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://warsaw-durag-store.vercel.app'
).replace(/\/+$/, '');
