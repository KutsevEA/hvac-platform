import { Product } from './types'

export function parseProduct(raw: {
  id: string
  title: string
  model: string
  serialNumber: string
  shortDescription: string
  fullDescription: string
  price: number
  images: string
  mainImageIndex: number
  status: string
  badge: string | null
  createdAt: Date
  updatedAt: Date
}): Product {
  return {
    ...raw,
    images: JSON.parse(raw.images),
    status: raw.status as Product['status'],
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }
}

export function getMainImage(product: Product): string | null {
  if (!product.images.length) return null
  return product.images[product.mainImageIndex] ?? product.images[0]
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
