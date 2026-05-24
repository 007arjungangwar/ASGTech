# Supabase Setup

Use this once before publishing the GitHub Pages site.

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase-setup.sql`.
3. Open **Project Settings > API**.
4. Copy the Project URL and anon/publishable key into `supabase-backend.js`.
5. Open **Authentication > Providers > Email** and enable email/password login.
6. For instant student registration, turn off email confirmation. If you keep confirmation on, students must confirm email before signing in.
7. Sign in with `arjungangwariitpkd@gmail.com`, open `admin.html`, then click **Publish to Cloud**.

After this, admin content, YouTube links, student activity, and uploaded PDFs are served from Supabase instead of one browser's local storage.
