import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/db'
import { parseProduct } from '@/lib/utils'

type RouteContext = { params: { id: string } }

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(parseProduct(product))
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
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

    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(model !== undefined && { model }),
        ...(serialNumber !== undefined && { serialNumber }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(fullDescription !== undefined && { fullDescription }),
        ...(price !== undefined && { price }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
        ...(mainImageIndex !== undefined && { mainImageIndex }),
        ...(status !== undefined && { status }),
        ...(badge !== undefined && { badge }),
      },
    })

    return NextResponse.json(parseProduct(product))
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete image files from /public/uploads/
    let imagePaths: string[] = []
    try {
      imagePaths = JSON.parse(existing.images)
    } catch {
      imagePaths = []
    }

    const uploadsDir = path.join(process.cwd(), 'public')
    for (const imagePath of imagePaths) {
      // imagePath is like "/uploads/filename.ext"
      const fullPath = path.join(uploadsDir, imagePath)
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
      } catch (fileError) {
        console.warn(`Failed to delete file ${fullPath}:`, fileError)
      }
    }

    await prisma.product.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
