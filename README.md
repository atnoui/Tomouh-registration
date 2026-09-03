# طموح — Membership Registration Platform

A Next.js + Tailwind + Supabase site for the Tomouh club: a public landing
page with a 3-step Arabic (RTL) registration form, and a private admin
dashboard to review applicants.

## 1. Folder structure

```
tomouh-club/
├── app/
│   ├── layout.js                  Root layout, RTL + fonts + metadata
│   ├── globals.css                Tailwind + base styles
│   ├── page.js                    Landing page (hero, story, departments, form)
│   ├── icon.png                   Favicon (auto-detected by Next.js)
│   └── admin/
│       ├── page.js                Redirects /admin → /admin/login
│       ├── login/page.js          Admin sign-in
│       └── dashboard/
│           ├── page.js            Applicants table (search + filter)
│           └── [id]/page.js       Full applicant profile + status control
├── components/
│   ├── Header.js                  Sticky landing-page nav
│   ├── RegistrationForm.js        The 3-step public form (writes to Supabase)
│   ├── AuthGuard.js               Redirects to /admin/login if not signed in
│   └── StatusBadge.js             Colored status pill
├── lib/
│   ├── supabaseClient.js          Supabase client initialization
│   └── constants.js               Wilayas list + form option sets
├── sql/
│   └── schema.sql                 Run this once in the Supabase SQL Editor
├── public/
│   ├── logo.png                   Logo mark (navy/orange, for light backgrounds)
│   └── logo-hero.png              Logo badge (for the dark hero + favicon)
├── .env.local.example
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 2. Set up the database

Your Supabase project **"Tomouh club"** is already connected. Open
**Supabase Dashboard → SQL Editor → New query**, paste the contents of
`sql/schema.sql`, and run it. This creates the `applicants` table with Row
Level Security so that:
- anyone (anonymous visitors) can **submit** an application, but
- only **signed-in** users (your admins) can **read or update** the list.

## 3. Create an admin account

The dashboard uses Supabase's own authentication — there's no separate user
table to manage. To create your first admin:

1. Go to **Authentication → Users** in the Supabase dashboard.
2. Click **Add user → Create new user**.
3. Enter the admin's email and a password, and make sure **"Auto confirm
   user"** is checked.
4. That's it — this email/password now logs into `/admin/login`.

Repeat for each additional admin. To revoke access, delete or disable the
user from the same screen.

## 4. Run the project locally

You'll need [Node.js](https://nodejs.org) 18 or later installed.

```bash
# 1. Move into the project folder
cd tomouh-club

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.local.example .env.local
# (the Supabase URL and anon key are already filled in for you)

# 4. Start the dev server
npm run dev
```

Visit:
- **http://localhost:3000** — the public landing page + registration form
- **http://localhost:3000/admin/login** — the admin dashboard

## 5. Deploy it

The easiest path is [Vercel](https://vercel.com) (made by the Next.js team,
free tier is enough for this):

```bash
# From inside tomouh-club/
npx vercel
```

When prompted, add the two environment variables from `.env.local` in the
Vercel project settings (**Settings → Environment Variables**):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://iidrroobpqczcejvjauy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_DV00fwqW4BP-pOQ5FOHHWw_x0cAw2Qb` |

Then `npx vercel --prod` to ship it. Any other Node-friendly host (Netlify,
Render, your own server via `npm run build && npm run start`) works the same
way — just set those two env vars there too.

## 6. How the pieces fit together

- **Registration form** (`components/RegistrationForm.js`) collects the same
  questions as your original Google Form, in three steps, then calls
  `supabase.from("applicants").insert([...])`.
- **Dashboard** (`app/admin/dashboard/page.js`) calls
  `supabase.from("applicants").select("*")` and renders it as a searchable,
  filterable table.
- **Applicant detail** (`app/admin/dashboard/[id]/page.js`) fetches one row
  by `id` and lets an admin move it through `pending → reviewed → accepted /
  rejected` via `supabase.from("applicants").update({ status })`.
- Every one of those calls is governed by the RLS policies in
  `sql/schema.sql` — the anon key in your frontend can never read applicant
  data, only submit it; only an authenticated admin session can read/update.

## 7. Notes & assumptions worth knowing

- The original Google Form's last question ("which department could you see
  yourself in") was set up as **multiple-select** here, since people
  realistically fit more than one branch — stored as a `text[]` column.
- "Wilaya of residence" is a dropdown of all 58 Algerian wilayas rather than
  free text, for cleaner, consistent data.
- The whole UI is Arabic/RTL to match your original form and audience. If
  you'd like an English version or a language switch, that's a
  straightforward follow-up.
