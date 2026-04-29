# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

A production **HVAC clearance equipment platform** with multiple interfaces:
- Public product showcase (customers browse and contact via WhatsApp)
- Admin panel (manage products, upload images)
- Operator dashboard (real-time WhatsApp check-in management)
- Kiosk (tablet self-registration with QR code)

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma + Supabase.

## Development Commands

```bash
npm run dev          # Start dev server (uses SQLite locally)
npm run build        # prisma generate + next build
npx prisma db push   # Push schema changes to database
npx prisma studio    # Browse database
```

## Local vs Production

| | Local | Production |
|---|---|---|
| Database | SQLite (`prisma/dev.db`) | Supabase PostgreSQL |
| Storage | `public/uploads/` | Supabase Storage (bucket: `products`) |
| Realtime | Mock (no Supabase keys needed) | Supabase Realtime |

Switch database: change `prisma/schema.prisma` provider between `sqlite` and `postgresql`.
Switch storage: set `USE_SUPABASE_STORAGE=true` in env (absent = local).

## Key Architecture

```
app/
├── page.tsx                        # Public showcase
├── products/[id]/page.tsx          # Product detail + WhatsApp CTA
├── admin/                          # Protected by middleware.ts
│   ├── page.tsx                    # Product list
│   ├── login/page.tsx
│   └── products/[new|[id]/edit]/
├── operator/page.tsx               # Dark realtime dashboard
├── kiosk/page.tsx                  # QR code + customer form
└── api/
    ├── products/                   # CRUD
    ├── upload/                     # Image upload (dual-mode)
    ├── admin/auth/                 # Cookie auth
    ├── sessions/                   # WhatsApp sessions
    ├── customers/[id]/             # Customer PATCH
    └── webhook/whatsapp/           # Meta webhook
```

## Database Models

- `Product` — clearance HVAC equipment listings
- `Customer` — unique by phone number
- `Session` — WhatsApp check-in (status: active | completed)

## WhatsApp Flow

1. Customer scans QR on kiosk → opens wa.me link → sends message
2. Meta sends POST to `/api/webhook/whatsapp`
3. Customer upserted, Session created (status=active)
4. Supabase Realtime notifies `/operator` and `/kiosk`
5. Operator edits customer info inline; kiosk shows customer form
6. Operator clicks "Finish session" → status=completed → kiosk returns to idle

## Environment Variables

See `.env.example` for all required variables. Key ones:
- `DATABASE_URL` — Supabase PostgreSQL pooler URL
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Realtime (client-side)
- `SUPABASE_SERVICE_ROLE_KEY` — Storage uploads (server-side)
- `USE_SUPABASE_STORAGE=true` — enables Supabase Storage (absent = local files)
- `WHATSAPP_VERIFY_TOKEN` — Meta webhook verification token
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_SECRET` — admin auth

## Orchestrator/Agent Model

For new features: orchestrator reads `docs/project/` → decomposes into tasks in `docs/tasks/tasks-index.md` → spawns agents in parallel → updates docs after completion.

Architecture reference: `docs/project/architecture-map.md`
