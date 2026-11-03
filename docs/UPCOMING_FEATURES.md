# AcadFlows Upcoming Features & Product Roadmap (PRD)

This document provides the technical architecture, product specifications, API contracts, and implementation blueprints for the next phase of **AcadFlows** product evolution.

---

## 📌 Executive Summary of Upcoming Roadmap

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          AcadFlows Next-Generation Platform                            │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ 1. Mobile App & Unified  │ 2. Omnichannel Digital   │ 3. Perplexity AI Research &      │
│    Communication Hub     │    Fee Payments          │    Academic Workspace            │
│  • React Native / Expo   │  • Razorpay / UPI / Net  │  • Persistent RAG Threads        │
│  • WebSocket Instant Chat│  • Automated Receipts    │  • Citation-Backed Answers       │
│  • Push Alerts (FCM)     │  • Installment Plans     │  • Student & Teacher Modes       │
├──────────────────────────┴──────────────────────────┴──────────────────────────────────┤
│ 4. Shiksha Sathi (NCERT / CBSE / NEP 2020 Curriculum Suite)                            │
│  • Curated Indian Question Bank  • 1-Click AI Homework Generator  • Free Public Access │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. VisionFlow: Classroom Group Photo AI Face Attendance                                │
│  • Mobile Camera Snap  • Multi-Face Detection  • Vector Matching  • Auto Roll-Call     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Module 1: AcadFlows Mobile App & Unified Communication Hub

### 1.1 Problem Statement & Objectives
Schools currently rely on fragmented, unmonitored channels (WhatsApp groups, SMS, paper diaries) to interact with parents and teachers. AcadFlows Mobile delivers a secure, institutional communications app with verified identity, audit trails, and instant alerts.

### 1.2 Target Platform & Architecture
- **Framework**: React Native with Expo (cross-platform iOS & Android) reusing `@acadflows/shared` types.
- **Push Notification Engine**: Firebase Cloud Messaging (FCM) & Apple Push Notification service (APNs).
- **Real-Time Messaging**: WebSockets (Socket.io) with offline message caching (SQLite / MMKV).

```
[Parent / Teacher Mobile] ◄──WebSocket (TLS)──► [AcadFlows Socket Gateway]
           │                                                │
           ▼                                                ▼
[Push Notification (FCM/APNs)] ◄──Worker── [Event Bus / MongoDB Collection]
```

### 1.3 Key Capabilities
1. **Teacher ↔ Parent Direct Messaging**: Office-hours bounded, monitored messaging with read receipts and translation support.
2. **Official School Circulars & Broadcasts**: Rich media dispatches (PDF circulars, event photos, emergency weather closures) with acknowledged-by-parent tracking.
3. **Emergency Alerts & Push Broadcasts**: High-priority push notifications bypassing silent hours for urgent safety notices.
4. **Voice Notes & Media Attachments**: 60-second voice notes for quick teacher instructions to young learners' parents.

### 1.4 Data Model & API Endpoints
- **Model**: `MessageThread`, `Message`, `NotificationPreference`
- **Endpoints**:
  - `POST /api/v1/communication/threads` — Initiate 1-on-1 or group thread
  - `GET /api/v1/communication/threads/:threadId/messages` — Paginated message history
  - `POST /api/v1/communication/messages` — Send text, voice note, or document
  - `POST /api/v1/communication/broadcasts` — Admin/Principal institution-wide broadcast

---

## 💳 Module 2: Omnichannel Digital Fee Payments (Web & Mobile)

### 2.1 Problem Statement & Objectives
Manual fee collection creates cash handling risks, long accounting reconciliation delays, and friction for parents. AcadFlows Fee Payments enables frictionless 1-click fee settlements across both web and mobile apps.

### 2.2 Payment Gateway Integrations
- **Primary Rail (India)**: **Razorpay** / **Cashfree** supporting UPI Intent (Google Pay, PhonePe, Paytm), NetBanking, Debit/Credit Cards, and EMI options.
- **International Rail**: **Stripe** for multi-currency international schools.

```
[Parent (Web / Mobile)] ──► Click "Pay Term Fees" ($450 / ₹35,000)
            │
            ▼
[Create Order API] ──► Generate Gateway Order ID & Signature
            │
            ▼
[Checkout Modal / UPI Intent Flow] ──► Parent Completes Payment
            │
            ▼
[Gateway Webhook / Signature Verification] ──► Atomic DB Transaction:
            │                                 • FeeInvoice: status = 'paid'
            │                                 • FeePayment: record created
            │                                 • PDF Receipt generated
            ▼
[Push Notification & Email] ──► Instant digital receipt delivered to parent
```

### 2.3 Key Capabilities
1. **1-Click UPI & Card Payments**: Mobile app directly invokes installed UPI apps (GPay, PhonePe, Cred) with zero manual VPA typing.
2. **Flexible Installment Schedules**: Parents can pay in terms, quarterly installments, or full-session advance with automated early-bird discount calculation.
3. **Automated Tax & Fee Receipts**: Instant GST/Tax compliant downloadable PDF receipts with school stamp and unique QR verification code.
4. **Smart Reminders**: Automated automated SMS, WhatsApp, and push alerts dispatched 7 days, 3 days, and on the due date.

### 2.4 API Endpoints
- `POST /api/v1/fees/checkout/create-order` — Initializes payment gateway session
- `POST /api/v1/fees/checkout/verify` — Validates cryptographic signature and updates ledger
- `POST /api/v1/fees/webhooks/razorpay` — Asynchronous webhook listener for background updates
- `GET /api/v1/fees/invoices/:invoiceId/receipt` — Streamable signed PDF download

---

## 🧠 Module 3: AcadFlows AI Research & Answer Workspace (Perplexity Engine)

### 3.1 Problem Statement & Concept
Students and teachers need a safe, hallucination-resistant, verified research tool tailored for educational inquiry. Inspired by Perplexity AI, this module offers a dedicated full-stack AI research workspace inside AcadFlows.

### 3.2 System Architecture
```
                                 ┌───────────────────────────────────┐
                                 │     User Asks Research Query      │
                                 └─────────────────┬─────────────────┘
                                                   │
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │      Query Reformulation &        │
                                 │    Semantic Search Embedding      │
                                 └─────────────────┬─────────────────┘
                                                   │
                        ┌──────────────────────────┴──────────────────────────┐
                        ▼                                                     ▼
           ┌────────────────────────┐                            ┌────────────────────────┐
           │ Academic Vector DB     │                            │ Curated Educational    │
           │ (NCERT, Curricula,     │                            │ Web Knowledge Base     │
           │ Peer-Reviewed Papers)  │                            │ (Filtered, Safe Search)│
           └────────────┬───────────┘                            └────────────┬───────────┘
                        │                                                     │
                        └──────────────────────────┬──────────────────────────┘
                                                   │
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │     RAG Synthesis & Citation      │
                                 │  (LLM Generates Answer + Sources) │
                                 └─────────────────┬─────────────────┘
                                                   │
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │ Persistent Thread Saved to Account│
                                 └───────────────────────────────────┘
```

### 3.3 Key Capabilities
1. **User Authentication & Thread Persistence**: Users sign in, ask questions, receive markdown-formatted answers with inline citations `[1]`, and resume previous conversations from a sidebar thread history.
2. **Verified Sources & Web Search**: Every response includes clickable source cards (academic repositories, Britannica, Khan Academy, NCERT).
3. **Role-Tailored Modes**:
   - **Student Mode**: Step-by-step Socratic explanations without directly giving test answers; high school and middle school difficulty toggles.
   - **Teacher Mode**: Generates lesson plans, case study prompts, curriculum summaries, and lab experiment instructions.
4. **Strict Educational Safety**: Automated child-safe filtering preventing non-educational, explicit, or harmful topics.

### 3.4 Data Model & Endpoints
- **Model**: `AiThread`, `AiMessage`, `AiCitation`
- **Endpoints**:
  - `POST /api/v1/ai/threads` — Create a new research session
  - `GET /api/v1/ai/threads` — List user's persistent Q&A threads
  - `POST /api/v1/ai/threads/:threadId/messages` — Submit prompt, stream SSE (Server-Sent Events) tokens with citations
  - `DELETE /api/v1/ai/threads/:threadId` — Delete research thread

---

## 🇮🇳 Module 4: Shiksha Sathi (NCERT / CBSE / NEP 2020 Educational Platform)

### 4.1 Mission & Vision
**Shiksha Sathi** (शिक्षा साथी) is a dedicated educational workspace purpose-built for Indian teachers and students. It bridges national curriculum standards (**NCERT**, **CBSE**, and the **National Education Policy / NEP 2020**) with modern classroom tools — enabling teachers to create aligned homework, browse curated question banks, and provide AI feedback **at zero cost**.

### 4.2 Key Capabilities
1. **Curated NCERT / CBSE Question Bank**:
   - Spanning Classes 1 through 12 across Mathematics, Science, Social Sciences, English, and Regional languages.
   - Categorized by Bloom's Taxonomy (Knowledge, Understanding, Application, Analysis, Evaluation).
   - Tagged with NEP 2020 Competency-Based Learning standards.
2. **1-Click AI Assignment Generator**:
   - Teacher selects: `Class 9`, `Science`, `Chapter 5: Fundamental Unit of Life`, `Difficulty: Balanced`.
   - The engine automatically generates a structured assignment containing:
     - 5 Multiple Choice Questions (MCQs) with explanations
     - 3 Short Answer Questions
     - 1 Real-World Case Study / Assertion-Reasoning question
3. **Rubric-Based AI Grading & Feedback**:
   - Evaluates handwritten or typed student submissions against CBSE marking schemes.
   - Highlights conceptual strengths, calculation mistakes, and suggested improvement areas.
4. **Bilingual & Vernacular Support**:
   - Seamless toggling between English and Hindi (with expansion to regional Indian languages: Tamil, Marathi, Bengali, Telugu).

### 4.3 Architecture & Open Access
- Embedded directly inside AcadFlows for enrolled schools.
- Accessible via a dedicated public workspace (`/shiksha-sathi`) as a high-impact social-good initiative empowering under-resourced Indian teachers.

---

## 📷 Module 5: VisionFlow: Classroom Group Photo AI Face Attendance

### 5.1 Problem Statement & Solution
Traditional manual roll-call wastes 10–15 minutes of every classroom period, while biometric fingerprint scanners create long queues and hygiene concerns. 

**VisionFlow** revolutionizes attendance: The class teacher opens the AcadFlows mobile app, snaps a single panoramic or standard group photo of the classroom, and AcadFlows' AI computer vision pipeline identifies all seated students and records their attendance in under 5 seconds.

### 5.2 End-to-End Pipeline

```
[Teacher Mobile App] ──► Camera Capture of Classroom
          │
          ▼
[Upload to AcadFlows API] ──► Pre-signed secure upload to temporary memory buffer
          │
          ▼
[VisionFlow AI Worker]
          │
          ├─► Step 1: Multi-Face Detection (YOLOv8-Face / RetinaFace)
          │           Detects 30–60 bounding boxes in single photo
          │
          ├─► Step 2: Quality & Alignment Filter
          │           Filters out low-resolution or extreme angle faces
          │
          ├─► Step 3: Facial Embedding Extraction (InsightFace / ArcFace)
          │           Extracts 512-dimensional vector per detected face
          │
          ├─► Step 4: Cosine Similarity Matching
          │           Matches against class student embeddings gallery
          │           (Enrolled during student profile creation)
          │
          ▼
[Roll-Call Output & Verification Screen]
          │
          ├─► Display list of Present (Green) & Absent (Red) students
          ├─► Teacher reviews preview, corrects any outlier with 1-click
          ├─► Teacher taps "Confirm & Submit"
          │
          ▼
[Database Persistence & Parent Alerts]
          │
          └─► Attendance record saved in MongoDB
          └─► Instant SMS / Push notification sent to absent students' parents
```

### 5.3 Student Facial Enrollment Workflow
1. During student registration or annual orientation, the school admin or class teacher uploads 2–3 clear reference photos of the student.
2. The system computes the student's normalized 512-dimensional vector embedding and stores it securely in `Student.faceEmbeddings`.
3. **Privacy First**: Raw biometric facial photos can be discarded after embedding generation; embeddings cannot be reverse-engineered into facial images.

### 5.4 Safety, Privacy & Fallback Guarantees
- **Human-in-the-Loop Review**: The AI generates a suggested roll-call, but the class teacher always validates the visual confirmation screen before committing.
- **Data Encryption**: All vector embeddings are encrypted at rest with AES-256.
- **Manual Override**: Teachers can instantly toggle any student between Present, Absent, or Late.

---

## 🗓️ Implementation Roadmap & Milestones

| Phase | Milestone | Core Deliverables | Target Window |
|:---:|---|---|:---:|
| **Q1** | **Mobile App & Communications** | React Native scaffold, push notifications, teacher-parent chat, school announcements. | Weeks 1–6 |
| **Q2** | **Digital Fee Payments** | Razorpay / Stripe gateway integration, mobile UPI intent, automated PDF receipts. | Weeks 7–10 |
| **Q3** | **Shiksha Sathi Curriculum Engine** | NCERT/CBSE question banks, 1-click AI assignment generator, bilingual Hindi/English. | Weeks 11–16 |
| **Q4** | **Perplexity AI Workspace** | Academic RAG pipeline, persistent user threads, citation cards, safe student mode. | Weeks 17–20 |
| **Q5** | **VisionFlow Face Attendance** | Mobile camera group capture, face detection & embedding matching, 1-tap roll-call. | Weeks 21–26 |

