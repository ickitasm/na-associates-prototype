# NA Associates — Final Project Scope & Requirements

**Status:** Working project brief for prototype, Figma, and later production development  
**Date:** 2 November 2026  
**Brand:** NA Associates — Architecture & Design

This document consolidates the project requirements discussed so far. It distinguishes requirements from the original project brief (`data.docx` / meeting notes), later agreed product decisions, recommendations, and items still awaiting confirmation. It is intended to travel with the prototype source.

---

## 1. Project objective

Build a professional public website and a project-management portal for NA Associates. The product has three connected experiences:

1. **Public Website** — introduce the studio, services, and portfolio, and collect inquiries and career applications.
2. **Client Portal** — let invited clients follow their own project information, published design outputs, progress, legal documents, material requirements, invoices, payments, and monthly recaps.
3. **Admin Dashboard** — let the NA Associates internal team manage projects, clients, reports, documents, procurement, billing, notifications, website content, and activity history.

The current deliverable is an interactive UI/workflow prototype. It is not a production website and must not be used to store real client or financial information.

## 2. Source basis and decision labels

### 2.1 Requirements originating in `data.docx` / the initial client discussion

- Public website pages: Projects, Services, WebTitle/Home, About, Career, Contact/ContactUs.
- Portfolio/project information: location, land area, building area, description, images, project category, year, ongoing/completed status, and project management.
- Project categories include common/other, commercial, and residential.
- Client portal access through the main public website, with email/Google login as the intended direction.
- Per-client access to their own project information and files.
- Design outputs such as renderings, drawings, working sheets, images, and PDFs.
- Project progress, milestones/timeline, weekly reports, daily updates, site photographs, work details, notes, and attendance/equipment records.
- Legal documents, including initial/current contracts and addenda.
- Billing schedules, monthly invoices/installments, payment proofs, payment verification, receipts, reminders, and monthly recapitulations.
- Shopping List in an Excel-like format, entered internally and visible to clients.
- Internal and client account contexts, with internal account creation and assignment of projects.
- Reminder channels discussed: email, web notification/popup, and WhatsApp.
- An H+7 unpaid-payment consequence/hold concept and the ability for internal staff to adjust schedules when project progress is delayed.

### 2.2 Decisions made during follow-up discussion

- The Client Portal uses a **single long Project Workspace** with anchor navigation, not tabs that replace the entire page.
- The Admin Dashboard uses a **multi-page layout** with a sidebar.
- One Client account may have multiple assigned projects.
- The Admin chooses each project's cover image/rendering. No complex personal theme builder is required.
- All internal team members use the same operational role, called **Admin**.
- The first-created account is **Primary Admin / Owner**. Only this account may create or promote other Admin accounts.
- Each internal team member uses an individual account; accounts must not be shared.
- Attendance and internal work notes are internal-only. Admin chooses which progress reports become visible to clients.
- Shopping List and Material Usage are separate records and adjacent concepts, not one combined dataset.
- Shopping List has Draft/Published visibility. Recommendation: Admin reviews entries before they become visible to the Client.
- The Shopping & Materials module is procurement/material tracking, not a full accounting system.
- Hold should pause new operational work updates, not lock all portal access or remove historical records.

### 2.3 Recommendations, not yet confirmed as client policy

- Use one Admin module for Shopping & Materials with separate Shopping List/Procurement and Material Usage views.
- Keep supplier, purchase prices, purchase documents, and internal notes Admin-only.
- Keep clients able to access historical reports, documents, contracts, invoices, and payment upload during Hold.
- Allow Admin to upload completed design outputs during Hold when they are already finished and ready to share; do not treat this as a new operational progress update.
- Permit internal-only documentation during Hold if needed, but do not publish it as active progress.

## 3. Roles and access boundaries

### Guest

Can access public Home, Projects, Project Detail, Services, About, Career, and Contact. Cannot access client workspaces, legal records, private documents, invoices, payment proofs, attendance, or internal activity.

### Client

- Is invited by Admin using name, Google email, phone, and one or more assigned projects.
- Uses the invited Google email for the intended production login.
- Can access only assigned projects and the data/files published to that client.
- Can upload payment proof and see verification status and receipts.
- Cannot see internal attendance, internal notes, procurement prices, suppliers, or unpublished files/reports.
- One client account may have several projects.

Date of birth must not be used as a password or security factor.

### Admin

All Admins have the same operational rights to manage projects, clients, progress, documents, materials, invoices, notifications, and content. Only Primary Admin can add/promote Admin accounts. Production authorization must be enforced on the server/database, not by hiding frontend controls.

## 4. Public Website scope

### Home

- Header with NA Associates identity and primary navigation.
- Hero with strong studio statement and architecture imagery.
- Subtle title animation.
- Featured projects, studio introduction, service preview, and contact CTA.
- Footer.

### Projects and Project Detail

Project cards should show cover, name, location, category, year, and status. Provide search and filters for category/status/year. Project details include location, land area, building area, description, category, year, status, and image gallery.

### Services, About, Career, Contact

- Services: service descriptions and supporting visuals.
- About: studio profile, approach, and philosophy.
- Career: application form with name, email, phone, position, introduction, and CV/portfolio attachments.
- Contact: name, email, phone, project type, and message; email and WhatsApp are intended contact routes.

Contact/Career submissions in the prototype only show demo confirmation. Production delivery requires a server-side email integration. WhatsApp must use the official studio number and a `wa.me` link; the user must press Send themselves.

## 5. Client Portal scope

### Login and My Projects

Intended production login is Google OAuth limited to invited email addresses. After login, show My Projects cards with cover, name, location, status, progress, next milestone, and next payment (when applicable). Provide an empty state when no projects are assigned.

### Project Workspace — one long page

Desktop: sticky left anchor sidebar and main content. Tablet: top/horizontal navigation. Mobile: compact dropdown/horizontal navigation and single-column content; tables become cards and dialogs become full-screen/bottom sheets.

Sections, in order:

1. **Overview** — cover, project identity, location, status, progress, next milestone, next payment, recent activity, land/building area.
2. **A. Output & Design** — published renderings, presentations, working drawings, PDFs, previews, and downloads.
3. **B. Progress & Field Operations** — timeline/milestones, published daily progress, weekly recap, site photos, work details, and client-visible notes. Attendance is never client-visible.
4. **C. Legal Documents** — client-visible contracts, current contract, addenda, version/date metadata, preview/download.
5. **D. Billing & Payments** — active invoices, due dates, verified amount, balance, uploaded proof, verification state, payment history, receipts.
6. **E. Shopping List** — published material requirements, need date, specification, quantity, unit, notes, and procurement status. No internal supplier/purchase cost data.
7. **F. Monthly Recapitulation** — invoice, total billed, verified payments, proof records, receipts, and outstanding balance grouped by month.

A project's cover is selected by Admin and used on My Projects and the workspace header.

## 6. Admin Dashboard scope

Use a multi-page sidebar layout with topbar, breadcrumb, content area, and responsive drawer behavior.

Menu:
1. Dashboard
2. Projects
3. Clients & Accounts
4. Field Operations
5. Documents & Legal
6. Shopping & Materials
7. Billing & Payments
8. Notifications
9. Activity Log
10. Website Content
11. Settings

### Projects

Create/edit/archive projects. Fields: project name/code, location, land area, building area, category, description, start date, target completion, status, progress, cover, assigned client, team, timeline/milestones.

### Clients & Accounts

Invite Client with name, Google email, phone, and one or more projects. Production invitation must be emailed and linked to Google OAuth.

### Field Operations

Admin creates Daily Project Logs with:

- Daily Progress: date, work category, description, progress, notes, photos.
- Work Details: work type, description, area, status, photos.
- Attendance & Equipment: employee, attendance, job description, tools/equipment (Admin-only).
- Material Usage: material, quantity, unit, date, work area, notes.
- Notes & Documentation: internal notes and attachments.

Admin chooses Draft or Published. Weekly reports should be summarized from daily records where practical rather than requiring duplicate entry.

### Documents & Legal

Upload documents, set category, version/date, description, and visibility (Internal Only / Client Visible). Preserve old versions and history.

### Shopping & Materials

Keep separate datasets:

- Shopping List / Procurement: need date, material, spec, quantity, unit, status, supplier, internal unit cost/total, purchase date, purchase document, notes, client visibility.
- Material Usage: actual date, material, quantity, unit, work area, notes.

Clients see only published Shopping List fields approved for client visibility. Procurement costs/supplier and internal receipts remain internal.

### Billing & Payments

Subsections: Invoice List, Payment Verification, Receipts, Monthly Recapitulation, Invoice History.

Invoice fields: number, revision, project, client, issue date, due date, amount, status, PDF/reference, related addendum, replacement/revision reference.

Payment fields: payment date, claimed amount, approved amount, proof, status, verification date, verifier, reason, receipt.

## 7. Financial rules

### Partial payment

1. Client enters claimed amount and uploads proof.
2. Invoice shows Pending Verification while proof awaits review.
3. Admin enters approved amount. If it differs from claimed amount, reason is mandatory.
4. Only approved amounts count as money received.
5. Invoice shows Partially Paid until the verified total reaches invoice amount.
6. Each accepted payment has its own receipt.
7. Original due date does not change automatically after a partial payment.
8. If a revised installment schedule is agreed, Admin records the new date and reason; if contractual scope/schedule changes, create an addendum as appropriate.

### Pending and rejected proof

- Pending proof does not count as paid.
- Display verified total and pending claim separately.
- H+7 overdue clock pauses while proof is awaiting verification.
- Rejected proof remains in history with mandatory rejection reason; Client can submit a new proof.

### Overpayment

Record the excess amount and require Admin to decide whether it is credited to a future invoice or refunded. Record the decision and reason. Do not silently discard the difference.

### Invoice revision

- An issued invoice is never silently edited or deleted.
- Admin enters a mandatory reason.
- Old invoice becomes Cancelled/Replaced but remains archived.
- New invoice gets a revision number and reference to the replaced invoice.
- Due date remains unchanged by default; changes require a reason.
- Already verified payments are carried forward/linked once only; avoid double counting old and replacement invoices in totals.
- If revision changes price/scope, reference the appropriate addendum.
- Paid invoices are locked; post-payment correction uses additional invoice or credit/refund process.

### Hold / Resume

- H+7 after due date with outstanding verified balance and no pending proof creates a recommendation, not an automatic lock.
- Admin confirms Hold.
- Client retains access to existing records, legal documents, design outputs, invoices, payment history, and payment upload.
- New operational progress updates are paused.
- When all remaining payments are verified, project becomes Ready to Resume; Admin confirms Resume.

## 8. Notifications and Activity Log

Notification events: invoice issued, payment proof received/rejected, receipt available, new progress report/document, project status, Hold/Resume, and reminders at H-7, due date, and H+7.

Planned channels: email, in-app/web notification, WhatsApp. They are not active until a provider/backend is connected.

Activity Log should record actor, timestamp, action, affected project/object, previous/new values where relevant, and reason. Critical production financial/legal logs must be append-only and protected by backend policies.

## 9. Visual and responsive direction

Architectural editorial aesthetic: minimal, refined, neutral palette (warm white, off-white, charcoal, stone grey, restrained earthy accents), ample white space, clear grid, considered typography, high-quality architecture imagery. Avoid generic gradients or overly dense dashboards.

Responsive targets: 375px, 768px, 1024px, and 1440px. Use desktop sticky client anchor sidebar, tablet horizontal/top navigation, mobile navigation control. Admin sidebar collapses into a drawer. Data tables must become readable mobile cards or controlled horizontal scrollers.

## 10. Planned technical stack

- Vercel: hosting/deployment.
- Cloudflare: domain/DNS.
- Supabase: Auth, PostgreSQL, Storage, Row Level Security.

The prototype uses React + Vite, structured mock data, and browser localStorage. Production must implement real authentication, server/database authorization, RLS, secure private file access, email provider, and notification integrations. Never rely on frontend visibility alone as a security boundary.

## 11. Data concepts

Core entities to consider for production: profiles, projects, project_members, project_clients, project_milestones, project_progress_logs, project_work_details, employee_attendance, material_usage, shopping_items, project_files, legal_documents, invoices, invoice_revisions, payments, payment_receipts, monthly_recap, notifications, activity_logs, website_content.

Key relationships:
- One Client can have many projects.
- One project can have many milestones, reports, files, legal docs, materials, invoices, and activity records.
- One invoice can have multiple payment records.
- An approved payment gets its own receipt.
- An invoice revision links to its predecessor.

## 12. Open decisions requiring studio confirmation

1. Official NA Associates email and WhatsApp number.
2. Whether Shopping List changes always require Publish (prototype recommendation: yes).
3. Whether Admin may upload already-completed outputs during Hold (recommendation: yes, when they are completed deliverables, not new operational progress).
4. Whether Admin may add internal-only records during Hold (recommendation: yes if needed for documentation, but not publish active progress).
5. Expected service level for payment-proof verification (how long a proof may remain pending).
6. Document/file retention policy.
7. Detailed method for recalculating overall progress and changing project timelines after delay.
8. Final fields and legal/financial wording for invoices, receipts, and addenda.

## 13. Prototype limitations

The prototype is for reviewing design, navigation, role flows, and demo business rules. It does not provide real Google OAuth, secure authorization, Supabase database/storage, real file upload, emails, WhatsApp messages, payment processing, or fiscal receipts. All demo records live in localStorage in the browser and can be reset. Do not enter real confidential client, legal, or payment data.
