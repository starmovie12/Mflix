# MFLIX — Master Development Prompt

## Project Overview

You are a Senior Full-Stack Engineer building **MFLIX**, a world-class Netflix clone that rivals Netflix, Amazon Prime Video, and Disney+ Hotstar in quality, UX, and feature richness. Use **Next.js 14** (App Router), **Tailwind CSS**, and the **TMDB API**. Write production-grade, type-safe, performant code with zero shortcuts.

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router, Server Components where appropriate) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict mode) |
| API | TMDB API v3 |
| Video | HTML5 Video / YouTube embed for trailers |
| State | React hooks, URL state, localStorage for preferences |
| Animations | Framer Motion |
| Icons | Lucide React or Heroicons |

---

## TMDB API Configuration

- **Base URL:** `https://api.themoviedb.org/3`
- **API Key:** Store in `.env.local` as `NEXT_PUBLIC_TMDB_API_KEY=aa844700ff3f44363be5bf50f78df0b1` (or use your own key)
- **Image Base URLs:**
  - Poster: `https://image.tmdb.org/t/p/w500`
  - Backdrop: `https://image.tmdb.org/t/p/original`
  - Profile: `https://image.tmdb.org/t/p/w185`
- Store the API key in `.env.local` as `NEXT_PUBLIC_TMDB_API_KEY` and use it via `process.env.NEXT_PUBLIC_TMDB_API_KEY`
- Implement server-side API routes (`/api/*`) to proxy TMDB requests and keep the key secure

---

## Core Features (100+ Requirements)

### 1. Authentication & User Experience
- [ ] Simulated auth (no real backend): store user in localStorage/context
- [ ] Profile switcher UI (Netflix-style avatars)
- [ ] Kids profile mode (content filtering)
- [ ] Remember device/last watched
- [ ] Sign out with confirmation

### 2. Homepage & Layout
- [ ] Full-viewport hero section with random featured movie/show
- [ ] Auto-playing muted background video or high-res backdrop
- [ ] Gradient overlay (bottom fade)
- [ ] Title, description, CTA buttons (Play, My List, Info)
- [ ] Horizontal scrollable rows: Trending, Top Rated, Now Playing, Popular, By Genre
- [ ] Lazy-load rows as user scrolls
- [ ] Sticky navbar with blur on scroll
- [ ] Search icon opens full-screen or modal search
- [ ] Notifications bell, profile dropdown
- [ ] Footer with links (Help, Account, Media Center, etc.)

### 3. Navigation & Routing
- [ ] `/` — Home
- [ ] `/browse` — Browse all (movies, TV, genres)
- [ ] `/movies` — Movies only
- [ ] `/tv` — TV shows only
- [ ] `/search` — Search results
- [ ] `/watch/[id]` — Video player (movie/show)
- [ ] `/title/[id]` — Detail modal or page
- [ ] `/mylist` — User's watchlist
- [ ] `/genre/[slug]` — Genre-filtered content
- [ ] `/new` — New & Popular
- [ ] 404 and error pages with branded design

### 4. Hero Section
- [ ] Random featured movie/show on load
- [ ] Backdrop image with parallax or Ken Burns effect
- [ ] Optional: trailer auto-play (muted) with fallback to backdrop
- [ ] Title, tagline, overview (truncated)
- [ ] Play, Add to My List, Info buttons
- [ ] Age rating badge
- [ ] Smooth fade-in on load

### 5. Content Rows
- [ ] Row titles: "Trending Now", "Top Rated", "Popular on MFLIX", "Action", "Comedy", etc.
- [ ] Horizontal scroll (mouse wheel, touch, drag)
- [ ] Left/right gradient fade at edges
- [ ] Cards scale on hover (1.05–1.1)
- [ ] Smooth scroll snap
- [ ] Skeleton loaders while fetching
- [ ] Infinite scroll or "Load More" for long rows

### 6. Movie/TV Cards
- [ ] Poster image with aspect ratio 2:3
- [ ] Hover: scale up, show overlay with Play, Add to List, Info
- [ ] Progress bar if partially watched
- [ ] Lazy load images with blur placeholder
- [ ] Fallback for missing poster

### 7. Detail Modal / Page
- [ ] Large backdrop, poster, title, metadata (year, runtime, rating)
- [ ] Overview, cast, director
- [ ] Similar titles row
- [ ] Seasons & episodes for TV
- [ ] Play, Add to My List, Share
- [ ] Close on backdrop click or Escape

### 8. Search
- [ ] Full-screen or overlay search
- [ ] Debounced input (300ms)
- [ ] Search movies + TV
- [ ] Recent searches (localStorage)
- [ ] Trending/popular suggestions when empty
- [ ] Keyboard navigation (arrow keys, Enter)
- [ ] Clear and close buttons

### 9. Video Player (Full Specification)

#### Core Controls
- [ ] Play/Pause: center overlay + bottom bar
- [ ] Seek bar: draggable, shows current time / duration
- [ ] Volume: slider (0–100%), mute toggle
- [ ] Fullscreen: native fullscreen API
- [ ] Progress bar: click-to-seek, hover shows preview time
- [ ] Controls auto-hide after 3s idle, show on mouse move

#### Keyboard Shortcuts
- [ ] `Space` — Play/Pause
- [ ] `F` — Fullscreen
- [ ] `M` — Mute
- [ ] `←` / `→` — Seek ±10s
- [ ] `↑` / `↓` — Volume ±10%
- [ ] `Escape` — Exit fullscreen / close overlay

#### UX Enhancements
- [ ] Hover preview: thumbnail + timestamp on seek bar (if TMDB provides)
- [ ] Picture-in-picture: `document.pictureInPictureEnabled`
- [ ] Auto-pause when tab loses focus
- [ ] "Skip Intro" button for TV (show at 10–15% of episode if applicable)
- [ ] Next episode: 15s countdown with "Next: S1E2" overlay
- [ ] "Watch Credits" option to skip countdown
- [ ] Subtitle toggle (if TMDB provides .vtt or similar)
- [ ] Quality selector: 1080p, 720p, 480p (when multiple sources)

#### Trailer Fallback
- [ ] Primary: TMDB `/videos` → YouTube key → embed `youtube.com/embed/{key}?autoplay=1`
- [ ] If no video: show "Trailer not available" with backdrop
- [ ] Autoplay muted for trailers on detail view

### 10. My List / Watchlist
- [ ] Add/remove from list (localStorage or simulated API)
- [ ] Dedicated `/mylist` page
- [ ] Heart or plus icon on cards
- [ ] Persist across sessions

### 11. Genres
- [ ] Fetch genres from TMDB
- [ ] Genre filter on browse
- [ ] Genre-specific rows on home
- [ ] `/genre/[id]` page with paginated grid

### 12. Animations & Micro-interactions (Detailed Specs)

#### Page & Layout Animations
- [ ] Page transitions: 200–300ms fade + subtle slide (Framer Motion `AnimatePresence`)
- [ ] Staggered children: rows fade in with 50ms delay between each
- [ ] Hero content: title slides up (y: 20→0), description fades in (opacity 0→1) over 600ms
- [ ] Modal enter: `opacity: 0→1`, `scale: 0.95→1`, duration 200ms, ease `easeOut`
- [ ] Modal exit: reverse with `easeIn`

#### Card Hover Effects
- [ ] Scale: `transform: scale(1.05)` or `scale(1.1)` on hover
- [ ] Transition: `transition: transform 0.3s ease`
- [ ] Z-index: elevated above adjacent cards
- [ ] Shadow: `box-shadow` increases on hover
- [ ] Overlay: dark gradient (bottom) fades in with Play, Add, Info icons
- [ ] Play icon: subtle pulse or glow
- [ ] Progress bar: smooth width transition if partially watched

#### Button Hover Effects
- [ ] Primary (Play): slight scale 1.02, brightness 110%
- [ ] Secondary (My List, Info): background lightens, border subtle glow
- [ ] Icon buttons: scale 1.1, color shift
- [ ] Disabled state: opacity 0.5, no pointer events

#### Navbar Animations
- [ ] Scroll down: navbar shrinks or hides (transform translateY)
- [ ] Scroll up: navbar slides down with `backdrop-blur-md`
- [ ] Background: `rgba(0,0,0,0.7)` when scrolled
- [ ] Logo: no animation on scroll
- [ ] Search icon: rotate or scale on click

#### Row Scroll
- [ ] `overflow-x: auto` with `scroll-behavior: smooth`
- [ ] `scroll-snap-type: x mandatory` for cards
- [ ] Left/right gradient masks: `linear-gradient(90deg, transparent, black)` at edges
- [ ] Mouse wheel horizontal scroll (optional polyfill)

#### Skeleton & Loading
- [ ] Skeleton: `animate-pulse` with `bg-gray-700`
- [ ] Shimmer effect: gradient moving left-to-right
- [ ] Spinner: rotating circle or Netflix-style loading animation
- [ ] Toast: slide in from top-right, auto-dismiss 3s

### 13. Responsive Design
- [ ] Mobile-first breakpoints: sm, md, lg, xl, 2xl
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Mobile nav: hamburger menu
- [ ] Rows: fewer cards on mobile, more on desktop
- [ ] Hero: stacked layout on mobile

### 14. Performance
- [ ] Image optimization: Next.js `Image` with `sizes`
- [ ] Lazy load below-fold content
- [ ] Prefetch links on hover
- [ ] Minimize client-side JS
- [ ] Use Server Components for static content

### 15. Accessibility
- [ ] Semantic HTML (nav, main, article, etc.)
- [ ] ARIA labels for icons
- [ ] Focus management in modals
- [ ] Keyboard navigation
- [ ] Sufficient color contrast

### 16. Polish & UX
- [ ] Dark theme (Netflix-like blacks)
- [ ] Consistent spacing (Tailwind scale)
- [ ] Custom scrollbar styling
- [ ] Smooth scroll behavior
- [ ] Error boundaries
- [ ] 404 with search and home link

### 17. Additional Features (Extended)
- [ ] "Continue Watching" row (localStorage-based)
- [ ] "Because you watched X" recommendations (use similar endpoint)
- [ ] Age rating badges (PG-13, R, TV-MA, etc.)
- [ ] Runtime display (e.g., "2h 15m")
- [ ] Release year in metadata
- [ ] Cast carousel on detail page
- [ ] Director & crew credits
- [ ] Share button (copy link, Twitter, etc.)
- [ ] Report/feedback placeholder
- [ ] Language preference (UI only)
- [ ] Autoplay toggle in settings
- [ ] Data saver mode (lower quality images)
- [ ] Keyboard shortcut overlay (? key)
- [ ] "New" badge for recent releases
- [ ] "Top 10" badge for trending
- [ ] Episode thumbnails for TV seasons
- [ ] Season selector dropdown
- [ ] "More like this" section
- [ ] Trailer modal on card hover (optional, performance-aware)
- [ ] Breadcrumb navigation
- [ ] Back button with history
- [ ] Preconnect to TMDB and image CDN
- [ ] Service worker for offline shell (PWA)
- [ ] Install prompt (Add to Home Screen)
- [ ] Meta tags for social sharing (OG, Twitter)
- [ ] Favicon and app icons (192, 512)
- [ ] Loading states for all async actions
- [ ] Retry button on API failure
- [ ] Empty state illustrations
- [ ] Rate limiting / throttle for API calls

---

## TMDB API Integration (Detailed)

### Server-Side Proxy
- Create `/api/tmdb/[...path]/route.ts` to forward requests
- Append `?api_key=...` server-side
- Return JSON with proper headers
- Handle 429 (rate limit) and 5xx with retry logic

### Client Fetch Pattern
```ts
// Example: fetch from /api/tmdb/movie/popular
const res = await fetch('/api/tmdb/movie/popular?page=1');
if (!res.ok) throw new Error('Failed to fetch');
const data = await res.json();
```

### Caching
- Use `next: { revalidate: 3600 }` for Server Components
- Or SWR/React Query with 1h stale time for client
- Cache images via Next.js Image

### Error Handling
- Try/catch all API calls
- Show toast or inline error message
- Fallback to cached data if available
- Log errors (console in dev)

---

## TMDB API Endpoints to Use

```
GET /movie/popular
GET /movie/top_rated
GET /movie/now_playing
GET /movie/upcoming
GET /movie/{id}
GET /movie/{id}/videos
GET /movie/{id}/credits
GET /movie/{id}/similar
GET /tv/popular
GET /tv/top_rated
GET /tv/on_the_air
GET /tv/{id}
GET /tv/{id}/videos
GET /tv/{id}/credits
GET /tv/{id}/similar
GET /tv/{id}/season/{season_number}
GET /trending/{media_type}/{time_window}
GET /search/multi
GET /genre/movie/list
GET /genre/tv/list
GET /discover/movie
GET /discover/tv
```

---

## Design System

### Colors
- Background: `#141414`, `#181818`, `#1f1f1f`
- Primary red: `#e50914`
- Text: `#ffffff`, `#b3b3b3`, `#808080`
- Hover: slight brightness increase

### Typography
- Font: Netflix Sans or system stack: `Inter`, `system-ui`, `sans-serif`
- Headings: bold, large
- Body: regular, 14–16px

### Spacing
- Use Tailwind spacing scale (4, 8, 16, 24, 32, 48, 64)

---

## File Structure (Recommended)

```
app/
  layout.tsx
  page.tsx
  globals.css
  browse/page.tsx
  movies/page.tsx
  tv/page.tsx
  search/page.tsx
  mylist/page.tsx
  watch/[id]/page.tsx
  title/[id]/page.tsx
  genre/[id]/page.tsx
  api/
    tmdb/[...path]/route.ts  # Proxy TMDB
components/
  Navbar.tsx
  Hero.tsx
  MovieRow.tsx
  MovieCard.tsx
  SearchBar.tsx
  VideoPlayer.tsx
  DetailModal.tsx
  Footer.tsx
lib/
  tmdb.ts
  types.ts
hooks/
  useDebounce.ts
  useInfiniteScroll.ts
  useWatchlist.ts
```

---

## Implementation Rules

1. **TypeScript:** Define interfaces for all TMDB responses and props.
2. **Error handling:** Handle API failures, show user-friendly messages.
3. **Security:** Never expose API key in client bundles; use server routes.
4. **SEO:** Use metadata, Open Graph, and proper headings.
5. **Code quality:** No `any`, meaningful names, small reusable components.
6. **Testing:** Ensure build passes (`npm run build`) and no lint errors.

---

## Execution Instructions

When given this prompt:

1. Set up or verify Next.js 14 + Tailwind + TypeScript.
2. Create `.env.local` with `NEXT_PUBLIC_TMDB_API_KEY=aa844700ff3f44363be5bf50f78df0b1`.
3. Implement features in order: API layer → Layout → Home → Rows → Detail → Search → Player → My List → Polish.
4. Commit after each major feature.
5. Ensure `npm run build` succeeds and fix any errors.
6. Deliver a production-ready MFLIX clone.

---

## One-Line Execution Prompt (Copy-Paste Version)

Use this condensed prompt when instructing the AI to build:

---

**Build MFLIX: a world-class Netflix clone with Next.js 14 (App Router), Tailwind CSS, and TMDB API. Use the full specification in MFLIX_MASTER_PROMPT.md. Tech stack: TypeScript, Framer Motion, Lucide icons. TMDB API key: store in `.env.local` as `NEXT_PUBLIC_TMDB_API_KEY`. Implement: sticky blur navbar, hero with backdrop/trailer, horizontal scroll rows (Trending, Top Rated, Popular, Genres), movie/TV cards with hover scale + overlay, detail modal, full-screen search with debounce, custom video player (HTML5 + YouTube trailers), My List (localStorage), keyboard shortcuts, responsive design, dark theme (#141414), skeleton loaders, toast notifications, 404 page. Ensure `npm run build` passes. Deliver production-ready code.**

---

## Security Note

- **Never** commit `.env.local` or expose the API key in client-side code.
- Use server-side API routes to proxy TMDB requests.
- Add `.env.local` to `.gitignore`.

---

**End of Master Prompt**
