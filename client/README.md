# GitHub Explorer

> A React SPA that searches GitHub users and explores their repositories — sorted, filtered, paginated, and bookmarkable.

---

## Screenshot

**TODO — add a screenshot here.**

1. Run `npm run dev` and search for a popular user (e.g. `torvalds` or `gaearon`).
2. Capture the home page at 1280×800 in light mode and the user repos page in dark mode.
3. Save them to `docs/screenshot-home.png` and `docs/screenshot-user.png`.
4. Replace this section with standard markdown image syntax pointing to those files.

---

## Tech stack

| Choice | Why |
| --- | --- |
| **React 18** | Concurrent features, automatic batching, and the ecosystem default. |
| **Vite** | Instant HMR, zero config, ~50KB runtime. Next.js would add SSR/hydration/file routing for an app that needs none of it. |
| **React Router v6** | Standard client-side routing for two routes. Anything heavier (Tanstack Router, Remix routing) is premature. |
| **CSS Modules** | Build-time scoped class names with zero runtime cost. Tailwind would inflate JSX with utility soup; styled-components would add a runtime CSS engine. |
| **Native `fetch` + `AbortController`** | 11KB of axios saved. `AbortController` is exactly what's needed for race-free debounced search. |
| **React Context (theme only)** | The only piece of cross-cutting state. No Redux/Zustand — there's nothing for them to manage. |

**Zero** external state libraries. **Zero** animation libraries. **Zero** utility libraries (no lodash — `useDebounce` is 8 lines).

---

## Features

### Core

- **Live user search** — debounced input (400ms) hits GitHub's `/search/users` endpoint, with `AbortController` cancelling stale requests so a slow earlier response never overwrites a fresh later one.
- **User profile pages** — bento card with avatar, display name, bio, company, location, blog link, follower/following/repo counts, and a formatted "Joined March 2018" line.
- **Repository browser** — repo cards with star count (gold), fork count (muted), 2-line description clamp, and a colored language badge using GitHub's canonical language colors.
- **Sort + filter** — sort repos by stars, forks, recently updated, or alphabetical; filter by language with an "All Languages" reset.
- **Light + dark theme** — `prefers-color-scheme` is checked on first visit; the user's explicit choice is persisted to localStorage and overrides the OS setting on return visits.
- **Keyboard accessible** — semantic HTML throughout, visible focus rings using the accent purple, ARIA labels on every icon-only button, `aria-live` regions on the result count and pagination summary.
- **Responsive** — mobile-first CSS, tested at 320px through 1440px+. Grids use the `minmax(min(Npx, 100%), 1fr)` pattern so single columns shrink safely on narrow viewports instead of overflowing.
- **Error states everywhere** — every fetch has a Loader, an ErrorMessage with a working "Try again" button, and an EmptyState for the no-data case. AbortController cleanup runs in every `useEffect` return.

### Bonus

- **Bookmarking** — toggle a purple bookmark on any repo to save it. Bookmarks are stored in localStorage as an array of repo `full_name` strings (e.g. `"facebook/react"`) — globally unique across GitHub and human-readable in the dev tools storage panel. Persists across sessions.
- **Pagination** — paginated user search with prev/next buttons and a numbered button row using an ellipsis pattern (`1 … 9 10 11 … 50`). Capped at 50 pages to match GitHub's 1000-result search ceiling. Page resets to 1 whenever the query changes.
- **Eva Bharat-inspired design** — floating dark navy pill navbar with `backdrop-filter: blur`, generous whitespace, soft purple gradient blushes bleeding from corner edges, white elevated bento cards with purple-tinted hover lift.

---

## Folder structure

```text
client/
├── index.html               Vite entry; preconnects Google Fonts; sets theme-color meta
├── vite.config.js           React plugin only — no other configuration needed
├── package.json             3 deps (react, react-dom, react-router-dom) + 2 dev deps
│
└── src/
    ├── main.jsx             ReactDOM root + BrowserRouter
    ├── App.jsx              ThemeProvider + route definitions
    ├── App.module.css       App shell layout + blush gradient background
    ├── index.css            Design system: tokens, font imports, body resets
    │
    ├── api/                 HTTP layer — owns URLs, headers, and error normalization
    ├── hooks/               State management hooks: search, profile, repos, debounce, localStorage
    ├── context/             Cross-cutting state — currently just ThemeContext
    ├── pages/               Route-level composition: HomePage and UserReposPage
    ├── components/
    │   ├── common/          Reusable primitives: Loader, ErrorMessage, EmptyState, Pagination, ThemeToggle
    │   ├── Layout/          Navbar (the floating pill)
    │   ├── Search/          SearchBar (pill input with leading icon and clear button)
    │   ├── User/            UserCard, UserList
    │   └── Repo/            RepoCard, RepoList, RepoFilters
    └── utils/               Pure data helpers: sortRepos, filterByLanguage, getUniqueLanguages, language colors
```

**Architectural rule:** layers flow strictly downward — `api → hooks → pages → components`. Components never call `fetch`, pages never touch the network, hooks never render UI. This is a layered architecture, not MVC — React's component model collapses View and Controller, so MVC doesn't fit cleanly.

---

## Setup

Requires Node.js 18 or later.

```sh
git clone https://github.com/<your-username>/github-explorer.git
cd github-explorer/client
npm install
npm run dev
```

Open <http://localhost:5173> in your browser.

### Other commands

```sh
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

No environment variables are required — the GitHub REST API is consumed unauthenticated.

---

## Design decisions

### Why Vite over Next.js or CRA?

This is a pure client-side SPA consuming a public REST API. There is no server logic, no SEO concern (the interesting content is behind a search bar that nothing crawls), and no data that benefits from SSR. Next.js would add hydration, server components, file-based routing, and a build target I don't need. CRA is unmaintained. Vite gives instant HMR, zero configuration, and a tiny dev runtime.

### Why CSS Modules over Tailwind or styled-components?

- **Tailwind** would mean inflating every JSX file with utility class soup (`<div className="flex items-center justify-between gap-4 px-5 py-3 bg-slate-900 ...">` instead of `<div className={styles.navbar}>`), and adding a build dependency. It also makes CSS harder to grep, since style logic moves into JSX.
- **styled-components / Emotion** would add a runtime CSS-in-JS engine that computes styles on every render, plus bundle weight.
- **CSS Modules** give scoped class names from the build tool (Vite handles this natively) with zero runtime overhead. Every class is grep-able and traceable to its component file. Each CSS file lives next to its component.

### Why this color system?

The design system is built on **CSS custom properties** (CSS variables) declared at `:root` and re-declared inside `[data-theme="dark"]`. Switching themes is a single attribute flip on `<html>`, not a re-render of every component — the browser handles the cascade.

The accent palette is purple-only (`#7C3AED`) for brand consistency. Spacing follows a 4px scale (`--space-1` through `--space-20`). Radii follow a small/medium/large/extra/full progression. Every component reads from these tokens — there are zero hardcoded colors except one documented `rgba(255,255,255,0.08)` overlay in `ThemeToggle.module.css` for the white-on-navy hover state, which has no equivalent token.

### Why no state library?

- **Server state** (search results, user profiles, repo lists) lives in custom hooks via `useState` + `useEffect`. Each hook owns its lifecycle, abort logic, and error handling.
- **UI state** (sort, filter, page, query) lives in the page that owns the URL.
- **Cross-cutting state** (theme) lives in a Context.

There is nothing left for Redux or Zustand to manage. Adding one would be tax without benefit.

### Why race-aware loading state?

The fetcher hooks have a subtle but important detail in their `finally` block:

```js
} finally {
  if (!controller.signal.aborted) {
    setLoading(false);
  }
}
```

Without this guard, an aborted request's `finally` runs *after* React processes the next effect's `setLoading(true)`, causing a one-frame flash where the spinner disappears between keystrokes. The guard makes the loading flag sticky across rapid query changes — it only flips off when a request actually completes, not when one gets cancelled.

### Why `retryKey` instead of forcing the same query through `flushSync`?

The "Try again" button needs to re-fire the same fetch with no input change. Two patterns work:

1. **`flushSync(() => setQuery(''))` then `setQuery(original)`** — forces React to commit the empty state synchronously so the second `setState` produces a distinct effect run. Brittle and unusual.
2. **A `retryKey` integer that the effect depends on** — bumping it re-runs the effect with the same query/page deps. Simple, idiomatic, and the user keeps both their query *and* their page position on retry.

The hooks accept an optional `retryKey` parameter. The page owns the integer and bumps it on retry. Same mechanism for all three fetcher hooks, no `react-dom` import.

---

## Known limitations

- **GitHub rate limiting** — the unauthenticated REST API allows 60 requests per IP per hour. Heavy testing will hit a `403` response. The app surfaces this with a "Rate limit exceeded — try again in a minute" error and a working retry button, but the underlying ceiling is upstream.
- **No authentication** — every request is anonymous. With OAuth, the rate limit would jump to 5,000/hour and private repos would become accessible, but token storage, refresh flows, and scope management are out of scope.
- **Maximum 100 repos per user** — `fetchUserRepos` requests `per_page=100&sort=updated` and does not paginate further. Users with more than 100 public repos will only see their 100 most recently updated. Pagination is wired up only for user search, not for the repo list.
- **Search results capped at 1000** — GitHub's `/search/*` endpoints return at most 1000 results regardless of `total_count`. The pagination component clamps at page 50 to match, and the displayed "Showing X of N" total is also clamped to avoid lying about what's actually fetchable.
- **Bookmarks are local-only** — stored in `localStorage` under `github-explorer-bookmarks`, not synced anywhere. Clearing site data wipes them. There is no "view all bookmarks" page yet — bookmarks are only visible on the user repos page where they were created.
- **No tests** — zero unit, integration, or e2e tests. Production code would have at minimum hook tests for the abort logic, snapshot tests for the cards, and a Playwright pass over the two main user flows.
- **No `prefers-reduced-motion` overrides** — transitions and the spinner animation run regardless of user preference. Should be wrapped in `@media (prefers-reduced-motion: no-preference)` before shipping.
- **Skeletons only for the profile card** — the user list and repo list show a centered spinner during load instead of shimmer placeholder cards. Functional but less polished.

---

## Future improvements

| Improvement | Effort | Value |
| --- | --- | --- |
| **OAuth authentication** | High | Lifts rate limit 60 → 5,000/hr, enables private repo browsing, opens the door to server-synced bookmarks |
| **Request caching layer** | Medium | A small `useFetchCache` keyed on URL would prevent re-fetching the same user's profile/repos when revisiting. Stale-while-revalidate pattern, similar to what TanStack Query provides |
| **Infinite scroll on user search** | Medium | Replace pagination with `IntersectionObserver`-driven incremental loads. Better mobile UX, especially for large result sets |
| **Repo pagination** | Low | Page through users with > 100 repos using GitHub's `Link` response headers |
| **Bookmarks page** | Low | A `/bookmarks` route showing all saved repos across users in one list, with a "remove all" button |
| **Unit + integration tests** | Medium | Vitest for hooks (mock `fetch`, exercise the abort path), Testing Library for components, Playwright for the search → profile → bookmark flow |
| **`prefers-reduced-motion` support** | Low | Wrap transition CSS in `@media (prefers-reduced-motion: no-preference)`. Quick to add |
| **Skeleton screens for UserList and RepoList** | Low | Replace the spinner with shimmer placeholder cards. Feels noticeably faster on slow connections |
| **Keyboard shortcut for search** | Low | `/` to focus the search bar (GitHub-style) |
| **URL state for filters** | Medium | Persist sort/language/page in the query string so deep links work and the back button restores filter state |
| **Service worker for offline** | Medium | Cache the last successful search results so the app degrades gracefully when offline |

---

## Time breakdown

A rough split of where time went on the implementation, by phase. Useful as a sanity check for someone reproducing this from scratch — your mileage will vary.

| Phase | Hours |
| --- | --- |
| Architecture + project scaffolding | 0.5 |
| Design system (CSS variables, theme provider, font setup) | 1.0 |
| Common components (Loader, ErrorMessage, EmptyState, ThemeToggle, Pagination) | 2.0 |
| Feature components (SearchBar, UserCard, UserList, RepoCard, RepoFilters, RepoList) | 2.0 |
| API layer + custom hooks (search, profile, repos, debounce, localStorage) including abort handling and `retryKey` mechanism | 1.5 |
| Pages (HomePage with hero + conditional render, UserReposPage with bento profile card and memoized filters) | 2.0 |
| Bonus features (bookmarking, pagination, profile card extras) | 1.5 |
| Quality / accessibility / responsive audit pass | 1.0 |
| README + documentation | 0.5 |
| **Total** | **~12 hours** |

---

Built with React 18, Vite, and CSS Modules. No external state, animation, or utility libraries.
