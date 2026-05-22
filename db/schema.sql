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
