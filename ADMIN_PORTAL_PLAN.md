# Admin Portal Plan

This plan describes the lean MVP path for the Claude Malaysia portfolio system.

## Goal

Build a protected admin portal where trusted members can log in, submit portfolio projects using a fixed template, and have the public portfolio reflect approved submissions automatically.

## Recommended Stack

- `Vercel` for hosting and deploy previews
- `Supabase Auth` for login
- `Supabase Postgres` for portfolio data
- `Supabase Storage` only if uploaded files are required later

## Workflow

1. A trusted member visits `/admin`.
2. The member logs in.
3. The admin page shows the submission form.
4. The member fills in the fixed submission fields.
5. The form validates the inputs.
6. The submission is saved to the data store.
7. The public portfolio site reads the published records and updates automatically.

## GitHub Responsibilities

GitHub should hold the source code and the operating docs.

The repo should include:

- the public site code
- the admin portal UI
- the submission template
- the data schema or field contract
- deployment config
- this plan document

## Approval Path

Before implementation is approved:

- keep the README and template in sync
- keep the plan aligned with the intended workflow
- open a pull request for review
- let the reviewer approve the docs first if the workflow is still changing
- merge only after the team agrees on the approach

## MVP Phases

### Phase 1: Docs And Contract

- confirm the admin portal flow
- freeze the field list and taxonomy
- keep README and submission template aligned
- define the public page rendering policy

### Phase 2: Auth And Data Model

- add login for trusted members
- create the project table/schema
- define published vs draft records

### Phase 3: Admin Portal UI

- add `/admin`
- build the submission form
- validate required fields and allowed values
- save submissions to the data store

### Phase 4: Public Portfolio Sync

- render only published projects on the main site
- keep search and filters working from the same data
- verify updates appear without manual HTML edits
- enforce the public page rendering policy

### Phase 5: Safety Review

- check all public-facing content for privacy issues
- confirm the portal cannot expose private client data
- verify the happy path and the failure path before launch

## MVP Rules

- no custom backend server unless it becomes unavoidable
- no separate database admin panel
- no public self-serve uploads
- no extra infrastructure that does not support the launch

## Open Questions

- Should new submissions publish immediately for trusted members, or should they start as draft?
- Should uploaded images live in Supabase Storage or stay as external links for MVP?
- Which members get admin access at launch?
