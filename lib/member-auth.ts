// Member magic-link auth.
// - Login request: generate raw token, store its SHA-256 hash, email the raw token in a magic link.
// - Verify: lookup by hash, ensure not used and not expired, mark used, mint a long-lived session token.
// - Session: another row with purpose='session' + 30d expiry; cookie carries raw token, server matches via hash.

import { createHash, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from './db'

export const MEMBER_COOKIE = 'member_session'
const LOGIN_LINK_TTL_MIN = 15
const SESSION_TTL_DAYS = 30

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function newRawToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex')
}

export async function createLoginToken(memberId: string): Promise<string> {
  const raw = newRawToken()
  const tokenHash = hashToken(raw)
  const expiresAt = new Date(Date.now() + LOGIN_LINK_TTL_MIN * 60 * 1000)
  await prisma.memberSession.create({
    data: { memberId, tokenHash, purpose: 'login_request', expiresAt },
  })
  return raw
}

export async function consumeLoginToken(rawToken: string): Promise<string | null> {
  if (!rawToken) return null
  const tokenHash = hashToken(rawToken)
  const row = await prisma.memberSession.findUnique({ where: { tokenHash } })
  if (!row || row.purpose !== 'login_request' || row.usedAt || row.expiresAt < new Date()) return null
  await prisma.memberSession.update({ where: { id: row.id }, data: { usedAt: new Date() } })
  return row.memberId
}

export async function createSessionToken(memberId: string): Promise<string> {
  const raw = newRawToken()
  const tokenHash = hashToken(raw)
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  await prisma.memberSession.create({
    data: { memberId, tokenHash, purpose: 'session', expiresAt },
  })
  return raw
}

export const MEMBER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
}

export async function getMemberFromCookie(): Promise<{ id: string; email: string; handle: string; displayName: string; founderNumber: number | null } | null> {
  const raw = cookies().get(MEMBER_COOKIE)?.value
  if (!raw) return null
  const tokenHash = hashToken(raw)
  const session = await prisma.memberSession.findUnique({ where: { tokenHash } })
  if (!session || session.purpose !== 'session' || session.expiresAt < new Date()) return null
  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    select: { id: true, email: true, handle: true, displayName: true, founderNumber: true },
  })
  return member
}

export async function destroySession(rawToken: string | undefined) {
  if (!rawToken) return
  const tokenHash = hashToken(rawToken)
  try {
    await prisma.memberSession.delete({ where: { tokenHash } })
  } catch {
    /* ignore */
  }
}

// Slugify a name into a URL-safe handle. Adds 4-char rand suffix for uniqueness.
// Reserved prefixes prevent collisions with sub-routes under /community/.
const RESERVED_HANDLES = new Set([
  'login', 'logout', 'me', 'members', 'welcome', 'join', 'subscribe',
  'challenges', 'challenge', 'admin', 'api', 'leaderboard', 'new', 'edit',
])

export function generateHandle(displayName: string): string {
  let base = displayName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24) || 'builder'
  if (RESERVED_HANDLES.has(base)) base = `${base}-builder`
  const suffix = randomBytes(2).toString('hex')
  return `${base}-${suffix}`
}
