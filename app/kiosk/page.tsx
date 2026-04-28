'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'

interface Customer {
  id: string
  phone: string
  name: string
  company: string
  customerNo: string
  email: string
}

interface Session {
  id: string
  customerId: string
  customer: Customer
}

// ── Editable field ────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/50 uppercase tracking-widest text-xs">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-white/40 transition-colors placeholder-white/20"
        placeholder="—"
      />
    </div>
  )
}

// ── QR code SVG (static placeholder — replace src with real QR url) ───────────

function QRCode() {
  // Uses the kiosk URL itself as the check-in trigger via WhatsApp deep link.
  // In production replace this with a real QR pointing to your WhatsApp number.
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const link = `https://wa.me/${waNumber}?text=checkin`

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Simple SVG QR placeholder — swap for <Image> with real QR in production */}
      <div className="w-52 h-52 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`}
          alt="Scan to check in"
          width={192}
          height={192}
          className="rounded-xl"
        />
      </div>
      <div className="text-center">
        <p className="text-2xl font-semibold text-white">Welcome</p>
        <p className="text-white/50 text-sm mt-1">Scan the QR code with WhatsApp to check in</p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function KioskPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [form, setForm] = useState({ name: '', company: '', customerNo: '', email: '' })
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchActive = useCallback(async () => {
    const res = await fetch('/api/sessions?status=active&limit=1')
    if (!res.ok) return
    const data: Session[] = await res.json()
    if (data.length > 0) {
      const s = data[0]
      setSession(s)
      setForm({
        name: s.customer.name,
        company: s.customer.company,
        customerNo: s.customer.customerNo,
        email: s.customer.email,
      })
    } else {
      setSession(null)
    }
  }, [])

  useEffect(() => {
    fetchActive()
    pollRef.current = setInterval(fetchActive, 1500)

    const sb = getSupabase()
    const channel = sb
      .channel('kiosk-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Session' },
        fetchActive
      )
      .subscribe()

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      sb.removeChannel(channel)
    }
  }, [fetchActive])

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    if (!session) return
    saveTimer.current = setTimeout(async () => {
      await fetch(`/api/customers/${session.customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  async function handleSubmit() {
    if (!session) return
    await fetch(`/api/customers/${session.customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await fetch(`/api/sessions/${session.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    setSession(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-8">
      {!session ? (
        /* ── Idle state ── */
        <QRCode />
      ) : (
        /* ── Active state ── */
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <p className="text-xs text-white/30 font-mono mb-1">{session.customer.phone}</p>
            <h2 className="text-2xl font-semibold text-white">Complete your details</h2>
            <p className="text-white/40 text-sm mt-1">We&apos;ll keep them for next time</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={form.name} onChange={(v) => handleChange('name', v)} />
              <Field label="Company" value={form.company} onChange={(v) => handleChange('company', v)} />
              <Field label="Customer #" value={form.customerNo} onChange={(v) => handleChange('customerNo', v)} />
              <Field label="Email" value={form.email} onChange={(v) => handleChange('email', v)} />
            </div>

            <div className="flex items-center justify-between mt-2">
              {saved ? (
                <span className="text-xs text-emerald-400">Saved</span>
              ) : (
                <span />
              )}
              <button
                onClick={handleSubmit}
                className="ml-auto rounded-xl bg-white text-[#0a0a0f] font-semibold text-sm px-6 py-3 hover:bg-white/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
