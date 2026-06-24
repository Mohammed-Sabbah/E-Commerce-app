# E-Commerce App — Project Context

## Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tanstack Query, Tailwind CSS, recharts, lucide-react, axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Monorepo:** backend/ + frontend/ in root

## Current Phase: ✅ Phase 2 — Admin Dashboard (Complete)

### What was built
- **Dashboard** (`/admin`): 4 stat cards + Revenue area chart + Orders bar chart + Status donut chart + Top products horizontal bar chart (recharts)
- **Orders** (`/admin/orders`): Filter tabs, status dropdown (any status), pay/deliver buttons, ConfirmDialog, pagination, per-row loading
- **Products** (`/admin/products`): Search, inline edit/create, category/brand dropdowns (fixed ID bug), pagination, ConfirmDialog
- **Users** (`/admin/users`): Search, activate/deactivate, delete with confirmation, pagination
- **Coupons** (`/admin/coupons`): Create/edit inline, date picker (timezone-safe), pagination, ConfirmDialog
- **Categories & Brands** (`/admin/categories`, `/admin/brands`): Search, inline edit with image upload, pagination, ConfirmDialog

### Admin auth
- Middleware (`middleware.ts`) + Layout (`(admin)/layout.tsx`) — JWT cookie check + role verification
- `adminFetch.ts` — shared server-side fetch with token forwarding + error handling
- `apiClient` (axios) — client-side API calls

### Backend Admin endpoints
- `GET /api/v1/admin/stats` — totalOrders, totalRevenue, ordersByStatus, totalUsers, totalProducts, recentOrders, monthlyRevenue[], monthlyOrders[], topProducts[]
- `PATCH /api/v1/orders/:id/status` — admin can set any order status

### Shared components
- `ConfirmDialog.tsx` — native `<dialog>` with Escape/click-outside dismiss
- `Pagination.tsx` — page buttons with ellipsis
- `LoadingSkeleton.tsx` — animated pulse rows

## Next: 
- **i18n** (next-intl) — planned
- **PWA** — deferred

## Critical Context
- Coupon flow: validate via `POST /api/v1/coupons/validate`, apply at order creation (`couponCode` in `POST /api/v1/orders`)
- Cart auto-clears on successful order via `queryClient.invalidateQueries`
- Coupon from cart → checkout via `?coupon=CODE` URL param
