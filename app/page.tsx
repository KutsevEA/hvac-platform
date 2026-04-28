'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import Header from '@/components/Header'
import FeaturedProduct from '@/components/FeaturedProduct'
import ProductCard from '@/components/ProductCard'
import FilterBar from '@/components/FilterBar'
import SkeletonCard from '@/components/SkeletonCard'

interface Filters {
  search: string
  minPrice: string
  maxPrice: string
  badge: string
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  minPrice: '',
  maxPrice: '',
  badge: '',
}

export default function Page() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setProducts([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const featuredProduct = products[0] ?? null

  const filteredProducts = useMemo(() => {
    // Start from products[1] onward — featured is always products[0]
    const rest = products.slice(1)

    return rest.filter((product) => {
      if (
        filters.search &&
        !product.title.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }
      if (filters.minPrice && product.price < Number(filters.minPrice)) {
        return false
      }
      if (filters.maxPrice && product.price > Number(filters.maxPrice)) {
        return false
      }
      if (filters.badge && product.badge !== filters.badge) {
        return false
      }
      return true
    })
  }, [products, filters])

  const hasActiveFilters =
    filters.search !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.badge !== ''

  const noProductsAtAll = !loading && products.length === 0
  const noFilterResults =
    !loading && products.length > 0 && filteredProducts.length === 0

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
      }}
    >
      {/* 1. Header */}
      <Header />

      {/* 2. Hero Section */}
      <section style={{ paddingTop: '96px', paddingBottom: '64px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#6e6e73', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', marginTop: 0 }}>
            Clearance Equipment
          </p>
          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: 600,
              color: '#1d1d1f',
              marginBottom: '16px',
              lineHeight: 1.1,
              marginTop: 0,
            }}
          >
            HVAC Units at<br />Exceptional Prices
          </h1>
          <p
            style={{
              fontSize: '17px',
              color: '#6e6e73',
              marginBottom: '24px',
              maxWidth: '460px',
              lineHeight: 1.6,
              marginTop: 0,
            }}
          >
            Brand-name equipment with cosmetic damage — fully functional, significantly discounted. Updated regularly.
          </p>
          <p
            style={{
              fontSize: '13px',
              color: '#6e6e73',
              borderLeft: '2px solid #e5e5e5',
              paddingLeft: '14px',
              lineHeight: 1.5,
              marginTop: 0,
            }}
          >
            Same performance. Honest condition. Real value.
          </p>
        </div>
      </section>

      {/* 3. Featured Product */}
      {!loading && featuredProduct && (
        <section>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              paddingLeft: '24px',
              paddingRight: '24px',
              marginBottom: '80px',
            }}
          >
            <FeaturedProduct
              product={featuredProduct}
              onClick={() => router.push('/products/' + featuredProduct.id)}
            />
          </div>
        </section>
      )}

      {/* 4. "More offers" label */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          marginTop: '64px',
          marginBottom: '32px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1d1d1f',
          }}
        >
          More deals
        </h2>
      </div>

      {/* 5. Filter Bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          marginBottom: '32px',
        }}
      >
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* 6. Product Grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* Loading state: 6 skeleton cards */}
        {loading && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* No products at all */}
        {noProductsAtAll && (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '80px',
              paddingBottom: '80px',
            }}
          >
            <p style={{ fontSize: '16px', color: '#6e6e73' }}>
              New deals coming soon. Check back shortly.
            </p>
          </div>
        )}

        {/* No results from filter */}
        {noFilterResults && (
          <div
            style={{
              textAlign: 'center',
              paddingTop: '64px',
              paddingBottom: '64px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <p style={{ fontSize: '16px', color: '#6e6e73' }}>
              No items match your filters.
            </p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              style={{
                border: '1px solid #1d1d1f',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#1d1d1f',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                marginTop: '16px',
                fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
                transition: 'background-color 200ms ease, color 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d1d1f'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#1d1d1f'
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product cards grid */}
        {!loading && filteredProducts.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push('/products/' + product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 7. Trust Block */}
      <div
        style={{
          marginTop: '80px',
          marginBottom: '80px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            paddingLeft: '24px',
            paddingRight: '24px',
            borderTop: '1px solid #e5e5e5',
            paddingTop: '64px',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#1d1d1f', marginBottom: '16px', marginTop: 0 }}>
            About these units
          </h3>
          <p style={{ fontSize: '14px', color: '#6e6e73', marginBottom: '8px', lineHeight: 1.6, marginTop: 0 }}>
            Each unit is a brand-name product with cosmetic imperfections — dents, scratches, or handling marks. Mechanically sound unless noted otherwise.
          </p>
          <p style={{ fontSize: '14px', color: '#6e6e73', marginBottom: '24px', lineHeight: 1.6, marginTop: 0 }}>
            The condition is reflected in the price. You get professional-grade equipment at a fraction of retail.
          </p>
          <p style={{ fontSize: '14px', color: '#1d1d1f', fontWeight: 500, lineHeight: 1.6, marginTop: 0 }}>
            Honest descriptions. No surprises.
          </p>
        </div>
      </div>
    </div>
  )
}
