# SECURITY.md — Frontend & API Security Guidelines

## 1. Security Architecture & Boundary Model

The application operates under a strict two-tier security model:
1. **Frontend Client (Next.js)**: Responsible for UI-level validation, secure token handling, and role-based interface adaptation.
2. **Backend API (Temporary Mock & Future Express.js)**: Authoritative boundary for all authentication, authorization, data validation, and business logic.

> **Rule 0**: Client-side role checks and route guards are for user experience only. They never guarantee actual security. All data operations and privileged actions must be verified and authorized server-side on every request.

---

## 2. Authentication & Token Management

### 2.1 JWT Handling & Session Lifecycle
* **Access Tokens**: Short-lived JWTs passed via the `Authorization: Bearer <access_token>` header on all protected API requests.
* **Storage Standard**:
  * In production, preferred storage is secure, `HttpOnly`, `SameSite=Lax`, `Secure` cookies managed by the backend.
  * In client memory / development mock environments, tokens must be encapsulated within the centralized API service layer (`services/api/auth.js`) rather than scattered across component state.
  * **Never** store sensitive administrator passwords, unhashed credentials, or privileged tokens in insecure, unprotected `localStorage`.
* **Session Expiry & Renewal**:
  * The API service layer must intercept HTTP `401 Unauthorized` responses.
  * Automatically attempt token refresh if a refresh mechanism is active; otherwise, clear client session state and redirect to `/login` with the intended destination preserved in the query string (`/login?redirect=/checkout`).
  * Intercept HTTP `403 Forbidden` responses and display an explicit "Access Denied" view rather than crashing or infinitely looping.

### 2.2 Role-Based Access Control (RBAC)
* **Roles**: `guest`, `customer`, `admin`.
* **Client Route Protection**:
  * Next.js Middleware or client layout guards must verify session status before rendering protected routes (`/account/*`, `/checkout`, `/admin/*`).
  * Unauthenticated users attempting to access `/admin` must be redirected to `/admin/login`.
  * Authenticated customers attempting to access `/admin` must be met with an explicit `403 Forbidden` boundary.
  * The frontend must never allow a user to alter their own `role` attribute in client storage or payloads.

---

## 3. Input Validation, XSS & Sanitization

### 3.1 Client-Side Form Validation
* **Strict Schema Validation**: Validate all form inputs (customer registration, shipping addresses, checkout details, admin product forms) before dispatching network requests.
* **Bangladeshi Phone Validation**: Ensure customer contact numbers conform to valid Bangladesh phone formats (e.g., `+8801XXXXXXXXX` or `01XXXXXXXXX`).
* **Price & Quantity Constraints**:
  * Quantities must be validated as strictly positive integers (`quantity >= 1`).
  * Cap purchase quantities to currently available variant inventory (`stock_quantity`).
  * Never allow negative or non-numeric price submissions.

### 3.2 XSS (Cross-Site Scripting) Defense
* **React Native Escaping**: Rely on React's automatic string escaping in JSX.
* **No Unsanitized HTML**: Strictly prohibit `dangerouslySetInnerHTML` for user-generated content, product descriptions, or reviews unless processed through a verified DOM sanitization library (such as DOMPurify).
* **URL Sanitization**: Validate external links, campaign hero banners, and payment redirect URLs against strict protocol allowlists (`https:`, `mailto:`, `tel:`). Reject `javascript:` pseudo-protocols.

---

## 4. API & Mock Backend Security Boundaries

### 4.1 Mock Backend Simulation Rules
* Route Handlers in `app/api/v1/...` must realistically simulate security boundaries:
  * Reject requests missing credentials on protected endpoints with a standardized `{ success: false, error: { code: "UNAUTHORIZED", message: "..." } }` (HTTP 401).
  * Enforce role checks in mock admin handlers (HTTP 403 when role is not `admin`).
  * Return realistic input validation errors (HTTP 400).
* **Simulation Notice**: The mock API must explicitly identify itself as a development simulation. Never claim mock authentication provides production-grade security.

### 4.2 Environmental Secrets & Configuration
* **Environment Variable Hygiene**:
  * Only prefix environment variables with `NEXT_PUBLIC_` if they are safe to be exposed in the public browser bundle (e.g., `NEXT_PUBLIC_API_BASE_URL`).
  * **Never** place private API secrets, database connection URIs, JWT secret keys, or payment provider private keys into `.env.local` with a `NEXT_PUBLIC_` prefix.

---

## 5. Data Privacy & PII Handling

* **Customer PII**: Treat customer names, phone numbers, delivery addresses, and order histories as sensitive Personally Identifiable Information.
* **Console Cleanliness**: Never log full credit card details, plaintext passwords, or raw auth tokens in browser `console.log()` statements.
* **Sensitive Page Exclusion**: Ensure customer account pages, cart, checkout, and admin dashboard routes contain `<meta name="robots" content="noindex, nofollow">` to prevent private data indexing by search engine crawlers.
