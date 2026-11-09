# Authorization and Role Structure

## 1. Purpose

Define authentication, identity, and access-control requirements for the fashion e-commerce platform.

The real implementation will use a separate Express.js backend. All access control must be enforced on the backend, not merely by hiding frontend components.

## 2. Roles

### Guest

An unauthenticated visitor.

Permitted:

- Browse published products and public categories.
- Search, filter, sort, and view product details.
- Manage a temporary guest cart.
- Place guest orders if guest checkout is enabled.
- Register or log in.

Not permitted:

- Access customer account details.
- View private order history.
- Access administrative pages or APIs.
- Modify products, inventory, or order status.

### Registered User

An authenticated customer.

Permitted:

- All permitted guest shopping activities.
- View and update permitted profile fields.
- Access their own order history and order details.
- Manage their cart according to the cart design.
- Access other account functions explicitly approved for customers.

Not permitted:

- View another customer's private data.
- Modify product catalog data.
- Change inventory or order status through administrative operations.
- Assign themselves privileged roles.

### Administrator (Store Operations)

An authenticated, explicitly authorized staff member.

Permitted, according to assigned permissions:

- Access administrative dashboard data.
- Create, update, publish, unpublish, and archive products.
- Manage categories and product variants.
- Update inventory and prices.
- View and manage customer orders and change fulfillment status.
- View staff directory in read-only mode.

Not permitted:

- Invite, create, or provision new administrator accounts.
- Create or promote users to Super Administrator.
- Modify global store settings, currencies, or delivery rates.
- Delete other staff accounts.

### Super Administrator (Executive Root)

The master administrative authority for the platform.

Permitted:

- All permissions granted to Store Administrators.
- Provision, create, and invite new Store Administrators.
- Provision, create, and promote new Super Administrators.
- Update staff roles, permissions, and toggle active/suspended status.
- Delete staff accounts (with protection against self-deletion and last-superadmin deletion).
- Configure store settings, Bangladesh logistics tiers (Inside/Outside Dhaka fees), and maintenance mode.
- Access complete system audit matrices and financial revenue metrics.

## 3. Authentication Method

Use JWT-based authentication for the Express backend, subject to the final security design.

Recommended approach:

- Short-lived access tokens.
- Secure session management.
- Refresh-token rotation if refresh tokens are implemented.
- Secure, HttpOnly cookies for browser-based authentication where compatible with the deployment architecture.
- Appropriate `SameSite`, `Secure`, and CSRF protections based on the cookie and origin configuration.
- Explicit logout and session invalidation behavior.

Do not expose signing secrets to the frontend.

Do not assume that storing JWTs in localStorage is the preferred or safest approach.

## 4. Authorization Rules

- Every protected backend endpoint must authenticate the request.
- Every administrative endpoint must verify the required administrative permission.
- Customer-specific operations must verify resource ownership.
- A user must never gain access by changing a URL, request body, role field, or object ID.
- The backend must reject attempts to assign privileged roles through public registration or profile updates.
- The backend must validate permissions for every request, not only at login.
- Product publication and inventory rules must be enforced server-side.
- Order status changes must follow approved transitions.
- Unauthorized and forbidden requests must return consistent error responses.

## 5. Permission Matrix

| Operation                      | Guest                     | Registered User   | Store Administrator               | Super Administrator               |
| ------------------------------ | ------------------------- | ----------------- | --------------------------------- | --------------------------------- |
| Browse published products      | Yes                       | Yes               | Yes                               | Yes                               |
| View public categories         | Yes                       | Yes               | Yes                               | Yes                               |
| Add to guest cart              | Yes                       | Yes, if supported | Yes, if supported                 | Yes, if supported                 |
| Place an order                 | If guest checkout enabled | Yes               | Only if explicitly allowed        | Only if explicitly allowed        |
| View own order history         | No                        | Yes               | Yes                               | Yes                               |
| View all customer orders       | No                        | No                | Yes                               | Yes                               |
| Update order status (shipping) | No                        | No                | Yes                               | Yes                               |
| Create or edit products        | No                        | No                | Yes                               | Yes                               |
| Manage inventory & variants    | No                        | No                | Yes                               | Yes                               |
| View staff directory           | No                        | No                | Yes (Read-only)                   | Yes                               |
| Create new Administrator       | No                        | No                | No (403 Forbidden)                | Yes                               |
| Create new Super Administrator | No                        | No                | No (403 Forbidden)                | Yes                               |
| Suspend / Delete Admin account | No                        | No                | No (403 Forbidden)                | Yes                               |
| Configure store & delivery fees| No                        | No                | No (403 Forbidden)                | Yes                               |

The real backend is the authority for all permission decisions.

## 6. Frontend Behavior

- Hide administrative navigation from users without administrative access.
- Protect admin page navigation and display appropriate redirects.
- Handle HTTP 401 and 403 responses.
- Preserve the user's intended destination during login where appropriate.
- Never treat client-side role data as proof of authorization.
- Avoid exposing private customer data in HTML, page props, logs, or browser storage.
- Use the same API service layer for authenticated requests.

## 7. Mock Authentication Requirements

The temporary Next.js mock API may simulate registration, login, logout, session expiry, role restrictions, and authorization failures.

However:

- Mock credentials are not production credentials.
- Mock JWTs must not be represented as production-secure authentication.
- Mock authentication must not be used to protect a real deployment.
- Tests must cover unauthorized and forbidden operations.
- Mock role checks must approximate the documented contract.

## 8. Security Acceptance Criteria

- Public users cannot invoke administrative operations successfully.
- Registered users cannot access another customer's private order data.
- Protected endpoints reject missing or invalid credentials.
- Privileged role assignment is restricted.
- Sensitive secrets are kept on the backend.
- Authentication failures use the agreed error format.
- The frontend handles expired sessions without entering an endless request loop.
