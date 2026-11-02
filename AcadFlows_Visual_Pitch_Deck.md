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

<p class="eyebrow">A connected operating system for schools</p>

# School operations.<br><span style="color:#FF9100">One connected flow.</span>

<p style="font-size:22px;max-width:520px">Meet **AcadFlows**: one platform connecting the people and processes behind every school day.</p>

<span class="pill">Administrators</span><span class="pill">Teachers</span><span class="pill">Students</span><span class="pill">Guardians</span>

<p class="tiny" style="color:#D8C9C0;margin-top:35px">STARTUP PITCH · NOVEMBER 2026</p>

<!-- _notes: Start with the everyday reality of a school: many people, many moving parts, one shared responsibility. AcadFlows is designed to connect those moving parts in one platform. Do not begin with technical architecture. -->

---

<p class="eyebrow">The everyday reality</p>

# A school day creates a lot of moving pieces.

<div class="cards4">
<div class="card"><div class="icon">🧑‍🎓</div><h3>Students</h3><p>Records, grades, attendance</p></div>
<div class="card"><div class="icon">👩‍🏫</div><h3>Teachers</h3><p>Classes, assignments, updates</p></div>
<div class="card"><div class="icon">🏫</div><h3>Administration</h3><p>People, fees, approvals</p></div>
<div class="card"><div class="icon">👨‍👩‍👧</div><h3>Guardians</h3><p>Progress, notices, payments</p></div>
</div>

<p class="quote" style="margin-top:42px">But the information they need is often <span class="red">spread everywhere.</span></p>

<!-- _notes: Use this slide to help an audience unfamiliar with school software picture the stakeholders. Each group needs different information, but they are all part of the same school ecosystem. -->

---

<p class="eyebrow">The problem</p>

# The school runs on too many places.

<div class="cards3">
<div class="card"><div class="icon">📊</div><h3>Spreadsheets</h3><p>Student lists, attendance, fee records</p></div>
<div class="card"><div class="icon">💬</div><h3>Messaging apps</h3><p>Notices, reminders, classroom updates</p></div>
<div class="card"><div class="icon">📁</div><h3>Paper and files</h3><p>Forms, approvals, report records</p></div>
</div>

<div class="center" style="margin-top:28px">
  <span class="pill">Duplicate entry</span>
  <span class="pill">Missed updates</span>
  <span class="pill">Manual follow-up</span>
  <span class="pill">Limited visibility</span>
</div>

<!-- _notes: Explain the cost of fragmentation without inventing numbers. The same information can be entered more than once, updates can be missed, and staff spend time checking which record is current. Ask the audience if this resembles the schools they know. -->

---

<!-- _class: dark -->
<p class="eyebrow">The opportunity</p>

# The issue isn't effort.<br>It's the way work is connected.

<div class="cards3">
<div class="card"><div class="num">01</div><h3>Scattered information</h3><p>Different tools hold different pieces of the story.</p></div>
<div class="card"><div class="num">02</div><h3>Repeated work</h3><p>People spend time updating and reconciling records.</p></div>
<div class="card"><div class="num">03</div><h3>Unclear status</h3><p>Leaders and families lack a shared view.</p></div>
</div>

<p class="quote" style="margin-top:32px">Schools need a <span style="color:#FF9100">connected workflow</span>, not another disconnected tool.</p>

<!-- _notes: Position this as an operational problem, not a criticism of school staff. Existing tools are often adopted because they are convenient and familiar. The challenge is coordinating them as school operations become more complex. -->

---

<p class="eyebrow">Meet AcadFlows</p>

# One platform for the work behind school life.

<div class="cards2">
<div>
  <div class="bigline red">Manage</div><p class="sub">People, classes, fees, permissions</p>
  <div class="bigline orange" style="margin-top:20px">Coordinate</div><p class="sub">Attendance, assignments, timetables</p>
  <div class="bigline cyan" style="margin-top:20px">Connect</div><p class="sub">Announcements, messages, guardians</p>
</div>
<div class="mock">
  <div class="mocktop"><span>ACAD FLOWS · SCHOOL OVERVIEW</span><span style="color:#DF301C">● LIVE CONCEPT</span></div>
  <div class="mockgrid">
    <div class="tile"><b>Students</b>Records</div>
    <div class="tile"><b>Attendance</b>Daily view</div>
    <div class="tile"><b>Academics</b>Grades</div>
    <div class="tile"><b>Fees</b>Invoices</div>
    <div class="tile"><b>Classes</b>Timetable</div>
    <div class="tile"><b>Updates</b>Notices</div>
  </div>
  <div class="tile" style="margin-top:10px">One school workspace · Role-based access</div>
</div>
</div>

<!-- _notes: This is the central product slide. Explain AcadFlows in one sentence: it brings the essential administrative, academic, financial, and communication workflows into one school platform. The dashboard is an illustrative concept, not a screenshot of a shipped interface. -->

---

<p class="eyebrow">One school community</p>

# Different roles. One connected school.

<div class="center">
<div class="node" style="display:inline-block;width:240px;border-color:#DF301C">🏫 AcadFlows school workspace</div>
</div>
<div class="flow">
<div class="node">🧑‍💼<br>Admin</div><div class="arrow">↔</div>
<div class="node">👩‍🏫<br>Teacher</div><div class="arrow">↔</div>
<div class="node">🧑‍🎓<br>Student</div><div class="arrow">↔</div>
<div class="node">👨‍👩‍👧<br>Guardian</div>
</div>
<p class="center sub">Each role gets relevant access to the information and actions they need.</p>

<!-- _notes: Walk through each role briefly. The administrator configures and oversees the school. Teachers manage classroom activity. Students see learning information. Guardians receive appropriate visibility. Role-based access is central: not everyone should see or change everything. -->

---

<p class="eyebrow">Product experience</p>

# A quick look at the school command centre.

<div class="cards2">
<div class="mock">
  <div class="mocktop"><span>MONDAY · SCHOOL OVERVIEW</span><span>ACADEMIC YEAR</span></div>
  <div class="mockgrid">
    <div class="tile"><b>01</b>Attendance</div>
    <div class="tile"><b>02</b>Fee updates</div>
    <div class="tile"><b>03</b>Approvals</div>
  </div>
  <div class="tile" style="margin-top:10px">Today's activity <div class="bar"><span style="width:78%"></span></div></div>
  <div class="tile" style="margin-top:8px">Class and section overview <div class="bar"><span style="width:58%;background:#00B7CD"></span></div></div>
  <div class="tile" style="margin-top:8px">Pending tasks <div class="bar"><span style="width:35%;background:#FF9100"></span></div></div>
</div>
<div>
  <h3>Designed around real school tasks</h3>
  <p class="sub">A school-level view for administrators.</p>
  <p><span class="red">01</span> Know what needs attention.</p>
  <p><span class="orange">02</span> Move between connected workflows.</p>
  <p><span class="cyan">03</span> Keep relevant information together.</p>
  <p class="tiny muted">Illustrative dashboard concept, not a live product screenshot.</p>
</div>
</div>

<!-- _notes: This slide gives the audience a visual mental model of the product. Be transparent that this is a concept visualization. Replace it with a real product screenshot once the interface is ready and approved for external sharing. -->

---

<p class="eyebrow">What it covers</p>

# The essential workflows, together.

<div class="cards3">
<div class="card"><div class="icon">🎓</div><h3>Academic life</h3><p>Students · Teachers · Grades · Reports · Assignments</p></div>
<div class="card"><div class="icon">🗓️</div><h3>School operations</h3><p>Attendance · Timetables · Approvals · Academic structure</p></div>
<div class="card"><div class="icon">💳</div><h3>Finance and connection</h3><p>Fees · Invoices · Payments · Messages · Guardians</p></div>
</div>

<p class="center sub" style="margin-top:25px">One permission model helps keep access appropriate to each role.</p>

<!-- _notes: Summarize the breadth without reading a long feature list. Group the capabilities into academic life, daily operations, and finance and communication. Make sure the team can distinguish live features from features still under development before presenting. -->

---

<!-- _class: dark -->
<p class="eyebrow">How it works</p>

# Set up once. Use it every school day.

<div class="flow">
<div class="node">01<br><span class="red">Create</span><br>school space</div>
<div class="arrow">→</div>
<div class="node">02<br><span class="orange">Configure</span><br>classes and year</div>
<div class="arrow">→</div>
<div class="node">03<br><span class="cyan">Connect</span><br>people and roles</div>
<div class="arrow">→</div>
<div class="node">04<br><span style="color:#FF9100">Operate</span><br>daily workflows</div>
</div>
<p class="center" style="margin-top:36px">From onboarding to everyday school activity, information stays connected.</p>

<!-- _notes: Explain the setup journey in four steps. A school gets its own workspace, configures its academic structure, adds users and roles, and begins using the workflows. Avoid promising a setup duration until it has been tested with real schools. -->

---

<p class="eyebrow">Designed for more than one school</p>

# One platform. Separate school workspaces.

<div class="center">
<div class="node" style="display:inline-block;width:270px;background:#1E140F;color:white;border:0">ACAD FLOWS PLATFORM</div>
</div>
<div class="flow">
<div class="node" style="border-top:5px solid #DF301C">School A<br><span class="small muted">Its own records and users</span></div>
<div class="node" style="border-top:5px solid #FF9100">School B<br><span class="small muted">Its own records and users</span></div>
<div class="node" style="border-top:5px solid #00B7CD">School C<br><span class="small muted">Its own records and users</span></div>
</div>
<p class="center sub">A multi-tenant model lets multiple schools use the platform with separated workspaces.</p>
<p class="tiny muted center">Tenant isolation and access controls must be validated through security testing.</p>

<!-- _notes: Define multi-tenancy simply. AcadFlows is one platform that can serve multiple schools, while each school works in its own separated workspace. This is a product architecture goal and must be backed by implementation and testing. Avoid claiming that isolation is guaranteed until it has been independently reviewed. -->

---

<p class="eyebrow">Who we start with</p>

# Start focused. Solve a real school need.

<div class="cards2">
<div>
  <img class="photoTall" src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=85">
</div>
<div style="padding-top:10px">
  <span class="pill">Initial customer profile</span>
  <h2>Independent and growing schools</h2>
  <p class="sub">Especially those moving beyond spreadsheet-led administration.</p>
  <div class="card" style="margin-top:20px"><h3>Buyers</h3><p>Owners · Principals · School management</p></div>
  <div class="card" style="margin-top:10px"><h3>Everyday users</h3><p>Administrators · Teachers · Students · Guardians</p></div>
</div>
</div>

<!-- _notes: This is the proposed starting segment, not a claim about existing customers. Independent and growing schools may be a useful initial focus because their decision-makers can be accessible and their workflows easier to understand. Validate this through discovery calls. -->

---

<p class="eyebrow">Market opportunity</p>

# A broad need. A focused first market.

<div class="cards3">
<div class="card"><div class="num">TAM</div><h3>Total market</h3><p>All schools that could use school-management software.</p></div>
<div class="card"><div class="num">SAM</div><h3>Serviceable market</h3><p>Target school segments in chosen geographies.</p></div>
<div class="card"><div class="num">SOM</div><h3>Initial opportunity</h3><p>Schools reachable with our early sales capacity.</p></div>
</div>
<p class="quote" style="margin-top:35px">Size the opportunity from <span class="red">school counts × realistic annual pricing.</span></p>
<p class="tiny muted">No unsupported market-size statistics included. Add verified geography, school counts, and pricing assumptions.</p>

<!-- _notes: Investors will expect a quantified market in a later version. Do not insert a generic global EdTech number. Define geography and target school type, source the number of eligible schools, estimate annual contract value, and calculate TAM, SAM, and SOM transparently. -->

---

<p class="eyebrow">Business model</p>

# Simple SaaS pricing that can grow with schools.

<div class="cards3">
<div class="card">
<span class="pill">CORE</span>
<h2>Base plan</h2>
<p>Essential school administration and academic workflows.</p>
<h3 class="red">Per school</h3>
</div>
<div class="card">
<span class="pill">GROWTH</span>
<h2>Growing plan</h2>
<p>Expanded workflows and capabilities as usage increases.</p>
<h3 class="orange">Per student</h3>
</div>
<div class="card">
<span class="pill">GROUP</span>
<h2>School groups</h2>
<p>Multi-campus needs, support, and consolidated oversight.</p>
<h3 class="cyan">Custom quote</h3>
</div>
</div>
<p class="center sub" style="margin-top:25px">Optional revenue: onboarding · migration · training · premium support</p>
<p class="tiny muted center">Pricing model proposal. Validate willingness to pay before publishing rates.</p>

<!-- _notes: Explain the logic, not invented price points. A base fee supports predictable budgeting, per-student pricing scales with school size, and custom group pricing can support more complex needs. Test willingness to pay, implementation costs, and support burden with buyers. -->

---

<p class="eyebrow">Why AcadFlows</p>

# Not another spreadsheet. Not another chat group.

<div class="cards2">
<div class="card">
<h3>Today's patchwork</h3>
<p style="font-size:20px;color:#1E140F">📊 Spreadsheet</p>
<p style="font-size:20px;color:#1E140F">💬 Messaging app</p>
<p style="font-size:20px;color:#1E140F">📁 Paper records</p>
<p style="font-size:20px;color:#1E140F">🧩 Disconnected systems</p>
</div>
<div class="card" style="border:2px solid #DF301C">
<h3 class="red">AcadFlows ambition</h3>
<p style="font-size:20px;color:#1E140F">One school workspace</p>
<p style="font-size:20px;color:#1E140F">Connected workflows</p>
<p style="font-size:20px;color:#1E140F">Role-based access</p>
<p style="font-size:20px;color:#1E140F">Shared operational visibility</p>
</div>
</div>
<p class="tiny muted">Positioning hypothesis. Validate against specific competitors and customer feedback.</p>

<!-- _notes: Keep the comparison honest. Spreadsheets and messaging apps are cheap and familiar. Established school ERP products may have deep feature sets. AcadFlows aims to compete on connected everyday workflows and an accessible experience. Validate this through real comparisons and customer feedback. -->

---

<p class="eyebrow">Go to market</p>

# Earn trust. Prove value. Grow through schools.

<div class="flow">
<div class="node">🎯<br>Discover<br><span class="small muted">Talk to school leaders</span></div>
<div class="arrow">→</div>
<div class="node">🧪<br>Pilot<br><span class="small muted">Test real workflows</span></div>
<div class="arrow">→</div>
<div class="node">📈<br>Prove<br><span class="small muted">Measure adoption</span></div>
<div class="arrow">→</div>
<div class="node">🤝<br>Expand<br><span class="small muted">Referrals and groups</span></div>
</div>
<div class="cards3">
<div class="card"><h3>Founder-led outreach</h3><p>Direct conversations and demos</p></div>
<div class="card"><h3>School networks</h3><p>Educator and owner referrals</p></div>
<div class="card"><h3>Partners</h3><p>Local implementation relationships</p></div>
</div>

<!-- _notes: The early go-to-market motion should be direct and relationship-led. Find schools with a clear problem, run a focused pilot, measure whether the product is used, and convert successful pilots into paid relationships. Build repeatable onboarding before scaling acquisition. -->

---

<p class="eyebrow">Measure what matters</p>

# Prove the value in the pilot.

<div class="cards4">
<div class="card"><div class="icon">⏱️</div><h3>Admin effort</h3><p>Time spent on recurring tasks</p></div>
<div class="card"><div class="icon">📣</div><h3>Communication</h3><p>Update delivery and response</p></div>
<div class="card"><div class="icon">🗂️</div><h3>Data quality</h3><p>Duplicate and incomplete records</p></div>
<div class="card"><div class="icon">👀</div><h3>Visibility</h3><p>Time to find operational status</p></div>
</div>
<p class="quote" style="margin-top:40px">Don't just promise efficiency.<br><span class="red">Measure the difference.</span></p>

<!-- _notes: This is how AcadFlows should demonstrate value. Capture a baseline before onboarding, then compare task time, communication delivery, data completeness, and how quickly staff can find key information. Report the method and sample size. Do not claim percentage improvements until measured. -->

---

<!-- _class: dark -->
<p class="eyebrow">Roadmap</p>

# Build the foundation. Expand with evidence.

<div class="cards3">
<div class="card"><div class="num">NOW</div><h3>Make the core dependable</h3><p>Core workflows, role permissions, tenant isolation, pilot onboarding.</p></div>
<div class="card"><div class="num" style="color:#FF9100">NEXT</div><h3>Learn from real schools</h3><p>Usability, reporting, integrations, migration, support processes.</p></div>
<div class="card"><div class="num" style="color:#00B7CD">LATER</div><h3>Scale the ecosystem</h3><p>Mobile experiences, multi-campus tools, partner capabilities.</p></div>
</div>
<p class="tiny" style="color:#C7B8AF;margin-top:25px">Future items are roadmap proposals, not current capabilities.</p>

<!-- _notes: Make the distinction between current scope and future plans explicit. Prioritize reliability, tenant isolation, permissions, onboarding, and pilot feedback first. Advanced reporting, integrations, mobile experiences, and broader multi-campus capabilities should follow evidence of customer demand. -->

---

<!-- _class: cover -->
<!-- _paginate: false -->
![bg right:48%](https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=85)

<p class="eyebrow">The investment thesis</p>

# Better school days<br>start with <span style="color:#FF9100">better-connected work.</span>

<p style="max-width:520px">AcadFlows is building the operational layer that helps schools manage, coordinate, and communicate in one place.</p>

<div style="margin-top:32px">
<span class="pill">Pilot schools</span>
<span class="pill">Implementation partners</span>
<span class="pill">Aligned investors</span>
</div>
<p class="tiny" style="margin-top:30px;color:#D8C9C0">[Add founder name] · [Add email] · [Add website]</p>

<!-- _notes: Close with a clear invitation. For school leaders, ask for a pilot conversation. For partners, ask about implementation and distribution. For investors, ask for a follow-up meeting and share the validated milestones, funding ask, and evidence pack. -->

---

<p class="eyebrow">The 60-second pitch</p>

# AcadFlows, in one minute.

> Schools do important work every day, but the systems supporting that work are often disconnected. Student records may sit in spreadsheets, attendance is tracked separately, assignments move through messaging apps, and fee information lives somewhere else.
>
> AcadFlows is building one connected platform for school operations. It brings together student and teacher management, attendance, grades, assignments, fees, timetables, announcements, approvals, and guardian access. Each school gets its own workspace, with access shaped by each person's role.
>
> Our goal is practical: reduce fragmented work, make information easier to find, and improve visibility across the school community. We want to validate that value through focused school pilots, measure adoption and time saved, and grow through trusted school relationships.
>
> We are looking for pilot schools, partners, and investors who want to help make school operations simpler.

<!-- _notes: Speak naturally, not like reading a paragraph. Pause after the problem, explain the product in one sentence, then describe the outcomes as goals to validate. Finish with a clear invitation. -->

---

<p class="eyebrow">Design system</p>

# AcadFlows visual identity

<div class="cards2">
<div class="card">
<h3>Brand colors</h3>
<p><span style="color:#DF301C">●</span> AcadFlows red <code>#DF301C</code></p>
<p><span style="color:#FF9100">●</span> Energy orange <code>#FF9100</code></p>
<p><span style="color:#00B7CD">●</span> Clarity cyan <code>#00B7CD</code></p>
<p><span style="color:#FAF7F4">●</span> Warm background <code>#FAF7F4</code></p>
<p><span style="color:#1E140F">●</span> Deep ink <code>#1E140F</code></p>
</div>
<div class="card">
<h3>Visual language</h3>
<p>Headlines: Manrope ExtraBold</p>
<p>Body: DM Sans</p>
<p>Icons: simple rounded line icons</p>
<p>Photography: authentic classrooms and school communities</p>
<p>Layouts: large statements, diagrams, generous whitespace</p>
</div>
</div>
<p class="tiny muted">Photos used from Unsplash image CDN. Check each image's current license and availability before external distribution. Replace concept dashboard visuals with real product screenshots when available.</p>

<!-- _notes: Keep the deck visually consistent. Use real product screenshots whenever possible. Stock photography should support the story, not replace product evidence. Verify image licenses and availability before distributing the exported deck. -->
