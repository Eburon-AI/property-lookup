Eburon Home Platform – Saturday Milestone

**Deadline:** Saturday  
**Goal:** Have the core skeleton running end-to-end:

- Shared backend API (Node.js + PostgreSQL + Prisma)
- Admin Portal (Internal/B2B) – basic but functional
- Client Portal (B2C) – basic search and listing details

---

## 1. Monorepo & Tooling

**Target:** All three apps can run locally via workspace scripts.

### Requirements

1. Set up a monorepo named `eburon-home` with:
   - `apps/api` (backend)
   - `apps/admin-portal` (admin frontend)
   - `apps/client-portal` (client frontend)
   - `packages/db` (Prisma + DB client)
   - `packages/ui` (shared UI, can be empty for now)
   - `packages/config` (shared configs, optional)

2. Configure:
   - TypeScript (strict mode)
   - ESLint + Prettier
   - Turborepo (or similar) for `dev`, `build`, `lint`

### Done Criteria

- `npm run dev:api` starts the API (at least `/health`).
- `npm run dev:admin` starts the admin app.
- `npm run dev:client` starts the client app.

---

## 2. Database & Prisma

**Target:** PostgreSQL running with the agreed schema, accessible via Prisma.

### Requirements

1. Use Docker to run PostgreSQL locally (e.g. via `infra/docker/docker-compose.yml`).
2. Implement the Prisma schema (Users, Profiles, Properties, Leases, MaintenanceRequests) as specified:
   - Roles: `ADMIN`, `CONTRACTOR`, `OWNER`, `BROKER`, `TENANT`
   - Property with price, address, specs, amenities, images, status
   - MaintenanceRequest with type, status, linked to Property, Tenant, and optional Contractor
3. Configure `DATABASE_URL` via `.env`.
4. Run:
   - `prisma migrate dev` (initial migration)
   - `prisma generate`

### Done Criteria

- Prisma migrations run successfully.
- `prisma studio` shows all models.
- `import { prisma } from '@eburon/db'` works in the API project.

---

## 3. Backend API – Core Endpoints

**Target:** Core API endpoints working:

- Authentication
- User management (admin)
- Property search and details

### Requirements

1. **Base API**
   - Node.js + TypeScript (Express or NestJS)
   - Routes:
     - `GET /health` returns `{ status: "ok" }`

2. **Auth**
   - `POST /auth/login`:
     - Accepts `{ email, password }`
     - Validates against `User` table (hashed password)
     - Returns `{ accessToken, user: { id, name, email, role } }`
   - JWT-based auth middleware:
     - Reads `Authorization: Bearer <token>`
     - Attaches `req.user`
     - Supports role checks, e.g. `authMiddleware(['ADMIN'])`

3. **User Management (Admin)**
   - `GET /admin/users`
     - Returns list of users.
   - `POST /admin/users`
     - Creates a user with role (`CONTRACTOR`, `OWNER`, `BROKER`, etc.)
     - Hashes password before saving.
   - `PATCH /admin/users/:id`
     - Update role and/or `isActive`.

   *(Email invite sending can be a TODO comment for now.)*

4. **Properties**
   - `POST /admin/properties` (Admin only)
     - Creates a property with:
       - Title, description
       - Address
       - Price + currency
       - Bedrooms, bathrooms, area
       - Amenities (list)
       - Images (list of URLs)
   - `GET /properties/search` (Public)
     - Query params:
       - `q` (search text)
       - `city`
       - `minPrice`, `maxPrice`
       - `bedrooms`
       - Pagination: `page`, `limit`
   - `GET /properties/:id` (Public)
     - Returns full details of one property.

### Done Criteria

- At least a few sample properties exist in the DB.
- You can:
  - Login via `/auth/login` using a real user from the DB.
  - Hit `/properties/search` and see real DB data.
  - Hit `/properties/:id` to get one listing.

---

## 4. Admin Portal – Minimal Functionality

**Target:** Admin can login and see real data from the backend.

### Requirements

1. React + TypeScript app at `apps/admin-portal` with routes:
   - `/login`
   - `/dashboard`
   - `/users`
   - `/properties`

2. **Login Page**
   - Simple form: email + password.
   - On submit:
     - Call `/auth/login`.
     - Store token (e.g. in memory or localStorage).
     - Redirect to `/dashboard`.

3. **Dashboard**
   - Display:
     - Total users (count from `/admin/users` or a summary endpoint).
     - Total listings (count from `properties`).
     - Active maintenance requests (can be `0` for now or stubbed).

4. **Users Page**
   - Fetch from `GET /admin/users`.
   - Show a table with:
     - Name, email, role, active status.
   - Creating/updating users can be Phase 2, but list view should work.

5. **Properties Page**
   - Fetch from:
     - Either `GET /admin/properties` (if implemented) OR
     - `GET /properties/search` without filters.
   - Show list of properties with:
     - Title, city, pricePerMonth, status.

### Done Criteria

- From the browser (admin portal):
  - You can login as an Admin (using the backend).
  - You can see real users and properties in the UI.
- No mock/static data for these lists.

---

## 5. Client Portal – Minimal Public Search

**Target:** Public users can search and view property details using real backend data.

### Requirements

1. React + TypeScript app at `apps/client-portal` with routes:
   - `/` (landing with search)
   - `/listings/:id` (property details)

2. **Landing / Search Page (`/`)**
   - Search input for query text.
   - “Search” button.
   - On search:
     - Call `/properties/search`.
     - Show results in a grid / list:
       - Image (first image or placeholder)
       - Title
       - City
       - Price

3. **Listing Details Page (`/listings/:id`)**
   - On card click:
     - Navigate to `/listings/:id`.
   - Fetch data from `GET /properties/:id`.
   - Show:
     - Images (gallery or at least the main image)
     - Title
     - Price
     - Basic specs (bedrooms, bathrooms, area)
     - Description
     - Amenities

### Done Criteria

- From the client portal:
  - You can open `/`.
  - Search and see properties from the DB.
  - Click a result and see full details (from the API).

---

## 6. Out of Scope for Saturday (Future Phases)

These are **not required** by Saturday, but will come next:

- Tenant authentication and “My Profile” page.
- Maintenance request UI for tenants.
- Maintenance dashboards for Admin and Contractors.
- Map view, voice search, “Reserve” and “Contact Broker” flows.
- Full email invitation system and notifications.
- Terraform-based cloud deployment and CI/CD.

---

Saturday, expected working monorepo with a live Node.js API (auth, user management, property search/details), a basic Admin portal (login + view users + view properties), and a basic Client portal (public search + property details), all running against a real PostgreSQL database using the provided Prisma schema.
