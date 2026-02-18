# MFLIX Master Prompt (Copy-Paste Ready)

Use the prompt below exactly as your "single source of truth" prompt to generate a production-grade Netflix/Prime/Hotstar style platform.

---

## MASTER PROMPT

You are a Principal Full-Stack Engineer, UX Motion Designer, and QA Lead.
Build a world-class OTT streaming platform called **MFLIX** using **Next.js 14 (App Router, TypeScript)**, **Tailwind CSS**, and **TMDB API**.
The final output must feel premium like Netflix + Amazon Prime + Disney+ Hotstar.

## Critical Execution Strategy (Must Follow)

Important Execution Strategy:
1. Start by setting up the folder structure, Tailwind config, and TMDB API utility.
2. Build the Homepage and Title Detail page first.
3. Use Claude 3.5 Sonnet for logic if model selection is available; otherwise use the strongest available coding model.
4. Do not summarize code; if a file is long, provide the full content. If you hit a limit, tell me to **"Continue"**.
5. **Generate the core architecture and first 2 pages first, then stop. I will ask for the next pages one by one to ensure quality.**

## 0) Execution Rules (Non-Negotiable)

1. Do not produce pseudo code. Produce fully working production-grade code.
2. Do not leave TODO placeholders unless explicitly requested.
3. Use strict TypeScript, no `any` unless strongly justified.
4. Follow clean architecture and reusable component patterns.
5. Ensure zero TypeScript errors, zero ESLint errors, and successful production build.
6. Keep API keys secure (never expose TMDB key on client).
7. Prefer Server Components where possible; use Client Components only when necessary.
8. Use best-practice caching, revalidation, loading, error boundaries, and suspense patterns.
9. Build mobile-first responsive UI that scales perfectly to all breakpoints.
10. The final app should be polished enough for a portfolio/demo release.
11. Deliver in phased milestones; do not attempt all pages/features in a single response.
12. If output limit is reached, end with `Continue` and resume exactly from where you stopped.

## 1) Project Setup Requirements

- Stack:
  - Next.js 14+ (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - React Query or SWR (optional for client cache where needed)
  - Zustand or Context API (global lightweight state)
  - Heroicons/Lucide icons
  - React Hook Form + Zod (forms)
  - Vitest/Jest + React Testing Library (unit tests)
  - Playwright (e2e smoke tests)
- Create a clean folder architecture:
  - `app/`
  - `components/`
  - `features/`
  - `lib/`
  - `hooks/`
  - `types/`
  - `styles/`
  - `public/`
- Add robust scripts in `package.json`:
  - `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`.

## 2) Environment and Security

Use environment variables and never hardcode secrets in source:

```env
TMDB_API_KEY=YOUR_TMDB_API_KEY
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_APP_NAME=MFLIX
```

Important:
- If a key is provided by user, use it only in `.env.local`.
- Access TMDB via secure server-side utilities and/or Next.js route handlers.
- Do not expose key to browser network logs.

## 3) Product Vision

Build a premium streaming web app with:
- cinematic homepage
- smooth hover, focus, and scroll animations
- high-quality cards and rows
- featured billboard with background trailer
- detail pages with cast, genres, runtime, similar titles
- powerful search and discovery
- watchlist, continue watching, and profile UX
- fully accessible keyboard navigation and screen-reader support

## 4) Mandatory Core Pages

1. Home (`/`)
2. Movies (`/movies`)
3. TV Shows (`/tv`)
4. New & Popular (`/new-popular`)
5. My List (`/my-list`)
6. Search (`/search`)
7. Title detail dynamic route (`/title/[mediaType]/[id]`)
8. Watch player page (`/watch/[mediaType]/[id]`)
9. Profile selector (`/profiles`)
10. Account/settings page (`/account`)
11. 404 and global error pages

## 5) UI and Design System

- Theme: dark cinematic palette with red accent.
- Build reusable primitives: Button, Badge, Tag, Card, Modal, Tooltip, Skeleton, Tabs, Accordion, Toast.
- Typography scale with fluid sizing.
- Consistent spacing, radii, shadows, gradient overlays.
- Reusable section wrapper with heading + action.
- Build responsive grid and horizontal rails with snap scrolling.
- Poster aspect ratio and backdrop ratio handled consistently.
- Include fallback poster/backdrop placeholders.

## 6) Motion, Hover, and Interaction Quality

Use Framer Motion and CSS transitions to match OTT feel:
- staggered entrance animations for rows/cards
- spring hover lift and scale on cards
- glow/ring on focus-visible
- smooth modal open/close
- animated progress bars
- animated skeleton shimmer
- navbar hide/show on scroll
- parallax subtle billboard movement
- autoplay muted background trailer with gradient fade
- row arrow controls with smooth easing

Performance rules for motion:
- use `prefers-reduced-motion`
- avoid heavy layout thrashing
- GPU-friendly transforms only
- animation durations consistent and tasteful

## 7) Video Player Requirements

Implement a robust player screen:
- HTML5 player wrapper (or HLS-ready architecture)
- controls: play/pause, seek, volume, mute, fullscreen, playback speed
- timeline scrubber with preview tooltip
- subtitle/caption toggle architecture
- next episode CTA for TV
- skip intro/recap button architecture
- keyboard shortcuts: space, left/right, up/down, f, m
- remember playback position per profile in local storage
- continue watching row populated from saved progress
- graceful fallback when playable video URL is unavailable

Hard rule for realism:
- TMDB does not host full movies/episodes or direct production-grade playback streams.
- For advanced player features (skip intro, next episode, subtitle/audio toggles), use a mock HLS URL or sample MP4 stream for testing/demo.
- Use TMDB videos/trailers only for discovery and trailer playback flows.

## 8) TMDB API Integration Requirements

Build a typed API layer:
- `lib/tmdb/client.ts`
- `lib/tmdb/endpoints.ts`
- `lib/tmdb/types.ts`
- `lib/tmdb/mappers.ts`

Use and combine endpoints:
- trending (day/week)
- popular movies/tv
- top rated
- upcoming
- now playing
- airing today / on the air
- genres
- multi search
- movie details with append_to_response (videos, images, credits, similar, recommendations)
- tv details with append_to_response (videos, images, credits, similar, recommendations, seasons)

Rules:
- strong runtime validation for API response shape (zod or custom guard).
- normalize data into UI-friendly models.
- cache responses with sensible revalidation windows.
- add retry logic + error mapping + empty states.

## 9) Data and State Strategy

- Server fetch for SEO/public content routes.
- Client state for player/watchlist/preferences.
- Persist user preferences locally:
  - language
  - maturity filter
  - autoplay toggle
  - subtitle preferences
  - profile selection
- Implement optimistic updates for My List actions.
- Prevent duplicate entries in lists.

## 10) Accessibility and Internationalization

Accessibility:
- semantic HTML landmarks
- ARIA labels for interactive controls
- full keyboard support
- visible focus states
- contrast-safe text and controls
- screen-reader friendly announcements for major actions

Internationalization-ready:
- design architecture to support multi-language labels
- locale-aware date formatting
- configurable content language parameter for TMDB requests

## 11) SEO and Metadata

- dynamic metadata per detail page (title, overview, image)
- Open Graph and Twitter cards
- canonical URLs
- sitemap and robots setup
- clean route structure and indexability for public pages

## 12) Error Handling and Resilience

- global `error.tsx` and `not-found.tsx`
- route-level loading states (`loading.tsx`)
- reusable empty/error components
- offline-ish fallback messaging
- image loading fallbacks
- API timeout and retry with user-friendly message

## 13) Testing and Quality Gate

Testing must follow phased delivery:

Phase 1 (mandatory for first delivery):
1. `npm run lint`
2. `npm run typecheck`
3. `npm run build`

Phase 2 (after core pages are stable):
4. `npm run test` (unit/integration)
5. `npm run test:e2e` (Playwright smoke)

Phase 2 test scope:
- API mappers and utilities
- critical components (card, hero, row, modal, player controls)
- at least one e2e happy path (home -> detail -> watch -> add to list)

Guideline:
- If test tooling config is not stable in the first pass, keep test scaffolding optional and prioritize a working, error-free product baseline.

## 14) Performance Requirements

- Lighthouse targets:
  - Performance >= 90
  - Accessibility >= 95
  - Best Practices >= 95
  - SEO >= 95
- Use `next/image` with proper sizes
- lazy load non-critical sections
- code split heavy client components
- avoid unnecessary re-renders
- memoize expensive transforms
- prefetch likely next routes

## 15) Required Feature Checklist (120 Features)

Implement the following features end-to-end:

1. Cinematic hero billboard
2. Hero autoplay trailer (muted)
3. Hero gradient overlays
4. Hero CTA buttons (Play, More Info)
5. Top 10 row with rank badges
6. Trending Today row
7. Trending This Week row
8. Popular Movies row
9. Popular TV row
10. Top Rated row
11. Upcoming movies row
12. Now Playing row
13. Anime row (if data available)
14. Kids-safe row (filtered)
15. Genre chips with active state
16. Dynamic rails by genre
17. Horizontal scroll with snap
18. Arrow controls for rails
19. Drag/scroll support on touch
20. Poster card variant
21. Backdrop card variant
22. Compact card variant
23. Card hover lift effect
24. Card hover video preview architecture
25. Card quick action buttons
26. Add to My List from card
27. Remove from My List from card
28. Card metadata badges
29. Match score indicator
30. Runtime/duration label
31. Age rating badge architecture
32. HD/4K quality badge
33. Language badge
34. Subtitle availability badge
35. Detail modal from card
36. Detail page full layout
37. Cast list section
38. Crew highlights section
39. Genre list section
40. Similar titles section
41. Recommendations section
42. Trailer carousel
43. Image gallery carousel
44. Season selector for TV
45. Episode list UI
46. Episode runtime display
47. Episode overview expand/collapse
48. Play trailer button
49. Share button (Web Share fallback)
50. Copy link action
51. Breadcrumb on detail page
52. Sticky header on scroll
53. Transparent to solid navbar transition
54. Search page with instant suggestions
55. Debounced search input
56. Search by movie/tv/person tabs
57. Search empty state
58. Search no-results state
59. Search loading skeleton
60. Search filters (year, genre, rating)
61. Sort options (popularity, rating, date)
62. Infinite scroll or pagination
63. New & Popular page sections
64. Upcoming reminder UI architecture
65. My List page with persisted state
66. Continue Watching row
67. Save playback progress
68. Resume playback CTA
69. Watch page player layout
70. Custom player controls
71. Keyboard shortcuts for player
72. Fullscreen mode support
73. Volume/mute persistence
74. Playback speed controls
75. Seek forward/back buttons
76. Progress bar with scrub
77. Subtitle toggle architecture
78. Audio track selector architecture
79. Next episode CTA architecture
80. Skip intro button architecture
81. Autoplay next toggle
82. Profile selection screen
83. Multiple local profiles
84. Profile avatar customization
85. Profile maturity preference
86. Kids profile mode
87. Account settings page
88. App preferences panel
89. Theme intensity options
90. Language preference persistence
91. Autoplay preference persistence
92. Notification/toast system
93. Success toast for My List actions
94. Error toast for API failures
95. Reusable modal system
96. Reusable drawer/sheet for mobile
97. Tooltips for icon buttons
98. Skeleton loaders across pages
99. Shimmer placeholders for rows
100. Route-level loading UI
101. Friendly error boundary UI
102. Custom 404 page
103. Empty states for all key pages
104. Fallback poster/backdrop images
105. Image blur-up placeholders
106. Accessibility focus ring styles
107. Keyboard navigable menus
108. ARIA labels for controls
109. Screen-reader helper text
110. Reduced motion support
111. SEO metadata per route
112. Open Graph image support
113. Twitter card metadata
114. Sitemap generation
115. Robots.txt
116. Analytics hook architecture
117. Event tracking for key actions
118. API utility with retries
119. TMDB response normalization
120. Production-ready code quality checks

## 16) File-by-File Output Format

When generating implementation output:
1. Show final folder tree.
2. Provide each file with full code.
3. Ensure imports resolve correctly.
4. Ensure no duplicated/conflicting files.
5. Include setup commands and run commands.
6. Include `.env.example` but do not expose real secret.

## 17) Definition of Done

Project is complete only if:
- all mandatory pages exist and are functional
- TMDB data flows correctly through typed layer
- premium OTT UI/UX is implemented
- animations and hover effects are polished
- player workflow is functional for trailer/demo playback
- My List and Continue Watching persist correctly
- app passes lint/typecheck/tests/build
- no obvious runtime errors in dev or production mode

## 18) Final Response Contract

At the end, provide:
1. Setup steps
2. Environment variable instructions
3. Commands to run
4. Short architecture explanation
5. List of implemented features
6. Known limitations (if any)
7. Next enhancements roadmap
8. If work is phased, clearly state what is completed now and what requires the next prompt.

Now execute **Phase 1 only**: set up architecture + TMDB utilities + Homepage + Title Detail page, then stop and wait for my next prompt.

---

Tip for operator: keep the TMDB key private in local environment only. Avoid committing `.env.local` to git.
