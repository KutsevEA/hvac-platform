'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white/90 backdrop-blur-sm border-b border-[#e5e5e5]">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Left: branding */}
        <Link href="/" style={{ textDecoration: 'none' }} className="flex flex-col justify-center">
          <span
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#1d1d1f',
              fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
              lineHeight: 1.2,
            }}
          >
            HVAC Clearance
          </span>
          <span
            style={{
              fontSize: '12px',
              color: '#6e6e73',
              fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
              lineHeight: 1.4,
              marginTop: '2px',
            }}
          >
            Updated regularly
          </span>
        </Link>

        {/* Right: Contact button */}
        <a
          href="mailto:counterburnaby@master.ca"
          style={{
            border: '1px solid #1d1d1f',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1d1d1f',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'background-color 200ms ease, color 200ms ease',
            fontFamily: 'system-ui, -apple-system, Inter, sans-serif',
            textDecoration: 'none',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget
            btn.style.backgroundColor = '#1d1d1f'
            btn.style.color = '#ffffff'
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget
            btn.style.backgroundColor = 'transparent'
            btn.style.color = '#1d1d1f'
          }}
        >
          Contact
        </a>
      </div>
    </header>
  )
}
