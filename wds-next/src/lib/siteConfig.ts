/**
 * Global Site Configuration
 *
 * Defaults to the production domain `warsawduragstore.com`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://warsawduragstore.com'
).replace(/\/+$/, '');
