'use client'

import Image from 'next/image'
import { Product } from '@/lib/types'
import { getMainImage, formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const mainImage = getMainImage(product)

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={(e) => {
        const card = e.currentTarget
        card.style.transform = 'translateY(-2px)'
        card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget
        card.style.transform = 'translateY(0)'
        card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'
      }}
      style={{
        minHeight: '400px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
        outline: 'none',
      }}
    >
      {/* Image block */}
      <div
        style={{
          height: '240px',
          backgroundColor: '#f5f5f7',
          padding: '16px',
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.model}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain', padding: '16px' }}
          />
        ) : (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              backgroundColor: '#d1d1d6',
            }}
          />
        )}
      </div>

      {/* Content block */}
      <div
        style={{
          padding: '16px 20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Badge */}
        {product.badge && (
          <span
            style={{
              fontSize: '11px',
              color: '#6e6e73',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Model */}
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: '#1d1d1f',
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.35,
          }}
        >
          {product.model}
        </h3>

        {/* Price */}
        <p
          style={{
            fontSize: '20px',
            fontWeight: 500,
            color: '#1d1d1f',
            marginBottom: '8px',
          }}
        >
          {formatPrice(product.price)}
        </p>

        {/* Short description */}
        <p
          style={{
            fontSize: '14px',
            color: '#6e6e73',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {product.shortDescription}
        </p>
      </div>

      {/* Footer — anchored to bottom */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #f0f0f0',
          marginTop: 'auto',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            color: '#0071e3',
            fontWeight: 500,
          }}
        >
          View details →
        </span>
      </div>
    </div>
  )
}
