# Neon Project Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the browser-local project-submission prototype with a private-link Vercel submission flow backed by Neon project data, Vercel Blob screenshot uploads, and a published-project API consumed by the public portfolio.

**Architecture:** Keep Vercel as the web and API boundary, add a small Node/Vercel function layer around shared validation and data mapping modules, persist structured project records in Neon Postgres, and persist uploaded screenshot bytes in Vercel Blob. The public page will keep a stable portfolio layout while moving its card data source from hard-coded records to the published-project API.

**Tech Stack:** Static HTML/CSS/JavaScript, Vercel Functions, Node.js, Neon Postgres, Vercel Blob, `@neondatabase/serverless`, `@vercel/blob`, Vitest

---

## File Structure

### Existing files to modify

- `README.md`: replace Supabase architecture notes with Vercel + Neon + Blob and clarify private-link immediate-publish scope
- `ADMIN_PORTAL_PLAN.md`: replace protected-admin-first plan with the actual submission MVP slices and mark admin/auth as safety follow-up
- `PROJECT_SUBMISSION_TEMPLATE.md`: align the status text with publish-immediately v1 while preserving the privacy checklist
- `index.html`: render public cards from the published-project API and preserve consultation/WhatsApp UI scope
- `vercel.json`: keep the existing Vercel security-header deployment config intact unless verification shows a route/header change is required

### New project files

- `package.json`: scripts and runtime/test dependencies for Vercel functions and validation modules
- `package-lock.json`: dependency lockfile
- `.gitignore`: ignore local Vercel and environment files
- `.env.example`: document required environment variables without secrets
- `db/schema.sql`: Neon schema for projects and project tech stack rows
- `lib/project-taxonomy.js`: canonical approved taxonomy constants
- `lib/project-validation.js`: submission validation and normalization
- `lib/project-public-shape.js`: public-safe project response mapper
- `lib/project-repository.js`: Neon insert/query persistence boundary
- `api/projects/index.js`: public published-project endpoint
- `api/projects/submit.js`: private-link project submission endpoint
- `api/projects/upload.js`: Blob screenshot upload endpoint or upload-token endpoint
- `submit-project.html`: private-link contributor submission page
- `submit-project.js`: form state, asset-mode selection, submit UX
- `submission.css`: focused private-link form styling
- `tests/project-validation.test.js`: validation tests
- `tests/project-public-shape.test.js`: public mapping tests
- `tests/project-repository.test.js`: repository behavior with mocked Neon calls
- `tests/projects-api.test.js`: API behavior with mocked repository/blob boundaries

## Preconditions

- Work only in the `znerationmedia-commits/index` checkout.
- Do not commit secrets or Vercel/Neon connection values.
- Keep consultation booking and lead automation out of this implementation.
- Do not expose `submit-project.html` from public navigation.
- Preserve the decision that valid v1 submissions become `published` immediately.

### Task 1: Update The Architecture Contract Docs

**Files:**
- Modify: `README.md`
- Modify: `ADMIN_PORTAL_PLAN.md`
- Modify: `PROJECT_SUBMISSION_TEMPLATE.md`
- Reference: `docs/superpowers/specs/2026-05-22-neon-project-submission-design.md`

- [ ] **Step 1: Write doc edits that remove the outdated Supabase-first wording**

Replace the README architecture section with this architecture text:

```markdown
## Recommended MVP Architecture

The leanest setup is:

- `Vercel` for the public site, private-link submission page, and server-side API routes
- `Neon Postgres` for structured project submission and published portfolio records
- `Vercel Blob` for uploaded project screenshot images
- external `Loom` or image URLs when contributors provide hosted visual assets

The public consultation path remains WhatsApp/contact-first until booking and lead automation are designed separately.
```

Update the workflow text so it states:

```markdown
1. A trusted contributor receives the unlisted project submission link.
2. The contributor fills out the fixed submission form.
3. The server validates required fields, taxonomy values, and visual asset rules.
4. Uploaded screenshots are stored in Vercel Blob.
5. Structured project data is saved in Neon Postgres.
6. Valid version-1 submissions are published immediately.
7. The public portfolio reads published records and renders the cards.
```

- [ ] **Step 2: Align the admin plan with the approved delivery slices**

Change `ADMIN_PORTAL_PLAN.md` so the MVP phases state:

```markdown
### Phase 1: Contract And Data Foundation

- keep README, template, schema, and rendering policy aligned
- define Neon project schema and taxonomy validation
- configure Vercel environment variables without committing secrets

### Phase 2: Private-Link Submission MVP

- add the unlisted contributor submission page
- validate submitted fields in a Vercel API route
- save valid published projects to Neon
- accept external image URLs and Loom URLs

### Phase 3: Screenshot Upload

- upload contributor screenshots to Vercel Blob
- save Blob URLs and asset metadata with the Neon project record
- enforce screenshot type and size limits

### Phase 4: Public Portfolio Sync

- fetch published projects from the public API
- render project cards from the published records
- keep card fallbacks and filtering safe

### Phase 5: Safety Follow-Up

- add edit, unpublish, and removal controls
- revisit auth, invitation tokens, or a passcode if the private link risk changes
```

- [ ] **Step 3: Align the submission template status text**

Change the template top note to:

```markdown
Version 1 publishes valid private-link submissions immediately after server-side validation. Use the privacy checklist before submitting.
```

Keep the review checklist as a future operational reference, but do not state that every v1 submission is blocked on committee approval.

- [ ] **Step 4: Review doc diff**

Run:

```bash
git diff -- README.md ADMIN_PORTAL_PLAN.md PROJECT_SUBMISSION_TEMPLATE.md
```

Expected:

- Supabase-first implementation wording is removed.
- Private-link immediate-publish scope is explicit.
- Booking/lead automation remains outside this plan.

- [ ] **Step 5: Commit contract docs**

```bash
git add README.md ADMIN_PORTAL_PLAN.md PROJECT_SUBMISSION_TEMPLATE.md
git commit -m "docs: align portfolio submission architecture"
```

### Task 2: Add Runtime/Test Skeleton And Secret Boundaries

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Create `package.json` scripts and dependencies**

Create:

```json
{
  "name": "claude-malaysia-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "dev": "vercel dev"
  },
  "dependencies": {
    "@neondatabase/serverless": "latest",
    "@vercel/blob": "latest"
  },
  "devDependencies": {
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Install dependencies and lock them**

Run:

```bash
npm install
```

Expected:

- `package-lock.json` is created.
- dependency install completes successfully.

- [ ] **Step 3: Add local secret ignores**

Create `.gitignore`:

```gitignore
.DS_Store
.env
.env.*
!.env.example
.vercel
node_modules
```

- [ ] **Step 4: Document required environment variables**

Create `.env.example`:

```dotenv
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

- [ ] **Step 5: Verify the skeleton**

Run:

```bash
npm test
```

Expected:

- Vitest exits without project tests or with no matching tests according to its current default behavior.
- No secret file is tracked.

- [ ] **Step 6: Commit skeleton**

```bash
git add package.json package-lock.json .gitignore .env.example
git commit -m "chore: add project submission runtime skeleton"
```

### Task 3: Define Neon Schema And Taxonomy Contract

**Files:**
- Create: `db/schema.sql`
- Create: `lib/project-taxonomy.js`
- Test: `tests/project-validation.test.js`

- [ ] **Step 1: Write the first taxonomy validation test**

Create `tests/project-validation.test.js`:

```js
import { describe, expect, it } from "vitest";
import { validateProjectSubmission } from "../lib/project-validation.js";

const validSubmission = {
  contributorName: "Amir",
  contributorSpecialty: "HR Payroll Automation",
  title: "Payroll Exception Assistant",
  description:
    "A payroll operations team needed a faster way to identify mismatched attendance and payroll records before monthly closing. Their existing spreadsheet checks were slow, repetitive, and easy to miss when several departments submitted late corrections. We built an AI-assisted exception workflow that compares payroll inputs, flags risky rows, groups the likely causes, and routes human review steps to the right owner before closing. The team still makes the final payroll decisions, but the workflow removes the hunting work, keeps review notes structured, and gives managers a clearer view of which exceptions are resolved and which ones need escalation for action.",
  dealType: "B2B SME",
  serviceModel: "Done-For-You",
  automationLayer: "Hybrid",
  industry: "HR & Payroll",
  projectType: "Workflow Automation",
  dataHosting: "Cloud-Hosted",
  techStack: ["Claude AI", "Python"],
  complexity: "Standard (1-4 weeks)",
  assetMode: "loom",
  assetUrl: "https://www.loom.com/share/demo-project"
};

describe("validateProjectSubmission", () => {
  it("accepts approved taxonomy values", () => {
    expect(validateProjectSubmission(validSubmission)).toMatchObject({
      ok: true,
      value: {
        status: "published",
        assetType: "loom"
      }
    });
  });
});
```

- [ ] **Step 2: Run the test to confirm the contract is not implemented**

Run:

```bash
npm test -- tests/project-validation.test.js
```

Expected:

- FAIL because `lib/project-validation.js` does not exist yet.

- [ ] **Step 3: Add the approved taxonomy module**

Create `lib/project-taxonomy.js`:

```js
export const PROJECT_TAXONOMY = Object.freeze({
  dealTypes: ["B2B Enterprise", "B2B SME", "B2C", "Internal Tool", "Non-Profit"],
  serviceModels: ["Done-For-You", "Consulting", "Talent Placement", "Training"],
  automationLayers: ["Frontend", "Backend", "Full-Stack", "No-Code", "Hybrid"],
  industries: [
    "Finance & Accounting",
    "HR & Payroll",
    "Marketing & Ads",
    "E-commerce",
    "Legal & Compliance",
    "Healthcare",
    "Education",
    "Real Estate",
    "Logistics",
    "SaaS / Tech",
    "Other"
  ],
  projectTypes: [
    "AI Chatbot",
    "Dashboard & Reporting",
    "Workflow Automation",
    "Data Pipeline",
    "Document Processing",
    "Lead Generation & CRM",
    "API Integration",
    "Web App / Portal",
    "Voice AI"
  ],
  dataHosting: ["Self-Hosted", "Cloud-Hosted", "Hybrid", "Client Infrastructure"],
  techStack: [
    "Claude AI",
    "Make",
    "n8n",
    "Zapier",
    "Airtable",
    "Notion",
    "Google Workspace",
    "Microsoft 365",
    "Python",
    "Custom API",
    "Other"
  ],
  complexity: ["Quick Win (< 1 week)", "Standard (1-4 weeks)", "Enterprise (1+ month)"]
});
```

- [ ] **Step 4: Add the Neon schema**

Create `db/schema.sql`:

```sql
create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  contributor_name text not null,
  contributor_specialty text not null,
  title text not null,
  description text not null,
  deal_type text not null,
  service_model text not null,
  automation_layer text not null,
  industry text not null,
  project_type text not null,
  data_hosting text not null,
  complexity text not null,
  asset_type text not null check (asset_type in ('uploaded_image', 'external_image', 'loom')),
  asset_url text not null,
  asset_alt_text text not null,
  status text not null default 'published' check (status in ('published', 'unpublished', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz not null default now()
);

create table if not exists project_tech_stack (
  project_id uuid not null references projects(id) on delete cascade,
  tech_stack_value text not null,
  primary key (project_id, tech_stack_value)
);

create index if not exists projects_public_status_published_idx
  on projects (status, published_at desc);
```

- [ ] **Step 5: Commit schema and taxonomy**

```bash
git add db/schema.sql lib/project-taxonomy.js tests/project-validation.test.js
git commit -m "feat: define project schema and taxonomy"
```

### Task 4: Implement Submission Validation

**Files:**
- Create: `lib/project-validation.js`
- Modify: `tests/project-validation.test.js`

- [ ] **Step 1: Add failing validation cases**

Append:

```js
  it("rejects unapproved taxonomy values", () => {
    const result = validateProjectSubmission({
      ...validSubmission,
      industry: "Anything Goes"
    });

    expect(result).toMatchObject({
      ok: false,
      errors: expect.arrayContaining(["industry must be an approved value"])
    });
  });

  it("requires exactly one visual asset path", () => {
    const result = validateProjectSubmission({
      ...validSubmission,
      assetMode: "loom",
      assetUrl: "",
      uploadedAssetUrl: "https://blob.example/image.png"
    });

    expect(result).toMatchObject({
      ok: false,
      errors: expect.arrayContaining(["choose exactly one project visual"])
    });
  });

  it("rejects non-Loom URLs in Loom mode", () => {
    const result = validateProjectSubmission({
      ...validSubmission,
      assetUrl: "https://example.com/video"
    });

    expect(result).toMatchObject({
      ok: false,
      errors: expect.arrayContaining(["loom URL must use loom.com"])
    });
  });
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- tests/project-validation.test.js
```

Expected:

- FAIL until validation is implemented.

- [ ] **Step 3: Implement `lib/project-validation.js`**

Create:

```js
import { PROJECT_TAXONOMY } from "./project-taxonomy.js";

const DESCRIPTION_MIN_WORDS = 100;
const DESCRIPTION_MAX_WORDS = 200;

function wordCount(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function isApproved(value, approved) {
  return approved.includes(value);
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isLoomUrl(value) {
  try {
    const url = new URL(value);
    return url.hostname === "loom.com" || url.hostname.endsWith(".loom.com");
  } catch {
    return false;
  }
}

function trimText(value) {
  return String(value || "").trim();
}

export function validateProjectSubmission(input) {
  const errors = [];
  const required = [
    ["contributorName", "contributor name is required"],
    ["contributorSpecialty", "contributor specialty is required"],
    ["title", "project title is required"],
    ["description", "description is required"]
  ];

  for (const [key, message] of required) {
    if (!trimText(input[key])) errors.push(message);
  }

  const descriptionWords = wordCount(input.description);
  if (descriptionWords < DESCRIPTION_MIN_WORDS || descriptionWords > DESCRIPTION_MAX_WORDS) {
    errors.push("description must be 100-200 words");
  }

  const taxonomies = [
    ["dealType", PROJECT_TAXONOMY.dealTypes, "deal type"],
    ["serviceModel", PROJECT_TAXONOMY.serviceModels, "service model"],
    ["automationLayer", PROJECT_TAXONOMY.automationLayers, "automation layer"],
    ["industry", PROJECT_TAXONOMY.industries, "industry"],
    ["projectType", PROJECT_TAXONOMY.projectTypes, "project type"],
    ["dataHosting", PROJECT_TAXONOMY.dataHosting, "data hosting"],
    ["complexity", PROJECT_TAXONOMY.complexity, "complexity"]
  ];

  for (const [key, approved, label] of taxonomies) {
    if (!isApproved(input[key], approved)) errors.push(`${label} must be an approved value`);
  }

  const techStack = Array.isArray(input.techStack) ? input.techStack : [];
  if (!techStack.length || techStack.some((value) => !isApproved(value, PROJECT_TAXONOMY.techStack))) {
    errors.push("tech stack must contain approved values");
  }

  const assetMode = input.assetMode;
  const providedAssetUrl = trimText(input.assetUrl);
  const uploadedAssetUrl = trimText(input.uploadedAssetUrl);
  const hasExternalAsset = ["loom", "external_image"].includes(assetMode) && Boolean(providedAssetUrl);
  const hasUploadedAsset = assetMode === "uploaded_image" && Boolean(uploadedAssetUrl);
  if (Number(hasExternalAsset) + Number(hasUploadedAsset) !== 1) {
    errors.push("choose exactly one project visual");
  }

  if (assetMode === "loom" && providedAssetUrl && !isLoomUrl(providedAssetUrl)) {
    errors.push("loom URL must use loom.com");
  }

  if (assetMode === "external_image" && providedAssetUrl && !isHttpUrl(providedAssetUrl)) {
    errors.push("image URL must be a valid HTTP URL");
  }

  if (assetMode === "uploaded_image" && uploadedAssetUrl && !isHttpUrl(uploadedAssetUrl)) {
    errors.push("uploaded image URL must be a valid HTTP URL");
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      contributorName: trimText(input.contributorName),
      contributorSpecialty: trimText(input.contributorSpecialty),
      title: trimText(input.title),
      description: trimText(input.description),
      dealType: input.dealType,
      serviceModel: input.serviceModel,
      automationLayer: input.automationLayer,
      industry: input.industry,
      projectType: input.projectType,
      dataHosting: input.dataHosting,
      techStack: [...new Set(techStack)],
      complexity: input.complexity,
      assetType: assetMode,
      assetUrl: hasUploadedAsset ? uploadedAssetUrl : providedAssetUrl,
      assetAltText: trimText(input.assetAltText) || `${trimText(input.title)} project visual`,
      status: "published"
    }
  };
}
```

- [ ] **Step 4: Run validation tests**

Run:

```bash
npm test -- tests/project-validation.test.js
```

Expected:

- PASS.

- [ ] **Step 5: Commit validation**

```bash
git add lib/project-validation.js tests/project-validation.test.js
git commit -m "feat: validate portfolio project submissions"
```

### Task 5: Add Public Mapping And Repository Boundaries

**Files:**
- Create: `lib/project-public-shape.js`
- Create: `lib/project-repository.js`
- Create: `tests/project-public-shape.test.js`
- Create: `tests/project-repository.test.js`

- [ ] **Step 1: Write a failing public-mapper test**

Create `tests/project-public-shape.test.js`:

```js
import { describe, expect, it } from "vitest";
import { toPublicProject } from "../lib/project-public-shape.js";

describe("toPublicProject", () => {
  it("returns only public portfolio fields", () => {
    expect(
      toPublicProject({
        slug: "payroll-exception-assistant",
        contributor_name: "Amir",
        contributor_specialty: "HR Payroll Automation",
        title: "Payroll Exception Assistant",
        description: "Public project description",
        industry: "HR & Payroll",
        project_type: "Workflow Automation",
        automation_layer: "Hybrid",
        service_model: "Done-For-You",
        deal_type: "B2B SME",
        data_hosting: "Cloud-Hosted",
        complexity: "Standard (1-4 weeks)",
        asset_type: "loom",
        asset_url: "https://loom.com/share/demo",
        asset_alt_text: "Payroll project demo",
        published_at: "2026-05-22T00:00:00.000Z",
        internal_note: "do not leak"
      }, ["Claude AI", "Python"])
    ).toEqual({
      slug: "payroll-exception-assistant",
      contributorName: "Amir",
      contributorSpecialty: "HR Payroll Automation",
      title: "Payroll Exception Assistant",
      description: "Public project description",
      industry: "HR & Payroll",
      projectType: "Workflow Automation",
      automationLayer: "Hybrid",
      serviceModel: "Done-For-You",
      dealType: "B2B SME",
      dataHosting: "Cloud-Hosted",
      complexity: "Standard (1-4 weeks)",
      techStack: ["Claude AI", "Python"],
      asset: {
        type: "loom",
        url: "https://loom.com/share/demo",
        altText: "Payroll project demo"
      },
      publishedAt: "2026-05-22T00:00:00.000Z"
    });
  });
});
```

- [ ] **Step 2: Run the mapper test to verify failure**

Run:

```bash
npm test -- tests/project-public-shape.test.js
```

Expected:

- FAIL because the public mapper does not exist.

- [ ] **Step 3: Implement `lib/project-public-shape.js`**

Create:

```js
export function toPublicProject(row, techStack = []) {
  return {
    slug: row.slug,
    contributorName: row.contributor_name,
    contributorSpecialty: row.contributor_specialty,
    title: row.title,
    description: row.description,
    industry: row.industry,
    projectType: row.project_type,
    automationLayer: row.automation_layer,
    serviceModel: row.service_model,
    dealType: row.deal_type,
    dataHosting: row.data_hosting,
    complexity: row.complexity,
    techStack,
    asset: {
      type: row.asset_type,
      url: row.asset_url,
      altText: row.asset_alt_text
    },
    publishedAt: row.published_at
  };
}
```

- [ ] **Step 4: Write repository tests with mocked SQL boundary**

Create `tests/project-repository.test.js`:

```js
import { describe, expect, it, vi } from "vitest";
import { listPublishedProjects } from "../lib/project-repository.js";

describe("listPublishedProjects", () => {
  it("maps published project rows and their tech stack", async () => {
    const sql = vi
      .fn()
      .mockResolvedValueOnce([
        {
          id: "project-1",
          slug: "payroll-exception-assistant",
          contributor_name: "Amir",
          contributor_specialty: "HR Payroll Automation",
          title: "Payroll Exception Assistant",
          description: "Public project description",
          industry: "HR & Payroll",
          project_type: "Workflow Automation",
          automation_layer: "Hybrid",
          service_model: "Done-For-You",
          deal_type: "B2B SME",
          data_hosting: "Cloud-Hosted",
          complexity: "Standard (1-4 weeks)",
          asset_type: "loom",
          asset_url: "https://loom.com/share/demo",
          asset_alt_text: "Payroll project demo",
          published_at: "2026-05-22T00:00:00.000Z"
        }
      ])
      .mockResolvedValueOnce([
        { project_id: "project-1", tech_stack_value: "Claude AI" }
      ]);

    await expect(listPublishedProjects(sql)).resolves.toMatchObject([
      {
        slug: "payroll-exception-assistant",
        techStack: ["Claude AI"]
      }
    ]);
  });
});
```

- [ ] **Step 5: Implement `lib/project-repository.js`**

Create:

```js
import { neon } from "@neondatabase/serverless";
import { toPublicProject } from "./project-public-shape.js";

export function getSql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  return neon(process.env.DATABASE_URL);
}

function techByProject(rows) {
  return rows.reduce((map, row) => {
    const values = map.get(row.project_id) || [];
    values.push(row.tech_stack_value);
    map.set(row.project_id, values);
    return map;
  }, new Map());
}

export async function listPublishedProjects(sql = getSql()) {
  const projects = await sql`
    select *
    from projects
    where status = 'published'
    order by published_at desc
  `;

  if (!projects.length) return [];

  const ids = projects.map((project) => project.id);
  const techRows = await sql`
    select project_id, tech_stack_value
    from project_tech_stack
    where project_id = any(${ids})
    order by tech_stack_value asc
  `;

  const techMap = techByProject(techRows);
  return projects.map((project) => toPublicProject(project, techMap.get(project.id) || []));
}
```

- [ ] **Step 6: Run mapper and repository tests**

Run:

```bash
npm test -- tests/project-public-shape.test.js tests/project-repository.test.js
```

Expected:

- PASS.

- [ ] **Step 7: Commit public data boundary**

```bash
git add lib/project-public-shape.js lib/project-repository.js tests/project-public-shape.test.js tests/project-repository.test.js
git commit -m "feat: add public project data boundary"
```

### Task 6: Add Project Insert Boundary And Submission API

**Files:**
- Modify: `lib/project-repository.js`
- Create: `api/projects/submit.js`
- Create: `tests/projects-api.test.js`

- [ ] **Step 1: Write a failing API success test**

Create `tests/projects-api.test.js`:

```js
import { describe, expect, it, vi } from "vitest";
import submitProject from "../api/projects/submit.js";

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    }
  };
}

describe("submit project API", () => {
  it("publishes a valid URL-based submission", async () => {
    const req = {
      method: "POST",
      body: {
        contributorName: "Amir",
        contributorSpecialty: "HR Payroll Automation",
        title: "Payroll Exception Assistant",
        description:
          "A payroll operations team needed a faster way to identify mismatched attendance and payroll records before monthly closing. Their existing spreadsheet checks were slow, repetitive, and easy to miss when several departments submitted late corrections. We built an AI-assisted exception workflow that compares payroll inputs, flags risky rows, groups the likely causes, and routes human review steps to the right owner before closing. The team still makes the final payroll decisions, but the workflow removes the hunting work, keeps review notes structured, and gives managers a clearer view of which exceptions are resolved and which ones need escalation for action.",
        dealType: "B2B SME",
        serviceModel: "Done-For-You",
        automationLayer: "Hybrid",
        industry: "HR & Payroll",
        projectType: "Workflow Automation",
        dataHosting: "Cloud-Hosted",
        techStack: ["Claude AI", "Python"],
        complexity: "Standard (1-4 weeks)",
        assetMode: "loom",
        assetUrl: "https://www.loom.com/share/demo-project"
      }
    };
    const res = mockResponse();
    const insertProject = vi.fn().mockResolvedValue({ slug: "payroll-exception-assistant" });

    await submitProject(req, res, { insertProject });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      ok: true,
      project: { slug: "payroll-exception-assistant" }
    });
  });
});
```

- [ ] **Step 2: Run API test to verify failure**

Run:

```bash
npm test -- tests/projects-api.test.js
```

Expected:

- FAIL because `api/projects/submit.js` does not exist.

- [ ] **Step 3: Add insert behavior to repository**

Add this import beside the existing repository imports:

```js
import { randomUUID } from "node:crypto";
```

Then append to `lib/project-repository.js`:

```js
function baseSlug(value) {
  return String(value || "project")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72) || "project";
}

export async function insertPublishedProject(project, sql = getSql()) {
  const slug = `${baseSlug(project.title)}-${randomUUID().slice(0, 8)}`;
  const rows = await sql`
    with inserted_project as (
      insert into projects (
        slug, contributor_name, contributor_specialty, title, description,
        deal_type, service_model, automation_layer, industry, project_type,
        data_hosting, complexity, asset_type, asset_url, asset_alt_text, status
      ) values (
        ${slug}, ${project.contributorName}, ${project.contributorSpecialty},
        ${project.title}, ${project.description}, ${project.dealType},
        ${project.serviceModel}, ${project.automationLayer}, ${project.industry},
        ${project.projectType}, ${project.dataHosting}, ${project.complexity},
        ${project.assetType}, ${project.assetUrl}, ${project.assetAltText}, 'published'
      )
      returning id, slug
    ),
    inserted_tech_stack as (
      insert into project_tech_stack (project_id, tech_stack_value)
      select inserted_project.id, tech.tech_stack_value
      from inserted_project
      cross join unnest(${project.techStack}::text[]) as tech(tech_stack_value)
    )
    select slug from inserted_project
  `;
  return { slug: rows[0].slug };
}
```

- [ ] **Step 4: Add submission API**

Create `api/projects/submit.js`:

```js
import { insertPublishedProject } from "../../lib/project-repository.js";
import { validateProjectSubmission } from "../../lib/project-validation.js";

export default async function submitProject(req, res, dependencies = {}) {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");
    return res.status(405).json({ ok: false, errors: ["method not allowed"] });
  }

  const validation = validateProjectSubmission(req.body || {});
  if (!validation.ok) {
    return res.status(400).json({ ok: false, errors: validation.errors });
  }

  try {
    const save = dependencies.insertProject || insertPublishedProject;
    const project = await save(validation.value);
    return res.status(201).json({ ok: true, project });
  } catch {
    return res.status(500).json({
      ok: false,
      errors: ["project could not be saved right now"]
    });
  }
}
```

- [ ] **Step 5: Add API invalid-data test**

Append:

```js
  it("rejects invalid submissions without inserting", async () => {
    const res = mockResponse();
    const insertProject = vi.fn();

    await submitProject({ method: "POST", body: {} }, res, { insertProject });

    expect(res.statusCode).toBe(400);
    expect(insertProject).not.toHaveBeenCalled();
  });
```

- [ ] **Step 6: Run API and validation tests**

Run:

```bash
npm test -- tests/projects-api.test.js tests/project-validation.test.js
```

Expected:

- PASS.

- [ ] **Step 7: Commit submission API**

```bash
git add api/projects/submit.js lib/project-repository.js tests/projects-api.test.js
git commit -m "feat: add project submission API"
```

### Task 7: Add Public Published Projects API

**Files:**
- Create: `api/projects/index.js`
- Modify: `tests/projects-api.test.js`

- [ ] **Step 1: Add failing public API test**

Append to `tests/projects-api.test.js`:

```js
import listProjects from "../api/projects/index.js";

describe("published projects API", () => {
  it("returns public project data", async () => {
    const res = mockResponse();
    await listProjects({ method: "GET" }, res, {
      listPublishedProjects: vi.fn().mockResolvedValue([{ slug: "payroll-exception-assistant" }])
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      projects: [{ slug: "payroll-exception-assistant" }]
    });
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/projects-api.test.js
```

Expected:

- FAIL until `api/projects/index.js` exists.

- [ ] **Step 3: Implement public API**

Create `api/projects/index.js`:

```js
import { listPublishedProjects } from "../../lib/project-repository.js";

export default async function listProjects(req, res, dependencies = {}) {
  if (req.method !== "GET") {
    res.setHeader?.("Allow", "GET");
    return res.status(405).json({ ok: false, errors: ["method not allowed"] });
  }

  try {
    const list = dependencies.listPublishedProjects || listPublishedProjects;
    const projects = await list();
    return res.status(200).json({ ok: true, projects });
  } catch {
    return res.status(503).json({
      ok: false,
      projects: [],
      errors: ["projects are temporarily unavailable"]
    });
  }
}
```

- [ ] **Step 4: Run API tests**

Run:

```bash
npm test -- tests/projects-api.test.js
```

Expected:

- PASS.

- [ ] **Step 5: Commit public API**

```bash
git add api/projects/index.js tests/projects-api.test.js
git commit -m "feat: expose published projects API"
```

### Task 8: Build Private-Link Submission UI For URL Assets

**Files:**
- Create: `submit-project.html`
- Create: `submit-project.js`
- Create: `submission.css`

- [ ] **Step 1: Create unlisted submission page**

Create `submit-project.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Submit Project | AI Malaysia Community</title>
    <link rel="stylesheet" href="submission.css" />
  </head>
  <body>
    <main class="submission-shell">
      <header>
        <p class="eyebrow">Trusted contributor submission</p>
        <h1>Submit a portfolio project</h1>
        <p>Only submit public-safe project proof. Valid version-1 submissions publish immediately.</p>
      </header>
      <form id="project-submission-form">
        <label>Contributor name <input name="contributorName" required /></label>
        <label>Contributor specialty <input name="contributorSpecialty" required /></label>
        <label>Project title <input name="title" required /></label>
        <label>Description <textarea name="description" required></textarea></label>
        <label>Deal type <select name="dealType" data-taxonomy="dealTypes" required></select></label>
        <label>Service model <select name="serviceModel" data-taxonomy="serviceModels" required></select></label>
        <label>Automation layer <select name="automationLayer" data-taxonomy="automationLayers" required></select></label>
        <label>Industry <select name="industry" data-taxonomy="industries" required></select></label>
        <label>Project type <select name="projectType" data-taxonomy="projectTypes" required></select></label>
        <label>Data hosting <select name="dataHosting" data-taxonomy="dataHosting" required></select></label>
        <fieldset id="tech-stack-fieldset">
          <legend>Tech stack</legend>
        </fieldset>
        <label>Complexity <select name="complexity" data-taxonomy="complexity" required></select></label>
        <fieldset>
          <legend>Visual asset</legend>
          <label><input type="radio" name="assetMode" value="external_image" checked /> Image URL</label>
          <label><input type="radio" name="assetMode" value="loom" /> Loom URL</label>
          <label><input type="radio" name="assetMode" value="uploaded_image" /> Upload screenshot</label>
          <label id="asset-url-field">Visual URL <input name="assetUrl" type="url" /></label>
          <label id="asset-file-field" hidden>Screenshot <input name="assetFile" type="file" accept="image/png,image/jpeg,image/webp" /></label>
          <label>Alt text <input name="assetAltText" /></label>
        </fieldset>
        <section class="privacy-check">
          <h2>Privacy check</h2>
          <p>Do not submit client secrets, credentials, customer data, private dashboards, or unapproved names.</p>
        </section>
        <p id="submission-status" role="status"></p>
        <button type="submit">Publish Project</button>
      </form>
    </main>
    <script type="module" src="submit-project.js"></script>
  </body>
</html>
```

If no shared stylesheet exists yet, add scoped styles in the same task by creating `submission.css` and include it in the file list before committing.

- [ ] **Step 2: Add form behavior for URL assets**

Create `submit-project.js`:

```js
import { PROJECT_TAXONOMY } from "./lib/project-taxonomy.js";

const form = document.querySelector("#project-submission-form");
const status = document.querySelector("#submission-status");
const assetUrlField = document.querySelector("#asset-url-field");
const assetFileField = document.querySelector("#asset-file-field");

function fillSelect(select, values) {
  select.innerHTML = `<option value="">Select...</option>${values
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("")}`;
}

for (const select of document.querySelectorAll("[data-taxonomy]")) {
  fillSelect(select, PROJECT_TAXONOMY[select.dataset.taxonomy]);
}

document.querySelector("#tech-stack-fieldset").insertAdjacentHTML(
  "beforeend",
  PROJECT_TAXONOMY.techStack
    .map(
      (value) =>
        `<label><input type="checkbox" name="techStack" value="${value}" /> ${value}</label>`
    )
    .join("")
);

function selectedAssetMode() {
  return form.elements.assetMode.value;
}

function syncAssetMode() {
  const uploaded = selectedAssetMode() === "uploaded_image";
  assetUrlField.hidden = uploaded;
  assetFileField.hidden = !uploaded;
}

form.addEventListener("change", (event) => {
  if (event.target.name === "assetMode") syncAssetMode();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Publishing project...";

  const body = Object.fromEntries(new FormData(form));
  body.techStack = new FormData(form).getAll("techStack");

  const response = await fetch("/api/projects/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const result = await response.json();
  status.textContent = result.ok
    ? "Project published."
    : result.errors.join(" ");
});

syncAssetMode();
```

- [ ] **Step 3: Add a submission stylesheet**

Create `submission.css` with stable, compact form styling that:

- keeps labels readable on mobile
- uses a constrained form width
- gives the privacy note and status text visible states
- avoids copying the entire inline public-page style block

- [ ] **Step 4: Confirm the form page is not linked publicly**

Run:

```bash
rg -n "submit-project" index.html README.md
```

Expected:

- No public navigation link is added from `index.html`.

- [ ] **Step 5: Commit URL-asset submission UI**

```bash
git add submit-project.html submit-project.js submission.css
git commit -m "feat: add private project submission page"
```

### Task 9: Add Blob Screenshot Upload Path

**Files:**
- Create: `api/projects/upload.js`
- Modify: `submit-project.js`
- Modify: `tests/projects-api.test.js`

- [ ] **Step 1: Add failing upload guardrail test**

Append to `tests/projects-api.test.js`:

```js
import { projectScreenshotUploadOptions } from "../api/projects/upload.js";

describe("project screenshot upload options", () => {
  it("limits Blob uploads to small web images", () => {
    expect(projectScreenshotUploadOptions()).toEqual({
      allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
      maximumSizeInBytes: 5 * 1024 * 1024,
      addRandomSuffix: true
    });
  });
});
```

- [ ] **Step 2: Run upload test to verify failure**

Run:

```bash
npm test -- tests/projects-api.test.js
```

Expected:

- FAIL until the upload endpoint exists.

- [ ] **Step 3: Implement upload-token endpoint with Blob guardrails**

Create `api/projects/upload.js`:

```js
import { handleUpload } from "@vercel/blob/client";

export function projectScreenshotUploadOptions() {
  return {
    allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
    maximumSizeInBytes: 5 * 1024 * 1024,
    addRandomSuffix: true
  };
}

export default async function uploadProjectAsset(req, res) {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");
    return res.status(405).json({ ok: false, errors: ["method not allowed"] });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => projectScreenshotUploadOptions(),
      onUploadCompleted: async () => {}
    });
    return res.status(200).json(jsonResponse);
  } catch {
    return res.status(500).json({
      ok: false,
      errors: ["screenshot upload could not start"]
    });
  }
}
```

- [ ] **Step 4: Update UI to upload screenshot first**

In `submit-project.js`, when `assetMode === "uploaded_image"`:

1. upload the chosen image through `@vercel/blob/client`
2. place the returned URL into `body.uploadedAssetUrl`
3. omit `assetUrl`
4. call `/api/projects/submit`

Use this upload call shape:

```js
const { upload } = await import("https://esm.sh/@vercel/blob/client");
const blob = await upload(file.name, file, {
  access: "public",
  handleUploadUrl: "/api/projects/upload"
});
body.uploadedAssetUrl = blob.url;
delete body.assetUrl;
```

- [ ] **Step 5: Run API tests**

Run:

```bash
npm test -- tests/projects-api.test.js tests/project-validation.test.js
```

Expected:

- PASS.

- [ ] **Step 6: Commit Blob upload path**

```bash
git add api/projects/upload.js submit-project.js tests/projects-api.test.js
git commit -m "feat: upload portfolio screenshots to blob"
```

### Task 10: Render Published Projects On Public Portfolio

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add a published-project loading function**

Replace the hard-coded portfolio-card rendering dependency with a public loader shape such as:

```js
async function loadPublishedProjects() {
  const response = await fetch("/api/projects");
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error("Published projects unavailable");
  return result.projects;
}
```

- [ ] **Step 2: Build safe card DOM from public project data**

Use DOM APIs for submitted text:

```js
function textNode(tag, value, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  return element;
}
```

Build cards so title, description, contributor, and tags are assigned through `textContent`, not raw unescaped HTML.

- [ ] **Step 3: Add asset-specific visual behavior**

Render:

- uploaded/external image asset as card image when safe
- Loom asset as a Loom/demo badge with link behavior appropriate to the modal/card design
- neutral fallback visual when asset loading fails

- [ ] **Step 4: Preserve safe empty/error states**

When the API fails or returns no projects:

- do not blank the page
- show a readable portfolio fallback state
- keep public CTA surfaces visible

- [ ] **Step 5: Decide hard-coded card migration behavior**

Pick one implementation path before merge:

- seed current showcase cards into Neon and render only API records, or
- keep current showcase cards as a fallback until seeded data exists

Record the choice in README so deployments are understandable.

- [ ] **Step 6: Commit public portfolio sync**

```bash
git add index.html README.md
git commit -m "feat: render published portfolio projects"
```

### Task 11: Verify Locally And On Vercel Preview

**Files:**
- Verify all changed files

- [ ] **Step 1: Run automated tests**

Run:

```bash
npm test
```

Expected:

- All project validation, mapper, repository, and API tests pass.

- [ ] **Step 2: Run local Vercel dev server**

Run:

```bash
npm run dev
```

Expected:

- Vercel dev server serves static pages and `/api/projects` endpoints locally.

- [ ] **Step 3: Apply Neon schema in the target dev database**

Run the contents of:

```text
db/schema.sql
```

in the Neon SQL editor for the development database.

Expected:

- `projects` and `project_tech_stack` exist.

- [ ] **Step 4: Browser-test URL submission**

Flow:

```text
/submit-project.html -> submit image URL project -> success message -> / -> portfolio project appears
```

Expected:

- Submission saves as published.
- Public portfolio renders the card.

- [ ] **Step 5: Browser-test Loom submission**

Flow:

```text
/submit-project.html -> submit Loom URL project -> success message -> / -> Loom visual state appears safely
```

Expected:

- Loom URL is accepted.
- Card layout remains stable.

- [ ] **Step 6: Browser-test screenshot submission**

Flow:

```text
/submit-project.html -> upload screenshot -> Blob upload -> project publish -> public card image appears
```

Expected:

- allowed screenshot uploads work
- oversized or invalid file type does not publish

- [ ] **Step 7: Check responsive public surfaces**

Verify desktop and mobile:

- homepage remains readable
- portfolio grid does not overlap
- public CTAs remain visible
- unlisted submission page remains usable

- [ ] **Step 8: Deploy preview from the Git-connected Vercel project**

After the repository is connected through the owner Vercel/GitHub path:

- push branch or open PR preview
- configure `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` in Vercel preview environment
- repeat published-project smoke checks on preview

### Task 12: Review Safety Backlog Before Production

**Files:**
- Modify if chosen: `README.md`

- [ ] **Step 1: Confirm immediate-publish risk acceptance**

Record:

```markdown
Version 1 project submissions are distributed by private link and publish immediately after server validation.
```

- [ ] **Step 2: Create the next safety backlog**

Record these next-release candidates:

1. edit/unpublish/remove surface
2. submission abuse controls
3. optional invite token, passcode, or auth
4. audit/notification path for new public submissions

- [ ] **Step 3: Commit production-readiness notes if docs changed**

```bash
git add README.md
git commit -m "docs: record submission safety follow-up"
```

## Final Verification Checklist

- [ ] Docs describe Vercel + Neon + Blob, not Supabase-first implementation.
- [ ] No environment secrets are tracked.
- [ ] Neon schema exists and supports publish status.
- [ ] Submission validation rejects unsupported taxonomy and invalid asset paths.
- [ ] External image URL submission publishes.
- [ ] Loom URL submission publishes.
- [ ] Screenshot upload stores Blob asset URL and publishes.
- [ ] Public projects endpoint returns only public-safe published records.
- [ ] Public portfolio renders API-backed cards with safe fallback behavior.
- [ ] Submission page remains unlinked from public navigation.
- [ ] WhatsApp/contact CTA scope remains intact.
- [ ] Booking and lead automation remain deferred.

## Self-Review

- Spec coverage: this plan follows the approved private-link immediate-publish architecture, Neon structured data, Blob screenshot storage, and public portfolio sync.
- Placeholder scan: tasks include concrete files, checks, code shapes, commands, and commit boundaries.
- Type consistency: submission API uses the same normalized field names defined by `validateProjectSubmission`, repository insert, and public mapping.
