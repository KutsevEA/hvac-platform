import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const session = await prisma.session.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(session)
}
