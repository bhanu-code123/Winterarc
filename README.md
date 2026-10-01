# Winter Arc Tracker

A monthly habit and sleep tracker built with **React (Vite)** and **Supabase** (Postgres database + login).
Each user signs up with email and password and only ever sees their own data.

## Project structure

```
winter-arc/
├── index.html
├── package.json
├── vite.config.js
├── .env.example            ← copy to .env and add your Supabase keys
├── public/
│   └── favicon.svg
├── supabase/
│   └── schema.sql          ← run once in Supabase SQL Editor
└── src/
    ├── main.jsx            ← entry point
    ├── App.jsx             ← shows login or tracker
    ├── styles.css
    ├── lib/
    │   ├── supabase.js     ← database client
    │   └── constants.js    ← default habits, sleep options, helpers
    ├── hooks/
    │   └── useMonthData.js ← loads + auto-saves a month
    └── components/
        ├── Auth.jsx          ← sign in / sign up
        ├── Tracker.jsx       ← main page layout
        ├── Header.jsx        ← title, name, month switcher
        ├── Stats.jsx         ← completion %, streak, avg sleep
        ├── DayHeader.jsx     ← 1–31 day row
        ├── HabitTracker.jsx
        ├── SleepTracker.jsx
        ├── MonthlyGoals.jsx
        ├── MonthlyReview.jsx
        └── Notes.jsx
```

## 1. Set up the database (Supabase, free tier)

1. Create an account at https://supabase.com and click **New project**.
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**.
   This creates the `profiles` and `months` tables with Row Level Security so users can only access their own rows.
3. Go to **Project Settings → API** and copy the **Project URL** and the **anon public** key.
4. Optional: under **Authentication → Providers → Email**, turn off **Confirm email** if you want
   users to sign in right after signing up without confirming by email.

## 2. Run locally

Requires Node.js 18 or newer.

```bash
npm install
cp .env.example .env      # then paste your URL and anon key into .env
npm run dev
```

Open http://localhost:5173

## 3. Deploy

### Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repo (framework preset: Vite).
3. Under **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Click **Deploy**.

### Netlify
Same steps: build command `npm run build`, publish directory `dist`, and add the same two environment variables.

After deploying, add your live URL in Supabase under **Authentication → URL Configuration → Site URL**
so confirmation emails link back to your site.

## How data is stored

| Table      | Columns                                   | Notes                                  |
|------------|-------------------------------------------|----------------------------------------|
| `profiles` | `id`, `name`, `updated_at`                | One row per user                       |
| `months`   | `user_id`, `month` (`2026-10`), `data`, `updated_at` | One row per user per month; `data` is JSON |

The `data` JSON holds habit names, ticks (`"habitIndex-day": true`), sleep (`"day": rowIndex`),
goals, review answers and notes. Changes save automatically about a second after each edit.

The anon key is safe to use in the browser: Row Level Security in `schema.sql` is what keeps each user's data private.
Never put the `service_role` key in this app.
