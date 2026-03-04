# InsightDash Backend

Express.js + TypeScript + Prisma backend for the InsightDash political finance transparency platform.

---

## 📋 Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Express 4.21
- **Language**: TypeScript 5.9
- **ORM**: Prisma 5.22
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Email**: nodemailer
- **Security**: helmet, cors, express-rate-limit, bcrypt

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npx prisma migrate dev --name init

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

The server will start on `http://localhost:3001`.

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Sample data seeding
├── src/
│   ├── config/
│   │   └── env.ts            # Environment variable validation
│   ├── controllers/          # Request handlers
│   │   ├── admin.controller.ts
│   │   ├── appointments.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── donors.controller.ts
│   │   ├── entities.controller.ts
│   │   ├── redFlags.controller.ts
│   │   └── tenders.controller.ts
│   ├── lib/
│   │   └── email.ts          # Email service (OTP, notifications)
│   ├── middleware/
│   │   ├── authenticate.ts   # JWT auth & role-based authorization
│   │   ├── errorHandler.ts   # Centralized error handling
│   │   └── rateLimiter.ts    # Rate limiting configuration
│   ├── routes/
│   │   ├── index.ts          # Main router aggregator
│   │   ├── admin.routes.ts   # Admin user management
│   │   ├── auth.routes.ts    # Authentication & OTP
│   │   └── ...               # Other resource routes
│   ├── services/             # Business logic layer
│   │   ├── admin.service.ts
│   │   ├── auth.service.ts
│   │   ├── otp.service.ts
│   │   └── ...
│   └── index.ts              # Application entry point
├── .env                       # Environment variables (DO NOT COMMIT)
├── .env.example              # Environment template
├── package.json
└── tsconfig.json
```

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
# Server
NODE_ENV=development
PORT=3001

# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL="file:./dev.db"
# DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGINS=http://localhost:8080

# Email (nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=InsightDash <noreply@insightdash.ke>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=20
```

---

## 📊 Database

### Schema Overview

**Models**:
- `User` - User accounts with email, hashed password, role, status
- `RefreshToken` - JWT refresh tokens
- `OtpCode` - One-time passwords for email verification
- `Entity` - Companies, individuals, organizations
- `Donor` - Political donation records
- `Tender` - Government contract awards
- `Appointment` - Public sector appointments
- `RedFlag` - Detected conflicts of interest

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client (after schema changes)
npx prisma generate
```

### Seeding

```bash
# Seed database with sample data
npm run db:seed
```

**Admin Credentials** (created by seed):
- Email: `glenngatiba@gmail.com`
- Password: `Admin123!`
- Role: ADMIN
- Status: ACTIVE

---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint         | Description                   | Auth Required |
|--------|------------------|-------------------------------|---------------|
| POST   | `/register`      | Register new user             | No            |
| POST   | `/verify-otp`    | Verify email with OTP code    | No            |
| POST   | `/resend-otp`    | Resend OTP code               | No            |
| POST   | `/login`         | Login with email/password     | No            |
| POST   | `/refresh`       | Refresh access token          | No            |
| POST   | `/logout`        | Logout (invalidate tokens)    | No            |
| GET    | `/me`            | Get current user info         | Yes           |

### Admin (`/api/v1/admin`) 🔒 ADMIN only

| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| GET    | `/users`              | Get all users               |
| GET    | `/users/pending`      | Get pending approval users  |
| PATCH  | `/users/approve`      | Approve user account        |
| PATCH  | `/users/suspend`      | Suspend user account        |
| PATCH  | `/users/reactivate`   | Reactivate suspended user   |
| PATCH  | `/users/role`         | Update user role            |
| DELETE | `/users/:id`          | Delete user account         |

### Data Resources

- `/api/v1/entities` - Companies and organizations
- `/api/v1/donors` - Political donations
- `/api/v1/tenders` - Government contracts
- `/api/v1/appointments` - Public appointments
- `/api/v1/red-flags` - Conflict of interest flags

All data endpoints support:
- Pagination: `?page=1&limit=10`
- Filtering: `?ministry=Health&minRisk=70`
- Search: `?search=keyword`

---

## 🔐 Authentication Flow

### User Registration & Approval

```
1. User registers (/register)
   └─> Status: PENDING_EMAIL
   └─> OTP code sent via email

2. User verifies email (/verify-otp)
   └─> Status: PENDING_APPROVAL

3. Admin approves account (/admin/users/approve)
   └─> Status: ACTIVE
   └─> Approval email sent

4. User can now login (/login)
   └─> Receives access + refresh tokens
```

### Token Management

**Access Token** (15min):
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "ANALYST"
}
```

**Refresh Token** (7 days):
- Stored in database (hashed)
- Used to get new access token when expired
- Deleted on logout

---

## 🧪 Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### TypeScript Compilation

```bash
# Check for type errors
npm run type-check

# Build production files
npm run build

# Start production server
npm start
```

### Database GUI

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio
```

---

## 🚀 Deployment

### Railway (Recommended for Backend)

1. **Create Railway project**
   ```bash
   railway init
   ```

2. **Add PostgreSQL database**
   ```bash
   railway add postgresql
   ```

3. **Set environment variables**
   - Copy all variables from `.env`
   - Update `DATABASE_URL` to Railway PostgreSQL URL
   - Set `NODE_ENV=production`
   - Generate new JWT secrets

4. **Deploy**
   ```bash
   railway up
   ```

### Environment-Specific Configuration

**Development** (`NODE_ENV=development`):
- SQLite database
- Console email logging
- Verbose error messages

**Production** (`NODE_ENV=production`):
- PostgreSQL database
- Real SMTP email
- Generic error messages
- Trust proxy enabled

---

## 🛠️ Scripts

```bash
npm run dev          # Start dev server (ts-node-dev)
npm run build        # Compile TypeScript
npm start            # Start production server
npm test             # Run tests
npm run db:seed      # Seed database
npm run type-check   # Check TypeScript errors
```

---

## 📚 API Documentation

### Example Requests

**Register User**:
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass1234!","name":"John Doe"}'
```

**Verify OTP**:
```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456"}'
```

**Login**:
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass1234!"}'
```

**Authenticated Request**:
```bash
curl http://localhost:3001/api/v1/entities \
  -H "Authorization: Bearer <access_token>"
```

---

## 🔍 Troubleshooting

### Prisma Client not updating
```bash
npx prisma generate
```

### Port already in use
```bash
# Kill process on port 3001 (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
```

### Database locked (SQLite)
```bash
# Reset database
npx prisma migrate reset
```

---

## 📄 License

MIT

---

**For security best practices, see [SECURITY.md](../SECURITY.md)**
