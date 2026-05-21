# Claude Malaysia Community Portfolio

This repository is the shared source of truth for the Claude Malaysia community portfolio site.

The MVP goal is simple:

- trusted members submit project portfolio entries in a fixed format
- the site renders those entries automatically
- the portfolio stays lightweight, searchable, and easy to maintain

This repo should stay lean. Do not add unnecessary infrastructure unless it solves a real problem for the MVP.

## What This Project Is

Claude Malaysia is building a public-facing portfolio portal for community members to showcase real projects.

The portal should help visitors quickly understand:

- what the community can build
- who built it
- what domain it applies to
- what tools and delivery model were used

## MVP Workflow

1. A trusted member fills out the project submission form.
2. The form collects a fixed set of fields.
3. The submission is saved as structured project data.
4. The public site reads from that data and renders portfolio cards.
5. When the data changes, the live site updates automatically on deploy.

The public site should not depend on manual HTML edits for each new project.

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
- a structured project data file such as `projects.json`
- `netlify.toml` for deployment and security headers
- `PROJECT_SUBMISSION_TEMPLATE.md` for the submission reference
- `CONTRIBUTING.md` for collaboration rules
- `SITE_DESIGN_DIRECTION.md` for product direction

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

Start by checking the submission template and the data format.

The most important thing is consistency:

- same fields every time
- same tag values every time
- same privacy rules every time

That is what keeps the portfolio useful and maintainable.
