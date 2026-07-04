-- Emergency admin account recovery.
-- Use only when password reset emails do not arrive.
--
-- Steps:
-- 1. In Supabase Dashboard > Authentication > Providers > Email, turn OFF email confirmation temporarily.
-- 2. Run this file in Supabase Dashboard > SQL Editor.
-- 3. Open login.html, Register with arjungangwariitpkd@gmail.com and a new password.
-- 4. Run supabase-setup.sql again after the new account is created.

delete from auth.users
where lower(email) = 'arjungangwariitpkd@gmail.com';

delete from public.profiles
where lower(email) = 'arjungangwariitpkd@gmail.com';

update public.profiles
set role = 'student',
    updated_at = now()
where role = 'admin'
  and lower(email) <> 'arjungangwariitpkd@gmail.com';

select email, role, updated_at
from public.profiles
order by updated_at desc;
