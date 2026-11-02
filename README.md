# NA Associates — Interactive Website Prototype

A responsive React + Vite prototype for the NA Associates public website, Client Portal, and Admin Dashboard.

## Requirements
- Node.js 20+ (Node 22 recommended)
- npm

## Run locally

1. Extract this ZIP.
2. Open the extracted `na-associates-prototype` folder in VS Code.
3. Open Terminal in that folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Build for preview

```bash
npm run build
npm run preview
```

## Demo access
- Public website: `/`
- Projects: `/projects`
- Project detail: `/projects/rumah-teduh`
- Client Portal: `/portal/client`
- Client project workspace: `/portal/client/projects/project-01`
- Admin Dashboard: `/admin/dashboard`

For the easiest entry, click **Client Portal** in the public header and choose a demo role.

## What can be tested

### Public website
- Home, Projects, Project Detail, Services, About, Career, and Contact screens.
- Project category/status filtering and search.
- Contact and Career form feedback states.

### Client Portal
- Demo login and My Projects.
- One client with two assigned projects.
- Project Workspace with sticky desktop anchor navigation and mobile section navigation.
- Published design files, legal documents, progress reports, and shopping requirements.
- Invoice details, payment history, upload of payment proof, and monthly recap.

### Admin Dashboard
- Dashboard and project overview.
- Create project and invite Client.
- Invite Admin from the seeded Primary Admin demo context.
- Daily project log with internal attendance/equipment fields and Draft/Published visibility.
- Document and legal document management.
- Shopping List and separate Material Usage records.
- Invoice creation, payment verification/rejection, partial payment, overpayment handling, invoice revision, and receipt references.
- H+7 Hold recommendation, manual Hold confirmation, Ready to Resume, and Resume confirmation.
- Notifications, Activity Log, Website Content overview, and Settings.

## Demo data and persistence
- Data is stored in browser `localStorage` under `na-associates-demo-v1`.
- Changes remain after refresh in the same browser.
- Use **Reset demo data** in Client or Admin to restore the original sample records.
- Sample account: Aditya Pratama (`aditya@example.com`).
- The demo has no real passwords. Choose Client/Admin from the Client Portal role chooser.

## Project structure

```text
src/
  components/
    ModalHost.jsx       Forms and confirmation/detail dialogs
    ui.jsx              Shared UI components
  data/
    seed.js             Initial demo database
  lib/
    utils.js            Formatting, IDs, and localStorage helper
  pages/
    PublicSite.jsx      Public website screens
    ClientPortal.jsx    Client project list and workspace
    AdminDashboard.jsx  Admin dashboard and management modules
  App.jsx               Role state, demo data state, and URL navigation
  main.jsx              React entry point
  styles.css            Responsive design system and page styling
```

## Important limitations

This is a **UI/UX and workflow prototype**, not a production system.

- Google Authentication is simulated. Role selection is not access control.
- Supabase Auth, PostgreSQL, Storage, and Row Level Security are not connected.
- File inputs only capture demo metadata; files are not uploaded to a server.
- Email, WhatsApp, reminders, and notifications are not actually sent.
- Payment verification and receipt references are simulated; no real money or fiscal receipt is involved.
- `localStorage` is not a secure database. Do not enter real client, legal, or payment information.
- Studio email and WhatsApp number are intentionally marked as awaiting confirmation because official contact details have not been supplied.

For production, implement server-side authorization and Supabase RLS; never rely on hidden frontend components to protect private project data.

## Project documentation
- `PROJECT_SPEC.md` — consolidated project scope, role rules, workflow decisions, financial rules, production plan, and open decisions.
- `DEMO_GUIDE.md` — click-through demo script for reviewing the main workflows.

## Verification note
The JS/JSX source files were syntax-parsed and local named imports/exports were checked. A full Vite build and in-browser interaction test could not be completed in this environment because `npm install` did not finish downloading dependencies. Run `npm install` and `npm run build` locally to complete that verification.
"# na-associates-prototype" 
