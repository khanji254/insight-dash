# InsightDash — Follow the Money

**Political finance & procurement transparency tracker for Kenya.**

InsightDash cross-references political donations, government tender awards, and public sector appointments to surface conflicts of interest. It features full user registration with email OTP verification, admin-controlled account approval, and role-based access control (ADMIN / ANALYST / VIEWER).

---

## Repository Layout

```
insight-dash/          ? git root (this repo)
+-- backend/           ? Express 4 + TypeScript + Prisma (Node 22)
+-- insight-dash/      ? React 18 + Vite 5 + shadcn/ui (frontend)
+-- README.md          ? you are here
+-- SECURITY.md        ? security documentation
```

---

## Quick Start

> Run **both** commands in separate terminals.

### 1 — Backend

```powershell
cd backend
npm install
npx prisma migrate dev --name init   # create SQLite DB and generate client
npm run db:seed                      # seed admin + sample data
npm run dev                          # starts on http://localhost:3001
```

### 2 — Frontend

```powershell
cd insight-dash
npm install
npm run dev                          # starts on http://localhost:8080
```

Open **http://localhost:8080** in your browser.

---

## Admin Credentials (seeded automatically)

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `glenngatiba@gmail.com`  |
| Password | `Admin123!`              |
| Role     | `ADMIN`                  |
| Status   | `ACTIVE`                 |

---

## User Registration Flow

New users go through a two-step activation before they can log in:

```
/signup ? OTP email sent ? /verify-otp ? pending admin approval
       ? admin approves at /admin ? approval email sent ? user can login
```

| Status             | Meaning                                  |
| ------------------ | ---------------------------------------- |
| `PENDING_EMAIL`    | Registered, OTP not yet verified         |
| `PENDING_APPROVAL` | Email verified, waiting for admin        |
| `ACTIVE`           | Approved, can log in                     |
| `SUSPENDED`        | Disabled by admin                        |

> **Dev note:** When `NODE_ENV=development`, OTP codes are logged to the backend console instead of being emailed.

---

## Environment Variables

### Backend — `backend/.env`

```env
NODE_ENV=development
PORT=3001

# SQLite (local dev). In production, swap for PostgreSQL.
DATABASE_URL="file:./dev.db"

# Generate strong secrets:  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET=change-me-in-production
JWT_REFRESH_SECRET=change-me-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Allow the Vite dev server
CORS_ORIGINS=http://localhost:8080

# SMTP (leave blank in dev — OTPs print to console)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=InsightDash <noreply@insightdash.ke>

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=20
```

### Frontend — `insight-dash/.env.local` (optional)

```env
VITE_API_URL=http://localhost:3001/api/v1
```

---

## API Reference

All routes prefixed `/api/v1`.

### Auth

| Method | Endpoint        | Auth    | Description                              |
| ------ | --------------- | ------- | ---------------------------------------- |
| POST   | `/auth/register`  | Public  | Register; triggers OTP email             |
| POST   | `/auth/verify-otp`| Public  | Verify email with 6-digit code           |
| POST   | `/auth/resend-otp`| Public  | Resend OTP (rate limited)                |
| POST   | `/auth/login`     | Public  | Get access + refresh tokens              |
| POST   | `/auth/refresh`   | Public  | Rotate tokens                            |
| POST   | `/auth/logout`    | Public  | Invalidate refresh token                 |
| GET    | `/auth/me`        | Bearer  | Current user info                        |

### Admin (ADMIN role only)

| Method | Endpoint                  | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/admin/users`            | All users                          |
| GET    | `/admin/users/pending`    | Accounts awaiting approval         |
| PATCH  | `/admin/users/approve`    | Approve a pending account          |
| PATCH  | `/admin/users/suspend`    | Suspend an active account          |
| PATCH  | `/admin/users/reactivate` | Re-enable a suspended account      |
| PATCH  | `/admin/users/role`       | Change a user's role               |
| DELETE | `/admin/users/:id`        | Delete account (non-admin only)    |

### Data (Bearer token required)

| Resource        | Base path           |
| --------------- | ------------------- |
| Entities        | `/entities`         |
| Donors          | `/donors`           |
| Tenders         | `/tenders`          |
| Appointments    | `/appointments`     |
| Red Flags       | `/red-flags`        |
| Dashboard stats | `/red-flags/stats`  |

All list endpoints support `?page=`, `?limit=`, and resource-specific filters.

---

## Roles & Permissions

| Role      | Can do                                               |
| --------- | ---------------------------------------------------- |
| `ADMIN`   | Everything + user management dashboard               |
| `ANALYST` | Read + write data entries, analytics                 |
| `VIEWER`  | Read-only access to dashboards                       |

---

## Useful Commands

### Backend

```powershell
npm run dev              # ts-node-dev with hot reload
npm run build            # compile TypeScript ? dist/
npm start                # run compiled build (production)
npm run db:seed          # (re)seed sample data
npx prisma studio        # visual DB browser
npx prisma migrate dev   # apply schema changes + regen client
npx prisma generate      # regen client without migration
```

### Frontend

```powershell
npm run dev              # Vite dev server
npm run build            # production build ? dist/
npm run preview          # preview the production build
npm run lint             # ESLint
npm test                 # Vitest
```

---

## Deployment

### Frontend ? Vercel

```bash
npm i -g vercel
cd insight-dash
vercel
```

Set env var `VITE_API_URL` to your Railway backend URL in the Vercel dashboard.

### Backend ? Railway

1. Create a Railway project and connect this repo (set root directory to `backend/`).
2. Add a **PostgreSQL** plugin — Railway sets `DATABASE_URL` automatically.
3. Copy all env vars from `backend/.env`, updating:
   - `DATABASE_URL` ? Railway's PostgreSQL URL
   - `NODE_ENV` ? `production`
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` ? new 32-byte random strings
   - `CORS_ORIGINS` ? your Vercel frontend URL
   - `SMTP_*` ? real SMTP credentials

---

## Security

See [SECURITY.md](./SECURITY.md) for a full breakdown of:

- JWT access + refresh token design
- bcrypt password & OTP hashing
- Rate limiting, Helmet headers, CORS policy
- Production security checklist

---

## Further Reading

- [backend/README.md](./backend/README.md) — backend deep-dive, DB schema, migration guide
- [insight-dash/README.md](./insight-dash/README.md) — frontend structure, component library, auth hooks
