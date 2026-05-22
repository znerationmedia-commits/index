# Public Page Rendering Policy

This policy defines how the Claude Malaysia public portfolio page must behave when it renders project submissions.

The public page is a controlled viewer, not a free-form editor. New submissions must never be allowed to distort layout, break functionality, or expose unsafe content.

## Core Rules

1. Validate every submission before it is saved.
2. Render only approved or published records on the public site.
3. Never render raw HTML from user-submitted fields.
4. Keep the card layout fixed and consistent across all projects.
5. Use fallback content when a field is missing.
6. Limit text length so a single record cannot overwhelm the page.
7. Keep the page responsive at mobile, tablet, and desktop sizes.
8. Limit the number of cards shown at once through pagination, lazy loading, or a load-more pattern.

## Data Rules

The public page may only read sanitized records that follow the approved schema.

Required content should be normalized before rendering:

- title
- contributor name or alias
- domain specialty
- description
- visual asset URL or fallback
- deal type
- service model
- automation layer
- industry
- project type
- data hosting
- tech stack
- complexity

Optional or missing values must degrade gracefully.

## Layout Rules

The public page must render each project inside a standard card component.

Card rules:

- fixed image ratio
- consistent spacing
- consistent typography hierarchy
- title clamping
- description clamping
- tag wrapping that does not break the grid
- fallback image or neutral panel if no visual asset exists

## Safety Rules

Do not render:

- unescaped HTML
- script content
- private client data
- credentials
- tokens
- internal-only notes
- unfinished draft records

If a record does not meet the public standard, hide it from the public page until it is corrected.

## Scaling Rules

As the number of projects grows:

- show featured projects first if needed
- sort by newest published by default
- use filters and search to help browsing
- keep the overall page readable, not exhaustive

The page should always feel curated, even when the dataset gets larger.

## Implementation Reminder

Any future rendering code must follow this policy before being merged into the public portfolio page.
