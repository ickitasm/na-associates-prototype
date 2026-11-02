# NA Associates — Figma Handoff

Use this checklist to recreate/refine the interactive prototype as editable Figma frames and components. The browser prototype is a behavior and layout reference; it does not automatically generate an editable `.fig` file.

## Suggested Figma pages

### 00 — Cover & Project Notes
- Project cover.
- Scope summary.
- Prototype limitations and open decisions.

### 01 — Foundations
- Color variables.
- Typography styles.
- Spacing scale.
- Grid and breakpoints.
- Buttons, inputs, selects, textareas.
- Status tags, progress bars, cards, tables, upload controls.
- Modal, drawer, toast, empty/loading/error states.

### 02 — Public Website
- Home / desktop.
- Home / mobile.
- Projects / desktop + filters.
- Project Detail / desktop + mobile.
- Services.
- About.
- Career / default + submitted state.
- Contact / default + submitted state.
- Public navigation / mobile menu.

### 03 — Client Portal
- Login / role chooser (demo only).
- My Projects / desktop.
- My Projects / mobile.
- Project Workspace / Overview / desktop.
- Project Workspace / mobile navigation.
- A. Output & Design.
- B. Progress & Field Operations.
- C. Legal Documents.
- D. Billing & Payments.
- E. Shopping List.
- F. Monthly Recapitulation.
- Upload Payment Proof modal.
- Invoice detail modal.
- File preview modal.
- Project On Hold state.

### 04 — Admin Dashboard
- Dashboard.
- Projects list + Create Project modal.
- Clients & Accounts + Invite Client modal.
- Field Operations + New Daily Log modal.
- Documents & Legal + upload modal.
- Shopping & Materials + Draft/Published states.
- Billing & Payments + verification/rejection/revision modals.
- Notifications.
- Activity Log.
- Website Content.
- Settings / Primary Admin account state.

### 05 — Responsive & UI States
- Desktop reference: 1440px wide.
- Tablet reference: 768px wide.
- Mobile reference: 375px wide.
- Hover, focus, active, selected, disabled.
- Empty, loading, success, validation error, server/backend unavailable.
- Mobile sidebar drawer and modal bottom/full-screen states.

## Design tokens visible in the prototype

### Colors
- Ink / charcoal: `#272A27`
- Muted text: `#777B75`
- Border: `#E6E5DF`
- Paper / warm background: `#F7F6F2`
- White: `#FFFFFF`
- Olive: `#737B65`
- Dark olive: `#525B48`
- Sand: `#E9E5DC`
- Warm surface: `#F0EEE8`

### Typography
- UI/body: DM Sans.
- Display/headings: Manrope.
- Editorial italic emphasis: Georgia (serif fallback).

### Layout principles
- Architectural editorial aesthetic; restrained palette and generous whitespace.
- Public website uses image-led sections and editorial grids.
- Client workspace is a long single-page project document with anchored sections.
- Admin is a distinct multi-page management application with persistent sidebar on desktop.
- Tables should become mobile cards or controlled horizontal scrollers; avoid accidental page-wide horizontal overflow.

## Interaction prototypes to preserve in Figma

- Public nav changes page.
- Client Portal opens a demo role chooser.
- Client sees My Projects; selecting a card opens its Project Workspace.
- Project Workspace navigation scrolls to the selected section.
- Admin menu changes management pages.
- Draft/Published toggles change client visibility.
- Payment proof upload creates Pending Verification.
- Admin approval updates paid/remaining totals; rejection keeps proof history and reason.
- Invoice revision retains old invoice as Cancelled/Replaced and links a new revision.
- H+7 recommendation requires Admin confirmation; Hold preserves prior portal access/payment upload.
- Full verified payment changes project to Ready to Resume; Admin confirms Resume.
- Shopping List publication is separate from Material Usage entries.

## Content and design dependencies still needed from the studio

- Official logo files and brand guidelines, if available.
- Final approved project photography/renderings and usage permissions.
- Official studio email and WhatsApp number.
- Approved service descriptions, about copy, career copy, and contact details.
- Real project naming, data, contract wording, invoice/receipt format, and legal document templates.
