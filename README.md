# 🏆 wc-dashboard — FIFA World Cup 2026

A web app for following the **FIFA World Cup 2026**: browse matches, groups and brackets, explore
national teams, sync fixtures to Google Calendar, and compete with friends in a prediction ranking.

> Portfolio project. Built to showcase a clean, scalable front-end architecture (Feature-Sliced
> Design) with a modern React stack and a zero-cost serverless data pipeline.

## ✨ Features

- **Home** — minimalist, animated landing with entry points to each section.
- **Matches** — played matches (by date/time) & upcoming fixtures, group stage tables, and knockout
  brackets. Logged-in users can sync matches to **Google Calendar**.
- **Teams** — all national teams, searchable, each with its upcoming fixtures.
- **Predictions** _(final phase)_ — predict upcoming results; points are computed when matches finish
  and shown in a live ranking. Requires Google sign-in.
- **Bilingual** (🇪🇸 / 🇬🇧) and **light/dark** themes.

## 🧱 Tech stack

| Area            | Choice                                                |
| --------------- | ----------------------------------------------------- |
| Framework       | React 19 + TypeScript + Vite (React Compiler enabled) |
| Package manager | pnpm                                                  |
| Styling         | Tailwind CSS + shadcn/ui + design tokens (light/dark) |
| Animation       | Motion + tailwindcss-animate                          |
| Server state    | TanStack Query (React Query)                          |
| Global state    | Zustand (minimal: auth/UI)                            |
| i18n            | react-i18next (es / en)                               |
| Backend         | Firebase (Firestore + Auth)                           |
| Data source     | football-data.org → GitHub Actions cron → Firestore   |
| Hosting         | Vercel                                                |
| Architecture    | Feature-Sliced Design                                 |

## 🚀 Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in your Firebase values
pnpm dev
```

App runs on the Vite dev server (default `http://localhost:5173`).

### Scripts

| Command        | Description                   |
| -------------- | ----------------------------- |
| `pnpm dev`     | Start the dev server          |
| `pnpm build`   | Type-check + production build |
| `pnpm preview` | Preview the production build  |
| `pnpm lint`    | Run ESLint                    |

## 🗂️ Architecture

Feature-Sliced Design, applied pragmatically. Import direction is strictly downward:
`app → pages → widgets → features → entities → shared`.

```
src/
  app/       providers, router, global styles
  pages/     route compositions (Home, Matches, Teams, Predictions)
  widgets/   composed UI blocks (MatchList, GroupTable, Bracket, …)
  features/  user interactions (auth, calendar-sync, predict-match, team-search, …)
  entities/  domain units (match, team, group, prediction, user)
  shared/    ui (shadcn), lib, config, firebase client, i18n, types
```

A slice imports only from layers strictly below it, with no sibling cross-imports, and exposes a
public API via its `index.ts`. See **Architecture decisions** below.

## 🧭 Architecture decisions

Condensed rationale for the key technical choices.

- **Feature-Sliced Design.** Chosen over a flat `components/` layout to get enforceable boundaries and
  a structure that scales and reads as deliberate in a portfolio. Applied pragmatically — no empty
  layers for trivial features.
- **shadcn/ui over Mantine.** Tailwind is the single styling system; Mantine would add a second
  (Emotion-based) one. shadcn is accessible (Radix), owned in-repo, and themable via the same tokens.
- **React Query + Zustand.** All server state (Firestore) goes through React Query (caching,
  loading/error, refetch). Zustand holds only minimal global UI/session state (auth user, theme).
- **Data pipeline: football-data.org → GitHub Actions → Firestore.** The browser never calls the
  football API directly (API-key exposure + CORS). A scheduled GitHub Actions job (Firebase Admin
  SDK) is the only writer of `matches`/`teams`/`groups`; the app reads only from Firestore. A public
  repo gets generous Actions minutes, keeping sync frequent and free. **No Cloud Functions, no
  Firebase Blaze plan.**
- **Auth: optional & global, gated features only.** Google sign-in is available app-wide but never
  required to browse. Only **Predictions** and **Calendar sync** need it; clicking a gated action
  while logged out opens the Google sign-in popup directly.
- **Scoring is pure client-side logic.** Points are computed in the browser by comparing a user's
  prediction against the finished result already in Firestore. Keeps it testable and serverless.
  Default scheme (configurable): exact score **5**, correct outcome + goal difference **3**, correct
  outcome (1X2) only **1**, otherwise **0**.
- **Design tokens + dark mode from day one.** CSS-variable (HSL) tokens with a light/dark theme —
  apt for a sports/event app and nearly free with Tailwind + shadcn. Respects system preference.

## 🔧 Backend setup (Firebase)

The frontend env vars are documented in [`.env.example`](.env.example). Firebase keys are public by
design — security is enforced by **Firestore rules**, not by hiding keys.

The Firebase project starts **empty**. These steps must be done **manually in the consoles** (they
cannot be done from this repo):

1. Create a Firebase project → register a **Web App** → copy config into `.env.local`.
2. **Firestore** → create database (production mode) → deploy the security rules (below).
3. **Authentication** → enable the **Google** provider → configure the OAuth consent screen →
   authorize domains (`localhost`, the Vercel domain).
4. **Google Cloud Console** (same project) → enable the **Google Calendar API** → add the
   `https://www.googleapis.com/auth/calendar.events` scope to the consent screen.
5. **Service Account** (Admin SDK) JSON → GitHub secret `FIREBASE_SERVICE_ACCOUNT` (used by the sync
   job to write to Firestore).
6. `football-data.org` API token → GitHub secret `FOOTBALL_DATA_TOKEN`.
7. Create **composite indexes** when Firestore prompts (queries over matches by date/stage).

### Firestore data model

| Collection    | Doc               | Key fields                                                                 | Written by         |
| ------------- | ----------------- | -------------------------------------------------------------------------- | ------------------ |
| `teams`       | `{teamId}`        | `name`, `code` (FIFA 3-letter), `crestUrl`, `groupId`                      | Sync job           |
| `groups`      | `{groupId}`       | `name` (e.g. "Group A"), `teamIds[]`                                       | Sync job           |
| `matches`     | `{matchId}`       | `utcDate`, `status`, `stage`, `group`, `homeTeamId`, `awayTeamId`, `score` | Sync job           |
| `users`       | `{uid}`           | `displayName`, `photoURL`, `totalPoints`                                   | The user (own doc) |
| `predictions` | `{uid}_{matchId}` | `userId`, `matchId`, `homeScore`, `awayScore`, `points`                    | The user (own doc) |

### Security rules (starting point)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Read-only reference data; only the Admin SDK (sync job) writes it.
    match /teams/{id}   { allow read: if true; allow write: if false; }
    match /groups/{id}  { allow read: if true; allow write: if false; }
    match /matches/{id} { allow read: if true; allow write: if false; }

    // Public profile for the ranking; owner-only writes.
    match /users/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Predictions: public read (ranking), owner-only writes.
    // Hardening (Phase 5): block writes after kickoff via get() on the match doc.
    match /predictions/{predictionId} {
      allow read: if true;
      allow create, update: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow delete: if false;
    }
  }
}
```

The data pipeline runs as a scheduled **GitHub Actions** job using the Firebase Admin SDK (which
bypasses these rules), so the browser only ever reads from Firestore.

## ✅ Progress

Phases are sequential; each builds on the previous. Granular tasks live in
[`checklist.md`](checklist.md) (a working file, deleted once the project ships).

| Phase | Scope                                                               | Status         |
| ----- | ------------------------------------------------------------------- | -------------- |
| 0     | Foundations (Tailwind, shadcn, router, i18n, FSD skeleton, tooling) | ✅ Done         |
| 1     | Firebase & data pipeline (Firestore, sync job, GitHub Actions)      | 🚧 In progress |
| 2     | Matches section (lists, groups, brackets)                           | ⬜ Not started |
| 3     | Teams section (search, detail, fixtures)                            | ⬜ Not started |
| 4     | Calendar sync (Google auth + Calendar API)                          | ⬜ Not started |
| 5     | Predictions (scoring engine, ranking, rules hardening)              | ⬜ Not started |
| 6     | Polish & ship (a11y, perf, SEO, deploy)                             | ⬜ Not started |

Legend: ⬜ Not started · 🚧 In progress · ✅ Done

---

Built with ❤️ for the World Cup 2026.
