---
marp: true
theme: default
paginate: true
size: 16:9
title: AcadFlows | The connected school
description: Visual startup pitch deck
style: |
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
  :root {
    --red: #DF301C; --orange: #FF9100; --cyan: #00B7CD;
    --ink: #1E140F; --paper: #FAF7F4; --muted: #81746C;
    --line: #E9DED6; --white: #FFFFFF;
  }
  section {
    background: var(--paper); color: var(--ink);
    font-family: 'DM Sans', sans-serif; font-size: 23px;
    padding: 54px 68px;
  }
  h1,h2,h3 { font-family: 'Manrope', sans-serif; letter-spacing: -.045em; color: var(--ink); }
  h1 { font-size: 2.35em; line-height: 1.03; font-weight: 800; margin: 10px 0 18px; }
  h2 { font-size: 1.8em; line-height: 1.08; font-weight: 800; margin: 8px 0 22px; }
  h3 { font-size: 1em; font-weight: 800; margin: 4px 0 10px; }
  p { line-height: 1.35; }
  strong { color: var(--red); }
  section::after { color: #9D8F86; font-size: 13px; }
  section.dark { background: var(--ink); color: white; }
  section.dark h1, section.dark h2, section.dark h3 { color: white; }
  section.dark p { color: #F3E8E1; }
  section.cover { background: #1E140F; color: white; }
  section.cover h1, section.cover h2 { color: white; }
  section.cover::after, section.dark::after { color: #C3B3A9; }
  .eyebrow { color: var(--red); text-transform: uppercase; letter-spacing: .16em; font-size: 14px; font-weight: 800; }
  .dark .eyebrow, .cover .eyebrow { color: #FFAB80; }
  .sub { color: var(--muted); font-size: 18px; }
  .small { font-size: 16px; }
  .tiny { font-size: 12px; }
  .red { color: var(--red); } .orange { color: var(--orange); } .cyan { color: var(--cyan); }
  .pill { display: inline-block; border: 1px solid var(--line); border-radius: 30px; padding: 6px 13px; font-size: 13px; margin: 3px 4px 3px 0; }
  .cards2 { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .cards3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .cards4 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .card { background:white; border:1px solid var(--line); border-radius:18px; padding:18px 20px; }
  .dark .card { background:#30231D; border-color:#4A382E; }
  .card p { font-size:16px; margin:5px 0 0; color:var(--muted); }
  .dark .card p { color:#D9C9BF; }
  .num { font: 800 38px 'Manrope'; color:var(--red); }
  .icon { font-size:30px; margin-bottom:9px; }
  .bigline { font: 800 30px 'Manrope'; letter-spacing:-.04em; }
  .muted { color:var(--muted); }
  .center { text-align:center; }
  .right { text-align:right; }
  .flow { display:flex; align-items:center; justify-content:space-between; gap:9px; margin:28px 0; }
  .node { flex:1; background:white; border:1px solid var(--line); border-radius:16px; text-align:center; padding:17px 10px; font-size:16px; font-weight:800; }
  .dark .node { background:#30231D; border-color:#4A382E; color:white; }
  .arrow { color:var(--orange); font-size:25px; font-weight:800; }
  .mock { background:#FFFFFF; border:1px solid #E7DCD4; border-radius:20px; padding:16px; box-shadow:0 12px 32px #1E140F12; }
  .mocktop { display:flex; justify-content:space-between; border-bottom:1px solid #EEE5DF; padding-bottom:12px; margin-bottom:13px; font-size:13px; font-weight:800; }
  .mockgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
  .tile { background:#FAF7F4; border-radius:12px; padding:12px; font-size:12px; color:#756B65; }
  .tile b { display:block; color:#1E140F; font:800 22px 'Manrope'; }
  .bar { height:8px; border-radius:8px; background:#F0E7E1; margin-top:8px; overflow:hidden; }
  .bar span { display:block; height:8px; border-radius:8px; background:var(--red); }
  .photo { border-radius:22px; object-fit:cover; width:100%; height:330px; }
  .photoTall { border-radius:22px; object-fit:cover; width:100%; height:440px; }
  .quote { font:700 28px 'Manrope'; line-height:1.2; letter-spacing:-.03em; }
  .foot { position:absolute; bottom:24px; left:68px; font-size:12px; color:#A4948A; }
---

<!-- _class: cover -->
<!-- _paginate: false -->
![bg right:52%](https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=85)

<p class="eyebrow">Unifying India's fragmented education system</p>

# School operations.<br><span style="color:#FF9100">One connected flow.</span>

<p style="font-size:22px;max-width:520px">Meet **AcadFlows**: one platform connecting the people, processes, and career pathways behind every school day.</p>

<span class="pill">Administrators</span><span class="pill">Teachers</span><span class="pill">Students</span><span class="pill">Guardians</span>

<p class="tiny" style="color:#D8C9C0;margin-top:35px">STARTUP PITCH · NOVEMBER 2026</p>

<!-- _notes: Start with the everyday reality of a school: many people, many moving parts, one shared responsibility. AcadFlows connects those moving parts in one single platform. -->

---

<p class="eyebrow">The crisis</p>

# 90% of Indian students choose careers blindly.

<div class="cards3">
<div class="card"><div class="num">10%</div><h3>Guidance gap</h3><p>Only 10% receive professional career guidance — the rest drift on family pressure or 'safe' job myths[cite: 2].</p></div>
<div class="card"><div class="num">73%</div><h3>Wrong stream</h3><p>Students choose the wrong stream by Class 10, and 90% regret it within 3 years[cite: 2].</p></div>
<div class="card"><div class="num">8.25%</div><h3>Alignment</h3><p>Only 8.25% of graduates work in roles truly aligned to their qualifications[cite: 10].</p></div>
</div>

<p class="quote" style="margin-top:32px">A crisis hiding in plain sight: missing data and <span class="red">fragmented career pathways.</span></p>

<!-- _notes: Highlight the deep structural problem in Indian K-12 education: students choose streams and careers without data-backed insights or modern alignment. -->

---

<p class="eyebrow">The operational problem</p>

# India's school system is running on chaos.

<div class="cards3">
<div class="card"><div class="icon">📊</div><h3>Paper & Registers</h3><p>Roughly 1.5 million schools in 2026; 65% lack meaningful software[cite: 3].</p></div>
<div class="card"><div class="icon">💬</div><h3>Scattered Tools</h3><p>Relying on Excel sheets, WhatsApp groups, and manual memory[cite: 3].</p></div>
<div class="card"><div class="icon">📁</div><h3>Zero Unified Data</h3><p>No consolidated view of student performance, interest, or career readiness[cite: 3].</p></div>
</div>

<div class="center" style="margin-top:28px">
  <span class="pill">Duplicate entry</span>
  <span class="pill">Missed updates</span>
  <span class="pill">Manual follow-up</span>
  <span class="pill">Broken parent communication</span>
</div>

<!-- _notes: Show how administrative friction compounds the problem. Schools are buried under disjointed tools that prevent holistic student tracking. -->

---

<!-- _class: dark -->
<p class="eyebrow">The market opportunity</p>

# A massive market at a generational inflection point.

<div class="cards3">
<div class="card"><div class="num" style="color:#FF9100">₹33.3B</div><h3>EdTech by 2034</h3><p>India's edtech market is projected to reach USD 33.3B by 2034 at a 27.9% CAGR[cite: 5].</p></div>
<div class="card"><div class="num" style="color:#00B7CD">43%</div><h3>K-12 Focus</h3><p>K-12 remains the fastest-growing core segment in Indian education[cite: 5].</p></div>
<div class="card"><div class="num" style="color:#FFAB80">$2B</div><h3>AI in Education</h3><p>AI adoption in education is scaling to $2B by 2032 — right where AcadFlows sits[cite: 5].</p></div>
</div>

<p class="quote" style="margin-top:32px">Schools need a <span style="color:#FF9100">connected operating system</span>, not another standalone point solution.</p>

<!-- _notes: Frame the market timing. The intersection of rapid EdTech growth and AI integration makes 2026 the ideal moment for an integrated school OS. -->

---

<p class="eyebrow">Meet AcadFlows (SchoolOS)</p>

# One platform for the work behind school life.

<div class="cards2">
<div>
  <div class="bigline red">Manage</div><p class="sub">Admissions, attendance, fees, payroll, exams</p>
  <div class="bigline orange" style="margin-top:16px">Guide</div><p class="sub">Real-time performance tracking & AI insights</p>
  <div class="bigline cyan" style="margin-top:16px">Connect</div><p class="sub">Unified teacher-student-parent communication</p>
</div>
<div class="mock">
  <div class="mocktop"><span>ACAD FLOWS · SYSTEM OVERVIEW</span><span style="color:#DF301C">● LIVE PLATFORM</span></div>
  <div class="mockgrid">
    <div class="tile"><b>Admissions</b>CRM Pipeline</div>
    <div class="tile"><b>Attendance</b>6 Statuses</div>
    <div class="tile"><b>Academics</b>Exams & Reports</div>
    <div class="tile"><b>Fees</b>18-30% Boost</div>
    <div class="tile"><b>AI Tools</b>Parent Assistant</div>
    <div class="tile"><b>Workflows</b>Role-Based</div>
  </div>
  <div class="tile" style="margin-top:10px">13 production modules · Single & multi-campus support</div>
</div>
</div>

<!-- _notes: Introduce AcadFlows as the comprehensive solution unifying administration, academics, financial workflows, and parent communication. -->

---

<p class="eyebrow">The stakeholder triangle</p>

# Built for teachers, students, and parents.

<div class="cards3">
<div class="card"><div class="icon">👩‍🏫</div><h3>Teachers</h3><p>Real-time insights into student learning gaps to act before problems compound[cite: 8].</p></div>
<div class="card"><div class="icon">🧑‍🎓</div><h3>Students</h3><p>Personalized learning paths, career tracking, and skill development tailored individually[cite: 8].</p></div>
<div class="card"><div class="icon">👨‍👩‍👧</div><h3>Parents</h3><p>Transparent communication, live progress tracking, and informed decision-making[cite: 8].</p></div>
</div>

<p class="center sub" style="margin-top:25px">Technology that embeds naturally — zero friction, absolute clarity.</p>

<!-- _notes: Emphasize how the platform brings harmony to the three core pillars of the school ecosystem without adding administrative burden. -->

---

<p class="eyebrow">Beyond traditional ERP</p>

# AI literacy, coding, and real-world exposure.

<div class="cards2">
<div class="card">
<h3>AI & Coding Platform</h3>
<p>Students learn modern skills through in-app coding lessons and practical data analysis tools built directly into the workflow.</p>
</div>
<div class="card">
<h3>Entrepreneurship & Hackathons</h3>
<p>Embedded hackathons and startup programs turn classrooms into innovation hubs fully aligned with NEP 2020 holistic mandates[cite: 9].</p>
</div>
</div>

<p class="center sub" style="margin-top:25px">Transforming students from passive consumers into capable, informed builders[cite: 7].</p>

<!-- _notes: Highlight the unique differentiation: AcadFlows is not just an administrative ledger; it embeds future-ready AI, coding, and entrepreneurship modules. -->

---

<p class="eyebrow">Market validation</p>

# Proven ROI that schools can measure in months.

<div class="cards4">
<div class="card"><div class="num">40+</div><h3>Hours Saved</h3><p>Saved per week per 1,000 students after moving to an integrated ERP[cite: 10].</p></div>
<div class="card"><div class="num">2-4m</div><h3>Payback</h3><p>Fast ROI payback period resulting in months, not years[cite: 10].</p></div>
<div class="card"><div class="num">30%</div><h3>Fee Collection</h3><p>18% to 30% tangible improvement in fee collection rates[cite: 6, 10].</p></div>
<div class="card"><div class="num">100%</div><h3>Transparency</h3><p>Parents finally gain reliable, real-time visibility into student progress[cite: 10].</p></div>
</div>

<p class="quote" style="margin-top:35px">Deliver operational efficiency while building <p class="red" style="display:inline">lasting trust with families.</p></p>

<!-- _notes: Ground the pitch in hard metrics: time saved, rapid payback periods, and improved cash flow from automated fee tracking. -->

---

<!-- _class: dark -->
<p class="eyebrow">Simple, transparent pricing</p>

# Pricing that scales with institutional growth.

<div class="cards3">
<div class="card">
<span class="pill">ESSENTIALS</span>
<h2>Essentials Plan</h2>
<p>Core admissions, attendance, fees, and exams for single-campus K-12 schools.</p>
<h3 class="red">₹7 / student / mo</h3>
</div>
<div class="card">
<span class="pill">GROWTH</span>
<h2>Growth Plan</h2>
<p>Advanced features, timetables, transport, and AI parent assistant tools.</p>
<h3 class="orange">₹10 / student / mo</h3>
</div>
<div class="card">
<span class="pill">ENTERPRISE</span>
<h2>Enterprise</h2>
<p>Multi-campus consolidation, custom AI workflows, and white-labeled apps.</p>
<h3 class="cyan">Custom Quote</h3>
</div>
</div>
<p class="center sub" style="margin-top:25px;color:#F3E8E1">No setup fees · Free managed data migration included on Growth & Enterprise</p>

<!-- _notes: Clearly present the SaaS pricing tiers designed to capture single schools up to multi-campus trusts without complex per-module upsells. -->

---

<p class="eyebrow">Go-to-market & execution</p>

# Built for rapid onboarding and trusted expansion.

<div class="flow">
<div class="node">🎯<br>Discover<br><span class="small muted">Direct founder outreach</span></div>
<div class="arrow">→</div>
<div class="node">⚡<br>Deploy<br><span class="small muted">Live in days via CSV</span></div>
<div class="arrow">→</div>
<div class="node">📈<br>Prove<br><span class="small muted">Measure fee & time ROI</span></div>
<div class="arrow">→</div>
<div class="node">🤝<br>Expand<br><span class="small muted">Trust & group referrals</span></div>
</div>
<div class="cards3">
<div class="card"><h3>Admin-Led Setup</h3><p>School admins upload one roster to provision student and staff accounts, then share secure invite links or temporary credentials.</p></div>
<div class="card"><h3>Managed Migration</h3><p>Frictionless migration from Excel, Tally, Fedena, or EduSmart.</p></div>
<div class="card"><h3>Secure & Compliant</h3><p>Hosted in Mumbai, fully compliant with India's DPDP Act 2023.</p></div>
</div>

<!-- _notes: Detail the GTM strategy emphasizing speed of deployment, admin-led account provisioning, seamless migration paths from legacy setups, and strict local compliance. -->

---

<!-- _class: dark -->
<p class="eyebrow">Roadmap & vision</p>

# Unifying the future of education.

<div class="cards3">
<div class="card"><div class="num">NOW</div><h3>Core Reliability</h3><p>13 core production modules covering admissions, fees, exams, and attendance.</p></div>
<div class="card"><div class="num" style="color:#FF9100">NEXT</div><h3>AI Expansion</h3><p>Deepening regional language voice reminders and automated parent assistant capabilities.</p></div>
<div class="card"><div class="num" style="color:#00B7CD">LATER</div><h3>Ecosystem Scale</h3><p>Advanced multi-campus trusts, white-labeled mobile applications, and partner network scaling.</p></div>
</div>
<p class="tiny" style="color:#C7B8AF;margin-top:25px">Empowering schools to transition from administrative guesswork to intelligent decision-making.</p>

<!-- _notes: Conclude the core presentation with a clear roadmap showing traction today and scaling milestones tomorrow. -->

---

<!-- _class: cover -->
<!-- _paginate: false -->
![bg right:48%](https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=85)

<p class="eyebrow">The investment opportunity</p>

# Better school days<br>start with <span style="color:#FF9100">connected operations.</span>

<p style="max-width:520px">AcadFlows is building the unified operating system for India's schools, transforming administrative chaos into clarity and student growth.</p>

<div style="margin-top:32px">
<span class="pill">Pilot schools</span>
<span class="pill">Implementation partners</span>
<span class="pill">Aligned investors</span>
</div>
<p class="tiny" style="margin-top:30px;color:#D8C9C0">connect@acadflows.com · acadflows.com · Bangalore, India</p>

<!-- _notes: End with a strong call to action inviting pilots, partnerships, and strategic investment. -->
