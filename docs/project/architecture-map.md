# Architecture Map — HVAC Platform

## Route Structure

```
HVAC Platform (Next.js 14, App Router)
├── Public
│   ├── / (Product Showcase)
│   └── /products/[id] (Product Detail)
├── Admin (protected by middleware)
│   ├── /admin (Product List)
│   ├── /admin/login
│   ├── /admin/products/new
│   └── /admin/products/[id]/edit
├── Operations
│   ├── /operator (Operator Dashboard — realtime)
│   └── /kiosk (Tablet Kiosk — QR + form)
└── API
    ├── /api/products (GET, POST)
    ├── /api/products/[id] (GET, PUT, DELETE)
    ├── /api/upload (POST)
    ├── /api/admin/auth (POST, DELETE)
    ├── /api/sessions (GET)
    ├── /api/sessions/[id] (PATCH)
    ├── /api/customers/[id] (PATCH)
    └── /api/webhook/whatsapp (GET verify, POST process)
```

## Data Flow — WhatsApp Check-in

```
Customer sends WhatsApp message
        ↓
/api/webhook/whatsapp (POST)
        ↓
Upsert Customer (by phone)
Create Session (status=active)
        ↓
Supabase Realtime broadcasts change
        ↓
/operator — new session card appears
/kiosk    — switches from idle to form
```

## Database Schema

```
Product   — clearance HVAC equipment listings
Customer  — registered customers (unique by phone)
Session   — WhatsApp check-in sessions (active | completed)
```

## Systems

```
Project: HVAC Platform
├── System: Product Showcase
│   ├── Module: Public Store (/, /products/[id])
│   └── Module: Admin Panel (/admin/*)
├── System: Operations
│   ├── Module: Operator Dashboard (/operator)
│   └── Module: Kiosk (/kiosk)
├── System: Messaging
│   └── Module: WhatsApp Webhook (/api/webhook/whatsapp)
└── System: Identity & Access
    └── Module: Authentication (/admin/login)
```

## Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Hosting, auto-deploy from GitHub main |
| Supabase PostgreSQL | Production database |
| Supabase Storage | Product images (bucket: products) |
| Supabase Realtime | Live updates for operator + kiosk |
| WhatsApp Business API | Inbound messages → sessions (webhook built; Business account pending) |
| Email (mailto) | Temporary customer contact CTA → counterburnaby@master.ca |
