# ParkControl

ParkControl is a Next.js prototype for parking businesses that need better parking records, payment tracking, and owner visibility.

This project is built as a working product demo for Rompact. It shows the full parking flow from entry to checkout, owner reporting, and sales waitlist capture.

## Live prototype

- https://parkcontrol-prototype.vercel.app/

## What the prototype covers

- Staff vehicle entry
- Active cars view
- Camera capture simulation
- Camera review and confirmation
- Checkout with hourly or fixed pricing
- Paid and unpaid exits
- Current total / amount calculations
- Owner dashboard
- Daily report
- Staff activity log
- Waitlist form for sales follow-up
- Demo SMS messaging
- Receipt QR display on vehicle details

## Stack

- Next.js App Router
- JavaScript
- Tailwind CSS
- Supabase
- Vercel-ready deployment

## Main routes

- `/` landing page
- `/staff` staff dashboard
- `/staff/entry` manual vehicle entry
- `/owner` owner dashboard
- `/settings` parking settings
- `/activity` staff activity
- `/reports/daily` daily report
- `/waitlist` sales waitlist
- `/vehicles/[id]` vehicle details
- `/vehicles/[id]/checkout` checkout flow

## Local setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Create environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```


### 5. Start the app

```bash
yarn dev
```

Open:

- `http://localhost:3000`

## Demo flow

### Staff flow

1. Open `Staff View`
2. Add a manual vehicle entry or simulate a camera capture
3. Review active cars
4. Open a vehicle record
5. Checkout the vehicle
6. Mark it as paid or unpaid exit

### Owner flow

1. Open `Owner Dashboard`
2. Review active cars
3. Review completed payments
4. Open daily report
5. Check settings and staff activity

### Waitlist flow

1. Open `Join Waitlist`
2. Save a lead with business details, package, budget, and follow-up notes



## Scripts

```bash
yarn dev
yarn build
yarn start
yarn lint
```

Note:

- the build script uses `next build --webpack`

## Project structure

```text
src/app                  App Router pages and loading states
src/components           Reusable UI
src/lib                  Data, formatting, Supabase, parking logic
supabase/schema.sql      Database schema
```
