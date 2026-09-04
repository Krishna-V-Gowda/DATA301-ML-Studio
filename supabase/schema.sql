-- DATA301 Machine Learning Studio
-- Run this file once in the Supabase SQL editor for a new project.
-- It creates the content model, access controls, private file bucket,
-- publishing view, and reference DATA301 course/session seed.

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer' check (role in ('viewer', 'editor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null default '',
  program text,
  school text,
  semester text,
  credits integer check (credits is null or credits > 0),
  ltp text,
  duration_weeks integer check (duration_weeks is null or duration_weeks > 0),
  prerequisite text,
  instructor_name text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  number integer not null,
  slug text not null,
  title text not null,
  short_title text not null,
  level text,
  description text not null default '',
  takeaway text,
  lecture_sessions integer not null default 0,
  practice_sessions integer not null default 0,
  lecture_hours integer not null default 0,
  practice_hours integer not null default 0,
  accent text not null default 'cobalt',
  position integer not null,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, number),
  unique(course_id, slug),
  unique(course_id, position)
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_slug text not null,
  number integer not null check (number between 1 and 30),
  title text not null,
  practice_code text,
  practice_title text,
  status text not null default 'planned' check (status in ('planned', 'ready', 'published', 'completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, number),
  unique(course_id, number, module_slug),
  foreign key (course_id, module_slug) references public.modules(course_id, slug) on update cascade on delete cascade
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '' check (char_length(description) <= 500),
  kind text not null check (kind in ('slides', 'notes', 'lab', 'dataset', 'assignment', 'reference')),
  module_slug text,
  session_number integer check (session_number is null or session_number between 1 and 30),
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  publish_at timestamptz,
  storage_bucket text not null default 'course-materials',
  storage_path text not null unique,
  file_name text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0 and file_size_bytes <= 52428800),
  mime_type text not null,
  format text not null,
  version integer not null default 1 check (version > 0),
  thumbnail_url text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint materials_module_fk foreign key (course_id, module_slug) references public.modules(course_id, slug) on update cascade on delete cascade,
  constraint materials_session_fk foreign key (course_id, session_number, module_slug) references public.sessions(course_id, number, module_slug) on update cascade on delete cascade,
  constraint materials_session_requires_module check (session_number is null or module_slug is not null),
  constraint materials_publish_time_check check (
    status not in ('scheduled', 'published') or publish_at is not null
  )
);

create index if not exists materials_course_status_publish_idx
  on public.materials(course_id, status, publish_at desc);
create index if not exists materials_module_session_idx
  on public.materials(course_id, module_slug, session_number);
create unique index if not exists materials_series_version_unique
  on public.materials(
    course_id,
    kind,
    lower(title),
    coalesce(module_slug, ''),
    coalesce(session_number, 0),
    version
  );
create index if not exists sessions_course_status_idx
  on public.sessions(course_id, status, number);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('editor', 'admin')
  );
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'Course user'), '@', 1)),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at before update on public.courses
for each row execute procedure public.set_updated_at();

drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at before update on public.modules
for each row execute procedure public.set_updated_at();

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at before update on public.sessions
for each row execute procedure public.set_updated_at();

drop trigger if exists materials_set_updated_at on public.materials;
create trigger materials_set_updated_at before update on public.materials
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.sessions enable row level security;
alter table public.materials enable row level security;

-- Explicit API privileges. Row Level Security remains the authorization boundary.
grant usage on schema public to anon, authenticated;
grant select on public.courses, public.modules, public.sessions, public.materials to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant insert, update, delete on public.courses, public.modules, public.sessions, public.materials to authenticated;

-- Profiles: users see themselves; staff see the staff directory; only admins change roles.
drop policy if exists profiles_select_own_or_staff on public.profiles;
create policy profiles_select_own_or_staff on public.profiles
for select using (id = auth.uid() or public.is_staff());

drop policy if exists profiles_update_own_non_role on public.profiles;

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
for update using (public.is_admin())
with check (public.is_admin());

-- Course structure is public; only staff may write.
drop policy if exists courses_public_read on public.courses;
create policy courses_public_read on public.courses
for select using (status = 'published' or public.is_staff());

drop policy if exists courses_staff_write on public.courses;
create policy courses_staff_write on public.courses
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists modules_public_read on public.modules;
create policy modules_public_read on public.modules
for select using (status = 'published' or public.is_staff());

drop policy if exists modules_staff_write on public.modules;
create policy modules_staff_write on public.modules
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists sessions_public_read on public.sessions;
create policy sessions_public_read on public.sessions
for select using (status in ('published', 'completed') or public.is_staff());

drop policy if exists sessions_staff_write on public.sessions;
create policy sessions_staff_write on public.sessions
for all using (public.is_staff()) with check (public.is_staff());

-- Public users receive only released metadata. Private files are never public objects.
drop policy if exists materials_public_read on public.materials;
create policy materials_public_read on public.materials
for select using (
  public.is_staff()
  or (
    status in ('published', 'scheduled')
    and publish_at is not null
    and publish_at <= now()
  )
);

drop policy if exists materials_staff_insert on public.materials;
create policy materials_staff_insert on public.materials
for insert with check (public.is_staff() and created_by = auth.uid());

drop policy if exists materials_staff_update on public.materials;
create policy materials_staff_update on public.materials
for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists materials_staff_delete on public.materials;
create policy materials_staff_delete on public.materials
for delete using (public.is_staff());

create or replace view public.materials_public
with (security_invoker = true)
as
select
  m.id,
  m.course_id,
  m.title,
  m.description,
  m.kind,
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
where m.status in ('published', 'scheduled')
  and m.publish_at is not null
  and m.publish_at <= now();

grant select on public.materials_public to anon, authenticated;

-- Private storage bucket. Students receive 90-second signed downloads from the server route.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-materials',
  'course-materials',
  false,
  52428800,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/markdown',
    'application/zip',
    'text/csv'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists course_materials_staff_select on storage.objects;
create policy course_materials_staff_select on storage.objects
for select to authenticated
using (bucket_id = 'course-materials' and public.is_staff());

drop policy if exists course_materials_staff_insert on storage.objects;
create policy course_materials_staff_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'course-materials' and public.is_staff());

drop policy if exists course_materials_staff_update on storage.objects;
create policy course_materials_staff_update on storage.objects
for update to authenticated
using (bucket_id = 'course-materials' and public.is_staff())
with check (bucket_id = 'course-materials' and public.is_staff());

drop policy if exists course_materials_staff_delete on storage.objects;
create policy course_materials_staff_delete on storage.objects
for delete to authenticated
using (bucket_id = 'course-materials' and public.is_staff());

-- Reference course seed.
insert into public.courses (
  code, title, description, program, school, semester, credits, ltp,
  duration_weeks, prerequisite, instructor_name, status
)
values (
  'DATA301',
  'Machine Learning',
  'A theory-to-practice course covering regression, classification, clustering, dimensionality reduction, model evaluation, regularization, and perceptron-based learning with Python.',
  'B.Tech. (Hons.) Data Science',
  'School of Engineering & Technology',
  'V',
  4,
  '2:0:4',
  15,
  'Optimization Techniques for Data Science (MATH301)',
  'Independent course team',
  'published'
)
on conflict (code) do update set
  title = excluded.title,
  description = excluded.description,
  program = excluded.program,
  school = excluded.school,
  semester = excluded.semester,
  credits = excluded.credits,
  ltp = excluded.ltp,
  duration_weeks = excluded.duration_weeks,
  prerequisite = excluded.prerequisite,
  instructor_name = excluded.instructor_name,
  status = excluded.status;

with c as (select id from public.courses where code = 'DATA301')
insert into public.modules (
  course_id, number, slug, title, short_title, level, description, takeaway,
  lecture_sessions, practice_sessions, lecture_hours, practice_hours, accent, position, status
)
select c.id, seed.number, seed.slug, seed.title, seed.short_title, seed.level,
       seed.description, seed.takeaway, seed.lecture_sessions, seed.practice_sessions,
       seed.lecture_hours, seed.practice_hours, seed.accent, seed.position, 'published'
from c
cross join (values
  (1, 'introduction-and-data', 'Introduction to Machine Learning', 'Foundations & Data', 'Foundation', 'Build a precise mental model of AI and ML, learning paradigms, applications, and deliberate data preparation.', 'Understand machine learning and its foundations.', 4, 4, 4, 8, 'cobalt', 1),
  (2, 'supervised-learning', 'Supervised Learning Techniques', 'Supervised Learning', 'Intermediate', 'Move from regression fundamentals to classification with KNN, trees, forests, ensembles, SVMs, and evaluation metrics.', 'Understand and implement supervised machine-learning techniques.', 12, 12, 12, 24, 'violet', 2),
  (3, 'unsupervised-learning', 'Unsupervised Learning', 'Unsupervised Learning', 'Intermediate', 'Discover structure without labels through clustering, density-based methods, hierarchical techniques, and PCA.', 'Understand unsupervised machine-learning models.', 8, 8, 8, 16, 'teal', 3),
  (4, 'model-building-and-perceptron', 'Model Building and Introduction to Perceptron', 'Model Building', 'Advanced', 'Integrate regularization, cross-validation, bias-variance reasoning, model selection, perceptrons, and logistic regression.', 'Build perceptron and logistic-regression models to solve classification problems.', 6, 6, 6, 12, 'amber', 4)
) as seed(number, slug, title, short_title, level, description, takeaway, lecture_sessions, practice_sessions, lecture_hours, practice_hours, accent, position)
on conflict (course_id, number) do update set
  slug = excluded.slug,
  title = excluded.title,
  short_title = excluded.short_title,
  level = excluded.level,
  description = excluded.description,
  takeaway = excluded.takeaway,
  lecture_sessions = excluded.lecture_sessions,
  practice_sessions = excluded.practice_sessions,
  lecture_hours = excluded.lecture_hours,
  practice_hours = excluded.practice_hours,
  accent = excluded.accent,
  position = excluded.position,
  status = excluded.status;

with c as (select id from public.courses where code = 'DATA301')
insert into public.sessions (
  course_id, module_slug, number, title, practice_code, practice_title, status
)
select c.id, seed.module_slug, seed.number, seed.title, seed.practice_code, seed.practice_title, 'planned'
from c
cross join (values
  ('introduction-and-data', 1, 'Introduction to Machine Learning, learning paradigms, and applications in NLP and computer vision', 'P1-P2', 'Python ecosystem for machine learning: Python, SciPy, and Scikit-learn'),
  ('introduction-and-data', 2, 'Data preparation: data types, missing data, class imbalance, and resampling', null, null),
  ('introduction-and-data', 3, 'Data scaling: standardization and normalization', 'P3-P4', 'Demonstrate data-preprocessing techniques on a dataset'),
  ('introduction-and-data', 4, 'Outliers, categorical encoding, and terminology: features, samples, and dataset splits', null, null),
  ('supervised-learning', 5, 'Supervised learning and introduction to regression', 'P5-P6', 'Build a linear regression model for dependent and independent variables'),
  ('supervised-learning', 6, 'Simple linear regression and gradient descent', null, null),
  ('supervised-learning', 7, 'Multiple linear regression and regression metrics', 'P7-P8', 'Implement KNN classification'),
  ('supervised-learning', 8, 'Classification models and learning steps', null, null),
  ('supervised-learning', 9, 'K-nearest neighbour classification', 'P9-P10', 'Implement a decision tree classifier'),
  ('supervised-learning', 10, 'Decision tree classification', null, null),
  ('supervised-learning', 11, 'Decision tree classification continued', 'P11-P12', 'Implement a random forest classifier'),
  ('supervised-learning', 12, 'Random forest classification', null, null),
  ('supervised-learning', 13, 'Ensemble learning: bagging and boosting', 'P13-P14', 'Implement and analyse classifiers'),
  ('supervised-learning', 14, 'Support vector machine classification', null, null),
  ('supervised-learning', 15, 'Support vector machine classification continued', 'P15-P16', 'Implement and analyse classifiers'),
  ('supervised-learning', 16, 'Metrics for evaluating classification models', null, null),
  ('unsupervised-learning', 17, 'Unsupervised learning, supervised comparison, and applications', 'P17-P18', 'Implement K-means clustering'),
  ('unsupervised-learning', 18, 'Clustering applications, types, and metrics', null, null),
  ('unsupervised-learning', 19, 'Partitioning methods: K-means and K-medoids', 'P19-P20', 'Implement K-means clustering'),
  ('unsupervised-learning', 20, 'Hierarchical clustering', null, null),
  ('unsupervised-learning', 21, 'Density-based methods: DBSCAN', 'P21-P22', 'Implement PCA dimensionality reduction'),
  ('unsupervised-learning', 22, 'Dimensionality-reduction techniques', null, null),
  ('unsupervised-learning', 23, 'Principal component analysis', 'P23-P24', 'Implement PCA dimensionality reduction'),
  ('unsupervised-learning', 24, 'Module review', null, null),
  ('model-building-and-perceptron', 25, 'Model regularization: lasso and ridge', 'P25-P26', 'Evaluate models using appropriate metrics'),
  ('model-building-and-perceptron', 26, 'Cross-validation, overfitting, underfitting, bias, variance, and hyperparameters', null, null),
  ('model-building-and-perceptron', 27, 'Model evaluation and selection', 'P27-P28', 'Implement perceptron and logistic regression for classification'),
  ('model-building-and-perceptron', 28, 'Biological neuron and the perceptron learning algorithm', null, null),
  ('model-building-and-perceptron', 29, 'Perceptron learning algorithm continued', 'P29-P30', 'Course project reviews'),
  ('model-building-and-perceptron', 30, 'Logistic regression and sigmoid activation function', null, null)
) as seed(module_slug, number, title, practice_code, practice_title)
on conflict (course_id, number) do update set
  module_slug = excluded.module_slug,
  title = excluded.title,
  practice_code = excluded.practice_code,
  practice_title = excluded.practice_title;

commit;

-- After creating the instructor in Authentication > Users, promote that account:
-- update public.profiles set role = 'admin', display_name = 'Independent course team'
-- where id = '<AUTH_USER_UUID>';

-- Production API grants verified during live deployment acceptance testing.
-- RLS remains enabled; these grants provide table-level privileges while policies
-- continue to determine row-level access for browser/authenticated clients.
grant usage on schema public to anon, authenticated, service_role;
grant select on public.profiles to authenticated;
grant select on public.courses, public.modules, public.sessions, public.materials to anon, authenticated, service_role;
grant insert, update, delete on public.courses, public.modules, public.sessions, public.materials to authenticated, service_role;
grant select, update on public.profiles to authenticated;
notify pgrst, 'reload schema';
