import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'active'
  const limit = parseInt(searchParams.get('limit') || '100')

  const sessions = await prisma.session.findMany({
    where: { status },
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json(sessions)
}
