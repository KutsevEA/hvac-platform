import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseProduct } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') ?? undefined
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const badge = searchParams.get('badge') ?? undefined

    const all = searchParams.get('all') === 'true'

    const products = await prisma.product.findMany({
      where: {
        ...(!all && { status: 'active' }),
        ...(search && {
          title: { contains: search },
        }),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice && { gte: parseFloat(minPrice) }),
                ...(maxPrice && { lte: parseFloat(maxPrice) }),
              },
            }
          : {}),
        ...(badge && { badge }),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products.map(parseProduct))
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      model,
      serialNumber,
      shortDescription,
      fullDescription,
      price,
      images,
      mainImageIndex,
      status,
      badge,
    } = body

    const product = await prisma.product.create({
      data: {
        title,
        model: model ?? '',
        serialNumber: serialNumber ?? '',
        shortDescription,
        fullDescription,
        price,
        images: JSON.stringify(images ?? []),
        mainImageIndex: mainImageIndex ?? 0,
        status: status ?? 'active',
        badge: badge ?? null,
      },
    })

    return NextResponse.json(parseProduct(product), { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
