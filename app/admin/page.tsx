'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { formatPrice, getMainImage } from '@/lib/utils'

// Note: This fetches /api/products which returns only active products.
// To see hidden products, the API would need to support ?all=true to skip the status filter.
// For now, admin manages active products and can toggle status to hidden via the edit page.

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function loadProducts() {
    setLoading(true)
    try {
      const res = await fetch('/api/products?all=true')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Failed to load products', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this product?')
    if (!confirmed) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      await loadProducts()
    } catch (err) {
      console.error('Failed to delete product', err)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
          height: '64px',
          paddingLeft: '32px',
          paddingRight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Admin</span>
          <span style={{ fontSize: '16px', color: '#6e6e73' }}> / Products</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/admin/products/new')}
            style={{
              backgroundColor: '#1d1d1f',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Add Product
          </button>
          <button
            onClick={async () => {
              await fetch('/api/admin/auth', { method: 'DELETE' })
              router.push('/admin/login')
            }}
            style={{
              backgroundColor: 'transparent',
              color: '#6e6e73',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #e5e5e5',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f7' }}>
                {['Image', 'Title', 'Price', 'Status', 'Date', 'Actions'].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: 'left',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#6e6e73',
                      padding: '12px 20px',
                      borderBottom: '1px solid #e5e5e5',
                      fontWeight: 600,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // 5 skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[48, 200, 80, 80, 100, 120].map((w, j) => (
                      <td key={j} style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f7', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            height: j === 0 ? '48px' : '16px',
                            width: j === 0 ? '48px' : `${w}px`,
                            backgroundColor: '#e5e5e5',
                            borderRadius: '6px',
                            animation: 'pulse 1.5s ease-in-out infinite',
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '64px 20px',
                      textAlign: 'center',
                      color: '#6e6e73',
                      fontSize: '15px',
                    }}
                  >
                    No products yet. Add your first product.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const mainImage = getMainImage(product)
                  const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  return (
                    <tr key={product.id}>
                      {/* Image */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f7', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#f5f5f7',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative',
                            flexShrink: 0,
                          }}
                        >
                          {mainImage ? (
                            <Image
                              src={mainImage}
                              alt={product.title}
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          ) : null}
                        </div>
                      </td>

                      {/* Title */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f7', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            fontSize: '15px',
                            color: '#1d1d1f',
                            fontWeight: 500,
                            maxWidth: '240px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.title}
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f7', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '15px', color: '#1d1d1f' }}>
                          {formatPrice(product.price)}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f7', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '14px',
                            backgroundColor: product.status === 'active' ? '#d1fae5' : '#f3f4f6',
                            color: product.status === 'active' ? '#065f46' : '#6e6e73',
                            fontWeight: 500,
                          }}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f7', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '14px', color: '#6e6e73' }}>{formattedDate}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f7', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                          style={{
                            color: '#0071e3',
                            fontSize: '14px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '16px',
                            padding: 0,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{
                            color: '#ef4444',
                            fontSize: '14px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
