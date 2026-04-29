# Patient Dashboard

A patient management dashboard built for a project

## Features

- Add, edit, and delete patients with confirmation dialog
- Real-time search by patient name
- Filter patients by status with live counts per stage
- Sort by any column in table view
- Toggle between table view and kanban board view
- Kanban board with left and right arrows to move patients through status progression
- Recently moved patients appear at the top of their new column with a blue highlight
- Color coded status badges across all views
- Patient age calculated automatically from date of birth
- Analytics summary showing total, active, inquiry, onboarding, and churned counts
- Empty states for no results

## Stack

- Next.js 16 with App Router
- TypeScript
- PostgreSQL via Neon (serverless)
- Drizzle ORM
- Tailwind CSS
- Shadcn UI

## API Routes

- GET /api/patients — fetch all patients
- POST /api/patients — create a new patient
- PUT /api/patients/[id] — update a patient
- DELETE /api/patients/[id] — delete a patient
- PATCH /api/patients/[id]/status — update status only

## Running Locally

1. Clone the repo
2. Run `npm install`
3. Create a `.env.local` file with your Neon connection string:
DATABASE_URL=your_neon_connection_string
4. Run `npm run db:push` to create the database tables
5. Optionally run `npm run db:seed` to populate with sample data
6. Run `npm run dev` and open http://localhost:3000

## Design Decisions

- Skipped authentication since a single shared view was confirmed as sufficient
- Skipped drag and drop in favor of arrow buttons for simplicity and reliability
- Pagination not implemented for this dataset size but would add limit/offset to the GET endpoint at scale
- Status changes use PATCH instead of PUT to follow REST conventions for partial updates
