# Database Schema Specification

## 1. Database Requirements

Use a relational SQL database. PostgreSQL is the proposed default.

The database must support:

- Product categories and subcategories.
- Products with multiple images.
- Size and color variants.
- Variant-level pricing and inventory.
- Registered users and customer accounts.
- Guest and registered-user orders.
- Order items with historical price snapshots.
- Order status and payment status.
- Product discounts and coupon codes if approved.

All primary keys use UUIDs. Use UTC timestamps for stored date/time values. Prices must use exact decimal or integer minor-unit representations, never floating-point types.

## 2. Users

Table: `users`

| Column            | Type         | Rules                                                                |
| ----------------- | ------------ | -------------------------------------------------------------------- |
| id                | UUID         | Primary key                                                          |
| full_name         | VARCHAR(150) | Required                                                             |
| email             | VARCHAR(255) | Nullable if phone-based registration is approved; otherwise required |
| phone             | VARCHAR(20)  | Nullable if not required for account creation                        |
| password_hash     | TEXT         | Required for password-based accounts                                 |
| role              | VARCHAR(30)  | `customer` or `admin`                                                |
| is_active         | BOOLEAN      | Default true                                                         |
| email_verified_at | TIMESTAMPTZ  | Nullable                                                             |
| created_at        | TIMESTAMPTZ  | Required                                                             |
| updated_at        | TIMESTAMPTZ  | Required                                                             |

Rules:

- Enforce unique normalized email addresses when provided.
- Define phone uniqueness according to the approved account policy.
- Never store plaintext passwords.
- Public registration must not permit assignment of the `admin` role.

## 3. Categories

Table: `categories`

| Column      | Type         | Rules                                 |
| ----------- | ------------ | ------------------------------------- |
| id          | UUID         | Primary key                           |
| parent_id   | UUID         | Nullable foreign key to categories.id |
| name        | VARCHAR(150) | Required                              |
| slug        | VARCHAR(180) | Unique                                |
| description | TEXT         | Nullable                              |
| image_url   | TEXT         | Nullable                              |
| sort_order  | INTEGER      | Default 0                             |
| is_active   | BOOLEAN      | Default true                          |
| created_at  | TIMESTAMPTZ  | Required                              |
| updated_at  | TIMESTAMPTZ  | Required                              |

Relationships:

- A category can have zero or more subcategories.
- A category can contain multiple products.
- A subcategory can reference a parent category.

## 4. Products

Table: `products`

| Column            | Type         | Rules                            |
| ----------------- | ------------ | -------------------------------- |
| id                | UUID         | Primary key                      |
| category_id       | UUID         | Foreign key to categories.id     |
| name              | VARCHAR(255) | Required                         |
| slug              | VARCHAR(280) | Unique                           |
| description       | TEXT         | Nullable                         |
| fabric            | VARCHAR(150) | Nullable                         |
| fit               | VARCHAR(100) | Nullable                         |
| care_instructions | TEXT         | Nullable                         |
| status            | VARCHAR(20)  | `draft`, `published`, `archived` |
| seo_title         | VARCHAR(255) | Nullable                         |
| seo_description   | VARCHAR(320) | Nullable                         |
| created_at        | TIMESTAMPTZ  | Required                         |
| updated_at        | TIMESTAMPTZ  | Required                         |

Rules:

- Public product queries return published products only.
- Archived products are not available for new purchases.
- Product details may include fit, fabric, care, and model information when supplied.
- Category relationships must be validated.

## 5. Product Images

Table: `product_images`

| Column     | Type         | Rules                               |
| ---------- | ------------ | ----------------------------------- |
| id         | UUID         | Primary key                         |
| product_id | UUID         | Foreign key to products.id          |
| variant_id | UUID         | Nullable foreign key to variants.id |
| image_url  | TEXT         | Required                            |
| alt_text   | VARCHAR(255) | Nullable                            |
| sort_order | INTEGER      | Default 0                           |
| is_primary | BOOLEAN      | Default false                       |

A product can have multiple images. Variant-specific images are optional.

## 6. Product Variants

Table: `variants`

| Column           | Type          | Rules                      |
| ---------------- | ------------- | -------------------------- |
| id               | UUID          | Primary key                |
| product_id       | UUID          | Foreign key to products.id |
| sku              | VARCHAR(100)  | Unique                     |
| size             | VARCHAR(50)   | Nullable                   |
| color            | VARCHAR(80)   | Nullable                   |
| price            | NUMERIC(12,2) | Required, nonnegative      |
| compare_at_price | NUMERIC(12,2) | Nullable                   |
| stock_quantity   | INTEGER       | Required, nonnegative      |
| is_active        | BOOLEAN       | Default true               |
| created_at       | TIMESTAMPTZ   | Required                   |
| updated_at       | TIMESTAMPTZ   | Required                   |

Rules:

- A product may have multiple variants.
- Inventory is tracked per variant.
- A product without size or color options can still have one default variant.
- The backend must reject purchases of inactive or unavailable variants.
- Price and stock validation must happen on the server.
- Prevent duplicate combinations of product, size, and color when applicable.
- A nullable size or color must be handled consistently by database constraints.

## 7. Orders

Table: `orders`

| Column           | Type          | Rules                                |
| ---------------- | ------------- | ------------------------------------ |
| id               | UUID          | Primary key                          |
| order_number     | VARCHAR(40)   | Unique                               |
| user_id          | UUID          | Nullable foreign key to users.id     |
| customer_name    | VARCHAR(150)  | Required                             |
| customer_email   | VARCHAR(255)  | Nullable according to checkout rules |
| customer_phone   | VARCHAR(20)   | Required                             |
| shipping_area    | VARCHAR(120)  | Required                             |
| shipping_address | TEXT          | Required                             |
| order_note       | TEXT          | Nullable                             |
| subtotal         | NUMERIC(12,2) | Required                             |
| discount_total   | NUMERIC(12,2) | Default 0                            |
| shipping_total   | NUMERIC(12,2) | Default 0                            |
| grand_total      | NUMERIC(12,2) | Required                             |
| order_status     | VARCHAR(30)   | Required                             |
| payment_method   | VARCHAR(30)   | Required                             |
| payment_status   | VARCHAR(30)   | Required                             |
| created_at       | TIMESTAMPTZ   | Required                             |
| updated_at       | TIMESTAMPTZ   | Required                             |

Suggested order statuses:

- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

Suggested payment statuses:

- `pending`
- `paid`
- `failed`
- `refunded`

Rules:

- Guest orders have a null `user_id`.
- Customer details must be snapshotted at purchase time.
- The backend calculates final totals from authoritative prices, stock, shipping rules, and discounts.
- Order status and payment status are separate.
- Only permitted transitions may be applied.
- Finalized order details must remain historically accurate even if the product changes later.

## 8. Order Items

Table: `order_items`

| Column         | Type          | Rules                      |
| -------------- | ------------- | -------------------------- |
| id             | UUID          | Primary key                |
| order_id       | UUID          | Foreign key to orders.id   |
| variant_id     | UUID          | Foreign key to variants.id |
| product_name   | VARCHAR(255)  | Required snapshot          |
| sku            | VARCHAR(100)  | Required snapshot          |
| selected_size  | VARCHAR(50)   | Nullable snapshot          |
| selected_color | VARCHAR(80)   | Nullable snapshot          |
| unit_price     | NUMERIC(12,2) | Required snapshot          |
| quantity       | INTEGER       | Positive                   |
| line_total     | NUMERIC(12,2) | Required                   |

Rules:

- Each item belongs to one order.
- One order can contain multiple items.
- Store the purchased name, SKU, variant options, and price as snapshots.
- Historical orders must not change when a product is renamed or repriced.

## 9. Relationships

- `categories.parent_id` → `categories.id`
- `products.category_id` → `categories.id`
- `product_images.product_id` → `products.id`
- `product_images.variant_id` → `variants.id`, nullable
- `variants.product_id` → `products.id`
- `orders.user_id` → `users.id`, nullable
- `order_items.order_id` → `orders.id`
- `order_items.variant_id` → `variants.id`

Use appropriate indexes for category slugs, product slugs, SKUs, product status, order numbers, order status, user order history, and frequently queried filters.

## 10. Recommended Additional Tables

These are proposed supporting tables rather than verified features of the reference website.

- `refresh_tokens` or server-side sessions, if required by the authentication design.
- `addresses` for saved customer addresses.
- `coupons` and `coupon_redemptions` if discounts are supported.
- `payments` for payment provider references and transaction status.
- `order_status_history` for auditability.
- `inventory_movements` for tracking stock changes.
- `reviews` if product reviews are approved.
- `wishlist_items` if wishlist functionality is approved.

## 11. Transaction and Inventory Requirements

Order creation must be transactional.

The backend must:

1. Validate all requested variants.
2. Verify current stock.
3. Recalculate prices, discounts, shipping, and totals.
4. Create the order and order items.
5. Reserve or decrement stock according to the agreed order/payment policy.
6. Prevent overselling during concurrent purchases.
7. Commit the transaction only if all required operations succeed.

Inventory restoration for cancellations, refunds, and failed payments must follow explicit business rules.

## 12. Migration and Integrity Requirements

- Use version-controlled database migrations.
- Define foreign keys and constraints.
- Use appropriate `ON DELETE` behavior.
- Preserve historical order records.
- Use transactions for multi-table operations.
- Seed development data separately from production data.
- Never rely on frontend validation to protect database integrity.
