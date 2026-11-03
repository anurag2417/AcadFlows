# AcadFlows Security & Compliance Architecture

Educational SaaS systems manage sensitive personally identifiable information (PII), academic records, financial data, and minor child information. AcadFlows adopts a defense-in-depth security model to ensure privacy, integrity, and regulatory compliance.

---

## 1. Multi-Tenant Data Isolation Perimeter

Multi-tenancy isolation is the most critical security boundary in AcadFlows. A failure in isolation constitutes a severe data breach.

### 1.1 Logical Isolation Architecture
- **Tenant Context Binding**: Inbound requests must supply a valid `x-tenant-id` header or match a resolved tenant slug.
- **Strict Query Scoping**: Every Mongoose query touching tenant-scoped entities is bounded with `{ tenantId: req.tenantId }`. Cross-tenant query execution is rejected at the middleware level.
- **Compound Database Indexes**: Database-level compound indexes enforce tenant uniqueness (e.g., `{ tenantId: 1, admissionNumber: 1 }`), preventing duplicate records and accidental collisions.
- **Tenant Status Verification**: Suspended or delinquent tenant accounts are halted at the API gateway before any database query executes.

```
Incoming Request
       │
       ▼
[tenantContext Middleware]
       │
       ├─► Missing or Invalid Tenant ID? ──► 400 Bad Request
       │
       ├─► Tenant Status === 'suspended'? ──► 403 Forbidden (TENANT_SUSPENDED)
       │
       ├─► Inject req.tenantId into Express Context
       │
       ▼
[Controller / Service Layer]
       │
       └─► Query DB: Model.find({ tenantId: req.tenantId, ...filter })
```

---

## 2. Authentication & Credential Security

### 2.1 Password Hashing & Storage
- Passwords are encrypted using **bcrypt** with a minimum salt work factor of `12` rounds.
- Plaintext passwords never touch logs, audit trails, or application cache.
- Password strength policies enforce a minimum of 8 characters containing uppercase, lowercase, numbers, and symbols.

### 2.2 Dual-Token JWT Lifecycle
- **Access Tokens**: Short-lived (15–60 minutes), signed with `JWT_SECRET`. Carried in `Authorization: Bearer <token>`.
- **Refresh Tokens**: Long-lived (30 days), signed with distinct `JWT_REFRESH_SECRET`. Stored in secure, `httpOnly`, `sameSite: 'lax'` / `'strict'` cookies to protect against token extraction via Cross-Site Scripting (XSS).
- **Token Invalidation**: User logout clears client cookies and revokes session validity.

---

## 3. Role-Based Access Control (RBAC) Matrix

Every API route is governed by strict authorization checks (`requireRole` and `requirePlatformAdmin`):

| Resource / Action | Platform Super-Admin | School Admin | Teacher | Student | Guardian |
|---|:---:|:---:|:---:|:---:|:---:|
| **Verify / Suspend School Tenants** | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Manage School Settings & Staff** | :white_check_mark: | :white_check_mark: | :x: | :x: | :x: |
| **Manage Academic Calendar & Curricula**| :x: | :white_check_mark: | :x: | :x: | :x: |
| **Admit & Edit Students** | :x: | :white_check_mark: | :x: | :x: | :x: |
| **Mark Class Attendance** | :x: | :white_check_mark: | :white_check_mark: | :x: | :x: |
| **Create Assignments & Grade Work** | :x: | :white_check_mark: | :white_check_mark: | :x: | :x: |
| **Submit Assignments** | :x: | :x: | :x: | :white_check_mark: | :x: |
| **View Personal Gradebook** | :x: | :x: | :x: | :white_check_mark: | :white_check_mark: (Child) |
| **Generate & Record Fee Invoices** | :x: | :white_check_mark: | :x: | :x: | :x: |
| **Pay Fee Invoices & Download Receipts**| :x: | :white_check_mark: | :x: | :x: | :white_check_mark: |

---

## 4. Network & Application Defenses

### 4.1 Transport Layer Security (TLS)
- All traffic is encrypted in transit using **TLS 1.3** (or TLS 1.2 minimum).
- Strict Transport Security (`HSTS`) headers enforce secure HTTPS connections.

### 4.2 Security Headers (Helmet)
Express endpoints use Helmet middleware configured with:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` / `DENY` to prevent clickjacking
- `X-XSS-Protection: 0` (modern standard replacing legacy browser heuristics)
- Content Security Policy (CSP) tailored for API endpoints

### 4.3 Rate Limiting & Abuse Prevention
- Global API rate limiter restricts excessive requests per IP (`apiLimiter`).
- Dedicated strict rate limiters protect sensitive authentication endpoints (`/auth/login`, `/auth/forgot-password`) against credential stuffing and brute-force attacks.

### 4.4 Input Validation & Sanitization
- All payload schemas validated using **Zod** before hitting controllers.
- No raw unsanitized input is passed to MongoDB queries (preventing NoSQL injection attacks).

---

## 5. Educational Data Privacy & Compliance

AcadFlows is engineered to facilitate compliance with global education data privacy laws:

### 5.1 FERPA (Family Educational Rights and Privacy Act - USA)
- **Directory Information Control**: Parents and eligible students hold access rights to academic records.
- **Audit Trails**: All modifications, grade changes, and record views are logged with immutable timestamps and actor IDs.
- **Third-Party Disclosures**: Student records are strictly siloed and never sold or shared with commercial ad networks.

### 5.2 COPPA (Children’s Online Privacy Protection Act)
- Student accounts under age 13 are provisioned exclusively through authorized school administrators acting under institutional consent.
- Student accounts do not collect behavioral tracking data or personal biometric information.

### 5.3 GDPR & Data Sovereignty
- **Right to Access & Rectification**: School admins can export student dossiers and update incorrect data.
- **Right to Erasure (Right to be Forgotten)**: Compliant student purging cascades through associated attendance, grades, and invoice associations.
- **Encryption at Rest**: Databases are encrypted using AES-256 with managed KMS keys.

---

## 6. Audit Logging & Security Event Monitoring

Mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`) trigger the asynchronous `auditLog` middleware:

```json
{
  "timestamp": "2026-11-03T10:15:30.000Z",
  "actorId": "usr_89218",
  "actorEmail": "principal@school.edu",
  "actorRole": "admin",
  "tenantId": "tenant_springfield_01",
  "action": "STUDENT_RECORD_UPDATED",
  "resource": "students/std_042",
  "ip": "203.0.113.195",
  "userAgent": "Mozilla/5.0 ...",
  "status": 200
}
```

---

## 7. Vulnerability Disclosure & Reporting

If you identify a security vulnerability in AcadFlows:
1. Do not publicly disclose the issue or open a public GitHub issue.
2. Email full technical details and reproduction steps to `acadflows00@gmail.com` with the subject `[SECURITY] Vulnerability Report`.
3. Our engineering team acknowledges reports within 24 hours and provides status updates until resolution.
