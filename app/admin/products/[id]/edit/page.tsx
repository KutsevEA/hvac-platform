'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product, ProductStatus } from '@/lib/types'

type BadgeOption = 'None' | 'New Arrival' | 'Limited Offer' | 'Available Now'

const BADGE_OPTIONS: BadgeOption[] = ['None', 'New Arrival', 'Limited Offer', 'Available Now']
const STATUS_OPTIONS: ProductStatus[] = ['active', 'hidden']

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '44px',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '0 16px',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  color: '#1d1d1f',
  fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '10px 16px',
  fontSize: '15px',
  outline: 'none',
  resize: 'none',
  boxSizing: 'border-box',
  color: '#1d1d1f',
  fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  color: '#1d1d1f',
  marginBottom: '6px',
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#1d1d1f',
  marginBottom: '16px',
  marginTop: 0,
}

const fieldStyle: React.CSSProperties = {
  marginBottom: '16px',
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { id } = params

  const [loadingProduct, setLoadingProduct] = useState(true)
  const [title, setTitle] = useState('')
  const [model, setModel] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<ProductStatus>('active')
  const [badge, setBadge] = useState<BadgeOption>('None')
  const [images, setImages] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; price?: string }>({})
  const [uploadAreaHovered, setUploadAreaHovered] = useState(false)

  const uploading = uploadProgress !== null

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data: Product = await res.json()
        setTitle(data.title)
        setModel(data.model ?? '')
        setSerialNumber(data.serialNumber ?? '')
        setShortDescription(data.shortDescription)
        setFullDescription(data.fullDescription)
        setPrice(String(data.price))
        setStatus(data.status)
        setBadge((data.badge as BadgeOption) ?? 'None')
        setImages(data.images)
        setMainImageIndex(data.mainImageIndex)
      } catch (err) {
        console.error('Failed to load product', err)
      } finally {
        setLoadingProduct(false)
      }
    }
    loadProduct()
  }, [id])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadProgress({ current: 0, total: files.length })
    try {
      const uploaded: string[] = []
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length })
        const form = new FormData()
        form.append('file', files[i])
        const res = await fetch('/api/upload', { method: 'POST', body: form })
        if (res.ok) {
          const data = await res.json()
          uploaded.push(data.path)
        }
      }
      setImages((prev) => [...prev, ...uploaded])
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploadProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    // Note: DELETE /api/upload is not implemented; the file stays on disk but is removed from the product's image list.
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (mainImageIndex >= next.length) setMainImageIndex(Math.max(0, next.length - 1))
      return next
    })
  }

  function validate() {
    const errs: { title?: string; price?: string } = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (!price.trim() || isNaN(Number(price))) errs.price = 'A valid price is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          model: model.trim(),
          serialNumber: serialNumber.trim(),
          shortDescription: shortDescription.trim(),
          fullDescription: fullDescription.trim(),
          price: Number(price),
          images,
          mainImageIndex,
          status,
          badge: badge === 'None' ? null : badge,
        }),
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        console.error('Failed to update product', await res.text())
      }
    } catch (err) {
      console.error('Submit error', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading skeleton
  if (loadingProduct) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
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
            <span style={{ fontSize: '16px', color: '#6e6e73' }}> / Edit Product</span>
          </div>
        </div>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ ...cardStyle, height: '160px' }}>
              <div
                style={{
                  height: '16px',
                  width: '160px',
                  backgroundColor: '#e5e5e5',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  height: '44px',
                  backgroundColor: '#f5f5f7',
                  borderRadius: '8px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </div>
          ))}
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
          <span style={{ fontSize: '16px', color: '#6e6e73' }}> / Edit Product</span>
        </div>
        <button
          onClick={() => router.push('/admin')}
          style={{
            background: 'none',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            color: '#1d1d1f',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Info */}
          <div style={cardStyle}>
            <p style={sectionTitleStyle}>Basic Information</p>

            <div style={fieldStyle}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.title ? '#ef4444' : '#e5e5e5',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = errors.title ? '#ef4444' : '#0071e3')}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.title ? '#ef4444' : '#e5e5e5')}
                placeholder="Product title"
              />
              {errors.title && (
                <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                  {errors.title}
                </span>
              )}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#0071e3')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                placeholder="e.g. Carrier 24ACC636A003"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Serial Number</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#0071e3')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                placeholder="e.g. 1234A56789"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Short Description</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                style={textareaStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#0071e3')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                placeholder="Brief product description"
              />
            </div>

            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={labelStyle}>Full Description</label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                rows={5}
                style={textareaStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#0071e3')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                placeholder="Detailed product description"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Status */}
          <div style={cardStyle}>
            <p style={sectionTitleStyle}>Pricing & Status</p>

            <div style={fieldStyle}>
              <label style={labelStyle}>Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  ...inputStyle,
                  width: '200px',
                  borderColor: errors.price ? '#ef4444' : '#e5e5e5',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = errors.price ? '#ef4444' : '#0071e3')}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.price ? '#ef4444' : '#e5e5e5')}
                placeholder="0"
                min="0"
              />
              {errors.price && (
                <span style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                  {errors.price}
                </span>
              )}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      border: status === s ? 'none' : '1px solid #e5e5e5',
                      backgroundColor: status === s ? '#1d1d1f' : '#ffffff',
                      color: status === s ? '#ffffff' : '#6e6e73',
                      fontWeight: 500,
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={labelStyle}>Badge</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {BADGE_OPTIONS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(b)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      border: badge === b ? 'none' : '1px solid #e5e5e5',
                      backgroundColor: badge === b ? '#1d1d1f' : '#ffffff',
                      color: badge === b ? '#ffffff' : '#6e6e73',
                      fontWeight: 500,
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Images */}
          <div style={cardStyle}>
            <p style={sectionTitleStyle}>Images</p>

            {/* Upload area */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onMouseEnter={() => !uploading && setUploadAreaHovered(true)}
              onMouseLeave={() => setUploadAreaHovered(false)}
              style={{
                border: `2px dashed ${uploading ? '#0071e3' : uploadAreaHovered ? '#0071e3' : '#e5e5e5'}`,
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                cursor: uploading ? 'default' : 'pointer',
                backgroundColor: uploading ? '#f0f7ff' : uploadAreaHovered ? '#f0f7ff' : 'transparent',
                transition: 'border-color 150ms ease, background-color 150ms ease',
              }}
            >
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                {uploading ? (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="20" cy="20" r="16" stroke="#e5e5e5" strokeWidth="3" />
                    <path d="M20 4 a16 16 0 0 1 16 16" stroke="#0071e3" strokeWidth="3" strokeLinecap="round" />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#f5f5f7" />
                    <path d="M20 27V13M20 13L14 19M20 13L26 19" stroke="#6e6e73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {uploading && uploadProgress ? (
                <>
                  <p style={{ fontSize: '14px', color: '#0071e3', margin: '0 0 8px 0', fontWeight: 500 }}>
                    Uploading {uploadProgress.current} of {uploadProgress.total}...
                  </p>
                  <div style={{ width: '160px', height: '4px', backgroundColor: '#e5e5e5', borderRadius: '2px', margin: '0 auto' }}>
                    <div style={{
                      height: '4px',
                      backgroundColor: '#0071e3',
                      borderRadius: '2px',
                      width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                      transition: 'width 200ms ease',
                    }} />
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '14px', color: '#6e6e73', margin: '0 0 4px 0' }}>Click to upload images</p>
                  <p style={{ fontSize: '12px', color: '#9e9e9e', margin: 0 }}>PNG, JPG up to 10MB</p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Images grid */}
            {images.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  marginTop: '16px',
                }}
              >
                {images.map((src, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      backgroundColor: '#f5f5f7',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: mainImageIndex === index ? '2px solid #0071e3' : '2px solid transparent',
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Product image ${index + 1}`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                    {mainImageIndex === index && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: '#1d1d1f',
                          color: '#ffffff',
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        fontSize: '14px',
                        color: '#1d1d1f',
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            style={{
              backgroundColor: '#1d1d1f',
              color: '#ffffff',
              width: '100%',
              height: '48px',
              borderRadius: '12px',
              fontWeight: 500,
              fontSize: '16px',
              border: 'none',
              cursor: isSubmitting || uploading ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || uploading ? 0.6 : 1,
              marginTop: '16px',
              fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
