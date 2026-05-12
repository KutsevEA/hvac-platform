# Systems Index

## Active Systems

### Product Showcase
Public-facing store for damaged/clearance HVAC equipment.
- Routes: `/`, `/products/[id]`
- Components: Header, FeaturedProduct, ProductCard, FilterBar, SkeletonCard
- Features: product grid, filters, image gallery (swipe), fullscreen lightbox, email CTA
- Hero block on main page is fully clickable (entire block navigates to product detail)
- **Product name:** `model` field is displayed as the primary product name in ProductCard and FeaturedProduct; search filter also matches on `model`
- **Header Contact button:** `<a href="mailto:counterburnaby@master.ca">` — opens mail app on mobile and desktop
- **Contact CTA:** Email (`counterburnaby@master.ca`) — temporary; WhatsApp code commented out pending Business account

### Admin Panel
Internal interface for managing products and images.
- Routes: `/admin`, `/admin/login`, `/admin/products/new`, `/admin/products/[id]/edit`
- Auth: httpOnly cookie (`admin_session`), protected by middleware.ts
- Features: product CRUD, image upload with progress (Supabase Storage in prod)

### Operator Dashboard
Real-time dashboard for managing WhatsApp customer check-ins.
- Route: `/operator`
- Tech: Supabase Realtime (postgres_changes on Session + Customer tables)
- Features: session cards, inline editable fields (auto-save 1.5s debounce), finish session

### Kiosk
Tablet interface for customer self-registration.
- Route: `/kiosk`
- Tech: Supabase Realtime + 1500ms polling
- States: idle (QR code → wa.me link), active (customer form with auto-save)

### Identity & Access
Admin authentication system.
- Module: Authentication
- Component: Login (`/admin/login`)
- Mechanism: POST /api/admin/auth sets httpOnly cookie; middleware.ts validates it

## Planned Systems

(none)
