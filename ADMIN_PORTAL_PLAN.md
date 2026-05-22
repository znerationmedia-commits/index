# Admin Portal Plan

This plan describes the lean MVP path for the Claude Malaysia portfolio system.

## Goal

Build a private-link project submission MVP where trusted contributors submit fixed-format portfolio projects and the public portfolio reflects valid published submissions automatically.

## Recommended Stack

- `Vercel` for hosting, deploy previews, and API routes
- `Neon Postgres` for structured portfolio data
- `Vercel Blob` for uploaded screenshot images
- external Loom or image URLs when contributors already host the visual asset

## Workflow

1. A trusted contributor receives the unlisted submission link.
2. The contributor fills in the fixed submission fields.
3. The Vercel API validates the inputs and asset choice.
4. Uploaded screenshots are saved to Vercel Blob.
5. Structured project data is saved to Neon Postgres.
6. Valid version-1 submissions publish immediately.
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

## MVP Rules

- no custom backend server unless it becomes unavoidable
- no separate database admin panel
- no public self-serve uploads
- no public navigation link to the private submission form
- no extra infrastructure that does not support the launch

## Open Questions

- Which removal path should launch first after immediate publishing: Vercel-backed admin control or a narrower operations script?
- Should the private-link path later gain a passcode, invitation token, or login?
- Which abuse controls should be added if the private link starts circulating beyond trusted contributors?
