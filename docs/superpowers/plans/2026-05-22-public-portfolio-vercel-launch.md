# Public Portfolio Vercel Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch the current public portfolio page from `znerationmedia-commits/index` on Vercel with the portfolio cards, consultation CTAs, and visible consultation lead form verified before production handoff.

**Architecture:** Treat this launch as a static public-site deployment from the repository root. The launch surface is `index.html` plus `vercel.json`; the consultation submission workflow, scheduling workflow, and teammate project-submission pipeline are explicitly deferred until after the public UI launch.

**Tech Stack:** Static HTML, inline Tailwind CDN styles, Vercel Git deployment, GitHub `main`

---

## Launch Scope

### In scope

- Public home page from `index.html`
- Public portfolio page state reached from the Portfolio CTA/navigation
- Visible portfolio cards and project-modal interaction
- Visible consultation CTAs such as the floating `Book a Free Call` tab and consultation buttons
- Visible consultation/contact form that currently promises a free consultation
- Vercel deployment from `znerationmedia-commits/index`
- Desktop and mobile visual smoke checks before accepting production

### Deferred after launch

- Persisting consultation-form submissions
- Sending leads to email, CRM, database, or admin lead table
- Calendar booking or 30-minute scheduling automation
- Real teammate/admin authentication
- Database-backed project submission and public portfolio sync

## Current File Map

- `index.html`: public homepage, in-page portfolio view, portfolio cards, CTAs, and consultation/contact form
- `vercel.json`: Vercel deployment headers for the static site
- `admin.html`: prototype admin/project-submission surface that must not be treated as production-ready during the public launch
- `README.md`: intended system architecture and repo workflow notes
- `ADMIN_PORTAL_PLAN.md`: future admin/auth/data work that is deferred from this launch

## Launch Decision Gate

The repository root currently includes `admin.html`. Because that page exposes a browser-side prototype login and browser-local project storage, decide its production treatment before the first public deployment is accepted:

1. Recommended: remove or exclude `admin.html` from the public launch branch until the protected admin flow is implemented.
2. Acceptable only for a temporary internal preview: leave `admin.html` present while clearly treating the deployment as non-production.

Do not claim the public launch is production-ready while the insecure admin prototype is knowingly exposed as part of the same deployment.

### Task 1: Confirm The Public UI Launch Contract

**Files:**
- Inspect: `index.html`
- Inspect: `vercel.json`
- Inspect: `README.md`

- [ ] **Step 1: Confirm the public portfolio elements already exist in code**

Run:

```bash
rg -n "Our Portfolio|projects-grid|Book a Free Call|Get Your|Free AI Readiness Audit|Send Message & Get a Free Consultation|handleContactSubmit" index.html
```

Expected:

- Portfolio heading and `projects-grid` matches appear.
- `Book a Free Call` CTA text appears.
- Consultation/audit form copy appears.
- `handleContactSubmit` appears and remains UI-only for this launch.

- [ ] **Step 2: Confirm no submission/scheduling automation is required for this launch**

Record the deferred scope from the section above in the launch notes so verification does not fail the deployment for postponed workflow work.

- [ ] **Step 3: Confirm the Vercel deployment root**

Run:

```bash
pwd
rg --files
```

Expected:

- Working directory is the local checkout for `znerationmedia-commits/index`.
- `index.html` and `vercel.json` are at the repository root.

### Task 2: Handle The Prototype Admin Surface Before Production

**Files:**
- Modify if production launch requires it: `admin.html` or deployment configuration
- Verify: `README.md`

- [ ] **Step 1: Choose the launch treatment for `admin.html`**

Recommended production decision:

```text
Public launch contains the public site only. Admin/project-submission work is deferred until real auth and persistence are implemented.
```

- [ ] **Step 2: If launching production now, keep the prototype admin page out of the accepted public surface**

Use the smallest repo change that matches the team decision:

- Remove `admin.html` from the production launch branch, or
- Move it off the deployable public root while preserving it for later work.

Expected:

- Public-site launch no longer implies that the current prototype admin login is secure or supported.

- [ ] **Step 3: Review the launch diff before deployment**

Run:

```bash
git diff --stat
git diff
```

Expected:

- Any prelaunch diff is limited to keeping the public launch surface safe.
- The public UI sections in `index.html` remain intact.

### Task 3: Run Local Public-Site Smoke Checks

**Files:**
- Verify: `index.html`
- Verify: `vercel.json`

- [ ] **Step 1: Serve the static site locally**

Run from the repository root:

```bash
python3 -m http.server 4173
```

Expected:

- Static server reports that it is serving on port `4173`.

- [ ] **Step 2: Open the public page locally**

Open:

```text
http://localhost:4173/
```

Expected first viewport:

- Public homepage renders.
- Hero CTAs render.
- No blank page or blocking browser error overlay appears.

- [ ] **Step 3: Verify the portfolio card flow**

Interaction path:

```text
Home -> View Our Work or Portfolio -> portfolio page state -> click one visible project card -> project modal opens
```

Expected:

- Portfolio cards are visible in the portfolio grid.
- Filter tabs remain visible.
- Opening a card shows project detail content rather than a broken modal.

- [ ] **Step 4: Verify the consultation UI flow**

Interaction path:

```text
Home -> consultation CTA or floating Book a Free Call tab -> consultation/contact form section
```

Expected:

- Consultation CTA is visible.
- Form fields are visible.
- Form button that promises a free consultation is visible.
- No expectation is set that the form currently sends data or books a call.

- [ ] **Step 5: Verify one mobile viewport**

Check the same public surfaces at a mobile width such as `390x844`.

Expected:

- Portfolio cards remain visible without incoherent overlap.
- Consultation CTA/form remains reachable and readable.

### Task 4: Import The GitHub Repo Into Vercel

**Files:**
- Source repository: `znerationmedia-commits/index`
- Deployment config: `vercel.json`

- [ ] **Step 1: Connect the Vercel dashboard to GitHub**

In Vercel:

```text
Dashboard -> Add New -> Project -> Import Git Repository
```

Select:

```text
znerationmedia-commits/index
```

Expected:

- Vercel can see the repository after GitHub authorization or repository selection.

- [ ] **Step 2: Configure the project as the repository-root static site**

Use:

```text
Root Directory: repository root
Production Branch: main
Environment Variables: none required for the public UI-only launch
```

Expected:

- `index.html` remains the public entry page.
- `vercel.json` remains available to Vercel from the project root.

- [ ] **Step 3: Trigger the first deployment**

Click the Vercel deploy/import action after reviewing the settings.

Expected:

- Vercel creates a deployment URL for the imported project.

### Task 5: Verify The Vercel Deployment Before Acceptance

**Files:**
- Verify live deployment URL

- [ ] **Step 1: Open the deployed root URL**

Expected:

- Page title and homepage content match the current public site.
- No deployment error page appears.

- [ ] **Step 2: Verify portfolio visibility on deployment**

Interaction path:

```text
Deployed homepage -> Portfolio/View Our Work -> visible project grid -> open one card modal
```

Expected:

- Portfolio cards are visible on the deployed page.
- Cards load their image surfaces or obvious fallbacks.
- Project modal opens.

- [ ] **Step 3: Verify consultation UI visibility on deployment**

Interaction path:

```text
Deployed homepage -> visible consultation CTA -> consultation/contact form section
```

Expected:

- CTA toward consultation is visible.
- Consultation lead form section is visible.
- Form button is visible.

- [ ] **Step 4: Capture launch evidence**

Capture at least:

- Desktop homepage screenshot
- Desktop portfolio-grid screenshot
- Desktop consultation-form screenshot
- One mobile screenshot showing the public site remains usable

### Task 6: Accept Production And Record Follow-Up Work

**Files:**
- No required code change

- [ ] **Step 1: Confirm the accepted production URL**

Record:

```text
Vercel project URL:
Production URL:
GitHub source repo: znerationmedia-commits/index
Production branch: main
Launch scope: public UI only
```

- [ ] **Step 2: Write the follow-up backlog**

Create the next implementation queue in this order:

1. Consultation form persistence and lead destination
2. 30-minute scheduling/booking flow
3. Real admin authentication
4. Project submission schema and persistence
5. Public portfolio sync from published project records

- [ ] **Step 3: Decide the next release boundary**

Recommended next release:

```text
Lead capture release: public consultation form saves a real lead and routes it to the agreed team destination without changing the portfolio submission workflow yet.
```

## Verification Checklist

- [ ] Public homepage renders from Vercel.
- [ ] Portfolio cards are visible.
- [ ] At least one portfolio card modal opens.
- [ ] Consultation CTA is visible.
- [ ] Consultation lead form UI is visible.
- [ ] The team has not mistaken the current UI-only form for a working booking workflow.
- [ ] Production handling for `admin.html` is explicitly resolved.
- [ ] Launch URL and deferred backlog are recorded.

## Self-Review

- Spec coverage: plan launches the public page, verifies cards, verifies consultation CTA/form visibility, and defers form submission, scheduling, and teammate submission work as requested.
- Placeholder scan: each launch step is concrete and executable.
- Scope consistency: public launch uses `index.html` and Vercel Git deployment; future data/auth work remains outside this launch.
