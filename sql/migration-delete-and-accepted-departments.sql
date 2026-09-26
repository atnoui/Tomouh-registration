-- Run this once in Supabase → SQL Editor. Safe to run even if part of it
-- was already applied — every statement is written to not error on repeat.

-- 1) New column: lets an admin narrow down which branch(es) someone is
--    actually accepted into, separate from which branch(es) they applied for.
alter table public.applicants
  add column if not exists accepted_departments text[];

-- 2) New policy: lets a signed-in admin delete a registration.
drop policy if exists "Admins can delete applications" on public.applicants;
create policy "Admins can delete applications"
  on public.applicants
  for delete
  to authenticated
  using (true);
