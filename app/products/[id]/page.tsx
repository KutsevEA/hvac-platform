'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

function getWhatsAppLink(product: Product) {
  const lines = [
    `Hi! I'm interested in a damaged unit:`,
    ``,
    `*${product.title}*`,
    product.model ? `Model: ${product.model}` : '',
    product.serialNumber ? `S/N: ${product.serialNumber}` : '',
    `Price: ${formatPrice(product.price)}`,
  ].filter(Boolean)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [notFound, setNotFound] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const lbTouchStartX = useRef<number | null>(null)

  const openLightbox = useCallback(() => setLightboxOpen(true), [])
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const lbPrev = useCallback(() => {
    if (!product) return
    setSelectedImageIndex((i) => (i - 1 + product.images.length) % product.images.length)
  }, [product])

  const lbNext = useCallback(() => {
    if (!product) return
    setSelectedImageIndex((i) => (i + 1) % product.images.length)
  }, [product])

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') lbPrev()
      if (e.key === 'ArrowRight') lbNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, closeLightbox, lbPrev, lbNext])

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (res.status === 404) { setNotFound(true); setLoading(false); return }
        if (!res.ok) throw new Error('Failed to fetch')
        const data: Product = await res.json()
        setProduct(data)
        setSelectedImageIndex(data.mainImageIndex ?? 0)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif' }}>
        <Header />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 0' }}>
          <div className="animate-pulse bg-gray-100 rounded" style={{ height: 16, width: 120 }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            <div className="animate-pulse flex-shrink-0 md:w-[58%]">
              <div className="bg-gray-100 rounded-2xl" style={{ height: 380 }} />
            </div>
            <div className="animate-pulse flex flex-col gap-4 flex-1">
              {[80, '60%', '40%', '90%', '70%', '85%'].map((w, i) => (
                <div key={i} className="bg-gray-100 rounded" style={{ height: i === 0 ? 12 : i < 3 ? 28 : 16, width: w }} />
              ))}
              <div className="bg-gray-100 rounded-xl mt-4" style={{ height: 52 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── 404 ────────────────────────────────────────────────────────────────────
  if (notFound || !product) {
    return (
      <div style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif' }}>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', gap: 16 }}>
          <p style={{ fontSize: 20, color: '#1d1d1f', fontWeight: 500 }}>Deal not found</p>
          <button onClick={() => router.back()} style={{ fontSize: 14, color: '#6e6e73', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
            ← Back to deals
          </button>
        </div>
      </div>
    )
  }

  const currentImage = product.images.length > 0 ? (product.images[selectedImageIndex] ?? product.images[0]) : null

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Header />

      {/* Back link */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        <button
          onClick={() => router.back()}
          style={{ fontSize: 14, color: '#6e6e73', cursor: 'pointer', background: 'none', border: 'none', padding: 0, transition: 'color 200ms ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6e6e73')}
        >
          ← Back to deals
        </button>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div className="flex flex-col md:flex-row md:gap-16">

          {/* ── Gallery ── */}
          <div className="flex-shrink-0 w-full md:w-[58%]">
            {/* Main image — swipeable, clickable to fullscreen */}
            <div
              style={{
                backgroundColor: '#f5f5f7',
                borderRadius: 20,
                position: 'relative',
                height: 360,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                userSelect: 'none',
                cursor: currentImage ? 'zoom-in' : 'default',
              }}
              onClick={() => { if (currentImage) openLightbox() }}
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null || !product) return
                const dx = e.changedTouches[0].clientX - touchStartX.current
                if (Math.abs(dx) < 40) return
                const total = product.images.length
                if (dx < 0) setSelectedImageIndex((i) => (i + 1) % total)
                else setSelectedImageIndex((i) => (i - 1 + total) % total)
                touchStartX.current = null
              }}
            >
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  style={{ objectFit: 'contain', padding: 24 }}
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e5e5', borderRadius: 12 }} />
              )}

              {/* Zoom hint */}
              {currentImage && (
                <span style={{
                  position: 'absolute', bottom: 12, right: 12,
                  backgroundColor: 'rgba(29,29,31,0.5)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: 8, padding: '4px 8px',
                  display: 'flex', alignItems: 'center', gap: 4,
                  color: '#ffffff', fontSize: 11, pointerEvents: 'none',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  Zoom
                </span>
              )}

              {/* Badge overlay */}
              {product.badge && (
                <span style={{
                  position: 'absolute', top: 16, left: 16,
                  backgroundColor: 'rgba(29,29,31,0.75)', color: '#ffffff',
                  fontSize: 11, fontWeight: 500, padding: '4px 10px',
                  borderRadius: 6, letterSpacing: '0.04em',
                  backdropFilter: 'blur(4px)',
                }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Swipe dots — mobile only */}
            {product.images.length > 1 && (
              <div className="flex md:hidden justify-center gap-2 mt-3">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: idx === selectedImageIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: idx === selectedImageIndex ? '#1d1d1f' : '#d1d1d6',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails — desktop only */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                {product.images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: 64, height: 64,
                      backgroundColor: '#f5f5f7', borderRadius: 10, padding: 6,
                      cursor: 'pointer', flexShrink: 0,
                      border: `2px solid ${idx === selectedImageIndex ? '#1d1d1f' : 'transparent'}`,
                      position: 'relative', transition: 'border-color 150ms ease',
                    }}
                    onMouseEnter={(e) => { if (idx !== selectedImageIndex) e.currentTarget.style.borderColor = '#d1d1d6' }}
                    onMouseLeave={(e) => { if (idx !== selectedImageIndex) e.currentTarget.style.borderColor = 'transparent' }}
                  >
                    <Image src={src} alt="" fill sizes="64px" style={{ objectFit: 'contain', borderRadius: 6, padding: 4 }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info panel ── */}
          <div className="flex-1 mt-8 md:mt-0">

            {/* Label */}
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6e6e73', marginBottom: 12, marginTop: 0 }}>
              Clearance Unit
            </p>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 600, color: '#1d1d1f', marginBottom: 12, lineHeight: 1.2, marginTop: 0 }}>
              {product.title}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
              <p style={{ fontSize: 28, fontWeight: 600, color: '#1d1d1f', margin: 0 }}>
                {formatPrice(product.price)}
              </p>
              <span style={{ fontSize: 13, color: '#6e6e73' }}>clearance price</span>
            </div>

            {/* Model / Serial */}
            {(product.model || product.serialNumber) && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                marginBottom: 20,
                padding: '12px 16px',
                backgroundColor: '#f5f5f7',
                borderRadius: 10,
              }}>
                {product.model && (
                  <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                    <span style={{ color: '#6e6e73', minWidth: 90 }}>Model</span>
                    <span style={{ color: '#1d1d1f', fontWeight: 500 }}>{product.model}</span>
                  </div>
                )}
                {product.serialNumber && (
                  <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                    <span style={{ color: '#6e6e73', minWidth: 90 }}>Serial No.</span>
                    <span style={{ color: '#1d1d1f', fontWeight: 500 }}>{product.serialNumber}</span>
                  </div>
                )}
              </div>
            )}

            {/* Short description */}
            <p style={{ fontSize: 15, color: '#6e6e73', marginBottom: 20, lineHeight: 1.6, marginTop: 0 }}>
              {product.shortDescription}
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', marginBottom: 20 }} />

            {/* Full description */}
            <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.6, marginBottom: 28, marginTop: 0, whiteSpace: 'pre-wrap' }}>
              {product.fullDescription}
            </p>

            {/* WhatsApp CTA */}
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                backgroundColor: '#1d1d1f', color: '#ffffff',
                height: 52, borderRadius: 14,
                fontSize: 15, fontWeight: 500,
                textDecoration: 'none', width: '100%',
                transition: 'background-color 200ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#333333')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1d1d1f')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Ask manager about this unit
            </a>

            <p style={{ fontSize: 12, color: '#6e6e73', textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
              Quick response via WhatsApp
            </p>

            {/* Condition note */}
            <div style={{
              marginTop: 24,
              backgroundColor: '#f5f5f7',
              borderRadius: 12,
              padding: '14px 16px',
            }}>
              <p style={{ fontSize: 13, color: '#6e6e73', margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: '#1d1d1f' }}>Condition note:</strong> This unit has cosmetic damage and is priced accordingly. Mechanically sound unless stated otherwise in the description above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && currentImage && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={closeLightbox}
          onTouchStart={(e) => { lbTouchStartX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (lbTouchStartX.current === null || !product) return
            const dx = e.changedTouches[0].clientX - lbTouchStartX.current
            if (Math.abs(dx) < 40) return
            e.stopPropagation()
            if (dx < 0) lbNext()
            else lbPrev()
            lbTouchStartX.current = null
          }}
        >
          {/* Image */}
          <div
            style={{ position: 'relative', width: '100%', height: '100%', maxWidth: 1200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain', padding: '48px 72px' }}
              priority
            />
          </div>

          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'fixed', top: 16, right: 16,
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '50%', width: 44, height: 44,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', backdropFilter: 'blur(6px)',
            }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Prev arrow */}
          {product.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lbPrev() }}
              style={{
                position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: '50%', width: 48, height: 48,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', backdropFilter: 'blur(6px)',
              }}
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {product.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lbNext() }}
              style={{
                position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none',
                borderRadius: '50%', width: 48, height: 48,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', backdropFilter: 'blur(6px)',
              }}
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}

          {/* Dots counter */}
          {product.images.length > 1 && (
            <div style={{
              position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(idx) }}
                  style={{
                    width: idx === selectedImageIndex ? 24 : 7,
                    height: 7, borderRadius: 4,
                    backgroundColor: idx === selectedImageIndex ? '#ffffff' : 'rgba(255,255,255,0.35)',
                    border: 'none', padding: 0, cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
