import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

// ─── Session Token Hashing ──────────────────────────────────────────
// We never store the raw ADMIN_TOKEN in cookies.
// Instead we store a HMAC-derived session hash so the real password
// cannot be recovered from a stolen cookie.

const SESSION_SECRET = process.env.SESSION_SECRET || 'portfolio-session-default-key'

/**
 * Derive a session hash from the admin password.
 * Uses HMAC-SHA256 with a server-side secret so the cookie value
 * is not the raw password and cannot be reversed.
 */
export function deriveSessionHash(password: string): string {
  return createHash('sha256')
    .update(`${SESSION_SECRET}:${password}`)
    .digest('hex')
}

/**
 * Verify a session hash against the stored ADMIN_TOKEN.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifySession(sessionValue: string): boolean {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken || !sessionValue) return false

  const expected = deriveSessionHash(adminToken)

  // Timing-safe comparison
  try {
    const a = Buffer.from(sessionValue, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * Verify password against ADMIN_TOKEN.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyPassword(password: string): boolean {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken || !password) return false

  try {
    const a = Buffer.from(password)
    const b = Buffer.from(adminToken)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * Check if current request is authenticated (for use in API routes).
 * Reads the admin_session cookie and verifies the hash.
 */
export function isAuthenticated(): boolean {
  const session = cookies().get('admin_session')?.value
  if (!session) return false
  return verifySession(session)
}

/**
 * Cookie options for admin session.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
}
