# AcadFlows Incident Response & Disaster Recovery Playbook

This document defines the protocols, severity definitions, escalation trees, and recovery procedures for production incidents affecting AcadFlows.

---

## 1. Severity Classifications

| Severity | Definition | Target Response | Target Resolution | Example Scenarios |
|---|---|---|---|---|
| **SEV-0 (Critical)** | Catastrophic platform outage or suspected cross-tenant data leak | `< 15 minutes` | `< 2 hours` | Total API outage across all schools, cross-tenant data visible to unauthorized parties, active database compromise. |
| **SEV-1 (Major)** | Core operational workflow impaired across multiple schools | `< 30 minutes` | `< 4 hours` | Attendance recording failing globally, login/authentication broken, fee payment gateway processing duplicate transactions. |
| **SEV-2 (Moderate)**| Significant feature degraded, workaround available | `< 2 hours` | `< 24 hours` | Report card PDF generation fails, assignment submission delays, announcement email delivery deferred. |
| **SEV-3 (Minor)** | Minor cosmetic or non-blocking bug | `< 24 hours` | Next Sprint | Responsive table layout glitch on mobile, typo in student profile, minor sorting anomaly. |

---

## 2. Incident Management Lifecycle

```
[1. Detect & Classify] ──► [2. Contain & Stabilize] ──► [3. Eradicate Root Cause]
           │                                                    │
           ▼                                                    ▼
   Notify Incident Lead                               [4. Recover & Validate]
   Spin up War Room                                             │
   Post Status Page Update                                      ▼
                                                      [5. Blameless Post-Mortem]
```

### 2.1 Immediate Containment Steps (SEV-0 Outage or Breach)
1. **Declare Incident**: Post in `#incidents-production` with initial scope, affected tenants, and severity.
2. **Designate Incident Commander (IC)**: IC directs technical mitigation and delegates communications.
3. **Emergency Tenant Quarantine**:
   - If an isolation breach is identified for a specific tenant, execute the emergency tenant freeze via `/api/v1/platform/schools/:tenantId/suspend` to block further access while preserving evidence.
4. **Credential Revocation**:
   - If JWT secrets or database credentials are leaked, immediately invalidate active sessions by rotating `JWT_SECRET` and recycling MongoDB Atlas database user passwords.

---

## 3. Database Disaster Recovery & Point-In-Time Recovery (PITR)

In the event of database corruption, ransomware, or unintended data deletion:

### 3.1 MongoDB Atlas Point-In-Time Restore Procedure
1. Navigate to **MongoDB Atlas Console** > **Databases** > **Cluster0**.
2. Click **Backup** tab > **Restore**.
3. Select **Point in Time Restore**.
4. Choose the exact timestamp (UTC) immediately preceding the incident:
   - Target Restore Time: `[Incident Timestamp - 5 minutes]`.
5. Specify a new target cluster or restore in-place after backing up the current corrupted state for forensic analysis.
6. Update `MONGODB_URI` in production application environment settings to point to the restored cluster.
7. Trigger API rolling restart and verify `/health` endpoint.

---

## 4. Customer & Status Communication Protocol

During SEV-0 and SEV-1 incidents, institutional trust depends on rapid, transparent communication:

### 4.1 Initial Notification Template (Sent within 20 mins)
> **Subject**: [Service Advisory] Investigating Performance Disruption in AcadFlows
>
> We are currently investigating an issue impacting [Service/Feature, e.g. Portal Access / Attendance System]. Our engineering team has contained the incident and is actively working on resolution. No student data integrity has been compromised. We will provide our next update within 30 minutes.

### 4.2 Resolution Notification Template
> **Subject**: [Resolved] Service Normalization Notice - AcadFlows
>
> The issue impacting [Feature] has been fully resolved as of [Time UTC]. All systems are operating normally. A comprehensive summary and preventive remediation plan will be shared within 48 hours. Thank you for your patience.

---

## 5. Blameless Post-Mortem Framework

Within 48 hours of any SEV-0 or SEV-1 incident, the team must produce a post-mortem document answering:

1. **What happened**: Detailed chronological timeline of alerts, symptoms, and responses.
2. **Root cause analysis**: 5-Whys methodology to uncover foundational system or process failure.
3. **Where we got lucky**: Factors that prevented the incident from being worse.
4. **Action items**: Preventative technical tasks assigned with owners and strict completion dates.
