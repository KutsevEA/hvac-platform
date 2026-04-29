# HVAC Platform

## Type
project

## Parent
none

## Status
Active — deployed to production (Vercel + Supabase)

## Purpose
A multi-interface platform for selling damaged/clearance HVAC equipment and managing customer check-ins via WhatsApp.

## Production URL
https://hvac-platform-eta.vercel.app

## Tech Stack
- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database:** PostgreSQL via Supabase (Prisma ORM)
- **Storage:** Supabase Storage (production) / local filesystem (dev)
- **Realtime:** Supabase Realtime (postgres_changes)
- **Deployment:** Vercel (auto-deploy from GitHub main branch)
- **Messaging:** WhatsApp Business API (Meta webhook)

## Systems

- **Product Showcase** — public-facing clearance equipment store
- **Admin Panel** — internal product management with image upload
- **Operator Dashboard** — real-time WhatsApp check-in management
- **Kiosk** — tablet interface for customer self-registration
- **Identity & Access** — cookie-based admin authentication

## Key Interfaces
| URL | Description |
|---|---|
| `/` | Public product showcase |
| `/products/[id]` | Product detail with gallery + WhatsApp CTA |
| `/admin` | Admin product list |
| `/admin/login` | Admin login |
| `/operator` | Operator dashboard (dark, realtime) |
| `/kiosk` | Tablet kiosk (QR code + customer form) |
| `/api/webhook/whatsapp` | WhatsApp Business API webhook |

## Notes
Architecture is modular — each interface is independent and can be extended without affecting others.
