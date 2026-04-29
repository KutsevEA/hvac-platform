import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ── GET: Meta webhook verification ───────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ── POST: Incoming message ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('WhatsApp webhook payload:', JSON.stringify(body, null, 2))

    const entry = body?.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const messages = value?.messages

    console.log('Messages found:', messages?.length ?? 0, 'Statuses:', value?.statuses?.length ?? 0)

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: 'no_messages' })
    }

    for (const msg of messages) {
      const phone: string = msg.from
      const waMessageId: string = msg.id

      // Upsert customer by phone number
      let customer = await prisma.customer.findUnique({ where: { phone } })
      if (!customer) {
        customer = await prisma.customer.create({
          data: { phone },
        })
      }

      // Check if there's already an active session for this customer
      const existingSession = await prisma.session.findFirst({
        where: { customerId: customer.id, status: 'active' },
      })

      if (!existingSession) {
        await prisma.session.create({
          data: {
            customerId: customer.id,
            status: 'active',
            locked: true,
            waMessageId,
          },
        })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
