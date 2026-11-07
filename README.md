# Whistleblowing & Case Management Platform — Backend API

Secure RESTful backend API for the **Whistleblowing & Case Management Platform**, allowing employees (**Reporter**) to report workplace incidents and administrators (**Admin**) to review, investigate, and resolve cases through a structured workflow.

---

## 1. Technology Stack

- **Runtime & Framework:** Node.js (>= 18), Express.js, TypeScript
- **Database & ORM:** MySQL + Prisma ORM (v4)
- **Authentication & Security:**
  - JWT (`jsonwebtoken`) for stateless access & refresh tokens
  - Password hashing with `bcrypt`
  - AES payload encryption/decryption compatibility (`crypto-js`)
  - Security headers (`helmet`), CORS (`cors`), XSS sanitization (`xss-filters`), and request compression
- **Validation:** `zod` schema validation middleware
- **Logging:** `winston` & `morgan`

---

## 2. Database Schema, Migrations & Seeded Sample Data

The database uses **MySQL** managed via **Prisma ORM** (`prisma/schema.prisma`) with two SQL migration files in `prisma/migrations/`:

### Models & Enums

1. **`User` (`user` table)**
   - `id`: `Int` (Primary Key, Auto Increment)
   - `name`: `String`
   - `email`: `String` (Unique)
   - `role`: `Role` (`REPORTER` | `ADMIN`, default: `REPORTER`)
   - `is_email_verified`: `Boolean`
   - `slug`: `String`
   - `password`: `String?` (bcrypt hashed)
   - `createdAt`, `updatedAt`, `deletedAt` (Soft delete support)

2. **`IncidentReport` (`incident_report` table)**
   - `id`: `Int` (Primary Key, Auto Increment)
   - `referenceNumber`: `String` (Unique, auto-generated format `WBP-YYYYMMDD-XXXXX`)
   - `title`: `String`
   - `category`: `ReportCategory` (`FRAUD`, `HARASSMENT`, `SAFETY_VIOLATION`, `MISUSE_OF_RESOURCES`, `CORRUPTION`, `CONFLICT_OF_INTEREST`, `DATA_PRIVACY_BREACH`, `OTHER`)
   - `description`: `Text`
   - `incidentDate`: `DateTime`
   - `status`: `ReportStatus` (`DRAFT` | `SUBMITTED` | `UNDER_REVIEW` | `RESOLVED`, default: `DRAFT`)
   - `adminNotes`: `Text?` (Investigation/resolution notes by Admin)
   - `reporterId`: `Int` (Foreign Key → `User.id`)
   - `createdAt`, `updatedAt`, `deletedAt` (Soft delete support)

3. **`Token` (`token` table)**
   - Stores active `REFRESH` tokens linked to `User` (`user_id`).

### Seeded Sample Data (`npm run db-seed`)

Running the seeder (`prisma/seeders/index.ts`) populates:

- **3 Test Users** (1 Admin + 2 Reporters)
- **6 Sample Incident Reports** across all statuses (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `RESOLVED`) and categories (`FRAUD`, `SAFETY_VIOLATION`, `HARASSMENT`, `MISUSE_OF_RESOURCES`, `DATA_PRIVACY_BREACH`, `CONFLICT_OF_INTEREST`) to immediately demonstrate role isolation, dashboard statistics, and case management workflows.

---

## 3. Test Accounts (Both Roles)

All seeded accounts share the password: **`Password123!`**

| Role                        | Name                | Email               | Password       | Capabilities                                                                                                                                                        |
| :-------------------------- | :------------------ | :------------------ | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Reporter** (`REPORTER`)   | Budi Santoso        | `reporter@amana.id` | `Password123!` | Create incident reports, save as draft, edit/delete own drafts, submit reports, view own reports & track status.                                                    |
| **Reporter 2** (`REPORTER`) | Siti Aminah         | `siti@amana.id`     | `Password123!` | Secondary reporter account to verify strict data isolation between reporters.                                                                                       |
| **Administrator** (`ADMIN`) | Amana Administrator | `admin@amana.id`    | `Password123!` | View all submitted reports across reporters, inspect details, update status (`SUBMITTED` → `UNDER_REVIEW` → `RESOLVED`), add investigation notes, and manage users. |

---

## 4. Environment Configuration (`.env`)

Create or verify the `.env` file in the root of `amana-be-node-express`:

```env
NODE_ENV=development

# API
API_PORT=4100
API_HOST="localhost"
API_BASE_URL="http://localhost:4100/"
API_KEY="amana_whistleblowing_api_key_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c"

# AUTH
ACCESS_TOKEN="amana_jwt_access_secret_7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
REFRESH_TOKEN="amana_jwt_refresh_secret_1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e"
ACCESS_EXPIRATION_MINUTES=100
ACCESS_EXPIRATION_DAYS=7

# DATABASE
DATABASE_URL="mysql://root@localhost:3306/amana"

# ENCRYPTION (Must match ENCRYPTION_SECRET_KEY in Frontend .env)
ENCRYPTION_SECRET_KEY="amana_aes_secret_key_2026_whistleblowing_case_management_8f9e0d1c2b3a4f5e"
```

---

## 5. Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Make sure MySQL is running** and the database specified in `DATABASE_URL` (e.g., `amana`) exists.

3. **Apply schema / migrations & generate Prisma Client:**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Seed the database with test accounts and sample incident reports:**

   ```bash
   npm run db-seed
   ```

5. **Run the development server (listens on `http://localhost:4100`):**
   ```bash
   npm run dev
   ```

---

## 6. Expected Workflow & API Endpoints

### Expected End-to-End Workflow

```text
Login → Create Report → Save Draft → Edit Report → Submit → Admin Review → Update Status (Under Review / Resolved)
```

1. **Reporter Login (`POST /api/v1/authentication/login`)**: Reporter signs in and receives a JWT access token.
2. **Create Report / Save Draft (`POST /api/v1/reports`)**: Reporter creates a new incident report with `title`, `category`, `incidentDate`, `description`, and `status: "DRAFT"` (or `"SUBMITTED"` directly). System generates a unique `referenceNumber`.
3. **Edit / Delete Draft (`PUT /api/v1/reports/:id`, `DELETE /api/v1/reports/:id`)**: While in `DRAFT` status, the reporter can update any field or delete the draft.
4. **Submit Report (`PATCH /api/v1/reports/:id/submit`)**: Reporter submits the draft, transitioning its status from `DRAFT` to `SUBMITTED`. Once submitted, the reporter can no longer modify or delete it.
5. **Admin Review (`GET /api/v1/reports`, `GET /api/v1/reports/:id`)**: Admin logs in and views all non-draft reports (`SUBMITTED`, `UNDER_REVIEW`, `RESOLVED`), filtering by status, category, or searching by title/reference number.
6. **Update Investigation Status (`PUT /api/v1/reports/:id`)**: Admin updates the case status to `UNDER_REVIEW` and finally `RESOLVED`, adding `adminNotes` visible to the reporter.

### API Endpoints Summary

| Method          | Endpoint                          | Access Role         | Description                                                                       |
| :-------------- | :-------------------------------- | :------------------ | :-------------------------------------------------------------------------------- |
| `POST`          | `/api/v1/authentication/login`    | Public              | Authenticate user with email & password                                           |
| `POST`          | `/api/v1/authentication/logout`   | Authenticated       | Invalidate refresh token & sign out                                               |
| `POST`          | `/api/v1/authentication/register` | Public / Admin      | Register a new user account                                                       |
| `GET`           | `/api/v1/profile`                 | Authenticated       | Get current logged-in user profile                                                |
| `GET`           | `/api/v1/reports/summary`         | `REPORTER`, `ADMIN` | Get dashboard summary counts (Total, Draft, Submitted, Under Review, Resolved)    |
| `GET`           | `/api/v1/reports`                 | `REPORTER`, `ADMIN` | List incident reports (supports `keywords`, `category`, `status`, `page`, `size`) |
| `GET`           | `/api/v1/reports/:id`             | `REPORTER`, `ADMIN` | Get detailed incident report by ID (enforces ownership for `REPORTER`)            |
| `POST`          | `/api/v1/reports`                 | `REPORTER`          | Create a new incident report (`DRAFT` or `SUBMITTED`)                             |
| `PUT` / `PATCH` | `/api/v1/reports/:id`             | `REPORTER`, `ADMIN` | Edit own `DRAFT` report (`REPORTER`) or update `status` & `adminNotes` (`ADMIN`)  |
| `PATCH`         | `/api/v1/reports/:id/submit`      | `REPORTER`          | Submit own `DRAFT` report (`DRAFT` → `SUBMITTED`)                                 |
| `DELETE`        | `/api/v1/reports/:id`             | `REPORTER`          | Soft-delete own `DRAFT` report                                                    |
| `GET`           | `/admin-api/v1/users`             | `ADMIN`             | List and filter users with role statistics and pagination                         |
