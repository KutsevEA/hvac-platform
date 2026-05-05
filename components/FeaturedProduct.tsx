'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { getMainImage, formatPrice } from '@/lib/utils'

interface FeaturedProductProps {
  product: Product
  onClick: () => void
}

export default function FeaturedProduct({ product, onClick }: FeaturedProductProps) {
  const [mounted, setMounted] = useState(false)
  const mainImage = getMainImage(product)

  useEffect(() => {
    // Trigger fade-in on mount
    const timer = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(timer)
  }, [])

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#f5f5f7',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 500ms ease',
        fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
        cursor: 'pointer',
      }}
      className="flex-col md:flex-row md:h-[440px]"
    >
      {/* Image side — 60% on desktop */}
      <div
        className="w-full md:w-[60%] h-[280px] md:h-full"
        style={{
          backgroundColor: '#f5f5f7',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {mainImage ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transition: 'transform 300ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Image
              src={mainImage}
              alt={product.model}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              style={{ objectFit: 'contain', padding: '32px' }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '16px',
                backgroundColor: '#d1d1d6',
              }}
            />
          </div>
        )}
      </div>

      {/* Info side — 40% on desktop */}
      <div
        className="w-full md:w-[40%] p-6 md:p-10"
        style={{
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Editor's Pick label */}
        <span
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#6e6e73',
            marginBottom: '16px',
            display: 'block',
          }}
        >
          Featured Unit
        </span>

        {/* Product model */}
        <h2
          style={{
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 600,
            color: '#1d1d1f',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.2,
          }}
        >
          {product.model}
        </h2>

        {/* Price */}
        <p
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1d1d1f',
            marginBottom: '16px',
          }}
        >
          {formatPrice(product.price)}
        </p>

        {/* Short description */}
        <p
          style={{
            fontSize: '15px',
            color: '#6e6e73',
            marginBottom: '32px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
          }}
        >
          {product.shortDescription}
        </p>

        {/* CTA button */}
        <button
          onClick={onClick}
          style={{
            backgroundColor: '#1d1d1f',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 200ms ease',
            alignSelf: 'flex-start',
            fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333333'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1d1d1f'
          }}
        >
          View details →
        </button>
      </div>
    </div>
  )
}
