export type SessionType = 'mentorship' | 'collaborate' | 'study'
export type ApiSessionType = 'mentorship' | 'consulting' | 'workshop' | 'other' | 'study'

export interface BookingSession {
  id: SessionType
  label: string
  description: string
  apiSessionType: ApiSessionType
}

export const BOOKING_SESSIONS: Record<SessionType, BookingSession> = {
  mentorship: {
    id: 'mentorship',
    label: 'Mentorship Conversation',
    description: 'Career guidance, learning paths, and 1-on-1 mentoring',
    apiSessionType: 'mentorship',
  },
  collaborate: {
    id: 'collaborate',
    label: 'Career Clarity Session',
    description: 'Strategic guidance for startups, career transitions, and growth',
    apiSessionType: 'consulting',
  },
  study: {
    id: 'study',
    label: 'Let\'s Study Together',
    description: 'Structured learning, accountability, and real-world skill building',
    apiSessionType: 'study',
  },
}

/**
 * Get a booking session by ID
 */
export function getBookingSession(id: SessionType): BookingSession {
  return BOOKING_SESSIONS[id]
}
