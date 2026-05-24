-- ASG Tech Supabase setup for GitHub Pages hosting.
-- Run this once in Supabase Dashboard > SQL Editor.
-- Then paste your Project URL and anon/publishable key into supabase-backend.js.

create or replace function public.asg_admin_emails()
returns text[]
language sql
immutable
as $$
    select array['arjungangwariitpkd@gmail.com']::text[];
$$;

create or replace function public.asg_public_content_keys()
returns text[]
language sql
immutable
as $$
    select array[
        'asgQuizCatalog',
        'asgQuizQuestions',
        'asgCodingChallenges',
        'asgCourses',
        'asgBlogPosts',
        'asgProjectShowcase',
        'asgVideoPlaylists',
        'asgRoadmapItems',
        'asgVideoLibrary',
        'asgResourceLibrary',
        'studentAnnouncement'
    ]::text[];
$$;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null default '',
    email text not null unique,
    role text not null default 'student' check (role in ('student', 'admin')),
    join_date timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.site_data (
    key text primary key,
    value jsonb not null default 'null'::jsonb,
    updated_at timestamptz not null default now(),
    updated_by jsonb not null default '{}'::jsonb
);

create table if not exists public.user_activity (
    user_id uuid not null references auth.users(id) on delete cascade,
    key text not null,
    value jsonb not null default 'null'::jsonb,
    updated_at timestamptz not null default now(),
    updated_by jsonb not null default '{}'::jsonb,
    primary key (user_id, key)
);

create index if not exists profiles_email_idx on public.profiles (lower(email));
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists user_activity_key_idx on public.user_activity (key);

create or replace function public.asg_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select
        lower(coalesce(auth.jwt() ->> 'email', '')) = any(public.asg_admin_emails())
        or exists (
            select 1
            from public.profiles
            where id = auth.uid()
              and role = 'admin'
        );
$$;

create or replace function public.asg_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    user_email text := lower(coalesce(new.email, ''));
    user_name text := trim(coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(user_email, '@', 1), 'Student'));
begin
    insert into public.profiles (id, name, email, role, join_date, updated_at)
    values (
        new.id,
        coalesce(nullif(user_name, ''), 'Student'),
        user_email,
        case when user_email = any(public.asg_admin_emails()) then 'admin' else 'student' end,
        now(),
        now()
    )
    on conflict (id) do update
    set
        email = excluded.email,
        name = coalesce(nullif(public.profiles.name, ''), excluded.name),
        role = case
            when excluded.email = any(public.asg_admin_emails()) then 'admin'
            else public.profiles.role
        end,
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists asg_on_auth_user_created on auth.users;
create trigger asg_on_auth_user_created
after insert on auth.users
for each row execute function public.asg_handle_new_user();

alter table public.profiles enable row level security;
alter table public.site_data enable row level security;
alter table public.user_activity enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.site_data to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_activity to authenticated;
grant insert, update, delete on public.site_data to authenticated;

drop policy if exists "Users can read their own profile or admins read all" on public.profiles;
create policy "Users can read their own profile or admins read all"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.asg_is_admin());

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (
    id = auth.uid()
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and (
        role = 'student'
        or (role = 'admin' and lower(email) = any(public.asg_admin_emails()))
    )
);

drop policy if exists "Users can update their own profile or admins update all" on public.profiles;
create policy "Users can update their own profile or admins update all"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.asg_is_admin())
with check (
    public.asg_is_admin()
    or (
        id = auth.uid()
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        and (
            role = 'student'
            or (role = 'admin' and lower(email) = any(public.asg_admin_emails()))
        )
    )
);

drop policy if exists "Anyone can read public ASG content" on public.site_data;
create policy "Anyone can read public ASG content"
on public.site_data
for select
to anon, authenticated
using (key = any(public.asg_public_content_keys()));

drop policy if exists "Admins can read all site data" on public.site_data;
create policy "Admins can read all site data"
on public.site_data
for select
to authenticated
using (public.asg_is_admin());

drop policy if exists "Admins can write site data" on public.site_data;
create policy "Admins can write site data"
on public.site_data
for all
to authenticated
using (public.asg_is_admin())
with check (public.asg_is_admin());

drop policy if exists "Users can read own activity or admins read all" on public.user_activity;
create policy "Users can read own activity or admins read all"
on public.user_activity
for select
to authenticated
using (user_id = auth.uid() or public.asg_is_admin());

drop policy if exists "Users can create own activity" on public.user_activity;
create policy "Users can create own activity"
on public.user_activity
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update own activity or admins update all" on public.user_activity;
create policy "Users can update own activity or admins update all"
on public.user_activity
for update
to authenticated
using (user_id = auth.uid() or public.asg_is_admin())
with check (user_id = auth.uid() or public.asg_is_admin());

drop policy if exists "Admins can delete activity" on public.user_activity;
create policy "Admins can delete activity"
on public.user_activity
for delete
to authenticated
using (public.asg_is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'asg-content',
    'asg-content',
    true,
    52428800,
    array['application/pdf', 'text/html', 'text/plain', 'image/png', 'image/jpeg', 'image/webp']::text[]
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ASG content files are public" on storage.objects;
create policy "ASG content files are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'asg-content');

drop policy if exists "Admins can upload ASG content files" on storage.objects;
create policy "Admins can upload ASG content files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'asg-content' and public.asg_is_admin());

drop policy if exists "Admins can update ASG content files" on storage.objects;
create policy "Admins can update ASG content files"
on storage.objects
for update
to authenticated
using (bucket_id = 'asg-content' and public.asg_is_admin())
with check (bucket_id = 'asg-content' and public.asg_is_admin());

drop policy if exists "Admins can delete ASG content files" on storage.objects;
create policy "Admins can delete ASG content files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'asg-content' and public.asg_is_admin());

do $$
begin
    alter publication supabase_realtime add table public.site_data;
exception
    when duplicate_object then null;
end;
$$;

do $$
begin
    alter publication supabase_realtime add table public.user_activity;
exception
    when duplicate_object then null;
end;
$$;

do $$
begin
    alter publication supabase_realtime add table public.profiles;
exception
    when duplicate_object then null;
end;
$$;
