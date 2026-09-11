-- DATA301 Cosmic V4 migration
-- Adds explicit material visibility, makes the detailed course plan staff-only,
-- preserves public signed delivery for released materials, and refreshes API grants.

begin;

alter table public.materials
  add column if not exists visibility text not null default 'public';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'materials_visibility_check'
  ) then
    alter table public.materials
      add constraint materials_visibility_check
      check (visibility in ('public', 'staff'));
  end if;
end $$;

update public.materials
set visibility = 'staff'
where lower(title) = lower('Detailed Course Plan')
   or lower(file_name) = lower('ML_Course_Plan_Aug-2026.docx');

update public.materials
set visibility = 'public'
where visibility is null;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.sessions enable row level security;
alter table public.materials enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.profiles to authenticated;
grant select, update on public.profiles to authenticated, service_role;
grant select on public.courses, public.modules, public.sessions, public.materials to anon, authenticated, service_role;
grant insert, update, delete on public.courses, public.modules, public.sessions, public.materials to authenticated, service_role;

drop policy if exists materials_public_read on public.materials;
create policy materials_public_read on public.materials
for select using (
  public.is_staff()
  or (
    visibility = 'public'
    and status in ('published', 'scheduled')
    and publish_at is not null
    and publish_at <= now()
  )
);

create or replace view public.materials_public
with (security_invoker = true)
as
select
  m.id,
  m.course_id,
  m.title,
  m.description,
  m.kind,
  m.visibility,
  m.module_slug,
  m.session_number,
  m.file_name,
  m.format,
  case
    when m.file_size_bytes >= 1048576 then trim(to_char(m.file_size_bytes / 1048576.0, 'FM999990.0')) || ' MB'
    when m.file_size_bytes >= 1024 then trim(to_char(m.file_size_bytes / 1024.0, 'FM999990')) || ' KB'
    else m.file_size_bytes::text || ' B'
  end as size_label,
  'published'::text as status,
  m.publish_at as published_at,
  m.version,
  m.thumbnail_url
from public.materials m
where m.visibility = 'public'
  and m.status in ('published', 'scheduled')
  and m.publish_at is not null
  and m.publish_at <= now();

grant select on public.materials_public to anon, authenticated, service_role;

notify pgrst, 'reload schema';

commit;
