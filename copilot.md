# copilot.md — Build plan & Copilot prompts for a **React Cold-Pitch Management System**

> Target: React + Vite + TypeScript (recommended).
> Goal: reproduce the attached clean dashboard UI for managing cold outreach (prospects, campaigns, sequences, analytics) and use GitHub Copilot in VS Code to generate high-quality, consistent code.

---

## 1 — Project overview

### 🎯 Purpose

A web app to manage cold outreach at scale for agencies or sales teams: create and track email/social pitch campaigns, manage prospect lists, sequences, templates, statuses, analytics (open rates, replies, conversions), and scheduling.

### 📦 Core Modules

* Authentication & Team membership (Admin, Manager, Outreach)
* Dashboard (KPIs, trends, quick actions)
* Prospects (import, enrichment, tags, status)
* Campaigns & Sequences (steps, delays, channels)
* Templates (email, LinkedIn message)
* Sending & Integrations (SMTP, Sendgrid, Postmark, LinkedIn/PhantomBuster — keep integration pluggable)
* Replies & Inboxes (simple aggregated view)
* Analytics & Reports (opens, clicks, replies, demos booked)
* Settings & Team management

### Non-functional requirements

* Privacy & rate-limit safe (avoid spammy automation guidance)
* Scalable (queue-based sending), audited actions
* Responsive dashboard matching attached design
* Extensible: add new channels / analytics

---

## 2 — Tech stack (recommended)

* React 18+ with TypeScript (Vite)
* Routing: `react-router-dom` v6
* Styling: Tailwind CSS
* Charts: ApexCharts (or Recharts)
* State: Zustand (small & ergonomic) or Redux Toolkit
* Forms: React Hook Form + Yup
* HTTP: Axios
* Authentication: JWT + refresh tokens (or Auth0 / Clerk)
* Background jobs (backend): queue system (Bull / Redis) — backend responsibility
* Lint & format: ESLint + Prettier
* Tests: Vitest + React Testing Library
* Hosting: Vercel / Netlify (frontend), backend on any API host

---

## 3 — Suggested folder structure

```
coldpitch/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ Sidebar/
│  │  ├─ Navbar/
│  │  ├─ KpiCard/
│  │  ├─ Chart/
│  │  ├─ ProspectTable/
│  │  └─ CampaignEditor/
│  ├─ pages/
│  │  ├─ Dashboard/
│  │  ├─ Prospects/
│  │  ├─ Campaigns/
│  │  ├─ Templates/
│  │  ├─ Inbox/
│  │  └─ Settings/
│  ├─ services/
│  ├─ stores/
│  ├─ hooks/
│  ├─ routes/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles/
├─ public/
├─ package.json
├─ tailwind.config.js
└─ README.md
```

---

## 4 — High-level routes (React Router)

```
/                -> redirect to /dashboard
/dashboard       -> Dashboard
/prospects       -> Prospect list (import, filters, bulk actions)
/prospects/:id   -> Prospect details & activity
/campaigns       -> Campaign list
/campaigns/new   -> Create campaign / sequence editor
/templates       -> Message templates
/inbox           -> Replies & message center
/settings        -> Account, integrations, team
```

---

## 5 — UI components & Copilot prompts

Use the attached dashboard layout: left sidebar, top navbar, KPI cards, chart + list, table below.

### Sidebar

**File:** `src/components/Sidebar/Sidebar.tsx`
**Prompt:**

> Build a left sidebar using Tailwind with links: Dashboard, Prospects, Campaigns, Templates, Inbox, Reports, Settings. Include the app logo and a compact footer profile.

### Navbar

**File:** `src/components/Navbar/Navbar.tsx`
**Prompt:**

> Top navbar with greeting (e.g., “Good morning, Jane”), global actions (Export, + New Campaign), a search input, and a notification bell. Keep it responsive.

### KPI Card

**File:** `src/components/KpiCard/KpiCard.tsx`
**Prompt:**

> Reusable KPI card component: title, large value, small percentage change (green/red), optional icon and link.

### Overview Chart

**File:** `src/components/Chart/OverviewChart.tsx`
**Prompt:**

> Line/area chart (ApexCharts) showing 2 series: Sent vs Replies (monthly). Tooltip shows month and counts.

### Campaign List / Activity

**File:** `src/components/CampaignList/CampaignList.tsx`
**Prompt:**

> A right-column appointment-style list showing active campaigns with progress, next send time and quick actions (pause/cancel).

### Prospects Table

**File:** `src/components/ProspectTable/ProspectTable.tsx`
**Prompt:**

> Responsive table: checkbox, name, company, email, status, last activity, tags, and prospect ID. Search box and filters (stage, tag).

### Campaign Editor

**File:** `src/components/CampaignEditor/CampaignEditor.tsx`
**Prompt:**

> Drag-and-drop / step editor for multi-step sequences. Each step: channel (email/LinkedIn), template selection, delay (hours/days), condition branching on reply.

---

## 6 — State Management & Services

### Zustand store example

**File:** `src/stores/useAppStore.ts`

```ts
import create from "zustand";

type State = {
  kpis: any;
  setKpis: (k: any) => void;
  prospects: any[];
  setProspects: (p: any[]) => void;
};

export const useAppStore = create<State>((set) => ({
  kpis: {},
  setKpis: (k) => set({ kpis: k }),
  prospects: [],
  setProspects: (p) => set({ prospects: p }),
}));
```

### API service

**File:** `src/services/api.ts`

```ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true,
});

export default api;
```

**Example service function prompt to Copilot:**

> Create `prospectService.ts` with `getProspects`, `getProspect`, `importProspects(csv)`, `updateStatus` and proper error handling.

---

## 7 — Authentication & Route Guarding

* Implement auth context / token store.
* Use `PrivateRoute` wrapper or check auth in layout.
* Example: protect `/dashboard`, `/prospects`, `/campaigns` routes — redirect to `/login` if not authenticated.

**Copilot prompt:**

> Generate an `AuthProvider` using context + hook `useAuth()`, with `login`, `logout`, `refreshToken`, and `isAuthenticated`.

---

## 8 — Forms & Validation

* Use React Hook Form + Yup for complex forms (prospect import, campaign creation, templates).
* For the campaign editor, save draft regularly (autosave) to local storage or backend.

**Prompt:**

> Create a React Hook Form for "New Template" with fields: title, subject, body (WYSIWYG optional), placeholders ({{first_name}}), and validation.

---

## 9 — Charts & Analytics

* Provide endpoints for daily/weekly aggregates and return time-series for charts.
* Important KPIs: Sent, Delivered, Open rate, Click rate, Reply rate, Booked demos.
* Use ApexCharts to render line/area charts and small sparkline cards.

**Copilot prompt:**

> Build `OverviewChart` component to accept `series` and `categories` props and render a responsive ApexCharts line chart.

---

## 10 — Prospect import & enrichment

* Support CSV import with mapping UI.
* Validate emails and dedupe by email or LinkedIn profile.
* Optional enrichment (company, role) via 3rd-party (backend).

**Prompt for Copilot:**

> Create a CSV uploader component that previews first 10 rows, lets user map CSV columns to app fields, and calls `POST /prospects/import`.

---

## 11 — Sending & Integration strategy (backend notes)

* Frontend triggers campaign create/update; actual sending should be performed by backend worker/queue to respect throttling and relay provider limits.
* Keep integrations abstracted behind endpoints (e.g., `/api/send`) — frontend only calls API.

---

## 12 — Testing & QA

* Unit tests for components with Vitest + React Testing Library.
* Integration tests for forms and flows (import → create campaign → start).
* End-to-end tests (Playwright) for critical flows.

**Copilot prompt:**

> Generate a test for `KpiCard` rendering title, value and color change based on prop.

---

## 13 — Accessibility & Responsiveness

* Semantic HTML, ARIA where needed for dynamic elements (modals, drag-and-drop).
* Mobile behavior: collapse sidebar to hamburger; stack KPI cards; tables horizontally scrollable.

---

## 14 — VS Code & Copilot Best Practices

**Extensions**

* GitHub Copilot, Tailwind CSS IntelliSense, ESLint, Prettier, TypeScript Hero (optional)

**Settings snippet**

```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "files.exclude": { "node_modules": true },
  "emmet.includeLanguages": { "javascript": "javascriptreact" }
}
```

**How to prompt Copilot**

* Use descriptive single-line comments directly above where you want code generated:

  ```ts
  // Copilot: Create a ProspectTable component with props: prospects, onSelect, onBulkAction
  ```
* Provide small examples of props or expected shape to improve accuracy.
* Keep related files open in the editor for Copilot context.

---

## 15 — Example Copilot prompts (copy/paste)

```
Copilot: Build a responsive React sidebar with Tailwind and the following nav items: Dashboard, Prospects, Campaigns, Templates, Inbox, Reports, Settings.

Copilot: Create a Dashboard page that shows 4 KPI cards (Sent, Open rate, Reply rate, Booked Demos) and an OverviewChart. Fetch data from /api/dashboard.

Copilot: Generate a ProspectTable component with server-side pagination, search, and filters. Use axios service for data fetching.

Copilot: Create a CampaignEditor UI with step items (channel, template select, delay), ability to reorder steps, and save draft to /api/campaigns/draft.

Copilot: Implement an AuthProvider hook that stores tokens in memory and refreshes them using /api/auth/refresh. Redirect unauthenticated users to /login.
```

---

## 16 — Milestones & Roadmap

1. Project scaffold (Vite + TypeScript + Tailwind) + routing + layout.
2. Sidebar, Navbar, KPI cards, OverviewChart placeholders.
3. Prospects list, search, import flow & detail page.
4. Templates CRUD & template editor.
5. Campaign sequence editor & basic backend hooks (mock).
6. Inbox stub & reply tracking.
7. Analytics: charting & KPI accuracy.
8. Integrations (SMTP, provider) — backend-heavy.
9. Testing, performance, deploy.

---

## 17 — Deployment pointers

* Frontend: Vercel/Netlify — set `VITE_API_URL` environment variable.
* Backend: host on provider that supports queues (Heroku, Render, DigitalOcean App Platform, or containerized on AWS/GCP).
* Use HTTPS and secure token storage.
* CI: GitHub Actions — run lint, tests, build.

---

## 18 — Security & compliance considerations

* Rate-limit sensitive endpoints.
* Respect anti-spam rules, and ensure user consent & unsubscribe options in emails.
* Log all automation steps; provide audit trail for sending and contact changes.
* Never store plain SMTP credentials client-side.

---

## 19 — Example code snippets

**App routes (src/App.tsx)**

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Prospects from "./pages/Prospects";
import Campaigns from "./pages/Campaigns";
import Inbox from "./pages/Inbox";
import Templates from "./pages/Templates";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prospects" element={<Prospects />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**KPI Card (src/components/KpiCard/KpiCard.tsx) — sample**

```tsx
type Props = { title: string; value: string | number; change?: number };

export default function KpiCard({ title, value, change }: Props) {
  return (
    <div className="bg-white rounded p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {change !== undefined && (
        <div className={`mt-1 text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "+" : ""}
          {change}%
        </div>
      )}
    </div>
  );
}
```

