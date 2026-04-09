import { prisma } from './db'

type LeadSource = 'contact' | 'booking' | 'feedback' | 'community_invite' | 'community_subscribe'

interface CreateLeadInput {
  name: string
  email: string
  source: LeadSource
  sourceId?: string
  message?: string
  meta?: Record<string, string>
}

export async function createLead({ name, email, source, sourceId, message, meta }: CreateLeadInput) {
  try {
    await prisma.lead.create({
      data: {
        name: name.slice(0, 200),
        email: email.slice(0, 200).toLowerCase().trim(),
        source,
        sourceId: sourceId || null,
        message: message?.slice(0, 2000) || null,
        meta: meta ? JSON.stringify(meta) : null,
      },
    })
  } catch (err) {
    // Lead creation should never break the main form flow
    console.error('Lead creation failed:', err)
  }
}
