# GitHub Explorer

A lightweight React SPA that searches GitHub users and explores their repositories with sorting, filtering, pagination, and bookmarking. Built with React 18, Vite, and CSS Modules—zero external state libraries.

---

## Features

- **Live user search** — Debounced search (400ms) with automatic cancellation of stale requests
- **User profiles** — Avatar, bio, company, location, follow counts, and join date
- **Repository browser** — Repo cards showing stars, forks, descriptions, and language badges
- **Sort & filter** — By stars, forks, updated date, or name; filter by language
- **Light & dark theme** — Follows OS preference, user-overridable, persists to localStorage
- **Bookmarking** — Save repos locally, visible only on user repo pages
- **Pagination** — User search results with ellipsis pattern, capped at 50 pages
- **Accessible** — Semantic HTML, visible focus states, ARIA labels on icons
- **Responsive for Mobile , Dekstop and Tablet** — Safe from 320px to 1440px+

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React 18 | Standard, concurrent rendering, good ecosystem |
| **Build** | Vite | Instant HMR, zero config, ~50KB runtime |
| **Routing** | React Router v6 | Simple client-side routing for 2 pages |
| **Styling** | CSS Modules | Scoped, build-time, zero runtime overhead |
| **HTTP** | Fetch + AbortController | Built-in, race-free request cancellation |
| **State** | React Context | Theme only—nothing else needs managing |

**Zero external dependencies for:** state management, animations, utilities, or UI frameworks.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/Rahulgupta7777/github-explorer-react.git
cd github-explorer/client
npm install
npm run dev