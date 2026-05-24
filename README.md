# ASG Tech Learning Website

ASG Tech is a static frontend hosted on GitHub Pages with Supabase used as the central online backend for authentication, database records, realtime content sync, and PDF storage.

Live site:

```text
https://007arjungangwar.github.io/learning-with-arjun/
```

## Current Architecture

```text
Student/Admin browser
        |
        v
GitHub Pages static frontend
        |
        v
Supabase
  - Auth: student/admin login
  - PostgreSQL: shared learning data and activity
  - Storage: uploaded PDFs
  - Realtime: content refresh across devices
```

GitHub Pages serves only HTML, CSS, and JavaScript. Supabase is the source of truth for shared content.

## Main Files

| File | Purpose |
| --- | --- |
| `index.html` | Public home/overview page |
| `login.html` | Login, register, and password reset UI |
| `admin.html` | Admin dashboard for courses, topics, quizzes, videos, resources, announcements, and users |
| `admin-guide.html` | Admin-only content upload plan and AI prompt templates |
| `auth-check.js` | Shared navigation shell, top header, left sidebar, auth guard, theme, service worker refresh |
| `learning-data.js` | Course/content models, local cache helpers, student progress helpers, and save functions |
| `supabase-backend.js` | Supabase Auth, REST database sync, realtime listeners, Storage uploads |
| `published-learning-data.js` | Static fallback snapshot for first load or emergency backup |
| `supabase-setup.sql` | Supabase database tables, RLS policies, admin permissions, Storage bucket |
| `sw.js` | Service worker cache for GitHub Pages |
| `SUPABASE_SETUP.md` | Short Supabase setup checklist |

## Data Flow

### Admin Publishes Content

```text
Admin Dashboard
        |
        v
learning-data.js saves the content key
        |
        v
supabase-backend.js sends it to Supabase REST API
        |
        v
public.site_data table
        |
        v
All student devices read the same content
```

The main shared content keys are:

```text
asgCourses
asgQuizCatalog
asgQuizQuestions
asgCodingChallenges
asgBlogPosts
asgProjectShowcase
asgVideoPlaylists
asgRoadmapItems
asgVideoLibrary
asgResourceLibrary
studentAnnouncement
```

These keys are stored in the Supabase `site_data` table.

### PDF Uploads

When the admin uploads a PDF:

```text
Admin selects PDF
        |
        v
Supabase Storage bucket: asg-content
        |
        v
Public PDF URL is saved inside site_data
        |
        v
Students open the PDF from Supabase Storage
```

The PDF is not stored only in the admin browser. It is uploaded to Supabase Storage and becomes available to other devices.

### HTML Lessons

HTML lesson files are read by the admin page and saved as lesson content inside the course data. That course data is then synced to Supabase `site_data`.

### YouTube Videos

YouTube video links are saved as URLs in the course topic or video library data. Students receive those links from Supabase like any other shared content.

### Student Activity

Student activity is stored in Supabase `user_activity`.

Examples:

```text
asgQuizAttempts
quizScores
asgCodingSubmissions
asgExamAttempts
asgCourseProgress
certificates
asgCertificateRequests
studentQuestions
```

Admins can read all activity. Students can only read their own activity.

## Authentication And Admin Access

Supabase Auth handles real login accounts.

Current admin email:

```text
arjungangwariitpkd@gmail.com
```

Admin permission is controlled in two places:

1. `supabase-setup.sql`
2. `supabase-backend.js`

Only the configured admin email should get admin dashboard access. The public Supabase publishable key is safe to use in frontend code. Do not put the database password or service-role key in frontend files.

## Supabase Tables

### `profiles`

Stores registered users:

```text
id
name
email
role
join_date
updated_at
```

### `site_data`

Stores shared admin content:

```text
key
value
updated_at
updated_by
```

### `user_activity`

Stores student progress and submissions:

```text
user_id
key
value
updated_at
updated_by
```

## Security Model

Supabase Row Level Security is enabled.

Rules:

```text
Public users can read public learning content.
Only admin can write shared site content.
Students can read/write their own activity.
Admin can read student profiles and activity.
Admin can upload/delete files in the asg-content bucket.
```

This is why students on another device can see admin content, but cannot edit it.

## Deployment Flow

This website deploys from GitHub `main`.

```text
Edit files locally
        |
        v
git add / git commit
        |
        v
git push origin main
        |
        v
GitHub Pages build and deployment
        |
        v
Live website updates
```

After deployment, use a cache-busted URL when checking changes:

```text
https://007arjungangwar.github.io/learning-with-arjun/?v=YOUR_COMMIT_ID
```

The service worker cache version is stored in:

```text
auth-check.js
sw.js
```

When frontend behavior changes, bump the cache version, for example:

```text
asg-tech-v46 -> asg-tech-v47
```

This helps old devices pick up the new files.

## Admin Content Workflow

Use this workflow when adding new content:

1. Login as admin.
2. Open `admin.html`.
3. Open `admin-guide.html` if you need the upload map or prompt templates.
4. Add or edit courses, topics, PDFs, HTML lessons, YouTube links, quizzes, videos, resources, or announcements.
5. Watch the sync text near the admin command area.
6. Confirm it says Supabase saved the content.
7. Open the website on another browser/device and refresh.

The content should appear from Supabase, not from the original admin browser.

## Scaling Plan

For the first version and around 500 users, the current approach is practical:

```text
GitHub Pages + Supabase Auth + Supabase PostgreSQL + Supabase Storage
```

As the site grows, improve in this order:

1. Keep using `site_data` for admin-managed content while the content size is small.
2. Move large repeated records into dedicated tables later, for example `courses`, `topics`, `videos`, `resources`, `quiz_questions`.
3. Keep PDFs in Supabase Storage, not in JSON.
4. Add indexes for any new tables that are searched often.
5. Add server-side validation with Supabase Edge Functions if admin workflows become complex.
6. Add backups/export routines before major content migrations.
7. Monitor Supabase free-plan limits for database size, storage, bandwidth, and monthly active users.

## Common Problems

### New Device Cannot See Content

Check:

1. `supabase-setup.sql` has been run in Supabase SQL Editor.
2. `site_data` has rows in Supabase.
3. Admin clicked save/publish after editing.
4. The browser is using the newest service worker cache.
5. Open the cache-busted URL with the latest commit id.

### Admin Upload Does Not Appear

Check:

1. You are logged in as the admin email.
2. Supabase status text says saved.
3. Storage bucket `asg-content` exists.
4. Storage policies from `supabase-setup.sql` are installed.
5. The PDF is under 50 MB.

### Password Reset Email Does Not Arrive

Check Supabase dashboard:

1. Authentication email provider is enabled.
2. Site URL is set to the GitHub Pages URL.
3. Redirect URL includes:

```text
https://007arjungangwar.github.io/learning-with-arjun/login.html?mode=reset-password
```

If needed, use `supabase-admin-recovery.sql` from this repo.

## Important Notes

- Firebase is no longer the active backend.
- GitHub Pages hosts the frontend only.
- Supabase is the central database/storage/auth backend.
- Browser `localStorage` is now mainly a local cache and fallback, not the source of truth.
- Do not commit database passwords.
- Do not expose Supabase service-role keys in frontend code.

## Development Commands

Check JavaScript syntax:

```powershell
node --check supabase-backend.js
node --check auth-check.js
node --check learning-data.js
```

Commit and deploy:

```powershell
git add .
git commit -m "Describe the change"
git push origin main
```

Check GitHub Pages deployment:

```powershell
gh run list --limit 5
```

## Current Goal

The current site goal is:

```text
Admin uploads PDFs, HTML lessons, and YouTube links.
Content saves to Supabase.
Students on any device see the same content.
Admin can monitor users, progress, quizzes, coding activity, and certificates.
```

That is the foundation to scale the platform cleanly.
