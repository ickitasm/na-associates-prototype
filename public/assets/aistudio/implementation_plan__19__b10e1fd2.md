# Staff Portal InfoHint Consolidation & Mobile Left-Alignment

This update streamlines guidance across every Staff Portal screen to strictly one `(i)` InfoHint popover per view, cleans up the Project status banner layout, and ensures all Staff page headers remain cleanly left-aligned across desktop, tablet, and Android/mobile viewports.

## User Review & Critical Decisions

> [!NOTE] All specifications from your request are incorporated directly with zero loss of guidance text.

- **Single InfoHint Per View**: Consolidate sub-panel hints into each module's main page `<h1>` InfoHint (and solely beside `Field Quick Actions` on the Dashboard overview).
- **Mobile Header Alignment Fix**: Resolve the CSS cascade override where `.staff-page-header` centered stacked column headers on viewports `<= 780px`, enforcing strict left-alignment across all breakpoints.

## 1. Overview & Core Concept

- **What It Does**: Eliminates redundant `(i)` InfoHint icons inside Staff sub-panels and status banners while preserving all operational and workflow guidance inside a single, predictably placed InfoHint per screen. Simultaneously fixes mobile flex-column alignment so Staff page titles sit flush left on Android phones just as they do on desktop.
- **Target Audience / Persona**: Field Architects and Studio Staff reviewing assigned sites, daily logs, design files, and materials on mobile phones or desktop browsers.
- **Key Value**: Cleaner visual scanning, zero floating `(i)` icons inside status bars, and consistent left-aligned typography across every screen size.

## 2. User Experience & Visual Design

- **Key User Flows**:
  - **Staff Dashboard Overview**: Greeting header renders clean (`Good evening, Raka.`) with no `(i)` icon. `Field Quick Actions` displays the single Dashboard `(i)` popover explaining that staff submissions save as `Draft` for Admin review and recent non-financial updates appear below. `Recent Field Activity` renders with a clean heading.
  - **Module Sub-Pages (`Field Operations`, `Output & Design`, `Shopping & Materials`, `Notifications`, `Activity Log`)**: Each screen shows exactly one `(i)` button inline immediately to the right of the left-aligned `<h1>` page title. All inner sub-panel headings (`Milestones`, `Daily Progress`, `Output & Design Files`, `Material requests for field procurement`, `Material usage`, `Field notifications`, `Operational Audit Trail`) and the `Project status` banner render cleanly without `(i)` icons.
- **Consolidated Guidance Copy**:
  - **Field Operations**: `"Create and edit draft daily progress logs before Admin review. Project milestones are read-only schedule references."`
  - **Output & Design**: `"Upload and revise draft site drawings, plans, and output files for Admin review before client publication."`
  - **Shopping & Materials**: `"Submit draft material procurement requests and record actual site material usage. Cost estimates are restricted to Admin."`
  - **Notifications**: `"View official studio announcements, published project updates, and Admin feedback on your submitted field drafts."`
  - **Activity Log**: `"Immutable audit trail recording all Staff CREATE, UPDATE, and DELETE draft actions across your assigned projects."`
- **Visual Identity & Layout Alignment**:
  - Preserves existing warm studio neutrals, typography (`Manrope` / display scale), and Light + Dark mode contrast tokens.
  - Fixes the mobile flex-column cascade on `.admin-page-header` and `.staff-page-header` (`align-items: flex-start; text-align: left; width: 100%;`) at `<= 780px` and `<= 640px`, keeping the inline `<h1>` + `(i)` wrapper (`display: inline-flex; align-items: center; gap: 8px; flex-wrap: nowrap; text-align: left;`) flush left alongside any primary action button below it.

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Merging Sub-Panel Hints into Top Page Hints**
  - *Chosen Approach*: Consolidate read-only milestone notices, cost restriction notes, draft workflow rules, and audit trail explanations into the single page-level InfoHint on each module view (and into `Field Quick Actions` on the Dashboard).
  - *Why*: Eliminates repetitive `(i)` icons across stacked mobile cards while ensuring zero instructional detail is lost.
  - *Alternatives Considered*: Keeping two or more hints per page would reintroduce visual noise on compact Android screens.
- **Decision 2: Fixing Flex-Column Header Alignment in Stylesheets**
  - *Chosen Approach*: Keep `align-items: center` only for horizontal desktop rows (`> 780px`), explicitly enforcing `align-items: flex-start; justify-content: flex-start; text-align: left; width: 100%;` on header containers and `flex-wrap: nowrap` on the title + InfoHint inline wrapper on mobile breakpoints (`<= 780px` and `<= 640px`).
  - *Why*: Previously, `.staff-page-header { align-items: center; }` appeared later in the stylesheet than the `780px` media query, causing stacked vertical mobile headers to center instead of aligning left.

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Staff Page View (Dashboard / Operations / Design / Materials / etc.)    │
├─────────────────────────────────────────────────────────────────────────┤
│  Header Row (.admin-page-header.staff-page-header)                      │
│  ┌─────────────────────────────────────────────┐  ┌──────────────────┐  │
│  │ Left-Aligned Inline Wrapper (flex, nowrap)  │  │ Primary CTA      │  │
│  │ [<h1> Title] + [Single (i) InfoHint]        │  │ (stacks left on  │  │
│  │ (Dashboard greeting omits InfoHint)         │  │  <= 780px)       │  │
│  └─────────────────────────────────────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│  Content Panels                                                         │
│  ├─ Dashboard: [Field Quick Actions + Single (i)] & [Recent Activity]   │
│  └─ Modules:   [Clean Project Status Banner] & [Clean Panel Headings]   │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Header Component & Props**: The Staff page header accepts an optional `infoHint` prop and renders the single inline InfoHint popover beside `<h1>` inside `.staff-heading-inline`, while the `Project status` banner renders only the status label and `StatusTag` pill.
- **Responsive Cascade**: Responsive rules at `<= 780px` and `<= 640px` sit after base Staff header rules in the global stylesheet so left-alignment holds consistently across desktop, tablet, and Android viewports in both Light and Dark modes without affecting Client Portal or Admin headers.
