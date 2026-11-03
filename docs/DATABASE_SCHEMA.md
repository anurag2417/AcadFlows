# AcadFlows Database Schema & Data Dictionary

AcadFlows utilizes **MongoDB** with **Mongoose ODM** for document persistence, paired with strict compound indexing to ensure lightning-fast tenant-scoped lookups and data integrity.

---

## 1. Entity-Relationship Overview

```
 ┌────────────────┐         1:N         ┌────────────────┐
 │     Tenant     ├────────────────────►│      User      │ (Admin / Teacher / Student / Guardian)
 └───────┬────────┘                     └───────┬────────┘
         │                                      │
         │ 1:N                                  │ 1:1
         ▼                                      ▼
 ┌────────────────┐         1:N         ┌────────────────┐
 │  AcademicYear  ├────────────────────►│    Student     │
 └───────┬────────┘                     └───────┬────────┘
         │                                      │
         │ 1:N                                  │
         ▼                                      │
 ┌────────────────┐                             │
 │     Grade      │                             │
 └───────┬────────┘                             │
         │                                      │
         │ 1:N                                  │
         ▼                                      │
 ┌────────────────┐         1:N                 │
 │    Section     ├─────────────────────────────┤
 └───────┬────────┘                             │
         │                                      │
         │ 1:N                                  │
         ▼                                      ▼
 ┌────────────────┐         1:N         ┌────────────────┐
 │   Timetable    │                     │   Attendance   │
 └────────────────┘                     └────────────────┘
         │                                      │
         ▼                                      ▼
 ┌────────────────┐         1:N         ┌────────────────┐
 │   Assignment   ├────────────────────►│   Submission   │
 └────────────────┘                     └────────────────┘
         │                                      │
         ▼                                      ▼
 ┌────────────────┐         1:N         ┌────────────────┐
 │  FeeStructure  ├────────────────────►│   FeeInvoice   ├────► FeePayment
 └────────────────┘                     └────────────────┘
```

---

## 2. Core Collections & Data Schemas

### 2.1 `tenants` (School Accounts)
Represents an educational institution on the platform.

| Field | Type | Required | Description |
|---|---|:---:|---|
| `_id` | ObjectId | Yes | Unique Tenant Object ID |
| `name` | String | Yes | Legal name of the school / institution |
| `slug` | String | Yes | Unique URL subdomain identifier (indexed, unique) |
| `code` | String | Yes | Unique short school code (e.g., `SPH-2026`) |
| `status` | String | Yes | `pending` \| `active` \| `suspended` \| `rejected` |
| `contact` | Object | Yes | `{ email, phone, address, city, state, country, postalCode }` |
| `branding` | Object | No | `{ logoUrl, primaryColor, faviconUrl }` |
| `settings` | Object | Yes | `{ currency, timezone, academicYearId, attendanceMode }` |
| `createdAt` | Date | Yes | Timestamp of application registration |
| `updatedAt` | Date | Yes | Timestamp of last modification |

**Indexes**:
- `{ slug: 1 }` (unique)
- `{ code: 1 }` (unique)
- `{ status: 1 }`

---

### 2.2 `users` (Identity & Accounts)
Authentication and role profiles across schools and platform staff.

| Field | Type | Required | Description |
|---|---|:---:|---|
| `_id` | ObjectId | Yes | Unique User Object ID |
| `tenantId` | ObjectId | No | References `tenants._id` (Null for Platform Super-Admin) |
| `email` | String | Yes | Normalized email address |
| `password` | String | Yes | Bcrypt hash with work factor 12 |
| `role` | String | Yes | `admin` \| `teacher` \| `student` \| `guardian` |
| `isPlatformAdmin`| Boolean| No | Flags platform founder/super-admin access |
| `status` | String | Yes | `pending` \| `active` \| `suspended` |
| `profile` | Object | Yes | `{ firstName, lastName, phone, avatarUrl }` |
| `createdAt` | Date | Yes | Timestamp |
| `updatedAt` | Date | Yes | Timestamp |

**Indexes**:
- `{ tenantId: 1, email: 1 }` (unique compound)
- `{ isPlatformAdmin: 1 }`

---

### 2.3 `students` (Student Records)
Comprehensive educational and demographic dossier of enrolled students.

| Field | Type | Required | Description |
|---|---|:---:|---|
| `_id` | ObjectId | Yes | Unique Student ID |
| `tenantId` | ObjectId | Yes | References `tenants._id` |
| `userId` | ObjectId | No | References optional `users._id` login account |
| `admissionNumber`| String | Yes | Unique school admission identifier |
| `rollNumber` | String | No | Classroom roll / seat identifier |
| `firstName` | String | Yes | Student legal first name |
| `lastName` | String | Yes | Student legal last name |
| `gender` | String | Yes | `male` \| `female` \| `other` |
| `dateOfBirth` | Date | Yes | Date of birth (ISO 8601) |
| `gradeId` | ObjectId | Yes | Current enrolled grade |
| `sectionId` | ObjectId | Yes | Current enrolled section |
| `academicYearId` | ObjectId| Yes | Active academic calendar year |
| `guardians` | Array | Yes | Array of `{ name, relationship, phone, email, isPrimary }` |
| `status` | String | Yes | `active` \| `inactive` \| `graduated` \| `transferred` |

**Indexes**:
- `{ tenantId: 1, admissionNumber: 1 }` (unique)
- `{ tenantId: 1, gradeId: 1, sectionId: 1 }`
- `{ tenantId: 1, status: 1 }`

---

### 2.4 `academics` (Years, Grades, Sections, Subjects)
Defines institutional structure and curricula.

- **`academicyears`**: `{ tenantId, name, startDate, endDate, isCurrent: Boolean }`
  - Index: `{ tenantId: 1, isCurrent: 1 }`
- **`grades`**: `{ tenantId, name, code, order: Number }`
  - Index: `{ tenantId: 1, order: 1 }`
- **`sections`**: `{ tenantId, gradeId, name, capacity, classTeacherId }`
  - Index: `{ tenantId: 1, gradeId: 1, name: 1 }` (unique)
- **`subjects`**: `{ tenantId, name, code, gradeIds: [ObjectId], isElective: Boolean }`
  - Index: `{ tenantId: 1, code: 1 }` (unique)

---

### 2.5 `attendances` (Daily & Class Records)
Captures roll-call attendance entries.

| Field | Type | Required | Description |
|---|---|:---:|---|
| `tenantId` | ObjectId | Yes | References `tenants._id` |
| `date` | Date | Yes | Date of roll-call (normalized to midnight UTC) |
| `gradeId` | ObjectId | Yes | Grade identifier |
| `sectionId` | ObjectId | Yes | Section identifier |
| `recordedBy` | ObjectId | Yes | References `users._id` (Teacher/Admin who took roll) |
| `records` | Array | Yes | `[{ studentId, status: 'present'\|'absent'\|'late'\|'excused', remarks }]` |

**Indexes**:
- `{ tenantId: 1, date: 1, sectionId: 1 }` (unique compound prevents duplicate roll-calls)

---

### 2.6 `assignments` & `submissions` (Learning Management)
Coursework, homework, and gradebook evaluations.

- **`assignments`**:
  - `{ tenantId, subjectId, gradeId, sectionId, teacherId, title, description, maxMarks, dueDate, attachments }`
  - Index: `{ tenantId: 1, sectionId: 1, dueDate: -1 }`
- **`submissions`**:
  - `{ tenantId, assignmentId, studentId, submittedAt, content, attachments, status: 'submitted'|'graded'|'late', marksObtained, feedback, gradedBy }`
  - Index: `{ tenantId: 1, assignmentId: 1, studentId: 1 }` (unique)

---

### 2.7 `fees` (Billing & Invoicing)
Tuition, transportation, and school fee structures.

- **`feestructures`**: `{ tenantId, academicYearId, name, gradeId, items: [{ title, amount }], totalAmount }`
- **`feeinvoices`**: `{ tenantId, studentId, feeStructureId, invoiceNumber, dueDate, totalAmount, paidAmount, balanceAmount, status: 'unpaid'|'partially_paid'|'paid'|'overdue' }`
  - Index: `{ tenantId: 1, invoiceNumber: 1 }` (unique)
  - Index: `{ tenantId: 1, studentId: 1, status: 1 }`
- **`feepayments`**: `{ tenantId, invoiceId, amount, paymentMethod, transactionReference, paidAt, recordedBy }`

---

### 2.8 `auditlogs` (Immutable Compliance Ledger)
Security, administrative mutation, and access log records.

| Field | Type | Description |
|---|---|---|
| `tenantId` | ObjectId | References `tenants._id` |
| `actorId` | ObjectId | References user initiating the mutation |
| `action` | String | Event verb (e.g., `STUDENT_CREATED`, `GRADE_MODIFIED`) |
| `resource` | String | Affected resource endpoint and record ID |
| `ip` | String | Client remote IP address |
| `userAgent` | String | Browser / HTTP client header |
| `timestamp` | Date | UTC timestamp of event |

**Indexes**:
- `{ tenantId: 1, timestamp: -1 }`
- `{ actorId: 1, timestamp: -1 }`
