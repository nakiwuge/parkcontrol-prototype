# ParkControl Prototype

ParkControl is a Next.js market research prototype for demonstrating parking entry, revenue control, owner visibility, suspicious activity, and daily reporting.

It is intentionally simple:

- `Next.js` App Router
- `JavaScript`, not TypeScript
- `Tailwind CSS`
- `Supabase` for database
- `Vercel` ready deployment
- no real authentication
- no real camera, ANPR, or SMS provider integrations

## Features

- Home page with role switch between Staff and Owner
- Staff dashboard with:
  - cars inside
  - entries today
  - exits today
  - collected today
  - manual entry creation
  - simulated camera capture
  - camera confirmation
  - active cars table
- Vehicle checkout flow with:
  - rounded hourly duration calculation
  - configurable fixed-rate sessions
  - lost receipt fine
  - paid and unpaid exit states
  - cash and mobile money demo methods
- Owner dashboard with:
  - expected revenue
  - collected revenue
  - unpaid amount
  - suspicious activity
  - staff activity
- Demo SMS receipt preview and logging
- Daily report with print button

## Requirements

- Node.js `20+` is recommended
- A Supabase project

## 1. Install dependencies

Use `yarn`:

```bash
yarn dev
```

If dependencies are not installed yet:

```bash
yarn install
```

## 2. Create a Supabase project

Create a new project in Supabase, then open the SQL editor.

## 3. Run the schema

Run the SQL from:

```bash
supabase/schema.sql
```

This creates:

- `parking_sites`
- `vehicle_sessions`
- `activity_logs`
- the `updated_at` trigger
- the default parking site:
  - `Rompact Demo Parking`
  - `Kampala`
  - `hourly_rate = 2000`
  - `fixed_rate = 5000`
  - `lost_receipt_fine = 10000`

If you already created the tables before this update, rerun `supabase/schema.sql` so the `fixed_rate` column is added to `parking_sites`.

## 4. Add environment variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## 5. Run locally

Start the development server:

```bash
yarn dev
```

Open:

```bash
http://localhost:3000
```

## 6. Demo flow to test

1. Open `Staff View`
2. Create a manual vehicle entry
3. Confirm it appears under active cars
4. Open vehicle details
5. Send demo SMS if a phone number exists
6. Open checkout
7. Mark it as paid or unpaid exit
8. Open `Owner Dashboard`
9. Confirm revenue totals and suspicious activity update
10. Use `Simulate Camera Capture`
11. Confirm the new session appears as `Needs Staff Confirmation`
12. Confirm the camera vehicle from the staff dashboard
13. Open `Daily Report`

## Deployment to Vercel

1. Push the repo to GitHub
2. Import the project into Vercel
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy

The app uses server actions and standard App Router pages, so it is Vercel ready without extra runtime configuration.

## Notes

- SMS sending is demo-only and logs to the server console
- Camera capture is simulated only
- Mobile Money is a demo payment label only
- Supabase Storage is not required yet, but the database layer is ready to be extended later

## Scripts

```bash
yarn dev
yarn build
yarn start
yarn lint
```
