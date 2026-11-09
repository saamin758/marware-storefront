# REST API Contract

## 1. Global Rules

### Base path

All endpoints use:

`/api/v1`

Development examples:

- Next.js mock API: `http://localhost:3000/api/v1`
- Express.js backend: `http://localhost:4000/api/v1`

The frontend must use an environment-configured API base URL.

### Content type

Requests and responses use JSON unless an endpoint explicitly specifies multipart file upload.

Standard request header:

`Content-Type: application/json`

Authenticated requests use the agreed session mechanism. If bearer tokens are selected:

`Authorization: Bearer <access_token>`

### Identifiers

All resource IDs are UUID strings.

### Pagination

List endpoints support pagination where applicable:

- `page`: positive integer, default 1.
- `limit`: positive integer, default 20, maximum 100.

Paginated response format:

{\
"success": true,\
"data": [],\
"meta": {\
"page": 1,\
"limit": 20,\
"total": 0,\
"totalPages": 0\
}\
}

### Standard error format

{\
"success": false,\
"error": {\
"code": "VALIDATION_ERROR",\
"message": "The request contains invalid fields.",\
"details": [\
{\
"field": "quantity",\
"message": "Quantity must be a positive integer."\
}\
]\
}\
}

`details` may be omitted when no field-specific errors exist.

### Standard status codes

- `200 OK`: successful retrieval or update.
- `201 Created`: successful resource creation.
- `204 No Content`: successful deletion where applicable.
- `400 Bad Request`: malformed or invalid request.
- `401 Unauthorized`: missing or invalid authentication.
- `403 Forbidden`: authenticated but not permitted.
- `404 Not Found`: resource does not exist or is not accessible.
- `409 Conflict`: duplicate resource, stock conflict, or invalid state transition.
- `422 Unprocessable Entity`: optional use for semantic validation errors, if consistently adopted.
- `429 Too Many Requests`: rate limit exceeded.
- `500 Internal Server Error`: unexpected server error.

Choose one consistent validation-status convention. The mock and Express APIs must use the same convention.

## 2. Public Catalog Endpoints

### GET `/categories`

Returns active public categories.

Optional query parameters:

- `parentId`
- `includeChildren`

Response:

{\
"success": true,\
"data": [\
{\
"id": "uuid",\
"parentId": null,\
"name": "Men",\
"slug": "men",\
"imageUrl": null,\
"children": []\
}\
]\
}

### GET `/categories/{slug}`

Returns a public category by slug.

Response:

{\
"success": true,\
"data": {\
"id": "uuid",\
"name": "Men",\
"slug": "men",\
"description": null,\
"parentId": null\
}\
}

### GET `/products`

Returns published products.

Supported query parameters:

- `page`
- `limit`
- `category`
- `search`
- `minPrice`
- `maxPrice`
- `size`
- `color`
- `inStock`
- `onSale`
- `sort`

Allowed `sort` values:

- `newest`
- `price_asc`
- `price_desc`
- `name_asc`

Unknown sorting options must be rejected or handled according to a documented consistent rule.

Response:

{\
"success": true,\
"data": [\
{\
"id": "uuid",\
"name": "Premium Casual Shirt",\
"slug": "premium-casual-shirt",\
"category": {\
"id": "uuid",\
"name": "Shirts",\
"slug": "shirts"\
},\
"primaryImage": {\
"url": "/mock-images/shirt.jpg",\
"alt": "Premium casual shirt"\
},\
"priceFrom": "1800.00",\
"priceTo": "2200.00",\
"compareAtPriceFrom": null,\
"inStock": true,\
"status": "published"\
}\
],\
"meta": {\
"page": 1,\
"limit": 20,\
"total": 1,\
"totalPages": 1\
}\
}

Prices are strings in decimal notation in JSON for consistency and exact financial representation. Currency is BDT. The backend must document whether listing prices represent the minimum available variant price or another agreed display price.

### GET `/products/{slug}`

Returns a public product and its active variants.

Response:

{\
"success": true,\
"data": {\
"id": "uuid",\
"name": "Premium Casual Shirt",\
"slug": "premium-casual-shirt",\
"description": "Product description",\
"fabric": "Cotton",\
"fit": "Regular Fit",\
"careInstructions": "Follow the garment label.",\
"images": [\
{\
"url": "/mock-images/shirt.jpg",\
"alt": "Front view of shirt"\
}\
],\
"variants": [\
{\
"id": "uuid",\
"sku": "SHIRT-BLK-M",\
"size": "M",\
"color": "Black",\
"price": "1800.00",\
"compareAtPrice": "2200.00",\
"stockQuantity": 5,\
"available": true\
}\
],\
"seo": {\
"title": "Premium Casual Shirt",\
"description": "Product description"\
}\
}\
}

Only published products and customer-visible variant data may be returned publicly. Internal inventory details should be minimized if the business does not want to expose exact stock quantities.

## 3. Authentication Endpoints

### POST `/auth/register`

Request:

{\
"fullName": "Customer Name",\
"email": "[customer@example.com](mailto:customer@example.com)",\
"phone": "01XXXXXXXXX",\
"password": "ExamplePassword123!"\
}

Response: `201 Created`

{\
"success": true,\
"data": {\
"user": {\
"id": "uuid",\
"fullName": "Customer Name",\
"email": "[customer@example.com](mailto:customer@example.com)",\
"role": "customer"\
}\
}\
}

Registration must never accept a user-supplied privileged role.

### POST `/auth/login`

Request:

{\
"email": "[customer@example.com](mailto:customer@example.com)",\
"password": "ExamplePassword123!"\
}

Response:

{\
"success": true,\
"data": {\
"user": {\
"id": "uuid",\
"fullName": "Customer Name",\
"email": "[customer@example.com](mailto:customer@example.com)",\
"role": "customer"\
}\
}\
}

Authentication credentials are established using the agreed cookie or token mechanism. Do not place secret refresh tokens in this response if the implementation uses secure HttpOnly cookies.

### POST `/auth/refresh`

Refreshes the authenticated session using the agreed refresh mechanism.

### POST `/auth/logout`

Terminates the current session and invalidates applicable refresh credentials.

### GET `/auth/me`

Returns the currently authenticated user's permitted profile and role information.

### POST `/auth/forgot-password`

Requests a password reset. Responses must not reveal whether an email address is registered.

### POST `/auth/reset-password`

Accepts the approved password reset token and new password.

Password recovery endpoints are required only if password recovery is included in the approved scope.

## 4. Cart Endpoints

### GET `/cart`

Returns the current cart for the supported guest or authenticated session.

### POST `/cart/items`

Request:

{\
"variantId": "uuid",\
"quantity": 1\
}

Adds a variant to the cart or updates its quantity according to the documented cart rules.

### PATCH `/cart/items/{itemId}`

Request:

{\
"quantity": 2\
}

Updates the quantity of an existing cart item.

### DELETE `/cart/items/{itemId}`

Removes an item from the current cart.

### DELETE `/cart`

Clears the current cart.

All cart endpoints must validate variant availability and quantities. Prices returned by the cart API are informational; checkout must recalculate authoritative prices.

## 5. Checkout and Order Endpoints

### POST `/checkout/validate`

Validates the current cart and checkout information without placing an order.

Request:

{\
"shipping": {\
"fullName": "Customer Name",\
"phone": "01XXXXXXXXX",\
"email": "[customer@example.com](mailto:customer@example.com)",\
"area": "Dhaka",\
"address": "Full delivery address"\
},\
"couponCode": null,\
"paymentMethod": "cod"\
}

Response:

{\
"success": true,\
"data": {\
"valid": true,\
"subtotal": "1800.00",\
"discountTotal": "0.00",\
"shippingTotal": "80.00",\
"grandTotal": "1880.00",\
"currency": "BDT",\
"errors": []\
}\
}

The shipping amount above is illustrative only. Real shipping charges must come from approved business rules.

### POST `/orders`

Creates an order from the current cart.

Request:

{\
"shipping": {\
"fullName": "Customer Name",\
"phone": "01XXXXXXXXX",\
"email": "[customer@example.com](mailto:customer@example.com)",\
"area": "Dhaka",\
"address": "Full delivery address"\
},\
"orderNote": null,\
"couponCode": null,\
"paymentMethod": "cod"\
}

Response: `201 Created`

{\
"success": true,\
"data": {\
"id": "uuid",\
"orderNumber": "ORD-EXAMPLE-001",\
"orderStatus": "pending",\
"paymentMethod": "cod",\
"paymentStatus": "pending",\
"subtotal": "1800.00",\
"discountTotal": "0.00",\
"shippingTotal": "80.00",\
"grandTotal": "1880.00",\
"currency": "BDT"\
}\
}

Rules:

- Guest orders may have no authenticated user.
- The backend must calculate totals.
- The backend must validate stock and reserve or decrement inventory transactionally.
- Duplicate submissions must be handled using a documented idempotency strategy where appropriate.
- Payment status must not become paid merely because an order was created.
- Successful order creation must return an order reference.

### GET `/orders/{orderNumber}`

Returns an order only if the current user is authorized to access it, or if the approved guest-order lookup mechanism verifies ownership.

Do not expose private order information using a predictable order number alone.

### GET `/account/orders`

Returns the authenticated customer's order history with pagination.

### GET `/account/orders/{orderNumber}`

Returns the specified order belonging to the authenticated customer.

## 6. Payment Endpoints

Payment endpoints depend on the approved payment provider.

Proposed endpoints:

- `POST /payments/initialize`
- `GET /payments/{paymentId}`
- `POST /payments/{paymentId}/cancel`, if supported

The real payment integration must follow the selected provider's documented flow.

Payment confirmation must be based on trusted server-to-server verification or verified provider callbacks, not frontend redirects alone.

The mock backend may simulate payment success, failure, and cancellation, but must clearly identify these as simulations.

## 7. Admin Product Endpoints

All endpoints below require an authenticated administrator with the appropriate permission.

### GET `/admin/products`

Supports pagination and approved search/filter parameters.

### POST `/admin/products`

Creates a product.

### GET `/admin/products/{id}`

Returns administrative product details, including editable fields and variants.

### PATCH `/admin/products/{id}`

Updates permitted product fields.

### DELETE `/admin/products/{id}`

Archives or deletes a product according to the approved retention policy. Prefer archiving products that are referenced by historical orders.

### POST `/admin/products/{id}/variants`

Creates a product variant.

### PATCH `/admin/variants/{id}`

Updates variant attributes, price, or inventory as permitted.

### DELETE `/admin/variants/{id}`

Deactivates or removes a variant according to historical-order and inventory rules.

### POST `/admin/products/{id}/images`

Uploads or registers product images according to the approved storage implementation.

### DELETE `/admin/products/{id}/images/{imageId}`

Removes an image when permitted.

Image upload request format must be documented separately if multipart data is used.

## 8. Admin Category Endpoints

- `GET /admin/categories`
- `POST /admin/categories`
- `GET /admin/categories/{id}`
- `PATCH /admin/categories/{id}`
- `DELETE /admin/categories/{id}`

Category deletion must account for child categories and associated products.

## 9. Admin Order Endpoints

### GET `/admin/orders`

Supports pagination, search, and approved filters such as order status, payment status, and date range.

### GET `/admin/orders/{orderNumber}`

Returns authorized administrative order details.

### PATCH `/admin/orders/{orderNumber}/status`

Request:

{\
"status": "confirmed"\
}

The backend must validate the transition and administrator permission.

### PATCH `/admin/orders/{orderNumber}/payment-status`

This endpoint must be restricted to approved payment-management operations. Normal administrators must not be able to mark an order paid without appropriate verified payment evidence or an explicitly approved manual-payment workflow.

## 10. Admin Dashboard

### GET `/admin/dashboard/summary`

Returns approved summary metrics, such as:

- Total orders.
- Orders awaiting processing.
- Published products.
- Low-stock variants.
- Sales summaries, if the calculation rules are defined.

All metrics must be calculated from authoritative backend data.

## 11. Optional Endpoints

Implement only if the PRD approves these features.

- `GET /wishlist`
- `POST /wishlist/items`
- `DELETE /wishlist/items/{productId}`
- `POST /coupons/validate`
- `GET /reviews`
- `POST /reviews`
- `GET /size-guides/{categorySlug}`
- `GET /shipping/areas`
- `GET /pages/{slug}`

## 12. API Contract Consistency Requirements

The mock and real backend must agree on:

- Route paths and HTTP methods.
- Request field names and validation rules.
- Response field names and data types.
- Error formats and status codes.
- Authentication and authorization behavior.
- Pagination and sorting.
- Cart persistence and order creation semantics.
- Price, discount, and stock calculations.
- Order and payment state transitions.

Document the contract in OpenAPI format (`openapi.yaml`) and use it to generate or validate contract tests where practical.

Do not silently change the API contract during implementation.

## 13. Mock API Requirements

The Next.js frontend developer must implement temporary mock Route Handlers that follow this contract.

The mock implementation must:

- Use JavaScript.
- Return realistic, deterministic test data.
- Validate requests.
- Simulate relevant success and failure responses.
- Simulate shopper and administrator roles.
- Support required cart and order flows.
- Never claim to perform real payments, email delivery, or production-secure authentication.

The mock backend is temporary and must not become a dependency of the final production frontend.

## 14. Integration Acceptance Criteria

The frontend must communicate exclusively through the centralized API service layer.

When the real Express.js backend is ready:

1. Run contract tests against it.
2. Configure the production API base URL.
3. Verify authentication, CORS, cookies, and credentials.
4. Verify every major shopper and admin workflow.
5. Remove the Next.js mock endpoints from the production implementation.
6. Confirm that no frontend component imports mock data or relies on mock-only behavior.

The frontend UI must not require a rewrite to switch between the mock API and the real API.
