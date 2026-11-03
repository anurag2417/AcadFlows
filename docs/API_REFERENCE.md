# AcadFlows REST API Reference

The AcadFlows API is a versioned RESTful service mounted at `/api/v1`. All requests and responses communicate over HTTPS using standard JSON payloads.

---

## 1. Global Conventions & Headers

### 1.1 Standard Request Headers
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
x-tenant-id: <TENANT_ID_OR_SLUG>
Content-Type: application/json
Accept: application/json
```

- `Authorization`: Required for all protected endpoints. Contains the signed short-lived JWT.
- `x-tenant-id`: Required for school-scoped endpoints. Identifies which school's partition the query operates within.

### 1.2 Standard Success Response
All successful responses return a JSON envelope:
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142
  }
}
```

### 1.3 Standard Error Response
In case of validation failures, authentication errors, or exceptions:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid admission number format",
    "details": [
      {
        "field": "admissionNumber",
        "message": "Admission number must start with ADM-"
      }
    ]
  }
}
```

### 1.4 HTTP Status Codes
| Code | Meaning | Use Case |
|---|---|---|
| `200 OK` | Success | GET, PUT, PATCH operations |
| `201 Created` | Resource Created | POST resource creation |
| `204 No Content` | Success | DELETE operations |
| `400 Bad Request` | Client Error | Malformed JSON or schema validation failure |
| `401 Unauthorized` | Unauthenticated | Missing or expired JWT token |
| `403 Forbidden` | Access Denied | Insufficient role or tenant boundary mismatch |
| `404 Not Found` | Resource Missing | Entity or endpoint does not exist |
| `409 Conflict` | Conflict | Duplicate unique key (e.g., student ID in same school) |
| `429 Too Many Requests`| Rate Limited | Exceeded API rate limits |
| `500 Server Error` | Internal Failure| Unhandled server error |

---

## 2. Authentication & Identity (`/api/v1/auth`)

### Register School Admin
- **POST** `/auth/register`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "Principal Jane Doe",
    "email": "jane@springfieldhigh.edu",
    "password": "StrongPassword#2026",
    "role": "admin",
    "schoolName": "Springfield High",
    "schoolCode": "SPH-2026",
    "phone": "+1-555-0199"
  }
  ```

### User Login
- **POST** `/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "jane@springfieldhigh.edu",
    "password": "StrongPassword#2026",
    "tenantId": "tenant_springfield_01"
  }
  ```
- **Response**: Returns `{ accessToken, user }` and sets `httpOnly` refresh cookie.

### Refresh Token
- **POST** `/auth/refresh`
- **Access**: Public (Cookie-based)
- **Response**: Returns new `{ accessToken }`.

### User Logout
- **POST** `/auth/logout`
- **Access**: Authenticated
- **Response**: Clears refresh cookie and invalidates session token.

### Current User Profile
- **GET** `/auth/me`
- **Access**: Authenticated

### Password Reset Request
- **POST** `/auth/forgot-password`
- **Body**: `{ "email": "user@school.edu" }`

### Password Reset Confirmation
- **POST** `/auth/reset-password`
- **Body**: `{ "token": "uuid-token", "password": "NewStrongPassword#2026" }`

---

## 3. Platform Super-Admin (`/api/v1/platform`)
*All platform routes require authentication and global `isPlatformAdmin` credentials.*

### Platform Metrics & Overview
- **GET** `/platform/stats`
- **Response**: Total schools, active vs pending counts, total cross-tenant users, platform health.

### Platform Activity Audit
- **GET** `/platform/recent-activity`
- **Response**: Array of recent tenant registrations, approvals, and administrator sign-ups.

### List All Schools (Cross-Tenant)
- **GET** `/platform/schools`
- **Query Params**: `status` (pending | active | suspended | rejected), `search`, `page`, `limit`

### Review Pending School Registrations
- **GET** `/platform/schools/pending`

### Approve School Application
- **POST** `/platform/schools/:tenantId/approve`
- **Response**: Marks tenant as active, provisions default academic calendar, sends welcome dispatch.

### Reject School Application
- **POST** `/platform/schools/:tenantId/reject`
- **Body**: `{ "reason": "Unverifiable state accreditation documents" }`

### Suspend School Tenant
- **POST** `/platform/schools/:tenantId/suspend`
- **Body**: `{ "reason": "Non-payment or security policy violation" }`

### Reactivate School Tenant
- **POST** `/platform/schools/:tenantId/reactivate`

---

## 4. Tenant Operations (`/api/v1/tenants`)

### Get School Settings
- **GET** `/tenants/current`
- **Access**: Authenticated School Admin

### Update School Configuration
- **PATCH** `/tenants/current`
- **Access**: School Admin
- **Body**:
  ```json
  {
    "name": "Springfield International Academy",
    "contact": {
      "phone": "+1-555-0199",
      "address": "742 Evergreen Terrace",
      "city": "Springfield",
      "state": "Oregon",
      "country": "US"
    },
    "branding": {
      "primaryColor": "#f97316",
      "logoUrl": "https://cdn.acadflows.com/logos/springfield.png"
    }
  }
  ```

---

## 5. Students Management (`/api/v1/students`)

### List Students
- **GET** `/students`
- **Access**: School Admin, Teacher
- **Query Params**: `gradeId`, `sectionId`, `status`, `search`, `page`, `limit`

### Register New Student
- **POST** `/students`
- **Access**: School Admin
- **Body**:
  ```json
  {
    "admissionNumber": "ADM-2026-0042",
    "firstName": "Alex",
    "lastName": "Rivera",
    "dateOfBirth": "2012-05-14",
    "gender": "male",
    "gradeId": "grade_id_6",
    "sectionId": "section_id_6a",
    "academicYearId": "ay_2026_2027",
    "guardians": [
      {
        "name": "Maria Rivera",
        "relationship": "Mother",
        "phone": "+1-555-0144",
        "email": "maria.rivera@example.com",
        "isEmergencyContact": true
      }
    ]
  }
  ```

### Bulk Import Students
- **POST** `/students/import`
- **Access**: School Admin
- **Body**: Multipart CSV / JSON array of student admission records.

### Get Student Details
- **GET** `/students/:id`

### Update Student Record
- **PATCH** `/students/:id`

---

## 6. Academic Engine (`/api/v1/academic`)

### Academic Years
- **GET** `/academic/years` - List academic calendar years
- **POST** `/academic/years` - Create academic year (`name`, `startDate`, `endDate`, `isCurrent`)

### Grades & Classes
- **GET** `/academic/grades` - List all grades
- **POST** `/academic/grades` - Create grade (`name`, `code`, `order`)

### Sections
- **GET** `/academic/sections` - List sections by grade
- **POST** `/academic/sections` - Create section (`gradeId`, `name`, `capacity`, `classTeacherId`)

### Subjects
- **GET** `/academic/subjects` - List curriculum subjects
- **POST** `/academic/subjects` - Create subject (`name`, `code`, `gradeIds`, `isElective`)

### Teacher Subject Assignments
- **POST** `/academic/assignments` - Map teacher to subject, grade, and section

---

## 7. Attendance Engine (`/api/v1/attendance`)

### Mark Daily Attendance
- **POST** `/attendance/mark`
- **Access**: Teacher, School Admin
- **Body**:
  ```json
  {
    "date": "2026-11-03",
    "gradeId": "grade_id_6",
    "sectionId": "section_id_6a",
    "records": [
      { "studentId": "std_01", "status": "present" },
      { "studentId": "std_02", "status": "absent", "remarks": "Medical leave" },
      { "studentId": "std_03", "status": "late" }
    ]
  }
  ```

### Attendance Analytics & Reports
- **GET** `/attendance/reports`
- **Query Params**: `startDate`, `endDate`, `gradeId`, `sectionId`, `studentId`

---

## 8. Assignments, LMS & Gradebook (`/api/v1/assignments`)

### Create Assignment
- **POST** `/assignments`
- **Access**: Teacher
- **Body**:
  ```json
  {
    "title": "Cellular Biology Lab Report",
    "description": "Submit a 3-page analysis of the plant cell microscope experiment.",
    "gradeId": "grade_id_9",
    "sectionId": "section_id_9b",
    "subjectId": "sub_biology",
    "dueDate": "2026-11-15T23:59:59Z",
    "maxMarks": 100,
    "attachments": []
  }
  ```

### Submit Assignment
- **POST** `/assignments/:id/submit`
- **Access**: Student
- **Body**: `{ "submissionText": "...", "attachments": [...] }`

### Grade Submission
- **POST** `/assignments/:id/grade`
- **Access**: Teacher
- **Body**:
  ```json
  {
    "submissionId": "sub_984",
    "marksObtained": 92,
    "feedback": "Excellent methodology and clear observation notes."
  }
  ```

### Student Gradebook & Report Cards
- **GET** `/assignments/gradebook/:studentId`
- **GET** `/assignments/report-cards/:studentId`

---

## 9. Fees & Billing (`/api/v1/fees`)

### Fee Structures
- **GET** `/fees/structures` - List tuition, lab, library, and transportation fee plans.
- **POST** `/fees/structures` - Configure fee item amounts and installment frequencies.

### Student Invoices
- **GET** `/fees/invoices` - Query student fee invoices and payment status.
- **POST** `/fees/invoices/generate` - Bulk generate monthly/term invoices across classes.

### Record Fee Payment
- **POST** `/fees/payments`
- **Body**:
  ```json
  {
    "invoiceId": "inv_8842",
    "amount": 450.00,
    "paymentMethod": "bank_transfer",
    "transactionReference": "TXN-9021849",
    "notes": "Term 2 tuition paid in full"
  }
  ```

---

## 10. Timetable & Scheduling (`/api/v1/timetable`)

### Get Class Schedule
- **GET** `/timetable`
- **Query Params**: `gradeId`, `sectionId`, `teacherId`

### Create / Update Timetable Entry
- **POST** `/timetable/entries`
- **Body**:
  ```json
  {
    "dayOfWeek": 1,
    "periodNumber": 3,
    "startTime": "10:15",
    "endTime": "11:00",
    "gradeId": "grade_id_8",
    "sectionId": "section_id_8a",
    "subjectId": "sub_math",
    "teacherId": "tch_john_doe",
    "roomNumber": "Lab-204"
  }
  ```
