# Frontend Engineering Rules & Complete Implementation System
# Workspace Rule: .agents/rules/frontend_rules.md

> **STANDING INSTRUCTION FOR AI AGENT**:
> These rules govern the entire project and must be strictly adhered to at all times.
> You must automatically consult and utilize the workspace skill **`ecommerce-design-md`** (`.agents/skills/ecommerce-design-md/SKILL.md`) and treat all project specification documents (`PRD.md`, `DESIGN.md`, `USER_FLOWS.md`, `AUTHORIZATION.md`, `DATABASE_SCHEMA.md`, `API_CONTRACT.md`, `SECURITY.md`, and `SEO.md`) as authoritative sources of truth.

---

## 1. Skill Integration: `ecommerce-design-md`

You must actively reference and apply the guidelines from **[.agents/skills/ecommerce-design-md/SKILL.md](file:///c:/Users/saminpc/Desktop/18%20octorber/.agents/skills/ecommerce-design-md/SKILL.md)**:

1. **Editorial Restraint & High-Taste Aesthetics**:
   - Never generate generic, flat, or MVP-looking e-commerce layouts.
   - Avoid generic blue buttons and default gray cards.
   - Apply warm off-white canvases (`#FAF9F6`), sharp architectural corners (`rounded-none` / `0px`), hairline borders (`#E4E3DF`), and restrained editorial accents (`#9E2A2B` crimson for sales, `#111111` near-black for primary CTAs).
2. **Brand Token Grounding**:
   - Cross-reference the design tokens against the reference brands in `.agents/skills/ecommerce-design-md/references/` (e.g., `rouje_design.md` and `staud_design.md`).
   - Use the included script `node .agents/skills/ecommerce-design-md/scripts/fetch_brand_design.js` if additional brand references or category tokens are needed.
3. **Component Perfection**:
   - Implement authentic fashion e-commerce patterns: vertical `3:4` portrait product imagery, hover crossfades, sticky PDP buy-boxes with tabular numerals, swatch color selectors, crossed-out unavailable sizes, and full-screen or slide-over cart drawers.

---

## 2. Core Sources of Truth & Project Documents

Before implementing any feature, you must read, synthesize, and respect the project documents:

1. **[PRD.md](file:///c:/Users/saminpc/Desktop/18%20octorber/PRD.md)**: High-level vision, customer & admin objectives, fashion categories, functional scope, and acceptance criteria.
2. **[DESIGN.md](file:///c:/Users/saminpc/Desktop/18%20octorber/DESIGN.md)**: Visual identity, color palette, typography scale, spacing, aspect ratios (`3:4` portrait), component specifications, and responsive breakpoints.
3. **[USER_FLOWS.md](file:///c:/Users/saminpc/Desktop/18%20octorber/USER_FLOWS.md)**: Exact step-by-step journeys for product browsing, filtering, search, variant selection, cart updates, guest & customer checkout, authentication, and admin catalog/order operations.
4. **[AUTHORIZATION.md](file:///c:/Users/saminpc/Desktop/18%20octorber/AUTHORIZATION.md)**: Role structure (`guest`, `customer`, `admin`), permission matrix, session lifecycle, and backend authorization boundaries.
5. **[DATABASE_SCHEMA.md](file:///c:/Users/saminpc/Desktop/18%20octorber/DATABASE_SCHEMA.md)**: Relational tables (`users`, `categories`, `products`, `variants`, `orders`, `order_items`), fields, data types, UUIDs, and inventory rules.
6. **[API_CONTRACT.md](file:///c:/Users/saminpc/Desktop/18%20octorber/API_CONTRACT.md)** (or `API.md`): The canonical REST API contract (`/api/v1/...`). Endpoint paths, HTTP methods, request bodies, query parameters, response structures, status codes, and error formats.
7. **[SECURITY.md](file:///c:/Users/saminpc/Desktop/18%20octorber/SECURITY.md)**: Secure JWT handling, RBAC client route guards, form validation, XSS prevention, sensitive data redaction, and mock API simulation boundaries.
8. **[SEO.md](file:///c:/Users/saminpc/Desktop/18%20octorber/SEO.md)**: Next.js Metadata API, dynamic title/meta generation, JSON-LD Schema.org structured data, semantic `h1-h6` hierarchy, `robots.js`, and `sitemap.js`.

---

## 3. Mandatory Technology Stack & Boundaries

- **Framework**: Next.js with App Router
- **Language**: JavaScript only (`.js`, `.jsx`). **TypeScript is strictly prohibited.**
- **Library**: React
- **Styling**: Vanilla Tailwind CSS configured with tokens from `DESIGN.md` and the `ecommerce-design-md` skill.
- **HTTP Client**: Native `fetch()` API inside a centralized API service layer.
- **SEO & Metadata**: Next.js Metadata API, `robots.js`, and `sitemap.js`.
- **Mock Backend**: Next.js Route Handlers (`app/api/v1/.../route.js`) in JavaScript only.
- **Strict Boundary**: You must **NOT** build the real Express.js backend. The temporary mock backend exists solely to make the frontend fully testable and functional before integration.

---

## 4. Architectural Separation & Decoupling

Maintain strict architectural boundaries:
1. **UI Components & Pages** (`app/...`, `components/...`):
   - Pure UI presentation and user interaction.
   - **NEVER** import mock data directly into UI components.
   - **NEVER** call internal mock storage or mock handlers directly.
2. **Centralized API Service Layer** (`services/api/...`):
   - All network calls must pass through dedicated service functions using native `fetch()`.
   - Uses a configurable base URL (`process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'`).
   - Normalizes requests and responses according to `API_CONTRACT.md`.
3. **Temporary Mock API Route Handlers** (`app/api/v1/.../route.js`):
   - Reproduce the exact contract defined in `API_CONTRACT.md`.
   - Mock storage and seed data reside in a separate directory (`mocks/data/...`).
   - Provide realistic simulation for CRUD, filtering, pagination, validation errors, and auth tokens.
4. **Zero UI Rewrites for Real Backend Integration**:
   - Switching from the mock API to the external Express.js backend must require **only** updating `NEXT_PUBLIC_API_BASE_URL` in environment configuration.

---

## 5. End-to-End Implementation Roadmap (Build All at Once)

When commanded to execute or build the project, implement all layers systematically without omitting features:

### Step 1: Project Setup & Design Foundation
- Configure Next.js App Router and Tailwind CSS (`tailwind.config.js`).
- Inject design tokens from `DESIGN.md` and `ecommerce-design-md` into CSS variables and Tailwind theme:
  - Colors: Canvas (`#FAF9F6`), Surface (`#FFFFFF`), Stone (`#F3F2EE`), Ink (`#111111`), Muted (`#686763`), Border (`#E4E3DF`), Sale Crimson (`#9E2A2B`).
  - Radii: `0px` (`rounded-none`) across all cards, buttons, drawers, and inputs.
  - Aspect ratios: `3:4` portrait for product photography.
- Set up root layout (`app/layout.js`) with announcement bar, sticky header, mobile drawer, and multi-column footer.
- Build reusable UI primitives: `Button`, `Input`, `Select`, `Badge`, `Card`, `Modal`, `Accordion`, `Skeleton`, `EmptyState`.

### Step 2: Centralized API Service Layer
- Create `services/api/client.js` with unified error handling, JSON parsing, and Bearer token injection.
- Build domain services:
  - `services/api/catalog.js`: `getCategories()`, `getCategoryBySlug()`, `getProducts()`, `getProductBySlug()`.
  - `services/api/cart.js`: `getCart()`, `addToCart()`, `updateCartItem()`, `removeFromCart()`.
  - `services/api/orders.js`: `createOrder()`, `getOrders()`, `getOrderById()`.
  - `services/api/auth.js`: `login()`, `register()`, `logout()`, `getProfile()`.
  - `services/api/admin.js`: `getDashboardMetrics()`, `createProduct()`, `updateProduct()`, `updateOrderStatus()`.

### Step 3: Temporary Mock Backend (`app/api/v1/...`)
- Seed realistic fashion data matching `DATABASE_SCHEMA.md` and `API_CONTRACT.md` (Men's, Women's, and Lifestyle collections with sizes S/M/L/XL, colors, images, and prices in BDT).
- Implement route handlers:
  - `GET /api/v1/categories`, `GET /api/v1/categories/[slug]`
  - `GET /api/v1/products`, `GET /api/v1/products/[slug]`
  - `POST /api/v1/cart`, `PATCH /api/v1/cart/[itemId]`, `DELETE /api/v1/cart/[itemId]`
  - `POST /api/v1/orders`, `GET /api/v1/orders`, `GET /api/v1/orders/[id]`
  - `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me`
  - `GET /api/v1/admin/dashboard`, `POST /api/v1/admin/products`, `PATCH /api/v1/admin/orders/[id]/status`

### Step 4: Complete Storefront Pages & Workflows
- **Homepage (`app/page.js`)**: Campaign hero banner, collection tiles (Men, Women, Lifestyle), New Arrivals 4-column grid, seasonal promotions.
- **Product Listing Page (`app/collections/[slug]/page.js`)**: Breadcrumbs, category header, filters (category, price, size, color, in-stock), sort dropdown, 4-column grid with hover crossfades, empty/loading states, pagination.
- **Product Details Page (`app/products/[slug]/page.js`)**: Split layout (60% gallery, 40% sticky buy-box), color swatches, size grid with out-of-stock strike-throughs, quantity stepper, add-to-cart feedback, product details accordion.
- **Cart Page & Drawer (`app/cart/page.js`, `components/cart/CartDrawer.js`)**: Line items, quantity updates, coupon input, subtotal/shipping/total breakdown, proceed to checkout.
- **Checkout Page (`app/checkout/page.js`)**: Guest checkout support, BD phone validation, shipping zone calculation, payment selection (Cash on Delivery / Online Simulation), simulation banner, order placement confirmation.
- **Order Confirmation Page (`app/order-confirmation/[id]/page.js`)**: Order summary, reference code, delivery info.
- **Authentication Pages (`app/login/page.js`, `app/register/page.js`)**: Clean single-column forms with validation and redirect preservation.

### Step 5: Admin Dashboard (`app/admin/...`)
- Admin layout with sidebar navigation and role indicator.
- Metric cards (Orders, Revenue in ৳, Active Products, Low Stock alerts).
- Product management table with search, category filtering, and status badges.
- Product create/edit form with variant matrix (sizes, colors, stock, pricing).
- Order processing view with status transitions (`pending` -> `confirmed` -> `processing` -> `shipped` -> `delivered`).

### Step 6: SEO, Security & Quality Audit
- Implement `app/robots.js` and `app/sitemap.js` as defined in `SEO.md`.
- Dynamic metadata via `generateMetadata()` on product and category routes.
- Inject Schema.org JSON-LD (Product and BreadcrumbList) on PDP and PLP.
- Verify security boundaries: XSS escaping, no exposed secrets, client-side phone/email validation.
- Run `npm run build` to verify clean compilation with zero lint or runtime errors.

---

## 6. Execution Reporting & Quality Standard

At the conclusion of the build:
1. Provide a comprehensive summary of all directories and files created.
2. Confirm API contract coverage and mock backend status.
3. Confirm design fidelity against `DESIGN.md` and the `ecommerce-design-md` skill.
4. Report build status (`npm run build`) and step-by-step local run instructions (`npm run dev`).