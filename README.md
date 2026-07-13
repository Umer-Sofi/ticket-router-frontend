# Smart Ticket Router — Frontend

The web UI for the AI-powered ticket triage system. Built with **Next.js**,
**TypeScript**, **Tailwind CSS**, and **shadcn/ui**. A user pastes a support
ticket, clicks **Classify**, and sees its category, priority, and assigned team.

> Backend (FastAPI) lives in a separate repo: **ticket-router-backend**.
> The frontend calls it over REST — start the backend first.

---

## Screenshots

<!-- Add a screenshot: save it to public/screenshot.png, then it shows below -->
![Smart Ticket Router UI](public/screenshot.png)

---

## Setup

**Requirements:** Node.js 18+

```bash
# 1. install dependencies
npm install

# 2. point the app at your backend (see Environment variables)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. run the dev server
npm run dev
```

Open **http://localhost:3000**. (The backend must be running on port 8000.)

---

## Environment variables

Create `.env.local` (git-ignored — never commit it):

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:8000` | Base URL of the backend API. `NEXT_PUBLIC_` makes it available in the browser. |

For production, set this to your deployed backend URL (e.g. the Render URL).

---

## How it works

1. `app/page.tsx` holds the UI state (input, loading, result, error).
2. On submit, it calls `classifyTicket()` in `lib/api.ts`.
3. `lib/api.ts` sends `POST {NEXT_PUBLIC_API_URL}/api/route-ticket` with `{ text }`.
4. The returned `RouteResult` is rendered by `components/result-card.tsx`.

The UI handles all states: idle, loading (spinner + disabled button), success
(result card), and error (alert).

---

## Folder structure

```
app/
  page.tsx           main page — state + layout
  layout.tsx         root layout
components/
  result-card.tsx    displays a classification result
  priority-badge.tsx colored High/Medium/Low badge
  ui/                shadcn components
lib/
  api.ts             backend API client (fetch)
types/
  ticket.ts          TypeScript types mirroring the backend contract
```

---

## Deployment

Deploy to **Vercel**. Set `NEXT_PUBLIC_API_URL` to your live backend URL in the
Vercel project's environment variables.

---

## Future work

- Ticket history (localStorage or backend-persisted)
- Analytics dashboard with real aggregated data
- Confidence score & token/cost display
