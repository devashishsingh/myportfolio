// ─── Events Data ─────────────────────────────────────────────────────
// Single source of truth for upcoming and past events.
// To add an event: append a new entry to UPCOMING_EVENTS or PAST_EVENTS.

export interface UpcomingEvent {
  id: string
  title: string
  date: string // ISO date or human-readable
  time: string
  format: 'Online' | 'In-person' | 'Hybrid'
  price: 'Free' | string // e.g. "Free" or "RM 99"
  seatsTotal?: number
  seatsRemainingApi?: string // optional API endpoint that returns { remaining: number }
  description: string
  registerHref: string
}

export interface PastEvent {
  id: string
  title: string
  date: string
  recordingHref?: string
  recapHref?: string
  attendees?: number
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 'cyber-fields-workshop',
    title: 'Which Cybersecurity Field is Right for You?',
    date: '3 June 2026',
    time: '2:00 PM IST · 90 minutes',
    format: 'Online',
    price: 'Free',
    seatsTotal: 25,
    seatsRemainingApi: '/api/workshop',
    description:
      'A free mentorship session covering the top 10 cybersecurity career paths, salary ranges, and a 90-day roadmap. Built for students and early-career professionals.',
    registerHref: '/workshop',
  },
]

export const PAST_EVENTS: PastEvent[] = [
  // Add past events here as they happen:
  // { id: 'soc-basics-2025', title: 'SOC Basics for Beginners', date: '2025-11-12', recordingHref: 'https://youtube.com/...', attendees: 80 },
]

export function nextUpcomingEvent(): UpcomingEvent | null {
  return UPCOMING_EVENTS[0] ?? null
}
