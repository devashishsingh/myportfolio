import { redirect } from 'next/navigation'
import { getMemberFromCookie } from '../../../lib/member-auth'
import { prisma } from '../../../lib/db'
import ProfileEditor from './ProfileEditor'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Your profile · Builders Hub' }

export default async function MyProfilePage() {
  const me = await getMemberFromCookie()
  if (!me) redirect('/community/login?error=invalid_or_expired')

  const member = await prisma.member.findUnique({
    where: { id: me.id },
    select: {
      id: true, email: true, handle: true, displayName: true, bio: true,
      linkedinUrl: true, githubUrl: true, siteUrl: true, region: true,
      tracks: true, workingOn: true, openToCollab: true, openToHire: true, openToMentor: true,
      founderNumber: true, points: true,
    },
  })
  if (!member) redirect('/community/login')

  let tracks: string[] = []
  try { tracks = JSON.parse(member.tracks || '[]') } catch {}

  return <ProfileEditor initial={{ ...member, tracks }} />
}
