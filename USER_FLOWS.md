# User Flow and Interaction Specification

## 1. Overview

Define the exact navigation and expected behavior for shoppers, registered customers, and administrators.

All interactions must use the frontend API service layer. During development, requests will go to the temporary Next.js mock API. The same operations must work with the independent Express.js backend later.

## 2. Shopper Flow: Discover and Purchase

### Flow A: Browse products

1. Shopper opens the homepage.
2. The application displays campaign banners, categories, and featured products.
3. Shopper selects a category such as Men, Women, or Lifestyle.
4. The application navigates to the corresponding category listing.
5. Shopper applies filters or sorting.
6. The frontend requests matching products from the API.
7. Shopper selects a product.
8. The application opens the product details page.

Expected behavior:

- Show loading indicators while fetching.
- Preserve supported filters in URL query parameters.
- Show an empty state when no products match.
- Display an actionable error if the API request fails.

### Flow B: Search for a product

1. Shopper opens the search interface.
2. Shopper enters a search query.
3. The frontend validates the query.
4. The application submits the search request.
5. Matching products appear on a search results page.
6. Shopper selects a product to view its details.

Expected behavior:

- Support keyboard submission.
- Provide a clear-search action.
- Show no-results and API-error states.
- Use URL parameters so searches can be refreshed or shared.

### Flow C: Select a product variant

1. Shopper opens a product details page.
2. The application displays product images, description, price, and availability.
3. Shopper selects a size when required.
4. Shopper selects a color when required.
5. The application displays the selected variant's availability and price.
6. Shopper chooses a quantity.
7. Shopper clicks Add to Cart.
8. The frontend sends the selected product variant and quantity to the cart service.
9. On success, the cart count updates and a confirmation appears.

Validation:

- Required variant selections cannot be skipped.
- Quantity must be a positive integer.
- Quantity must not exceed the available stock.
- Unavailable variants cannot be added.
- An API failure must not display a false success message.

### Flow D: Review and update the cart

1. Shopper opens the cart.
2. The application displays cart items and selected variants.
3. Shopper changes a quantity or removes an item.
4. The frontend submits the change.
5. The cart updates using the API response.
6. Shopper reviews the subtotal, discounts, shipping estimate, and total.
7. Shopper selects Checkout.

Expected behavior:

- Recalculate totals from authoritative API data.
- Show errors if inventory or pricing has changed.
- Preserve valid cart contents according to the agreed persistence strategy.
- Prevent checkout when the cart is empty.

### Flow E: Guest checkout

1. Shopper selects Checkout.
2. The application displays the checkout form.
3. Shopper enters their name, phone, delivery area, and full address.
4. Shopper enters email and an order note if applicable.
5. Shopper enters a coupon code if supported.
6. The frontend validates the form.
7. Shopper reviews the order summary and agrees to the required policies.
8. Shopper selects an available payment method.
9. The frontend submits the order request.
10. The mock API validates the request and returns an order result.
11. The application displays the order confirmation page with the order reference.

Expected behavior:

- Do not create an order if validation fails.
- Prevent duplicate submissions.
- Display field-level validation errors.
- Display API errors without losing all entered information.
- Do not trust client-supplied totals.
- Simulate payment only in the mock environment.
- Show confirmation only after a successful API response.

### Flow F: Registered customer checkout

1. Customer logs in.
2. Customer adds products to the cart.
3. Customer proceeds to checkout.
4. The application pre-fills permitted profile information.
5. Customer confirms shipping details.
6. Customer places the order.
7. The application displays confirmation.
8. Customer opens My Account and views the order history.
9. Customer selects an order to view its details and status.

Only orders belonging to the authenticated customer may be returned by the real backend.

## 3. Authentication Flow

### Registration

1. User opens Register.
2. User enters the required information.
3. The frontend validates the fields.
4. The API processes registration.
5. The application displays success or an appropriate error.
6. If automatic login is part of the approved authentication design, the session is established according to that design.

### Login

1. User opens Login.
2. User enters credentials.
3. The frontend submits the login request.
4. The backend validates credentials.
5. On success, the application establishes the approved authentication session.
6. The user is redirected to the requested destination or an appropriate account page.

### Logout

1. User selects Logout.
2. The frontend requests session termination as required by the authentication design.
3. The client clears its session state.
4. The application redirects the user to a public page.

Expired sessions must be handled gracefully. The frontend must not independently grant permissions.

## 4. Administrator Flow: Manage Products

1. Administrator opens the admin login page.
2. Administrator authenticates.
3. The application checks the current session.
4. Administrator opens Products.
5. The application requests the product list.
6. Administrator searches, filters, or sorts the list.
7. Administrator selects Add Product or Edit Product.
8. The application displays the product form.
9. Administrator enters product details and category information.
10. Administrator adds variants, sizes, colors, prices, and stock quantities.
11. Administrator submits the form.
12. The API validates the request and saves the product.
13. The application displays a success message and refreshed product information.

Expected behavior:

- Display field-level validation errors.
- Prevent invalid variant combinations.
- Do not allow negative stock or invalid prices.
- Require explicit confirmation before destructive actions.
- Update the storefront only according to the product publication state.

## 5. Administrator Flow: Manage Orders

1. Administrator opens the order dashboard.
2. The application requests orders from the API.
3. Administrator filters orders by status or searches by order reference.
4. Administrator opens an order.
5. The application displays customer, item, delivery, payment, and status information permitted by the administrator's role.
6. Administrator selects a valid status transition.
7. The application requests the status update.
8. The API validates the transition and permissions.
9. The application displays the updated status.

Expected behavior:

- Do not allow unauthorized order modifications.
- Show a confirmation for important status changes.
- Display errors if a transition is invalid.
- Keep order totals and item details consistent with the order record.

## 6. Navigation and Redirect Rules

- Product cards navigate to their canonical product URLs.
- Category links navigate to their respective listing routes.
- Cart actions lead to the cart or show cart confirmation.
- Checkout requires a non-empty valid cart.
- Successful checkout navigates to the order confirmation page.
- Login redirects to the originally requested protected page when appropriate.
- Unauthorized admin access redirects to admin login.
- Authenticated users who lack admin permissions must not access administrative operations.
- Invalid product and order identifiers must show appropriate not-found or error pages.
- Back navigation should preserve reasonable search and filter state.

## 7. Interaction Acceptance Criteria

For every interactive control:

- Define its expected action.
- Define its API request, if applicable.
- Define success and error behavior.
- Define loading behavior.
- Define validation rules.
- Define the destination or resulting state.
- Test the behavior using the mock API.

No control should appear functional while doing nothing.
