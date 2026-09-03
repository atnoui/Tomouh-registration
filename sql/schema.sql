-- ============================================================================
-- Tomouh Club — Membership Registration schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.applicants (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  -- Step 1 — personal details
  full_name           text not null,
  age                 int not null check (age between 10 and 100),
  email               text not null,
  phone               text,
  wilaya              text not null,

  -- Step 2 — experience & motivation
  contribution        text not null,   -- "ماذا يمكنك التقديم لطموح"
  portfolio_link      text not null,   -- Drive / GitHub / Figma / Canva link
  field_of_study      text not null,
  motivation          text not null,   -- "لماذا تريد الانضمام لفريق طموح"

  -- Step 3 — availability & fit
  weekly_hours        text not null check (weekly_hours in ('less_than_6', '6_to_10', 'more_than_10')),
  ready_to_commit     boolean not null,
  departments         text[] not null default '{}',

  -- Admin-managed review state
  status              text not null default 'pending'
                        check (status in ('pending', 'reviewed', 'accepted', 'rejected'))
);

comment on table public.applicants is 'Membership applications submitted through the Tomouh club registration form.';

create index if not exists applicants_created_at_idx on public.applicants (created_at desc);
create index if not exists applicants_status_idx on public.applicants (status);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Public visitors may only INSERT their own application; only signed-in
-- admins (created in Authentication → Users) may read or update the list.
-- ----------------------------------------------------------------------------
alter table public.applicants enable row level security;

drop policy if exists "Public can submit an application" on public.applicants;
create policy "Public can submit an application"
  on public.applicants
  for insert
  to anon
  with check (true);

drop policy if exists "Admins can view applications" on public.applicants;
create policy "Admins can view applications"
  on public.applicants
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can update applications" on public.applicants;
create policy "Admins can update applications"
  on public.applicants
  for update
  to authenticated
  using (true)
  with check (true);
