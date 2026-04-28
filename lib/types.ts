export type ProductStatus = 'active' | 'hidden'
export type ProductBadge = 'New Arrival' | 'Limited Offer' | 'Available Now'

export interface Product {
  id: string
  title: string
  model: string
  serialNumber: string
  shortDescription: string
  fullDescription: string
  price: number
  images: string[]
  mainImageIndex: number
  status: ProductStatus
  badge: string | null
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  search?: string
  minPrice?: number
  maxPrice?: number
  badge?: string
}
