'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { formatPrice, getMainImage } from '@/lib/utils'

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function loadProducts() {
    setLoading(true)
    try {
      const res = await fetch('/api/products?all=true')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    loadProducts()
  }

  async function handleSignOut() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const formattedDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#f5f5f7]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <div className="bg-white border-b border-[#e5e5e5] px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="text-[15px] font-semibold text-[#1d1d1f]">
          Admin <span className="text-[#6e6e73] font-normal">/ Products</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/admin/products/new')}
            className="bg-[#1d1d1f] text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            + Add
          </button>
          <button
            onClick={handleSignOut}
            className="text-[#6e6e73] text-sm border border-[#e5e5e5] px-4 py-2 rounded-lg bg-white"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">

        {/* ── Mobile: card list ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex gap-3 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-[#e5e5e5] shrink-0" />
                <div className="flex-1 flex flex-col gap-2 justify-center">
                  <div className="h-4 bg-[#e5e5e5] rounded w-3/4" />
                  <div className="h-3 bg-[#e5e5e5] rounded w-1/4" />
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-[#6e6e73] text-sm">
              No products yet. Tap + Add to create one.
            </div>
          ) : (
            products.map((product) => {
              const img = getMainImage(product)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 flex gap-3 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-[#f5f5f7] overflow-hidden relative shrink-0">
                    {img && <Image src={img} alt={product.title} fill style={{ objectFit: 'contain' }} />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-[#1d1d1f] truncate">{product.title}</div>
                    <div className="text-sm text-[#6e6e73] mt-0.5">{formatPrice(product.price)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.status}
                      </span>
                      <span className="text-xs text-[#6e6e73]">{formattedDate(product.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center shrink-0">
                    <button
                      onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      className="text-[#0071e3] text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── Desktop: table ── */}
        <div className="hidden md:block bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f5f5f7]">
                {['Image', 'Title', 'Price', 'Status', 'Date', 'Actions'].map((col) => (
                  <th key={col} className="text-left text-xs uppercase tracking-wider text-[#6e6e73] font-semibold px-5 py-3 border-b border-[#e5e5e5]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[48, 200, 80, 80, 100, 120].map((w, j) => (
                      <td key={j} className="px-5 py-4 border-b border-[#f5f5f7]">
                        <div className="animate-pulse bg-[#e5e5e5] rounded" style={{ height: j === 0 ? 48 : 16, width: j === 0 ? 48 : w }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-[#6e6e73] text-sm">
                    No products yet. Add your first product.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const img = getMainImage(product)
                  return (
                    <tr key={product.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-5 py-4 border-b border-[#f5f5f7]">
                        <div className="w-12 h-12 rounded-lg bg-[#f5f5f7] overflow-hidden relative">
                          {img && <Image src={img} alt={product.title} fill style={{ objectFit: 'contain' }} />}
                        </div>
                      </td>
                      <td className="px-5 py-4 border-b border-[#f5f5f7]">
                        <div className="text-[15px] font-medium text-[#1d1d1f] max-w-[240px] truncate">{product.title}</div>
                      </td>
                      <td className="px-5 py-4 border-b border-[#f5f5f7] text-[15px] text-[#1d1d1f]">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-5 py-4 border-b border-[#f5f5f7]">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 border-b border-[#f5f5f7] text-sm text-[#6e6e73]">
                        {formattedDate(product.createdAt)}
                      </td>
                      <td className="px-5 py-4 border-b border-[#f5f5f7]">
                        <button onClick={() => router.push(`/admin/products/${product.id}/edit`)} className="text-[#0071e3] text-sm mr-4">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 text-sm">Delete</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
