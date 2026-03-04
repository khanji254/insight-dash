# Security Documentation

## Overview

InsightDash implements multiple layers of security to protect user data, prevent unauthorized access, and ensure system integrity. This document outlines all security measures implemented in the application.

---

## 🔐 Authentication & Authorization

### JWT-Based Authentication
- **Access Tokens**: Short-lived (15 minutes) tokens for API authentication
- **Refresh Tokens**: Long-lived (7 days) tokens stored securely for session renewal
- **Token Storage**: Refresh tokens are hashed with bcrypt before database storage
- **Automatic Refresh**: Client automatically refreshes expired access tokens using refresh tokens

### Password Security
- **Hashing**: bcrypt with 12 salt rounds
- **Minimum Requirements**: 8 characters (enforced on frontend and backend)
- **Storage**: Only password hashes are stored; plaintext passwords never touch the database

### Role-Based Access Control (RBAC)
Three distinct user roles with hierarchical permissions:

**ADMIN**
- Full system access
- User management (approve, suspend, reactivate, delete)
- Role assignment
- Cannot be suspended or deleted by other admins

**ANALYST**
- Read/write access to data entries
- Analytics and reporting features
- Cannot access user management

**VIEWER**
- Read-only access to dashboards and reports
- Cannot modify any data

### Authorization Middleware
```typescript
authenticate()    // Verifies JWT token
authorize(roles)  // Restricts access based on user role
```

---

## 📧 Email Verification & Account Approval

### Two-Step Account Activation

**Step 1: Email Verification (OTP)**
- 6-digit one-time password sent to user's email
- OTP expires in 15 minutes
- OTP is hashed with bcrypt before storage (never stored in plaintext)
- Can be resent with rate limiting
- Marked as used after verification to prevent reuse

**Step 2: Admin Approval**
- After email verification, account enters `PENDING_APPROVAL` state
- Admin must manually approve account before user can log in
- Approval sends email notification to user

### User Status Workflow
```
PENDING_EMAIL → PENDING_APPROVAL → ACTIVE → SUSPENDED
```

- **PENDING_EMAIL**: Waiting for email verification
- **PENDING_APPROVAL**: Email verified, awaiting admin approval
- **ACTIVE**: Fully activated, can log in
- **SUSPENDED**: Account disabled by admin

---

## 🛡️ API Security

### Rate Limiting
```typescript
// Global rate limit
100 requests per 15 minutes per IP

// Authentication endpoints (/register, /login, /verify-otp)
20 requests per 15 minutes per IP
```

### HTTP Security Headers (Helmet)
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **Strict-Transport-Security**: Enforces HTTPS
- **X-DNS-Prefetch-Control**: Controls DNS prefetching

### CORS (Cross-Origin Resource Sharing)
- Whitelist-based origin validation
- Credentials support enabled for cookie/auth headers
- Configurable via `CORS_ORIGINS` environment variable

### Request Body Limits
- Maximum request size: **10kb**
- Prevents DoS attacks via large payloads

### Input Validation
- All endpoints use Zod schemas for type-safe validation
- SQL injection protection via Prisma ORM (parameterized queries)
- Email format validation
- Field length constraints

---

## 🔒 Data Security

### Database Security

**SQLite (Development)**
- File-based database with restricted file permissions
- Located at `backend/prisma/dev.db`

**PostgreSQL (Production)**
- Encrypted connections (SSL/TLS)
- Hosted on Railway with automatic backups
- Database credentials stored in environment variables

### Token Management
- Refresh tokens stored in database with expiry timestamps
- Expired tokens automatically rejected
- All tokens for a user deleted on logout
- Cascade deletion when user is suspended/deleted

### Sensitive Data Handling
- Environment variables for secrets (never committed to git)
- `.env` files excluded via `.gitignore`
- Admin credentials never logged or exposed in error messages

---

## 🚨 Security Best Practices

### Development
```bash
# Generate secure secrets
openssl rand -base64 32  # For JWT_ACCESS_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

### Production Deployment

**Environment Variables**
```env
# Use strong random secrets (32+ characters)
JWT_ACCESS_SECRET=<random-32-byte-string>
JWT_REFRESH_SECRET=<random-32-byte-string>

# PostgreSQL connection string with SSL
DATABASE_URL=postgresql://user:password@host:port/db?sslmode=require

# Real SMTP server (not console logging)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password

# Production URL
CORS_ORIGINS=https://your-frontend-domain.com
```

**HTTPS/TLS**
- Always use HTTPS in production
- Railway provides automatic SSL certificates
- Vercel provides automatic HTTPS for frontend

**Database Backups**
- Enable automated backups on Railway
- Regular backup testing (recovery drills)
- Keep backups encrypted and access-controlled

**Logging & Monitoring**
- Log all authentication attempts (success and failure)
- Monitor for unusual activity (rate limit violations, failed logins)
- Never log sensitive data (passwords, tokens, email addresses in dev logs)

---

## 🔍 Security Audit Checklist

### Before Production Deployment

- [ ] Change all default credentials
- [ ] Generate new JWT secrets (32+ bytes)
- [ ] Configure real SMTP server (not console)
- [ ] Enable PostgreSQL with SSL
- [ ] Update CORS_ORIGINS to production URL
- [ ] Enable HTTPS/TLS
- [ ] Set NODE_ENV=production
- [ ] Remove debug/development middleware
- [ ] Verify rate limiting is active
- [ ] Test token expiration and refresh flow
- [ ] Verify OTP email delivery
- [ ] Test admin approval workflow
- [ ] Check all role-based access restrictions
- [ ] Review error messages (no sensitive data leakage)
- [ ] Enable database backups
- [ ] Set up monitoring/alerting

---

## 🐛 Reporting Security Issues

If you discover a security vulnerability, please email:
**glenngatiba@gmail.com**

Do not open public GitHub issues for security vulnerabilities.

**Include in your report:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

We will respond within 48 hours and provide a timeline for a fix.

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

---

**Last Updated**: 2025-03-04  
**Security Team**: InsightDash Development Team
