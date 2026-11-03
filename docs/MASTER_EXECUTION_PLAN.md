# AcadFlows Master Execution Plan: From Web App to Mobile Ecosystem

This document establishes the **step-by-step execution blueprint** for transforming AcadFlows from its current foundation into a market-leading, industry-level enterprise education SaaS platform.

It is structured into three clear, sequential phases:
1. **Phase 1**: Perfecting the Current Web App into a 100% Production-Grade, Industry-Level Product.
2. **Phase 2**: Integrating High-Value Web Capabilities (Digital Fee Payments & Perplexity AI Workspace).
3. **Phase 3**: Building the Native Mobile Ecosystem (Mobile App, UPI Fees, Push Chat, and VisionFlow AI Face Attendance).

---

## 🗺️ Master Strategic Timeline & Execution Sequence

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 1: THE COMPLETE WEB APPLICATION                           │
│  Goal: 100% functional, zero mocks, rock-solid multi-tenant web app across all 5 roles│
│                                                                                        │
│  [1.1 Data Consistency] ──► [1.2 Document Storage] ──► [1.3 Reporting & Exports]       │
│            │                             │                             │               │
│            ▼                             ▼                             ▼               │
│  [1.4 Notification Hub] ──► [1.5 Profile & Settings] ──► [1.6 Platform Super-Admin]  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 2: HIGH-VALUE WEB INTEGRATIONS                            │
│  Goal: Monetization rail & AI-driven intelligence integrated directly into web app    │
│                                                                                        │
│  [2.1 Web Fee Payments] ─────────► [2.2 Perplexity AI Workspace]                       │
│  • Razorpay / Stripe Web Checkout  • Academic RAG Pipeline                             │
│  • Automated Invoices & Ledger     • Persistent Q&A Threads + Citations                │
│  • Tax-compliant PDF Receipts      • Socratic Student Tutor / Teacher Planner          │
│                                                                                        │
│  [2.3 Shiksha Sathi Integration]                                                       │
│  • NCERT / CBSE Question Bank & 1-Click AI Homework Generator                          │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 3: THE NATIVE MOBILE ECOSYSTEM                            │
│  Goal: Full-featured React Native / Expo app for on-the-go communications & operations │
│                                                                                        │
│  [3.1 Cross-Platform Mobile] ─────► [3.2 Mobile UPI Fee Payments]                      │
│  • Teacher / Parent / Student Hub  • 1-Click GPay, PhonePe, Paytm intent               │
│  • Push Notifications (FCM/APNs)   • Instant Mobile Receipts                           │
│                                                                                        │
│  [3.3 VisionFlow AI Face Attendance]                                                   │
│  • Mobile Camera Classroom Snap ──► Multi-Face AI Matching ──► Auto Roll-Call          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Phase 1: Perfecting the Current Web App (Industry-Level Working App)

Before building mobile applications or external AI integrations, our current web platform must be hardened into a production-grade, zero-placeholder system that school principals and administrators can trust with their entire institution.

### 1.1 Data Consistency, Zero-Mock Guarantee & API Completeness
- **Current State**: Core CRUD routes exist, but several UI screens use partial mock data or simulated responses.
- **Industry Requirement**: Every single button, table, modal, and filter must connect to live backend endpoints.
  - [ ] **Class Roster & Subject Mapping**: Ensure teachers only see students enrolled in their assigned sections.
  - [ ] **Timetable Grid Engine**: Replace static timetable entries with a dynamic drag-and-drop or grid scheduler that checks for teacher and room conflict detection (`409 Conflict: Teacher already scheduled in Room 204`).
  - [ ] **Report Card Generation**: Calculate real GPAs, weighted percentages, and term rankings from student assignment submissions and examination marks.
  - [ ] **Bulk Import Validation**: Provide real-time CSV validation preview for student and teacher imports with specific row-by-row error reporting.

### 1.2 Document & Media Vault (Cloudflare R2 / AWS S3 Integration)
- **Current State**: Placeholders for student avatars, school logos, and assignment attachments.
- **Industry Requirement**: Robust cloud object storage with signed upload URLs:
  - [ ] Direct-to-storage signed URL uploads (`POST /api/v1/documents/upload-url`).
  - [ ] School branding customization: School logo and custom favicon uploaded via Settings and instantly reflected in headers and PDF headers.
  - [ ] Student profile photos: Mandatory for identification and later used by VisionFlow face embeddings.
  - [ ] Homework attachments: Support PDF, docx, and images up to 25MB with virus scanning.

### 1.3 Enterprise Reporting & Data Export (PDF & CSV)
- **Current State**: On-screen data displays without downloadable physical records.
- **Industry Requirement**: School administrators and auditors require physical exports:
  - [ ] **Attendance Registers**: Monthly attendance sheet export (CSV and printable PDF) per grade and section.
  - [ ] **Official Report Cards**: One-click batch generation of branded, printable student report cards with school crest, grading legend, and principal signature block.
  - [ ] **Fee Defaulter Statements**: Export list of students with outstanding dues for administrative review.

### 1.4 Central In-App Notification Center
- **Current State**: System alerts are logged in the database, but no live notification bell exists in the top navbar.
- **Industry Requirement**:
  - [ ] Real-time notification badge counter in the web navbar.
  - [ ] Slide-out drawer displaying notifications: "New assignment posted", "Fee invoice generated", "Attendance marked absent", "School announcement published".
  - [ ] Mark-as-read and filter by unread.

### 1.5 Role-Based Portal Polish
- **School Admin Portal**: Complete school settings (term dates, grading scales, attendance cutoff times, staff directory).
- **Teacher Portal**: Class roster, 1-click bulk attendance submission, assignment creation with rubrics, and submission grading interface with feedback.
- **Student Portal**: Daily schedule, homework due dates with submission upload modal, and historical gradebook.
- **Guardian / Parent Portal**: Multi-child switcher, real-time daily attendance calendar, and grade summary cards.
- **Platform Super-Admin Portal**: Complete school verification, pending application review, tenant suspension/reactivation, and cross-tenant user auditing.

---

## 🚀 Phase 2: High-Value Web Integrations

Once the core web app is 100% solid, reliable, and verified, we introduce our two flagship web extensions: **Digital Fee Payments** and the **Perplexity-Style AI Workspace**.

### 2.1 Web Fee Payment Gateway & Financial Ledger
Integrating digital payment infrastructure directly into the web application:

1. **Payment Gateway Integration (Razorpay & Stripe)**:
   - Embed Razorpay Checkout SDK in the web app for Indian institutions (UPI, NetBanking, Debit/Credit Cards).
   - Embed Stripe Elements for international schools.
2. **Parent Checkout Flow on Web**:
   - Parent logs into `/dashboard` or `/:tenantSlug/fees`.
   - Views itemized fee invoice (Tuition, Lab, Transport, Library).
   - Selects "Pay Full Amount" or "Pay Installment 1".
   - Clicks "Proceed to Pay" → Opens Razorpay/Stripe checkout modal.
   - On payment success, webhook confirms payment, marks invoice as `paid`, and renders downloadable PDF receipt.
3. **School Financial Dashboard**:
   - Total collections this month vs outstanding balances.
   - Breakdown by grade and payment method.
   - Manual payment recording for parents paying in physical cash or cheque at the school accounts desk.

### 2.2 AcadFlows AI Research & Answer Workspace (Perplexity Engine)
Integrating an intelligent research and academic Q&A workspace into the web app:

1. **Dedicated AI Workspace Route (`/research` or `/ai-tutor`)**:
   - Clean, distraction-free conversational UI inspired by Perplexity AI.
   - Left sidebar with persistent Q&A thread history.
   - Central input bar: "Ask anything about biology, history, calculus, or curriculum..."
2. **RAG Architecture & Citation Engine**:
   - Queries are augmented with curated educational databases, textbook repositories, and verified academic sources.
   - Generates streaming markdown answers with clickable inline citation badges `[1]`, `[2]`.
   - Source drawer displaying verified references (Britannica, NCERT, Khan Academy, PubMed).
3. **Dual Educational Modes**:
   - **Student Socratic Mode**: Guides students to solutions through questions and conceptual breakdowns rather than writing direct answers.
   - **Teacher Assistant Mode**: Drafts lesson plans, creates quiz questions, formulates laboratory experiments, and summarizes complex topics for classroom delivery.

### 2.3 Shiksha Sathi Integration (NCERT / CBSE Engine)
- Dedicated module for Indian schools:
  - Curated question bank for Classes 1–12 across CBSE/NCERT curriculum.
  - 1-Click AI assignment generation with Bloom's Taxonomy tagging.
  - Free public access portal to empower teachers across under-resourced schools.

---

## 📱 Phase 3: The Complete Native Mobile App & VisionFlow

With the web application and its core integrations fully matured, we expand to our standalone, cross-platform mobile application.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AcadFlows Mobile App                            │
│                     (React Native / Expo - iOS & Android)              │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Unified Communications         │ 2. Mobile Fee Payments             │
│  • Teacher ↔ Parent Direct Chat   │  • 1-Click Native UPI Intent       │
│  • Push Alerts (FCM & APNs)       │  • (Google Pay, PhonePe, Paytm)    │
│  • Voice Notes & Circulars        │  • Instant Push Receipts           │
├───────────────────────────────────┴────────────────────────────────────┤
│ 3. VisionFlow: Classroom Group Photo AI Face Attendance                │
│  • Native Camera Snap (Teacher captures seated classroom)              │
│  • Multi-Face Detection + ArcFace Embedding Matching                   │
│  • Instant Present/Absent Visual Verification & Submission             │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Mobile Architecture & Communication Hub
- **Cross-Platform Stack**: Built with React Native & Expo for 60fps performance on budget and flagship Android and iOS devices.
- **Real-Time Messaging**: WebSocket (Socket.io) client with local SQLite offline cache.
- **Push Notification Infrastructure**: Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNs) for immediate alerts when messages, homework, or attendance are logged.

### 3.2 Mobile-First UPI Fee Payments
- **Seamless UPI Intent**: Parents tap "Pay Now" on their phone and the mobile app launches Google Pay, PhonePe, Paytm, or BHIM directly without manual VPA entry.
- **Biometric Authentication**: Parents authenticate payment with FaceID / Fingerprint.
- **Instant Receipt Notification**: Push notification delivers PDF receipt to the phone's downloads folder immediately.

### 3.3 VisionFlow: AI Classroom Face Attendance
- **The Workflow**:
  1. Teacher arrives in class, opens the AcadFlows Mobile App, and taps "Face Attendance".
  2. The app opens the device camera with framing guidelines.
  3. Teacher takes a single wide-angle picture of the seated students.
  4. The photo is securely transmitted to the VisionFlow AI inference worker.
  5. The model detects all faces, extracts 512-d embeddings, and matches them against the class's enrolled student profiles.
  6. The app displays an interactive visual roster: Present students in green, unassigned/absent students in red.
  7. Teacher reviews, taps any student to toggle if needed, and hits "Confirm Attendance".
  8. Attendance is locked, and absent student parents receive an instant push notification: *"Your child was not present in Period 1 today."*

---

## 🎯 Immediate Next Steps: Action Checklist

To execute this roadmap cleanly and systematically, we will follow this prioritized order:

| Step | Action Item | Target Phase | Status |
|:---:|---|:---:|:---:|
| **1** | **Audit & Polish Core Web Workflows**: Ensure 100% of web CRUD actions, rosters, and timetable conflict checks connect to real database models. | Phase 1 | 🟡 Current Focus |
| **2** | **Document Storage & File Uploads**: Implement direct-to-cloud file uploads for school logos, student avatars, and homework PDFs. | Phase 1 | Next |
| **3** | **Data Export & Report Cards**: Build downloadable printable PDF report cards and CSV attendance registers. | Phase 1 | Next |
| **4** | **In-App Notification Center**: Add real-time notification bell and event drawer in web navbar. | Phase 1 | Next |
| **5** | **Razorpay & Stripe Web Checkout**: Integrate payment modals, webhook handlers, and automated invoice settlements on web. | Phase 2 | Planned |
| **6** | **Perplexity AI Research Workspace**: Build conversational RAG workspace with persistent threads and academic citations on web. | Phase 2 | Planned |
| **7** | **Shiksha Sathi Curriculum Engine**: Implement CBSE/NCERT question banks and AI assignment generator on web. | Phase 2 | Planned |
| **8** | **React Native Mobile App Foundation**: Initialize mobile repository, auth screens, and push notification tokens. | Phase 3 | Planned |
| **9** | **Mobile Communications Hub**: Deploy teacher-parent messaging, circulars, and emergency broadcast dispatches. | Phase 3 | Planned |
| **10**| **VisionFlow AI Face Attendance**: Train face embedding pipeline, integrate mobile camera snap, and automate classroom roll-call. | Phase 3 | Planned |

