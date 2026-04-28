'use client'

import { useState } from 'react'

interface Filters {
  search: string
  minPrice: string
  maxPrice: string
  badge: string
}

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const BADGE_OPTIONS = ['New Arrival', 'Limited Offer', 'Available Now'] as const

// Simple filter icon (3 horizontal lines)
function FilterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 4h12M4 8h8M6 12h4" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// X icon for close / clear
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Draft state inside the modal before applying
  const [draft, setDraft] = useState<Filters>(filters)

  const openModal = () => {
    setDraft(filters) // sync draft with current filters when opening
    setIsOpen(true)
  }
  const closeModal = () => setIsOpen(false)

  const applyFilters = () => {
    onChange(draft)
    closeModal()
  }

  const resetDraft = () => {
    setDraft({ search: '', minPrice: '', maxPrice: '', badge: '' })
  }

  // Active chips derived from current applied filters (not draft)
  const activeChips: { key: keyof Filters; label: string }[] = []
  if (filters.badge) activeChips.push({ key: 'badge', label: filters.badge })
  if (filters.minPrice || filters.maxPrice) {
    const label =
      filters.minPrice && filters.maxPrice
        ? `Price: ${filters.minPrice}–${filters.maxPrice}`
        : filters.minPrice
        ? `Min: $${filters.minPrice}`
        : `Max: $${filters.maxPrice}`
    activeChips.push({ key: 'minPrice', label })
  }

  const clearChip = (key: keyof Filters) => {
    if (key === 'minPrice') {
      onChange({ ...filters, minPrice: '', maxPrice: '' })
    } else {
      onChange({ ...filters, [key]: '' })
    }
  }

  const clearAll = () => {
    onChange({ search: '', minPrice: '', maxPrice: '', badge: '' })
  }

  const hasActiveFilters = activeChips.length > 0

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif' }}>
      {/* Main bar */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        {/* Search input */}
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search products..."
          style={{
            flex: 1,
            height: '48px',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            padding: '0 16px',
            fontSize: '15px',
            color: '#1d1d1f',
            backgroundColor: '#ffffff',
            outline: 'none',
            transition: 'border-color 200ms ease',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#0071e3'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />

        {/* Filters button */}
        <button
          onClick={openModal}
          style={{
            height: '48px',
            padding: '0 20px',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            fontSize: '14px',
            color: '#1d1d1f',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'border-color 200ms ease',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#1d1d1f'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5'
          }}
        >
          <FilterIcon />
          Filters
          {hasActiveFilters && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#1d1d1f',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
            marginTop: '12px',
          }}
        >
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#f5f5f7',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '14px',
                color: '#1d1d1f',
              }}
            >
              {chip.label}
              <button
                onClick={() => clearChip(chip.key)}
                aria-label={`Remove ${chip.label} filter`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6e6e73',
                  marginLeft: '2px',
                }}
              >
                <XIcon size={12} />
              </button>
            </span>
          ))}

          <button
            onClick={clearAll}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#0071e3',
              padding: '0 4px',
              fontFamily: 'inherit',
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Modal overlay + drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 40,
            }}
          />

          {/* Drawer */}
          <div
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '360px',
              backgroundColor: '#ffffff',
              zIndex: 50,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 40px rgba(0,0,0,0.12)',
              fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 500, color: '#1d1d1f' }}>
                Filters
              </span>
              <button
                onClick={closeModal}
                aria-label="Close filters"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6e6e73',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Drawer content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {/* Price range */}
              <div style={{ marginBottom: '32px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1d1d1f',
                    marginBottom: '12px',
                  }}
                >
                  Price range
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={draft.minPrice}
                    onChange={(e) => setDraft({ ...draft, minPrice: e.target.value })}
                    style={{
                      flex: 1,
                      height: '44px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: '#1d1d1f',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0071e3'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={draft.maxPrice}
                    onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })}
                    style={{
                      flex: 1,
                      height: '44px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: '#1d1d1f',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0071e3'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                    }}
                  />
                </div>
              </div>

              {/* Badge filter */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1d1d1f',
                    marginBottom: '12px',
                  }}
                >
                  Filter by
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {BADGE_OPTIONS.map((badge) => {
                    const isSelected = draft.badge === badge
                    return (
                      <button
                        key={badge}
                        onClick={() =>
                          setDraft({ ...draft, badge: isSelected ? '' : badge })
                        }
                        style={{
                          border: isSelected ? 'none' : '1px solid #e5e5e5',
                          borderRadius: '9999px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          backgroundColor: isSelected ? '#1d1d1f' : 'transparent',
                          color: isSelected ? '#ffffff' : '#6e6e73',
                          cursor: 'pointer',
                          transition: 'background-color 200ms ease, color 200ms ease',
                          fontFamily: 'inherit',
                        }}
                      >
                        {badge}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '24px',
                borderTop: '1px solid #e5e5e5',
                marginTop: '24px',
              }}
            >
              <button
                onClick={resetDraft}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#6e6e73',
                  fontFamily: 'inherit',
                  padding: '4px 0',
                }}
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                style={{
                  backgroundColor: '#1d1d1f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d1d1f'
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
