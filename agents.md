# E-Commerce App — Project Context

## Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tanstack Query, Tailwind CSS, recharts, lucide-react, axios, sonner
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Monorepo:** backend/ + frontend/ in root
- **Package manager:** pnpm (not npm)
- **Images:** Cloudinary (not local uploads)
- **Typecheck:** `pnpm typecheck` = `tsc --noEmit`

---

## Phase 1 — Core E-Commerce (Complete)

- Product listing, detail page, cart, checkout, wishlist, auth (login/register), account pages
- Coupon validation via `POST /api/v1/coupons/validate`, applied at order creation (`couponCode` in `POST /api/v1/orders`)
- Cart auto-clears on successful order via `queryClient.invalidateQueries`
- Coupon from cart → checkout via `?coupon=CODE` URL param
- Star rating + review system

---

## Phase 2 — Admin Dashboard (Rebuilt)

### Pages
- **Dashboard** (`/admin`): 4 stat cards + Revenue area chart + Orders bar chart + Status donut chart + Top products horizontal bar chart (recharts)
- **Orders** (`/admin/orders`): Filter tabs, status dropdown (all statuses), pay/deliver buttons, ConfirmDialog, pagination, per-row loading
- **Products** (`/admin/products`): Search, **modal-based create/edit** (ProductFormModal), multi-image gallery upload, category/brand dropdowns, pagination
- **Users** (`/admin/users`): Search, activate/deactivate, delete with confirmation, pagination
- **Coupons** (`/admin/coupons`): Create/edit inline (useMutation), date picker (timezone-safe), pagination, ConfirmDialog
- **Categories & Brands** (`/admin/categories`, `/admin/brands`): Search, inline edit with unified FileInput + image removal, Cloudinary upload, pagination, ConfirmDialog

### Admin auth
- Middleware (`middleware.ts`) + Layout (`(admin)/layout.tsx`) — JWT cookie check + role verification
- `adminFetch.ts` — shared server-side fetch with token forwarding + error handling
- `apiClient` (axios) — client-side API calls

### Backend Admin endpoints
- `GET /api/v1/admin/stats` — totalOrders, totalRevenue, ordersByStatus, totalUsers, totalProducts, recentOrders, monthlyRevenue[], monthlyOrders[], topProducts[]
- `PATCH /api/v1/orders/:id/status` — admin can set any order status

### Shared components
- `ConfirmDialog.tsx` — native `<dialog>` with Escape/click-outside dismiss + `loading` prop for mutation state
- `Pagination.tsx` — page buttons with ellipsis
- `LoadingSkeleton.tsx` — animated pulse rows
- `ProductFormModal.tsx` — dialog-based form for product create/edit

---

## Phase 3 — Polish & Infrastructure (Complete)

### Cloudinary migration
- Created `backend/config/cloudinary.js` — Cloudinary SDK config + storage engine
- Replaced `backend/middlewares/uploadImagesMiddleware.js` — now uses Cloudinary storage (not local disk)
- Updated all controllers: Product, Brand, Category, SubCategory, User — uploads go to Cloudinary
- Removed `express.static("uploads")` from backend
- Added `res.cloudinary.com` to `next.config.ts` → `images.remotePatterns` (fixes 400 on Vercel)

### Toast notification system (sonner)
- `sonner` installed via pnpm
- `<Toaster position="top-right" richColors />` in `frontend/app/providers.tsx`
- All CRUD operations across admin use `toast.success` / `toast.error`
- No inline error banners anywhere in admin panel
- Orders: success in `onSuccess` (not `onSettled`) to prevent duplicate toasts

### Product form → modal
- New `ProductFormModal.tsx` — `<dialog>`-based form with same fields as old inline form
- FileInput + MultiImageInput sub-components inside modal
- Spinner on save button during mutation
- `AdminProductsClient.tsx` — inline form removed, replaced by modal trigger

### Coupons refactor
- `handleSave` / `handleDelete` → `saveMutation` / `deleteMutation` (useMutation)
- Matches the pattern used by Brands & Categories

### Image handling
- Unified FileInput: single "Remove" button for both new file and current photo
- Brand/Category `editCurrentPhoto` state + sends `photo: ""` on removal
- Product gallery: `resizeMixImages` merges `existingImages` JSON with new uploads
- MultiImageInput component in product form (max 5 extra images)
- ProductDetailesComponent shows combined coverImage + images gallery
- Image dedup fixed with `Set` instead of simple filter

### Other
- `pnpm-lock.yaml` and `pnpm-workspace.yaml` tracked (pnpm is the package manager)
- `tsc --noEmit` passes clean after every batch

---

## Next Steps (Planned)
1. **Tests** — Vitest + React Testing Library (priority, learning goal)
2. **i18n** — next-intl (after tests)
3. **PWA** — deferred
