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
  status: string
  locked: boolean
  notes: string
  createdAt: string
  customer: Customer
}

// ── Inline editable field ────────────────────────────────────────────────────

function InlineField({
  label,
  value,
  onSave,
}: {
  label: string
  value: string
  onSave: (v: string) => void
}) {
  const [local, setLocal] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setLocal(value) }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocal(e.target.value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onSave(e.target.value), 1500)
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
      <input
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
        value={local}
        onChange={handleChange}
      />
    </div>
  )
}

// ── Session card ─────────────────────────────────────────────────────────────

function SessionCard({
  session,
  onFinish,
  onUpdate,
}: {
  session: Session
  onFinish: () => void
  onUpdate: (customerId: string, patch: Partial<Customer>) => void
}) {
  const age = Math.floor((Date.now() - new Date(session.createdAt).getTime()) / 60000)
  const ageLabel = age < 1 ? 'just now' : age < 60 ? `${age}m ago` : `${Math.floor(age / 60)}h ago`

  async function save(field: keyof Customer, val: string) {
    await fetch(`/api/customers/${session.customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: val }),
    })
    onUpdate(session.customerId, { [field]: val })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-white/40 font-mono">{session.customer.phone}</div>
          <div className="text-white/60 text-xs mt-0.5">{ageLabel}</div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wide">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InlineField label="Name" value={session.customer.name} onSave={(v) => save('name', v)} />
        <InlineField label="Company" value={session.customer.company} onSave={(v) => save('company', v)} />
        <InlineField label="Customer #" value={session.customer.customerNo} onSave={(v) => save('customerNo', v)} />
        <InlineField label="Email" value={session.customer.email} onSave={(v) => save('email', v)} />
      </div>

      <button
        onClick={onFinish}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm py-2.5 transition-all"
      >
        Finish session
      </button>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function OperatorPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    const res = await fetch('/api/sessions?status=active')
    if (res.ok) {
      const data = await res.json()
      setSessions(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSessions()

    const sb = getSupabase()
    const channel = sb
      .channel('operator-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Session' },
        () => fetchSessions()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Customer' },
        () => fetchSessions()
      )
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [fetchSessions])

  async function finishSession(id: string) {
    await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  function updateCustomerLocal(customerId: string, patch: Partial<Customer>) {
    setSessions((prev) =>
      prev.map((s) =>
        s.customerId === customerId ? { ...s, customer: { ...s.customer, ...patch } } : s
      )
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Operator Dashboard</h1>
          <p className="text-xs text-white/40 mt-0.5">Active WhatsApp check-ins</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
          <span className="ml-3 text-sm font-semibold text-white/80">{sessions.length}</span>
          <span className="text-xs text-white/30">active</span>
        </div>
      </header>

      {/* Body */}
      <main className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/20">
            <div className="text-5xl mb-4">📭</div>
            <div className="text-sm">No active sessions</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onFinish={() => finishSession(s.id)}
                onUpdate={updateCustomerLocal}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
