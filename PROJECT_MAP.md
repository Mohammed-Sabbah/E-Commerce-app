# PROJECT MAP — E-Commerce App

> Last updated: June 2026
> Next.js 16.2.1 · React 19.2.4 · Express 4.21.2 · MongoDB 8.14

---

## TECH_STACK

### Frontend

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 16.2.1 | App Router |
| UI Library | React | 19.2.4 | Server Components by default |
| Language | TypeScript | ^5 | Strict mode |
| Styling | Tailwind CSS | ^4 | Utility-first + CSS modules |
| State (Server) | Tanstack React Query | ^5.91.3 | Cart, wishlist, orders data |
| State (Client) | Redux Toolkit | ^2.11.2 | authSlice + wishlistSlice only |
| Forms | react-hook-form | ^7.72.0 | + zod validation |
| Icons | lucide-react | ^0.576.0 | Consistent icon set |
| UI Primitives | shadcn/ui (radix) | — | Button, Card, Carousel, Table, Tabs |
| Carousel | embla-carousel-react | ^8.6.0 | Lightweight carousel |
| HTTP Client | axios | ^1.13.6 | Single apiClient instance |
| Charts | recharts | ^3.8.1 | For dashboard (to be added) |
| Testing | Vitest + Testing Library | ^4.1.9 | To be set up |
| i18n | next-intl | ^4.13.0 | To be set up |
| Payment | Lahza (custom) | — | Checkout integration |
| Analytics | @vercel/analytics | ^2.0.1 | Vercel Analytics |
| Performance | @vercel/speed-insights | ^2.0.0 | Vercel Speed Insights |

### Backend

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Runtime | Node.js | — | Express server |
| Framework | Express | ^4.21.2 | REST API |
| Database | MongoDB + Mongoose | ^8.14.2 | ODM with schemas |
| Auth | JWT (jsonwebtoken) | ^9.0.2 | Cookie-based |
| Validation | express-validator | ^7.2.1 | Request validation |
| Payments | Stripe | ^18.1.0 | Webhook-based |
| OAuth | Passport (Google + Facebook) | ^0.7.0 | Social login |
| Email | nodemailer | ^7.0.3 | Transactional emails |
| Security | helmet + xss-clean + mongo-sanitize + hpp + rate-limit | — | Full middleware stack |
| File Upload | multer + sharp | ^2.0.2 + ^0.34.1 | Image processing |
| Compression | compression | ^1.8.0 | Gzip (level 6, threshold 1KB) |
| Utilities | slugify, uuid, toobusy-js, morgan | — | Supporting libs |

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ Next.js   │  │ React    │  │ Redux    │  │ Tanstack    │ │
│  │ App Router│  │ Query    │  │(auth+    │  │ React Query │ │
│  │ (SSR/SSG) │  │ (cache)  │  │ wishlist)│  │ (cart/etc)  │ │
│  └────┬─────┘  └──────────┘  └──────────┘  └──────┬──────┘ │
│       │                                            │        │
│       └─────────────── NEXT_PUBLIC_API_URL ─────────┘        │
└──────────────────────────┬──────────────────────────────────-┘
                           │ HTTPS + Cookie (token)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS API SERVER                        │
│                                                              │
│  Middleware Stack (in order):                                │
│  cookieParser → compression → passport → webhook(routes)    │
│  → rateLimit(auth) → cors → helmet → morgan → urlencoded   │
│  → json → toobusy → hpp → mongo-sanitize → xss-clean       │
│  → static → passport.init → routes → globalErrorHandler     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes (/api/v1/)                                    │   │
│  │  auth | users | products | categories | subCategories │   │
│  │  brands | reviews | cart | orders | wishlist          │   │
│  │  addresses | coupons | payment | admin                │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  Controller Pattern:    ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controller.js (Generic Factory)                     │   │
│  │  getAll() / getOne() / createOne() /                 │   │
│  │  updateOne() / deleteOne()                           │   │
│  │  + Custom Controllers (Auth, Cart, Order, Admin)     │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │  Mongoose Models                                      │   │
│  │  User, Product, Category, SubCategory, Brand,         │   │
│  │  Review, Cart, Order, Coupon, Address                 │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         ▼                                    │
│                    ┌──────────┐                              │
│                    │ MongoDB  │                              │
│                    └──────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

---

## SYSTEM_FLOW

### 1. Authentication Flow

```
Browser                          Next.js                        Express API
  │                                │                               │
  │  GET /login                    │                               │
  │──────────────────────────────►│                               │
  │                                │                               │
  │  POST /api/v1/auth/login       │                               │
  │  { email, password }           │                               │
  │─────────────────────────────────────────────────────────────►│
  │                                │            verify credentials │
  │                                │            generate JWT       │
  │                                │     set cookie: token=JWT     │
  │◄─────────────────────────────────────────────────────────────│
  │                                │                               │
  │  Stores cookie                 │                               │
  │  (httpOnly, secure)            │                               │
  │                                │                               │
  │  Subsequent requests           │                               │
  │  → cookie sent automatically   │                               │
  │─────────────────────────────────────────────────────────────►│
  │                                │   authMiddleware.protect()    │
  │                                │   verify JWT → req.user       │
  │◄─────────────────────────────────────────────────────────────│
```

### 2. Cart + Coupon Flow

```
  ┌──────────┐       ┌───────────┐       ┌────────────┐
  │ Coupon   │       │ Checkout  │       │ Express    │
  │ Input.tsx│       │ Client    │       │ API        │
  │ (BROKEN) │       │           │       │            │
  └────┬─────┘       └─────┬─────┘       └──────┬─────┘
       │                   │                     │
       │  "SAVE10"         │   POST /cart        │
       │  (hardcoded)      │──────────────────►  │
       │                   │                     │
       │                   │   POST /cart/       │
       │                   │   applyCoupon       │
       │                   │──────────────────►  │
       │                   │                     │──  BUG: no null check
       │                   │                     │──  BUG: no expiry check
       │                   │                     │──  BUG: cart.save() no await
```

### 3. Admin Dashboard Flow

```
  ┌──────────────┐       ┌──────────────┐       ┌─────────────────┐
  │ admin/page   │       │ middleware.ts │       │ AdminController │
  │ (Server      │       │               │       │ getAdminStats() │
  │  Component)  │       │               │       │                 │
  └──────┬───────┘       └──────┬────────┘       └────────┬────────┘
         │                      │                         │
         │  GET /admin          │                         │
         │─────────────────────►│                         │
         │                      │  Check token cookie     │
         │                      │─────────────────────►  │
         │                      │◄────────────────────── │
         │  SSR fetch           │                         │
         │──────────────────────────────────────────────►│
         │                      │        Promise.all([    │
         │                      │          countOrders,   │
         │                      │          sumRevenue,    │
         │                      │          groupByStatus, │
         │                      │          countUsers,    │
         │                      │          countProducts, │
         │                      │          recentOrders   │
         │                      │        ])               │
         │◄──────────────────────────────────────────────│
         │                      │                         │
         │  Render stats +      │                         │
         │  status breakdown +  │                         │
         │  recent orders       │                         │
```

### 4. API Route Map

| Prefix | Auth | Controller Pattern | Notes |
|--------|------|-------------------|-------|
| `/auth` | Public | Custom | Login, register, forgotPassword, OAuth |
| `/users` | Protected | Generic + Custom | CRUD + profile, addresses |
| `/products` | Public | Generic | Filtered, sorted, paginated |
| `/categories` | Public | Generic | CRUD |
| `/subCategories` | Public | Generic | CRUD |
| `/brands` | Public | Generic | CRUD |
| `/reviews` | Protected | Generic | Product reviews |
| `/cart` | Protected | Custom | Add, remove, update, clear, coupons |
| `/orders` | Protected | Custom | Create, list, status |
| `/coupons` | Admin | Generic | CRUD |
| `/wishlist` | Protected | Custom | Add/remove products |
| `/addresses` | Protected | Generic | User addresses |
| `/payment` | Protected | Custom | Stripe + Lahza |
| `/admin` | Admin | Custom | Stats dashboard |

---

## CURRENT STATE ANALYSIS

### ✅ Working Correctly
- Authentication (login, register, OAuth, JWT cookie)
- Product browsing with filtering, sorting, pagination
- Cart CRUD operations
- Order placement (cash + card via Lahza)
- Security middleware stack (helmet, rate-limit, sanitize, xss, hpp)
- Generic Controller factory pattern

### 🔴 Critical Bugs (Fix Immediately)

- Admin CRUD for products, categories, brands, coupons, users  ... has to be checked on 

| # | File | Issue | Severity |
|---|------|-------|----------|
| 1 | `backend/fix-admin.js` | Hardcoded admin password script → DELETE before deploy | **Security** |
| 2 | `backend/controllers/CartController.js:161` | `applyCouponOnCart`: no null check on coupon → crash 500 on invalid code | **Financial** |
| 3 | `backend/controllers/CartController.js:161` | No expiry check (`coupon.expire`) → expired coupons accepted | **Financial** |
| 4 | `backend/controllers/CartController.js:166` | `cart.save()` without await → race condition | **Financial** |
| 5 | `backend/middlewares/ErrorMiddleware.js:60` | `CastError(error);` missing `error =` assignment → no user-friendly message | **Medium** |
| 6 | `frontend/components/checkoutComponents/CouponInput.tsx` | Hardcoded "SAVE10" → zero API integration | **Feature broken** |

### 🗑️ Dead Code to Delete
- `frontend/store/slices/cartSlice.ts` — empty file, not registered in store
- `backend/models/Category.js:25` — `console.log("photo:", doc.photo)` in post-init hook
- `frontend/app/products/page.tsx:40` — `console.log(productsData)`
- `frontend/components/ProductDetailesPage/ProductGallery.tsx:19` — `console.log("coverImage:", images)`
- `frontend/components/Sections/CategoriesSection/CategoriesCarousel.tsx:9` — `console.log(categoriesDocs)`

### 🔁 Code Duplication to Unify
- `formatDate()` — duplicated in 6 files → extract to `lib/utils.ts`
- `STATUS_STYLES` record — duplicated in 3 files → extract to `constants/orders.ts`
- Order ID truncation (`#${id.slice(-6).toUpperCase()}`) — duplicated in 2 files → extract to `lib/utils.ts`

### 📊 Performance Issues
- `Order.js:69` — `pre(/^find/)` hook auto-populates user + cartItems on ALL queries → unnecessary on list queries
- `Order.js` — no index on `user` field (unlike Cart model)

---

## FEATURE EXECUTION PLAN

### Phase 1: Fix Coupons (Current)

**Backend** (`CartController.js:applyCouponOnCart`):
- Add null check: if no coupon found → throw CustomError
- Add expiry check: if `coupon.expire < now` → throw CustomError
- Fix `cart.save()` → `await cart.save()`

**Frontend** (`CouponInput.tsx`):
- Replace hardcoded "SAVE10" with real API call: `POST /api/v1/cart/applyCoupon`
- Handle loading, error, and success states
- Wire into cart recalculation via React Query invalidation

**Cleanup** (same phase):
- Delete `fix-admin.js`
- Remove all `console.log` from production code
- Delete empty `cartSlice.ts`
- Extract `formatDate`, `STATUS_STYLES`, order ID truncation to shared modules
- Fix `ErrorMiddleware.js` CastError assignment

### Phase 2: Dashboard Development

**Backend** — Extend `AdminController.getAdminStats`:
```
Current (6 metrics):           Proposed additions:
├── totalOrders                ├── monthlyRevenue (last 12 months)
├── totalRevenue               ├── topSellingProducts (top 10)
├── ordersByStatus             ├── categorySales
├── totalUsers                 ├── averageOrderValue
├── totalProducts              ├── lowStockProducts (< threshold)
└── recentOrders               └── dailyNewUsers (last 30 days)
```

**Frontend** — Dashboard redesign:
- Install `recharts` ^3.8.1 for charts
- Revenue trend: `<AreaChart>` (monthly)
- Orders by status: `<PieChart>` or `<BarChart>`
- Top products: `<BarChart>` horizontal
- Category sales: `<PieChart>`
- Stat cards: keep existing layout, add AOV + low stock
- Use `AdminResourceClient.tsx` pattern for consistency

### Phase 3: i18n (Arabic/English)

**Setup** — next-intl v4.13.0:
- Install `next-intl`
- Configure `i18n/request.ts` with Arabic + English locales
- Create middleware for locale detection (cookie > accept-language > default)
- Add locale switcher to Header

**Translation files:**
- `messages/en.json` — extract all current English strings
- `messages/ar.json` — Arabic translations
- RTL support: Tailwind RTL classes + `dir="rtl"` on `<html>`

**Migration approach** (safe, incremental):
1. Wrap layout with `NextIntlClientProvider`
2. Migrate pages one-by-one, starting with public pages (products, cart, checkout)
3. Then admin dashboard
4. No mixing — each page is either fully migrated or not

### Phase 4: PWA (Deferred — revisit later)

### Phase 5: Testing Infrastructure

- Vitest ^4.1.9 + @testing-library/react
- Configure `vitest.config.ts` with Next.js compatibility
- Start with: `CouponInput.test.tsx`, `CartController.test.js`
- Backend integration tests with Supertest

---

## PROJECT STRUCTURE

```
e-commerce-app/
├── backend/
│   ├── app.js                    # Express app + middleware stack
│   ├── server.js                 # Entry point
│   ├── config.env                # Environment variables
│   ├── controllers/
│   │   ├── Controller.js         # Generic CRUD factory
│   │   ├── AdminController.js    # Dashboard stats
│   │   ├── AuthController.js     # Login, register, OAuth
│   │   ├── CartController.js     # Cart + coupons
│   │   ├── OrderController.js    # Order management
│   │   └── ...                   # Other controllers
│   ├── models/                   # Mongoose schemas (10 models)
│   ├── routes/                   # Express routes (15 route files)
│   ├── middlewares/              # Auth, error, upload, validation
│   └── utils/                    # CustomError, JWTs, QueryManipulater
│
├── frontend/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (admin)/admin/        # Admin dashboard + CRUD pages
│   │   ├── (auth)/               # Login + register
│   │   └── ...                   # Public pages
│   ├── components/               # React components (26 directories)
│   │   ├── Admin/                # Admin list components
│   │   ├── checkoutComponents/   # Checkout flow
│   │   └── ui/                   # shadcn primitives
│   ├── store/                    # Redux (auth + wishlist)
│   ├── services/                 # API service layer
│   │   ├── client/               # Client-side (Tanstack Query)
│   │   └── server/               # Server-side (SSR fetch)
│   ├── types/                    # TypeScript interfaces
│   ├── lib/                      # Utilities, apiClient, queryClient
│   └── hooks/                    # Custom React hooks
│
└── PROJECT_MAP.md                # ← This file
```

---

## ARCHITECTURAL PRINCIPLES

1. **Simplicity First**: Minimum code to solve the problem. No premature abstraction.
2. **Separation of Concerns**: Services layer isolates API logic from UI components.
3. **Error Handling Uniformity**: Backend uses `asyncErrorHandler` + `CustomError` everywhere.
4. **Type Safety**: TypeScript strict mode. Shared types in `types/`.
5. **Performance**: Server Components by default, client components only when interactivity needed.
6. **No Dead Code**: Console logs, empty files, orphan scripts removed before deployment.
7. **Reusability**: Extract duplicated logic to shared modules (`lib/utils.ts`, `constants/`).

---

## DECISIONS LOG

| Date | Decision | Rationale |
|------|----------|-----------|
| Jun 2026 | recharts for dashboard charts | React-native, SVG-based, Tree-shakeable, works with React 19 |
| Jun 2026 | next-intl for i18n | Official App Router support, TypeScript-first, performs static extraction |
| Jun 2026 | Vitest > Jest | Faster, Vite-native, compatible with Next.js 16 + TS 5 |
| Jun 2026 | Coupon fix first priority | Direct financial impact, broken feature, low effort |
| Jun 2026 | PWA deferred | Premature for current stage, revisit after i18n stabilization |
