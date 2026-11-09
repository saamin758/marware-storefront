# Product Requirement Document (PRD)

## Fashion E-Commerce Platform Inspired by Ecstasy BD

**Document status:** Initial specification\
**Project type:** Fashion e-commerce storefront and administration platform\
**Reference website:** [https://ecstasybd.com/](https://ecstasybd.com/)\
**Target market:** Bangladesh\
**Currency:** Bangladeshi Taka (BDT / ৳)

## 1. Project Overview

Build a responsive fashion e-commerce platform inspired by the public shopping experience of Ecstasy BD. The platform will allow customers to discover clothing and lifestyle products, view product details, select available sizes and colors, add products to a cart, place orders, and track their purchases.

Administrators will manage products, categories, variants, inventory, pricing, discounts, and orders through a protected dashboard.

This is a new implementation. Do not assume access to the reference website's internal APIs, database, source code, or administrative system.

## 2. Objectives

- Create a premium, modern fashion-shopping experience.
- Make product discovery simple through categories, search, filtering, and sorting.
- Support products with multiple sizes, colors, images, and stock levels.
- Provide a reliable cart and checkout experience.
- Support guest checkout and registered customer accounts.
- Allow administrators to manage the store without editing source code.
- Implement SEO-friendly public product and category pages.
- Separate the frontend from the backend through a documented REST API contract.
- Enable independent frontend and backend development.

## 3. Target Audience

### Shoppers

- Guests browsing products without an account.
- Registered customers who manage their profiles and orders.
- Mobile and desktop users shopping for fashion and lifestyle products.

### Administrators

- Authorized staff responsible for catalog management, inventory, discounts, and order processing.
- Administrators with permission to manage staff accounts and privileged settings, if required.

## 4. Product Categories

Support configurable categories and subcategories.

Initial reference-inspired categories:

- Men's clothing: shirts, T-shirts, polo shirts, Panjabi, trousers, jeans, chinos, joggers, jackets, footwear, and accessories.
- Women's clothing: tops, shirts, dresses, Kameez, Kurti, co-ord sets, trousers, skirts, and seasonal clothing.
- Lifestyle: bags, wallets, perfumes, sunglasses, and other configured accessories.
- New arrivals.
- Sale and discounted products.
- Gift vouchers, if included in the approved business scope.

Categories must be data-driven rather than hardcoded into page components.

## 5. Functional Requirements

### Product discovery

- Browse products by category and subcategory.
- Search by product name and supported keywords.
- Filter by category, price, size, color, availability, and discount where applicable.
- Sort by newest, price, and other explicitly supported criteria.
- Paginate or progressively load product listings.
- Show sale prices and original prices when a valid discount exists.

### Product details

- Display product name, images, description, price, and availability.
- Display selectable size and color options.
- Display variant-specific stock availability.
- Allow quantity selection within stock limits.
- Show product specifications, fabric, care instructions, and sizing information when available.
- Add a valid selected variant to the cart.

### Shopping cart

- Add, remove, and update cart items.
- Display selected variants and quantities.
- Recalculate subtotals when quantities change.
- Display applicable discounts and estimated shipping.
- Prevent invalid quantities and unavailable variants.
- Preserve the cart according to the agreed guest and account persistence strategy.

### Checkout and orders

- Support guest checkout.
- Collect customer name, phone, email when required, delivery area, and full address.
- Support order notes and coupon codes if enabled.
- Display a final price breakdown.
- Support Cash on Delivery where configured.
- Support online payment through an approved provider when configured.
- Show order confirmation and a unique order reference.
- Allow registered users to view their order history and order details.

### Customer accounts

- Register, log in, and log out.
- Support secure authentication using JWT.
- View and update permitted profile fields.
- View orders associated with the authenticated account.
- Support password recovery if included in the approved authentication scope.

### Administration

- View dashboard summaries.
- Create, edit, publish, unpublish, and archive products.
- Manage categories and subcategories.
- Manage product images and variants.
- Update variant-level inventory.
- Manage prices and discounts.
- View, filter, and search orders.
- Update order status according to permitted transitions.
- View customer and order information according to role permissions.
- Maintain audit history for important administrative actions where required.

## 6. Non-Functional Requirements

- Next.js App Router frontend using JavaScript only.
- Tailwind CSS for styling.
- Separate Express.js backend.
- REST API using JSON.
- Relational SQL database.
- Responsive mobile-first design.
- SEO-friendly server-rendered or statically rendered public pages.
- Accessible controls, keyboard navigation, and clear form validation.
- Secure server-side authorization and input validation.
- No secrets or privileged credentials in frontend code.
- Predictable API error responses.
- Automated tests for important business workflows.
- Production-ready logging, configuration, and deployment documentation.

## 7. Project Boundaries

The frontend implementation AI will build the Next.js frontend and a temporary mock API using Next.js Route Handlers.

A separate backend implementation AI will build the actual Express.js backend using the same API contract.

The mock API is for development and testing only. It must not be treated as production infrastructure.

## 8. Success Criteria

- All approved public pages render and navigate correctly.
- Product search, filtering, variant selection, and cart operations work.
- Checkout produces a mock order confirmation during frontend development.
- Administrative screens work against the mock API.
- All API calls follow the agreed contract.
- Public pages have appropriate metadata and render important content for search engines.
- Tests cover the primary shopper and administrator workflows.
- The frontend can connect to the real backend without rewriting UI components.

## 9. Assumptions Requiring Approval

- Guest checkout is supported.
- Cash on Delivery is supported.
- Online payment is optional until a payment provider is selected.
- Shipping fees, delivery zones, exchange rules, and return policies must be configured from approved business requirements.
- Wishlist, customer reviews, gift vouchers, loyalty points, and promotional campaigns are optional unless explicitly approved.
- The administration dashboard is a new proposed feature, not a verified representation of the reference site's private admin interface.
