# AI Frontend Design Instructions

## 1. Mandatory Technology Stack

- Next.js App Router
- JavaScript only — no TypeScript
- React
- HTML5 semantic markup
- Tailwind CSS
- Native Fetch API
- Next.js Metadata API
- Next.js Route Handlers for the temporary mock API only

The frontend must be independently deployable and must communicate with the backend exclusively through the API service layer.

## 2. Design Direction

Create a premium fashion-commerce experience inspired by the reference website's collection-oriented navigation, product cards, promotional banners, and fashion photography.

Do not copy the reference site's logo, proprietary assets, or exact branding. Use approved project branding and licensed or supplied product imagery.

### Visual principles

- Editorial fashion layout.
- Large, high-quality product and campaign photography.
- Clean typography and generous whitespace.
- Neutral backgrounds with strong product imagery.
- Clear pricing, sale labels, and calls to action.
- Consistent spacing and alignment.
- Minimal decorative effects.
- Responsive navigation and shopping controls.

### Suggested design tokens

Treat these as initial proposals and adjust to supplied brand assets.

- Primary background: white or warm off-white.
- Primary text: near-black.
- Secondary text: neutral gray.
- Borders: light gray.
- Sale indicators: restrained red.
- Primary buttons: dark background with light text.
- Body font: a clean sans-serif.
- Headings: a refined sans-serif with clear hierarchy.

Use consistent Tailwind design tokens rather than arbitrary styling throughout the application.

## 3. Shared Site Layout

### Announcement bar

- Optional campaign or delivery announcement.
- Must be configurable and dismissible if appropriate.

### Header

- Brand logo.
- Desktop navigation for men, women, lifestyle, new arrivals, and sale.
- Search control.
- Account access.
- Wishlist icon only if wishlist is approved.
- Cart icon with item count.
- Responsive mobile menu.

### Footer

- Customer service links.
- About and company information.
- Shipping, exchange, privacy, terms, and FAQ links.
- Contact details supplied by the project owner.
- Social links where configured.
- Payment information where supported.

Do not use the reference website's contact information as the new project's own contact details.

## 4. Homepage

Build the following sections when supported by supplied requirements and content:

1. Campaign hero banners with prominent calls to action.
2. Men's and women's collection entry points.
3. New arrivals.
4. Featured products or curated collections.
5. Seasonal or campaign promotions.
6. Optional lifestyle collection.
7. Optional editorial content.
8. Footer with customer support and policy links.

Requirements:

- Hero buttons must navigate to valid routes.
- Product cards must use actual API data.
- Use responsive image ratios appropriate to the content.
- Avoid excessive carousels.
- Add skeletons or other loading states when data is loading.
- Render important public content on the server when appropriate for SEO.

## 5. Product Listing Page

Include:

- Breadcrumbs.
- Category title and optional description.
- Result count.
- Sort selector.
- Filters for price, category, size, color, and stock where supported.
- Responsive product grid.
- Product image, name, current price, original price when discounted, and sale label where applicable.
- Pagination or a documented progressive-loading approach.
- Clear empty and error states.
- Filter chips and a reset option when appropriate.

Filters and sorting must reflect the API contract. Do not simulate filtering only in the UI if the contract requires server-side filtering.

## 6. Product Details Page

Include:

- Product image gallery.
- Product name.
- Current and original prices where applicable.
- Discount label when valid.
- Availability.
- Size and color selectors.
- Quantity selector.
- Add-to-cart button.
- Size guide.
- Product description and specifications.
- Fabric and care instructions when provided.
- Model information when available.
- Related products when supported.

Rules:

- A required variant must be selected before adding to the cart.
- Out-of-stock variants cannot be purchased.
- Quantity must not exceed available inventory.
- Variant changes must update price, availability, and images when those properties differ.
- Show clear feedback after adding to the cart.
- Use a product-specific URL and metadata.

## 7. Cart Page

Include:

- Product thumbnail and name.
- Selected size and color.
- Unit price and quantity.
- Line subtotal.
- Quantity controls and remove action.
- Coupon entry if supported.
- Estimated shipping when available.
- Subtotal, discount, shipping, and total.
- Continue-shopping and checkout actions.

All displayed totals must be consistent with the latest API responses. The frontend must not be the authority for final prices.

## 8. Checkout Page

Include:

- Contact information.
- Customer name and phone.
- Email where required.
- Shipping area and address.
- Order note if supported.
- Coupon summary if supported.
- Order item summary.
- Subtotal, discounts, shipping, and final total.
- Required policy agreement.
- Available payment methods.

Requirements:

- Support guest checkout if approved.
- Validate input and show accessible errors.
- Prevent duplicate submissions.
- Do not claim a payment succeeded unless the backend or payment provider confirms it.
- For the mock API, clearly treat checkout and payment as simulations.
- Redirect to an order confirmation page only after a successful mock or real API response.

## 9. Authentication Pages

Create registration, login, logout handling, and password recovery screens if included in the approved requirements.

- Use accessible forms.
- Show useful validation messages.
- Handle expired sessions and unauthorized API responses.
- Do not store sensitive tokens in insecure browser storage without an explicitly approved security design.
- Do not treat frontend route protection as a substitute for backend authorization.

## 10. Admin Dashboard

The admin area is a proposed project feature.

Include:

- Protected dashboard layout.
- Sidebar navigation.
- Summary cards for orders, products, and relevant business metrics.
- Product table with search and filters.
- Product create/edit form.
- Category management.
- Variant and inventory management.
- Order listing and order details.
- Order status controls.
- Loading, empty, error, and success states.

Admin screens must use the same documented API contract and mock API as the storefront. Hide or disable controls the current role is not allowed to use, but always rely on backend authorization for actual enforcement.

## 11. SEO Requirements

- Use Next.js Metadata API.
- Create unique titles and descriptions.
- Use canonical URLs where appropriate.
- Add Open Graph metadata.
- Provide a sitemap and robots.txt.
- Use semantic HTML.
- Use descriptive product names and image alt text.
- Ensure public product and category content is rendered in HTML.
- Use stable, readable URLs.
- Do not index private account, checkout, or admin pages.
- Avoid duplicate indexable URLs caused by sorting and filtering.
- Do not invent structured data values; use only accurate product and availability data.

## 12. Responsive Design

Test:

- Small mobile screens.
- Large mobile screens.
- Tablets.
- Desktop screens.
- Wide desktop screens.

Ensure menus, product grids, filters, galleries, cart controls, and checkout forms remain usable on touch devices.

## 13. Component Quality

- Use reusable components.
- Keep UI components separate from API calls.
- Use centralized API service functions.
- Avoid unnecessary client-side state management libraries.
- Use server components by default and client components only when interaction requires them.
- Do not use fake buttons or dead links.
- Do not place mock data directly inside UI components.
- Use JavaScript only.

## 14. Completion Criteria

Every page must match its approved requirements, use the API service layer, display realistic loading and error states, and work with the temporary mock API.

Do not mark a screen complete simply because it looks correct. Test its interactions.




=============================================


# DESIGN.md — Global Fashion-Commerce Design System & Experience Guidelines

## 1. Brand Vision & Aesthetic Philosophy

The application embodies an **Editorial Minimalist Fashion** aesthetic. Every screen must feel like a curated print lookbook combined with an effortless, high-precision shopping utility.

### Core Visual Principles
* **Photography First:** Product and campaign photography is the primary visual anchor. All UI chrome (borders, buttons, labels, navigation) must step back so imagery commands immediate attention.
* **Architectural Whitespace:** Generous breathing room between sections, cards, and typographic blocks signals luxury and clarity. Avoid crowding viewports with dense widgets or promotional clutter.
* **Crisp Structural Geometry:** Use sharp corners and ultra-thin hairline dividers rather than soft rounded cards, heavy drop shadows, or floating glass effects.
* **Restrained Motion:** Transitions must be subtle, fast, and purposeful (smooth opacity crossfades, crisp drawer slides, subtle hover underlines). Avoid bouncy animations, auto-playing carousels, or distracting scroll effects.
* **Absolute Brand Integrity:** Use only approved project branding, typography, contact details, and supplied/licensed imagery. Never copy proprietary logos, brand names, or contact data from reference inspirations.

---

## 2. Global Design Tokens

Use consistent design tokens across every storefront and admin screen rather than arbitrary one-off values.

### 2.1 Color System

| Token Role | Suggested Value | Visual Intent & Usage |
| :--- | :--- | :--- |
| **Primary Canvas** | `#FAF9F6` (Warm Off-White) | Main page background across the storefront to create a soft, gallery-like warmth without harsh glare. |
| **Elevated Surface** | `#FFFFFF` (Pure White) | Navigation bars, drawers, modals, input backgrounds, summary panels, and admin data tables. |
| **Subtle Surface** | `#F3F2EE` (Soft Stone Gray) | Image loading placeholders, skeleton blocks, secondary editorial banners, and inactive states. |
| **Primary Ink** | `#111111` (Near-Black) | Primary headings, body copy, product titles, current regular prices, and active navigation states. |
| **Secondary Muted** | `#686763` (Neutral Warm Gray) | Breadcrumbs, secondary descriptions, captions, fabric specifications, SKU codes, and crossed-out original prices. |
| **Hairline Border** | `#E4E3DF` (Light Warm Gray) | Structural 1px dividers, table borders, inactive input borders, and section separators. |
| **Active Border** | `#111111` (Near-Black) | Selected size/color variant frames, focused input fields, and active filter tabs. |
| **Sale & Promotional** | `#9E2A2B` (Editorial Crimson) | Discount badges, sale navigation highlights, and discounted current prices. |
| **In-Stock / Success** | `#1B4332` (Deep Forest Green) | Available inventory indicators, order confirmation alerts, and applied coupon feedback. |
| **Low-Stock / Warning** | `#B45309` (Warm Amber) | Scarcity indicators (e.g., low remaining stock) and pending fulfillment badges. |
| **Error / Destructive** | `#991B1B` (Deep Red) | Form validation messages, out-of-stock warnings, and destructive admin actions. |

### 2.2 Typography System

* **Heading Font Family:** A refined geometric or editorial sans-serif with strong architectural proportions.
* **Body & UI Font Family:** A clean, highly legible grotesque sans-serif.
* **Numeric Alignment:** Enable tabular numerals across all prices, quantities, discount percentages, order totals, and admin metrics so numbers align vertically and never jitter when updated.

| Typographic Tier | Sizing & Weight | Tracking & Line Height | Application |
| :--- | :--- | :--- | :--- |
| **Campaign Display** | `36px` mobile → `60px` desktop, Medium (500) | Tight tracking (`-0.02em`), tight line height (`1.08`) | Hero banner headlines and major seasonal lookbook titles. |
| **Page / Category Title** | `24px` mobile → `36px` desktop, Medium (500) | Tight tracking (`-0.015em`), line height (`1.15`) | Collection headers, major section titles, and checkout headings. |
| **Product Detail Title** | `20px` mobile → `26px` desktop, Regular/Medium (400–500) | Normal tracking, line height (`1.25`) | Primary product name on the Product Details Page. |
| **Section Subheading** | `18px` → `22px`, Medium (500) | Normal tracking, line height (`1.3`) | Feature blocks, cart summary headers, and admin card titles. |
| **Eyebrow / Navigation / CTA** | `11px` → `12px`, Medium/Semi-Bold (500–600) | Wide uppercase tracking (`0.12em` – `0.16em`) | Main navigation links, button labels, kickers, and table column headers. |
| **Body Primary** | `14px` → `16px`, Regular (400) | Normal tracking, relaxed line height (`1.6`) | Product descriptions, editorial storytelling, and form inputs. |
| **Body Secondary / Meta** | `12px` → `14px`, Regular (400) | Normal tracking, line height (`1.5`) | Breadcrumbs, care instructions, model fit notes, and footer links. |
| **Micro Badge** | `10px` → `11px`, Semi-Bold (600) | Uppercase tracking (`0.1em`), line height (`1.0`) | Sale tags, sold-out overlays, and status pills. |

### 2.3 Spacing, Grid & Geometry

* **Max Container Width:** `1440px` centered with responsive outer padding (`16px` on mobile, `24px` on tablet, `40px` on desktop).
* **Vertical Section Rhythm:** `48px` on mobile, `64px` on tablet, and `96px` on desktop between major page sections.
* **Corner Radius:** `0px` (sharp editorial corners) for all images, product cards, buttons, drawers, and inputs.
* **Borders & Dividers:** `1px` solid hairline borders (`#E4E3DF`) to define structure instead of drop shadows.
* **Standard Aspect Ratios:**
  * **Product Photography (Cards & Galleries):** `3:4` vertical portrait ratio. Images must fill the frame cleanly with top-centered alignment and a subtle neutral background fill while loading.
  * **Collection Entry Tiles:** `4:5` vertical portrait ratio.
  * **Campaign Hero Banners:** `4:5` vertical ratio on mobile viewports; `16:9` or `21:9` widescreen ratio on desktop viewports.

---

## 3. Global UI Component Design Instructions

### 3.1 Buttons & Calls to Action
* **Primary Button:** Solid near-black background (`#111111`) with off-white/white uppercase tracked text. Hovering subtly lightens the background to dark charcoal.
* **Secondary Button:** Transparent or white background with a `1px` solid near-black border and near-black text. Hovering inverts the fill to near-black with white text.
* **Disabled State:** Soft stone gray fill (`#F3F2EE`) with muted gray text (`#686763`) and a non-interactive cursor. Never allow clicks on disabled actions.
* **Touch Targets:** Minimum `44px` height (ideally `48px` for primary purchase actions) to ensure effortless tapping on mobile devices.

### 3.2 Form Inputs, Selectors & Validation
* **Text Inputs & Dropdowns:** Clean rectangular boxes (`48px` height) with `1px` light gray borders that transition to solid near-black on focus. Use `16px` minimum font size on mobile inputs to prevent automatic browser zoom.
* **Labels:** Always display persistent, visible labels above input fields in uppercase tracked micro-typography. Never rely solely on disappearing placeholder text.
* **Accessible Error States:** Invalid fields display a crimson border and a clear, human-readable error explanation directly underneath the field, announced cleanly to screen readers.

### 3.3 Loading, Empty & Error States
* **Geometric Skeletons:** Whenever content is loading, display pulsing neutral stone-gray (`#F3F2EE`) blocks that match the exact proportions of the incoming content (`3:4` rectangles for product cards, thin bars for titles and prices) to prevent layout shift.
* **Empty States:** When a collection filter, search query, or shopping cart is empty, present a calm, centered editorial message explaining why it is empty alongside a single prominent action button to recover (e.g., "Reset Filters" or "Explore New Arrivals").
* **Error States:** If data cannot be retrieved, show a polite, non-technical status message with a clear "Try Again" trigger.

---

## 4. Shared Site Layout Instructions

### 4.1 Announcement Bar
* Full-width top strip in high-contrast dark background with light uppercase micro-copy for campaigns or delivery thresholds.
* Configurable visibility with an optional, accessible close button that remembers dismissal for the session.

### 4.2 Header & Navigation
* **Sticky Behavior:** Remains pinned at the top of the viewport (`64px` height on mobile, `80px` on desktop) with a subtle bottom hairline border.
* **Desktop Layout:** Balanced three-zone structure:
  1. **Primary Navigation:** Clean horizontal links for **Men**, **Women**, **Lifestyle**, **New Arrivals**, and **Sale** (highlighted in editorial crimson).
  2. **Brand Identity:** Centered or left-anchored project wordmark/logo.
  3. **Utility Controls:** Search trigger, Account access, Wishlist icon (displayed strictly if wishlist functionality is enabled in scope), and Cart trigger with a live numeric item badge.
* **Mobile Navigation:** Collapses category links into a full-height slide-out drawer with generous touch rows (`48px` minimum height per link) while keeping Brand Logo, Search, and Cart accessible in the top bar.

### 4.3 Footer
* Structured multi-column editorial grid separated from main content by a `1px` hairline border.
* **Columns:** Brand summary and project-owner supplied contact details, Shopping category links, Customer service & policy links (Shipping, Exchange, Privacy, Terms, FAQ), Social links (when configured), and supported Payment Method badges.

---

## 5. Storefront Page Design Instructions

### 5.1 Homepage
Design a rhythmic vertical sequence of editorial and merchandising blocks:
1. **Campaign Hero:** High-impact photography with clear typographic hierarchy (Eyebrow, Display Title, Subtitle) and prominent CTA buttons that navigate to active collection pages.
2. **Collection Entry Points:** Side-by-side (`2-column` on desktop, stacked on mobile) large portrait visuals for Men's and Women's collections with clear overlay or bottom-aligned titles.
3. **New Arrivals Grid:** A clean 4-column desktop (`2-column` mobile) grid of the latest products with a direct "View All" link.
4. **Featured / Curated Collections:** Highlighted seasonal capsules or bestsellers presented in a balanced product grid without excessive carousels.
5. **Promotional Banner & Optional Editorial/Lifestyle Block:** A split image-and-text storytelling block highlighting seasonal promotions or lifestyle pieces.

### 5.2 Product Card (Global Merchandising Unit)
* **Visual Area:** `3:4` portrait image container. On desktop pointer hover, smoothly crossfade to a secondary angle or model shot if available.
* **Status Overlay:** Top-left micro-badge inside the image frame. Display "Sold Out" in dark ink if inventory is zero, or a percentage discount badge (e.g., `-20%`) in crimson if on sale.
* **Information Area:** Left-aligned below the image with tight vertical spacing:
  * Product name in a single clean line or two-line clamp that underlines on hover.
  * Pricing row showing current price in primary ink (or crimson when discounted) beside the crossed-out original price in muted gray.

### 5.3 Product Listing Page (PLP)
* **Header Zone:** Breadcrumb trail, Category Title, and an optional concise editorial description.
* **Control Bar:** Sticky or prominent horizontal bar displaying total result count, active filter chips with individual remove triggers and a "Clear All" reset option, a Filter Drawer/Sidebar trigger, and a Sort dropdown (Featured, Newest, Price Low-to-High, Price High-to-Low).
* **Filtering Experience:** Filter controls for Category, Price range, Size, Color swatches, and In-Stock availability. Applying filters or sorting must synchronize with the page URL and reflect actual server-side results.
* **Product Grid & Pagination:** Responsive grid (`2` columns on mobile, `3` on tablet, `4` on desktop) followed by clean pagination or progressive load controls.

### 5.4 Product Details Page (PDP)
* **Split Desktop Layout:** Left `60%` dedicated to the product image gallery; Right `40%` dedicated to a sticky product information and purchase panel.
* **Gallery Behavior:** Desktop displays a scrollable editorial 2-column image grid or a large main stage with a vertical thumbnail rail. Mobile displays a touch-friendly horizontal swipe gallery with a subtle image counter.
* **Purchase Panel Hierarchy:**
  1. Breadcrumbs and Product Name.
  2. Price display (current price, original price if discounted, and discount label) paired with an explicit stock availability badge.
  3. **Color Selector:** Swatch buttons indicating the active color name. Changing color immediately updates the gallery imagery, price, and stock status if they differ by variant.
  4. **Size Selector & Size Guide:** Grid of size boxes alongside a "Size Guide" modal trigger. Unavailable sizes must appear visually crossed-out and disabled.
  5. **Quantity Stepper:** Increment/decrement control strictly capped at available variant inventory.
  6. **Add-to-Cart Action:** Prominent full-width primary button. Requires a valid size/color selection before activation, prevents purchasing out-of-stock variants, and triggers immediate visual confirmation (such as a slide-out mini-cart drawer or toast notification) upon success.
  7. **Structured Details:** Clean collapsible accordions for Product Description & Specifications, Fabric & Care Instructions, Model Information (height and size worn), and Shipping/Exchange policies.
* **Bottom Cross-Sell:** Related products section presented in a standard 4-column product grid.

### 5.5 Cart Page
* **Two-Column Desktop Layout:** Item list on the left (`65%`), sticky Order Summary panel on the right (`35%`).
* **Line Item Row:** Displays product thumbnail (`3:4`), product title linking back to the PDP, selected color and size labels, unit price, quantity stepper (capped by stock), calculated line subtotal, and an explicit remove action.
* **Summary Panel:** Includes a coupon code entry field (when supported), item subtotal, active discount deduction, estimated shipping cost, and the authoritative final total, followed by "Proceed to Checkout" and "Continue Shopping" actions.

### 5.6 Checkout Page
* **Distraction-Free Layout:** Simplified header and a two-column split (Customer & Shipping details on the left; persistent Order Summary on the right).
* **Simulation Banner:** When operating in a demo or mock environment, display a clear, unmistakable notice stating that orders and payments are simulated.
* **Form Flow:**
  1. **Contact Information:** Customer full name, phone number, and email (supporting guest checkout seamlessly when approved).
  2. **Delivery Details:** Shipping area/zone selector (which dynamically updates shipping charges), full street address, and optional order notes.
  3. **Payment Method:** Clear selectable cards for supported payment options.
  4. **Policy Consent:** Mandatory checkbox confirming agreement to Terms, Privacy, and Exchange policies.
  5. **Submission Protection:** The final "Place Order" button must lock immediately upon click to prevent duplicate submissions and only navigate to the Order Confirmation screen after receiving a confirmed success state.

### 5.7 Authentication Screens
* Centered, calm single-column cards (`440px` max width) surrounded by generous whitespace for Login, Registration, and Password Recovery.
* Clear inline validation, password visibility toggles, and helpful session-expired alerts when redirected from protected areas.

---

## 6. Admin Dashboard Design Instructions

The Admin interface uses the **same typographic and color palette** as the storefront, adapted for high-density operational clarity.

* **Dashboard Shell:** Fixed dark or bordered left navigation sidebar, top status header showing the active user role and a quick link to view the live storefront, and a clean light-canvas workspace.
* **Role-Based UI Clarity:** Controls or destructive actions that the current user role is not authorized to perform must be visually hidden or disabled with explanatory tooltips.
* **Executive Overview:** Summary metric cards at the top (Orders, Revenue, Active Products, Low Inventory Alerts) using large tabular numerals.
* **Data Tables (Products, Categories, Orders):** Clean horizontal hairlines, sticky column headers, instant search bar, status filter pills, and clear pagination.
* **Product & Variant Management Form:** Structured multi-card editor covering core details, media ordering, category assignment, and a clear Variant Matrix where administrators manage per-size and per-color stock counts and pricing.
* **Order Detail & Fulfillment View:** Displays customer contact info, shipping destination, itemized line summary, payment status, and a prominent Order Status control with confirmation feedback.

---

## 7. Responsive & Touch Usability Standards

| Device Tier | Target Width | Layout & Ergonomic Rules |
| :--- | :--- | :--- |
| **Small Mobile** | `320px – 389px` | 2-column product grid with tight `12px` gaps; full-width stacked buttons; collapsible filter and navigation drawers. |
| **Large Mobile** | `390px – 767px` | 2-column product grid with `16px` gaps; horizontal swipe PDP gallery; minimum `44px × 44px` touch targets on all icons and steppers. |
| **Tablet** | `768px – 1023px` | 3-column product grid; slide-over drawers for filters and admin sidebar; balanced 2-column cart and checkout summaries. |
| **Desktop** | `1024px – 1439px` | 4-column product grid; full horizontal top navigation; sticky PDP buy-box and persistent admin sidebar. |
| **Wide Desktop** | `1440px+` | Locked `1440px` maximum content width centered in the viewport with generous editorial margins. |

---

## 8. SEO, Accessibility & Quality Assurance Rules

* **Semantic Structure:** Use proper HTML landmarks (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`) and strict heading hierarchy (a single `H1` per page followed by logical `H2` and `H3` subsections).
* **Search Engine Visibility:** Public pages (Homepage, Collections, Product Details) must render complete, descriptive titles, meta descriptions, canonical links, Open Graph tags, and accurate product availability metadata. Private routes (Cart, Checkout, Account, Admin) must be strictly excluded from search indexing.
* **Visual Accessibility:** Maintain strong text contrast (`#111111` on `#FAF9F6` / `#FFFFFF`), supply descriptive alternative text for all product and campaign imagery, and ensure every interactive control is operable via keyboard with a visible focus ring.
* **Interactive Completeness:** Every button, link, filter chip, variant selector, and form control must perform a genuine, verifiable interaction with complete loading, success, empty, and error feedback.