import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySession } from '../../../lib/auth'
import RegistrationsClient from './RegistrationsClient'

export const dynamic = 'force-dynamic'

export default function WorkshopRegistrationsPage() {
  const session = cookies().get('admin_session')?.value
  if (!session || !verifySession(session)) {
    redirect('/login')
  }
  return <RegistrationsClient />
}
