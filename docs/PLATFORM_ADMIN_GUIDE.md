# AcadFlows Platform Super-Admin Operations Playbook

This document is the standard operating procedure (SOP) for the **AcadFlows Founder & Platform Super-Admin Team**. The platform admin layer manages institutional onboarding, KYC verification, cross-tenant compliance, and platform integrity.

---

## 1. Platform Super-Admin Identity & Access

- **Master Founder Account**: `acadflows00@gmail.com`
- **Dashboard Access**: Accessible at `/dashboard` when authenticated as a platform super-admin (`isPlatformAdmin: true`).
- **Authorization Scope**:
  - Unrestricted cross-tenant read/write on tenant statuses.
  - Ability to inspect institutional metadata, administrator credentials, and audit logs across all registered schools.
  - Excluded from school-specific operational data (grades, minor child records) unless an explicit security audit is authorized.

---

## 2. Institutional Onboarding & Verification Lifecycle

Every school registering on AcadFlows enters a multi-stage verification pipeline to prevent fraudulent operations and protect educational data integrity.

```
       [School Submits Registration Form]
                       │
                       ▼
            Status: "pending"
                       │
                       ▼
       [Platform Super-Admin Review in Dashboard]
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   [Meets Criteria]          [Fails Criteria]
          │                         │
          ▼                         ▼
   Status: "active"          Status: "rejected"
          │                         │
  • Default Calendar Provisioned    • Rejection email dispatched
  • School Admin notified           • Reason recorded in audit log
  • Subdomain activated
```

---

## 3. School Verification Checklist

Before clicking **"Approve School"** in the Platform Admin Dashboard, complete this 4-point verification check:

### 3.1 Legal & Accreditation Verification
- [ ] Confirm school name exists on state/national department of education registry.
- [ ] Verify physical street address via maps and official school web presence.
- [ ] Check official contact phone number against school directory.

### 3.2 Administrator Credential Verification
- [ ] Ensure school administrator email uses an institutional domain (e.g., `principal@oakridge.edu`) rather than personal webmail where applicable.
- [ ] Validate administrator identity and authorization to bind the school.

### 3.3 Domain & Subdomain Safety
- [ ] Ensure school slug/subdomain does not infringe on registered trademarks.
- [ ] Verify that school code (e.g., `OAK-2026`) is unique and formatted correctly.

---

## 4. Platform Action Procedures

### 4.1 Approving a School
1. Log in with `acadflows00@gmail.com`.
2. Navigate to **Platform Hub** > **School Verifications** > **Pending**.
3. Click **Review** next to the school name.
4. Verify all institutional details.
5. Click **Approve School**.
   - Backend sets tenant status to `active`.
   - Provisions initial academic term template.
   - Dispatches official welcome email with login link to the school administrator.

### 4.2 Rejecting an Application
1. Click **Reject School**.
2. Select or type the explicit reason (e.g., *"Unable to verify state institutional license"*).
3. The applicant receives a notification email, and the record moves to the **Rejected** archive.

### 4.3 Suspending a Tenant (Emergency Freeze)
Used in cases of security breaches, legal orders, or severe terms-of-service violations.
1. Locate the school in **All Schools**.
2. Click **Suspend Tenant**.
3. Enter suspension justification.
4. **Immediate Impact**:
   - The `tenantContext` API middleware instantly terminates all active sessions under that tenant.
   - Any user attempting to query the API receives `403 Forbidden` (`TENANT_SUSPENDED`).
   - Data is preserved intact (never hard-deleted during suspension) pending investigation.

### 4.4 Reactivating a Suspended Tenant
1. Review resolution of the compliance issue.
2. Click **Reactivate Tenant**.
3. All access and API capabilities are immediately restored.

---

## 5. Security & Emergency Response for Super-Admins

- **Password Security**: The platform super-admin account must maintain a high-entropy password (minimum 16 characters) and multi-factor authentication.
- **Rotation Schedule**: Rotate `JWT_SECRET` and `JWT_REFRESH_SECRET` periodically using zero-downtime rolling secret rotation.
- **Audit Trails**: All platform admin actions (approvals, rejections, suspensions) are logged permanently in the platform immutable audit trail.

