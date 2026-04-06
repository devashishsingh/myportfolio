import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { isAuthenticated } from '../../../../lib/auth'

function isAuthed() {
  return isAuthenticated()
}

// GET — list bookings (admin)
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookings = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(bookings)
}

// PATCH — update booking status (admin)
export async function PATCH(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, status, adminNote } = await request.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const booking = await prisma.bookingRequest.update({
      where: { id },
      data: { status, ...(adminNote !== undefined ? { adminNote } : {}) },
    })

    return NextResponse.json(booking)
  } catch (err) {
    console.error('Booking update error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE — remove a booking (admin)
export async function DELETE(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    await prisma.bookingRequest.delete({ where: { id } })
    return NextResponse.json({ status: 'deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
