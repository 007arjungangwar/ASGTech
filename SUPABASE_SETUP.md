# Supabase Setup

Use this once before publishing the GitHub Pages site.

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase-setup.sql`.
3. Open **Project Settings > API**.
4. Copy the Project URL and anon/publishable key into `supabase-backend.js`.
5. Open **Authentication > Providers > Email** and enable email/password login.
6. For instant student registration, turn off email confirmation. If you keep confirmation on, students must confirm email before signing in.
7. Open **Authentication > URL Configuration**.
8. Set **Site URL** to `https://007arjungangwar.github.io/learning-with-arjun/`.
9. Add this redirect URL: `https://007arjungangwar.github.io/learning-with-arjun/login.html?mode=reset-password`.
10. Sign in with `arjungangwariitpkd@gmail.com`, open `admin.html`, then click **Publish to Cloud**.

After this, admin content, YouTube links, student activity, and uploaded PDFs are served from Supabase instead of one browser's local storage.

If old students were created before Supabase, they were browser-local accounts. They can appear in the admin dashboard as legacy users, but they should create/reset Supabase accounts to log in from every device.

## Emergency Fixes

If new devices cannot see content and `site_data` is empty, run `supabase-seed-content.sql` in the Supabase SQL Editor.

If password reset emails do not arrive, run `supabase-admin-recovery.sql`, then register again with `arjungangwariitpkd@gmail.com` and a new password.
