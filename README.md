# Claude Malaysia Community Portfolio

This repository is the shared source of truth for the Claude Malaysia community portfolio system.

The MVP goal is simple:

- community members log in to a protected admin portal
- they submit portfolio projects in a fixed format
- the public site reflects approved submissions automatically
- the system stays lightweight, searchable, and easy to maintain

This repo should stay lean. Do not add unnecessary infrastructure unless it solves a real problem for the MVP.

## What This Project Is

Claude Malaysia is building a public portfolio site plus a protected admin portal for community members to showcase real projects.

The system should help visitors quickly understand:

- what the community can build
- who built it
- what domain it applies to
- what tools and delivery model were used

## Recommended MVP Architecture

The leanest setup is:

- `Vercel` for hosting the public site and admin UI
- `Supabase Auth` for trusted-member login
- `Supabase Postgres` for project submissions and published portfolio records
- `Supabase Storage` only if uploaded images are needed later

This keeps the stack small without forcing the team to manage its own backend server.

## MVP Workflow

1. A trusted member visits `/admin` and logs in.
2. The admin portal loads only for authenticated users.
3. The member fills out the fixed submission form.
4. The form validates required fields and allowed tag values.
5. The submission is saved to the portfolio data store.
6. The public site reads published records and renders the cards.
7. When a record is published or updated, the public portfolio reflects the change automatically.

The public site should not depend on manual HTML edits for each new project.

## Public Page Rendering Policy

The public portfolio page must stay stable and readable as projects grow.

Rendering rules:

- validate all submissions before they are saved
- publish only approved or published records
- render each project through the same fixed card layout
- clamp long titles and descriptions so one record cannot distort the page
- use image fallbacks when a visual asset is missing
- keep the grid responsive and consistent at every screen size
- paginate, lazy-load, or otherwise limit how many cards are shown at once
- never render raw HTML from submissions into the public page

The policy exists so future contributors understand that the public site is a controlled viewer, not a free-form editor.

## Submission Fields

Every project submission must include:

- Contributor Name
- Project Title
- Visual Asset
- Description
- Deal Type
- Service Model
- Automation Layer
- Industry
- Project Type
- Data Hosting
- Tech Stack
- Complexity

## Field Guidance

- **Contributor Name**: name or alias plus domain specialty
- **Project Title**: short, punchy project name
- **Visual Asset**: screenshot, image, or Loom link
- **Description**: 100-200 words explaining what was needed, what was built, and what result was achieved
- **Deal Type**: choose from the approved taxonomy
- **Service Model**: choose from the approved taxonomy
- **Automation Layer**: choose from the approved taxonomy
- **Industry**: choose from the approved taxonomy
- **Project Type**: choose from the approved taxonomy
- **Data Hosting**: choose from the approved taxonomy
- **Tech Stack**: choose from the approved taxonomy
- **Complexity**: choose from the approved taxonomy

Taxonomy fields should use dropdowns or fixed choices so the data stays consistent.

## Approved Taxonomy

### Deal Type

- B2B Enterprise
- B2B SME
- B2C
- Internal Tool
- Non-Profit

### Service Model

- Done-For-You
- Consulting
- Talent Placement
- Training

### Automation Layer

- Frontend
- Backend
- Full-Stack
- No-Code
- Hybrid

### Industry

- Finance & Accounting
- HR & Payroll
- Marketing & Ads
- E-commerce
- Legal & Compliance
- Healthcare
- Education
- Real Estate
- Logistics
- SaaS / Tech
- Other

### Project Type

- AI Chatbot
- Dashboard & Reporting
- Workflow Automation
- Data Pipeline
- Document Processing
- Lead Generation & CRM
- API Integration
- Web App / Portal
- Voice AI

### Data Hosting

- Self-Hosted
- Cloud-Hosted
- Hybrid
- Client Infrastructure

### Tech Stack

- Claude AI
- Make
- n8n
- Zapier
- Airtable
- Notion
- Google Workspace
- Microsoft 365
- Python
- Custom API
- Other

### Complexity

- Quick Win (< 1 week)
- Standard (1-4 weeks)
- Enterprise (1+ month)

## Repository Structure

The repository should remain simple and easy to understand.

Typical files in this MVP:

- `index.html` for the public site
- `styles.css` for layout and styling
- `script.js` for client-side rendering and filtering
- `projects.json` if the team chooses to stage data before the database path is live
- `vercel.json` for deployment and security headers
- `PROJECT_SUBMISSION_TEMPLATE.md` for the submission reference
- `PUBLIC_PAGE_RENDERING_POLICY.md` for the public-page guardrails
- `CONTRIBUTING.md` for collaboration rules
- `SITE_DESIGN_DIRECTION.md` for product direction
- `ADMIN_PORTAL_PLAN.md` for the current implementation plan and approval steps

## GitHub Approval Flow

Before any implementation is approved:

1. Update the relevant docs in GitHub.
2. Keep the README, template, and plan file aligned.
3. Work in a branch or a clearly scoped change set.
4. Open a pull request for review.
5. Let the approver review the plan and the implementation together.
6. Merge only after approval.

This keeps the GitHub repo itself aligned with the product changes before they go live.

## Contributing Rules

- Do not invent project details.
- Do not publish private client data.
- Do not upload credentials, tokens, or sensitive screenshots.
- Keep each submission truthful and specific.
- Keep the site simple for MVP.
- If a project is not ready, leave it out until the data is complete.

## Privacy And Safety

Before a project goes public, check for:

- client names without permission
- emails
- phone numbers
- customer records
- revenue or payroll data
- internal dashboards
- private documents
- API keys or credentials
- confidential automation workflows

If any sensitive detail appears, remove it or blur it before publishing.

## For Future Collaborators

Start by checking the submission template, the plan file, and the data format.

The most important thing is consistency:

- same fields every time
- same tag values every time
- same privacy rules every time
- same approval path every time

That is what keeps the portfolio useful and maintainable.
