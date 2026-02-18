# MFLIX — Master Build Prompt

> **Role:** You are a Senior Full-Stack Engineer specialising in Next.js, React, Tailwind CSS, and streaming-platform UX. You will build MFLIX — a production-grade, world-class Netflix / Amazon Prime / Disney+ Hotstar-quality movie streaming web application from scratch. Every visual detail, every micro-interaction, every performance optimisation described below must be implemented exactly as specified.

---

## 0. Golden Rules

1. **Zero errors.** The project must `next build` and `next lint` without warnings or errors.
2. **TypeScript strict mode** (`"strict": true`) everywhere — no `any` unless absolutely unavoidable (always annotate with a comment explaining why).
3. **No placeholder logic.** Every component, hook, utility, and API route must be fully functional.
4. **Pixel-perfect dark theme.** The entire UI is dark (#050505 background). Netflix-red accent (#E50914). White/zinc typography. No light-mode toggle.
5. **Mobile-first responsive design.** Every layout must work flawlessly from 320 px to 2560 px.
6. **Accessibility.** Semantic HTML, ARIA labels, keyboard navigation, focus rings, screen-reader text on icon buttons.
7. **Performance.** Lighthouse score targets: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 90.

---

## 1. Tech Stack & Dependencies

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | **Next.js 14** (App Router) | `next@^14.2` — use Server Components by default; mark client components with `"use client"` only when necessary |
| Language | **TypeScript 5** | Strict mode enabled |
| Styling | **Tailwind CSS 3** | JIT mode, custom theme tokens |
| Animations | **Framer Motion 12** | Page transitions, card hover scale, hero fade-in, modal backdrop, staggered row reveals |
| Icons | **Lucide React** | Tree-shakeable SVG icons |
| Video Player | **@vidstack/react** | HLS/DASH adaptive streaming, custom skin, keyboard controls |
| Font | **Inter** (Google Fonts via `next/font`) | `display: "swap"`, variable `--font-inter` |
| Package Manager | npm | `package-lock.json` committed |
| Linting | ESLint + `eslint-config-next` | Zero warnings policy |

### TMDB API Credentials

```
API Key : aa844700ff3f44363be5bf50f78df0b1
Base URL : https://api.themoviedb.org/3
Image CDN: https://image.tmdb.org/t/p/{size}{path}
```

The key is read from `process.env.TMDB_API_KEY` or `process.env.NEXT_PUBLIC_TMDB_API_KEY`, falling back to the hardcoded key above when neither env var is set.

---

## 2. Project Architecture & Folder Structure

```
mflix/
├── app/
│   ├── layout.tsx              # Root layout — Inter font, dark body, metadata, viewport
│   ├── page.tsx                # Home — SSR: fetches hero + row data, renders HomePageClient
│   ├── globals.css             # Tailwind directives, scrollbar styling, skeleton shimmer, media-player vars
│   ├── loading.tsx             # Full-page skeleton (3 skeleton rows)
│   ├── not-found.tsx           # Custom 404 with "Back Home" CTA
│   ├── watch/
│   │   └── [id]/
│   │       ├── page.tsx        # Watch page — SSR: fetch movie details, render WatchPlayer
│   │       └── loading.tsx     # Watch page skeleton
│   └── api/
│       └── search/
│           └── route.ts        # GET /api/search?q=... — proxies TMDB search
├── components/
│   ├── Navbar.tsx              # Fixed navbar with scroll-aware transparency
│   ├── Hero.tsx                # Full-viewport hero with auto-play trailer
│   ├── HomePageClient.tsx      # Client shell — wires watchlist + rows
│   ├── MovieRow.tsx            # Horizontally scrollable category row
│   ├── MovieCard.tsx           # Poster card with hover scale, overlay, watchlist toggle
│   ├── WatchPlayer.tsx         # Vidstack-based player with Skip Intro + Next Episode
│   ├── SearchBar.tsx           # Debounced search with dropdown results
│   ├── PosterImage.tsx         # Fault-tolerant Next/Image wrapper
│   └── Skeleton.tsx            # Shimmer loading placeholder
├── hooks/
│   ├── useWatchlist.ts         # localStorage-backed watchlist with hydration guard
│   ├── useDebounce.ts          # Generic debounce hook
│   └── useInfiniteVisibleCount.ts  # IntersectionObserver-based infinite reveal
├── lib/
│   ├── tmdb.ts                 # All TMDB fetch functions, image URL builder, row definitions
│   └── types.ts                # Shared TypeScript interfaces
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── icon-192.svg            # App icon 192x192
│   ├── icon-512.svg            # App icon 512x512
│   └── placeholder.svg         # Fallback poster
├── tailwind.config.ts
├── postcss.config.js
├── next.config.mjs
├── tsconfig.json
├── .eslintrc.json
└── package.json
```

---

## 3. Tailwind Configuration

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#050505",       // Primary background
        netflix: "#E50914"      // Brand accent red
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 32px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.3) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
```

---

## 4. Next.js Configuration

```js
// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "i.ytimg.com" }
    ]
  }
};
export default nextConfig;
```

---

## 5. Global CSS (`app/globals.css`)

### Requirements

| Feature | Detail |
|---|---|
| Color scheme | `color-scheme: dark` on `:root` |
| Box model | `box-sizing: border-box` globally |
| Background | `#050505` on `html, body` |
| Typography | `color: #ffffff`, `font-family: Inter, system-ui, sans-serif` |
| Links | `color: inherit; text-decoration: none` |
| Custom scrollbar (WebKit) | 8 px wide, transparent track, `rgba(229,9,20,0.45)` thumb with `border-radius: 9999px` |
| Firefox scrollbar | `.row-scroll` class: `scrollbar-width: thin; scrollbar-color: rgba(229,9,20,0.45) transparent` |
| Skeleton shimmer | `.skeleton-shimmer` — `#111` bg, `::after` pseudo-element with gradient sweep animation `1.8s infinite` |
| Vidstack overrides | `media-player { --media-focus-ring: 0 0 0 2px rgba(229,9,20,0.95); --media-accent-color: #e50914 }` |

---

## 6. TypeScript Interfaces (`lib/types.ts`)

```ts
export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
}

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  media_type?: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  videos?: { results?: TMDBVideo[] };
}

export interface MovieRowData {
  id: string;
  title: string;
  movies: TMDBMovie[];
}

export interface HeroMovie extends TMDBMovie {
  trailerKey?: string | null;
}

export interface WatchlistMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}
```

---

## 7. TMDB API Layer (`lib/tmdb.ts`)

### 7.1 Constants

| Constant | Value |
|---|---|
| `TMDB_BASE_URL` | `https://api.themoviedb.org/3` |
| `TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p` |
| `DEFAULT_REVALIDATE_SECONDS` | `900` (15 min) |
| `FALLBACK_TMDB_API_KEY` | `aa844700ff3f44363be5bf50f78df0b1` |

### 7.2 Row Definitions

| ID | Title | TMDB Endpoint |
|---|---|---|
| `trending` | Trending Now | `/trending/movie/week` |
| `top-rated` | Top Rated | `/movie/top_rated` |
| `action` | Action Blockbusters | `/discover/movie?with_genres=28` |
| `comedy` | Comedy Hits | `/discover/movie?with_genres=35` |
| `horror` | Horror Nights | `/discover/movie?with_genres=27` |
| `romance` | Romance | `/discover/movie?with_genres=10749` |
| `documentary` | Documentaries | `/discover/movie?with_genres=99` |

### 7.3 Core Functions

| Function | Signature | Notes |
|---|---|---|
| `cleanMovie` | `(movie: TMDBMovie) => TMDBMovie` | Normalises null/undefined fields to safe defaults |
| `withBaseParams` | `(params?) => Record<string, string>` | Injects `api_key` + `language=en-US` |
| `fetchFromTMDB<T>` | `(endpoint, params?, revalidate?) => Promise<T \| null>` | Generic fetcher with `next: { revalidate }` caching. Splits query-string from endpoint, merges params. Logs errors, never throws. |
| `normalizeList` | `(payload) => TMDBMovie[]` | Extracts `.results`, maps through `cleanMovie` |
| `getMovieTitle` | `(movie) => string` | Returns `title \|\| name \|\| "Untitled"` |
| `getImageUrl` | `(path, size?) => string` | Builds full TMDB image URL. Falls back to `/placeholder.svg` when path is null/undefined. Accepts sizes: `w300`, `w500`, `w780`, `original`. Default `w500`. |
| `getTrendingMovies` | `() => Promise<TMDBMovie[]>` | `/trending/movie/week` |
| `getTopRatedMovies` | `() => Promise<TMDBMovie[]>` | `/movie/top_rated` |
| `getMoviesByGenre` | `(genreId) => Promise<TMDBMovie[]>` | `/discover/movie` with genre filter, sorted by popularity, no adult |
| `getHomeRows` | `() => Promise<MovieRowData[]>` | Parallel-fetches all row definitions, returns array of `{ id, title, movies }` |
| `selectBestTrailer` | `(videos) => string \| null` | Filters YouTube videos, ranks: official trailer (5) > trailer (4) > teaser (3) > clip (2) > other (1). Returns best `key`. |
| `getMovieTrailerKey` | `(movieId) => Promise<string \| null>` | Fetches `/movie/{id}/videos`, delegates to `selectBestTrailer` |
| `getFeaturedMovie` | `() => Promise<HeroMovie \| null>` | Picks first trending movie with a backdrop/poster, attaches trailer key |
| `searchMovies` | `(query) => Promise<TMDBMovie[]>` | `/search/movie`, 60 s revalidate, trims input, returns empty on blank |
| `getMovieDetails` | `(movieId) => Promise<TMDBMovieDetails \| null>` | `/movie/{id}?append_to_response=videos`, 30 min revalidate |

---

## 8. Custom Hooks

### 8.1 `useWatchlist`

- **Storage key:** `mflix_watchlist` in `localStorage`.
- **Hydration guard:** `hydrated` boolean starts `false`, flips to `true` after first `useEffect` read. UI renders skeleton until hydrated.
- **Validation:** Parses stored JSON, validates it is an array of objects each containing a numeric `id`.
- **Persistence:** Writes to localStorage on every state change (only after hydration).
- **Returns:** `{ watchlist, watchlistIds: Set<number>, hydrated, isInWatchlist(id), toggleWatchlist(movie) }`.
- `toggleWatchlist`: Adds movie to front if not present; removes if already present.

### 8.2 `useDebounce<T>`

- Generic hook. Accepts `value` and `delay` (default 350 ms).
- Returns debounced value updated via `setTimeout` / `clearTimeout`.

### 8.3 `useInfiniteVisibleCount`

- Accepts `{ total, initial = 8, step = 6 }`.
- Uses `IntersectionObserver` with `rootMargin: "200px 0px"` on a sentinel `<div>`.
- Increments `visibleCount` by `step` each time sentinel enters viewport.
- Returns `{ visibleCount, setSentinel }` (ref callback).

---

## 9. Component Specifications

### 9.1 `<Navbar />`

| Property | Detail |
|---|---|
| Position | `fixed top-0 inset-x-0 z-50` |
| Scroll behaviour | Transparent when `scrollY <= 24`; `bg-black/95 shadow-lg backdrop-blur-sm` when scrolled. Uses passive scroll listener. |
| Left section | Logo `"MFLIX"` — `text-2xl font-black tracking-wider text-netflix`, links to `/` |
| Navigation links | `["Home", "TV Shows", "Movies", "New & Popular", "My List"]` — hidden on mobile (`hidden md:flex`), `text-sm text-zinc-300 hover:text-white` |
| Right section | `<SearchBar />` component |
| Max width | `max-w-[1600px] mx-auto` |
| Padding | `px-4 py-4 md:px-12` |

### 9.2 `<Hero />`

| Property | Detail |
|---|---|
| Height | `h-[82vh] min-h-[620px]` |
| Background | Full-bleed backdrop image (`bg-cover bg-center`) from TMDB `original` size |
| Auto-play trailer | After a 3-second delay, switches background to a muted, looping YouTube embed (`iframe`, `scale-[1.35]` to crop YouTube chrome). Only activates if `trailerKey` exists. |
| Gradient overlays | `bg-hero-gradient` (custom) + bottom fade `h-44 bg-gradient-to-t from-pitch to-transparent` |
| Content block | Positioned `bottom` with `max-w-2xl`. Contains: title (`text-4xl sm:text-5xl md:text-6xl font-bold`), overview (`line-clamp-3 text-sm sm:text-base text-zinc-100`), two CTA buttons. |
| Animation | Framer Motion `initial={{ opacity: 0, y: 18 }}`, `animate={{ opacity: 1, y: 0 }}`, `duration: 0.45` |
| Play button | White bg, black text, `<Play />` icon filled black. Links to `/watch/{id}`. Hover: `bg-zinc-200`. |
| More Info button | `bg-zinc-600/70`, white text, `<Info />` icon. Hover: `bg-zinc-500/80`. Links to `/watch/{id}`. |
| Null state | Full-height `skeleton-shimmer` placeholder when no movie |

### 9.3 `<MovieRow />`

| Property | Detail |
|---|---|
| Layout | `space-y-4 px-4 md:px-12` |
| Header | Row title `text-xl font-semibold text-white` + left/right scroll buttons (desktop only, `hidden sm:flex`) |
| Scroll buttons | 36 px circles, `bg-zinc-900/90 hover:bg-zinc-700`, `<ChevronLeft>` / `<ChevronRight>`, `scrollBy({ left: ±500, behavior: "smooth" })` |
| Card container | `flex gap-3 overflow-x-auto pb-4`, class `row-scroll` for custom scrollbar |
| Infinite reveal | Uses `useInfiniteVisibleCount` hook — initially renders 10 cards, loads 8 more per intersection. Sentinel `<div>` placed after the last card. |
| Empty state | Returns `null` if no movies |

### 9.4 `<MovieCard />`

| Property | Detail |
|---|---|
| Size | `w-[128px] sm:w-[145px] md:w-[165px]`, `flex-none` |
| Poster | `<PosterImage />` — `h-[180px] sm:h-[205px] md:h-[235px] w-full object-cover`, rounded `rounded-md`, wrapped in `<Link>` to `/watch/{id}` |
| Hover effect | Framer Motion `whileHover={{ scale: 1.1, zIndex: 25 }}`, `duration: 0.18, ease: "easeOut"`. `layout` prop enabled. |
| Shadow | `shadow-card` (`0 18px 32px rgba(0,0,0,0.45)`) |
| Watchlist button | Top-right corner `right-2 top-2`, 32 px circle, `bg-black/75 hover:bg-netflix`. Shows `<Check>` if in watchlist, `<Plus>` otherwise. Full ARIA label. |
| Info overlay | Bottom gradient overlay, `opacity-0 group-hover:opacity-100 transition duration-200`. Shows title (`line-clamp-1 text-sm font-semibold`), star rating (`<Star>` icon in netflix red, rating to 1 decimal), year. |

### 9.5 `<SearchBar />`

| Property | Detail |
|---|---|
| Container | `max-w-sm`, relative positioned for dropdown |
| Input wrapper | `border border-zinc-700 bg-black/70 backdrop-blur-md rounded-md px-3 py-2` |
| Search icon | `<Search>` in `text-zinc-400`, 16 px |
| Input | Transparent bg, `text-sm text-white`, placeholder `text-zinc-500 "Search movies..."` |
| Clear button | `<X>` icon, appears when query is non-empty. Clears input, results, and closes dropdown. |
| Debouncing | 300 ms via `useDebounce` hook |
| Fetch | Calls `/api/search?q={query}` with `AbortController` for cancellation. Minimum 2-character query. |
| Dropdown | `absolute z-50 mt-2 max-h-[70vh] overflow-y-auto`, `bg-black/95 border border-zinc-800 rounded-md shadow-2xl` |
| Result items | Poster thumbnail (42x60 px), title (`line-clamp-1`), meta line (year + rating). Each is a `<Link>` to `/watch/{id}`. Hover: `bg-zinc-900`. |
| States | Loading: "Searching..." text. Empty: "No matches found." Max 10 results displayed. |
| Click-outside | Closes dropdown on `mousedown` outside wrapper ref |

### 9.6 `<WatchPlayer />`

| Property | Detail |
|---|---|
| Layout | `max-w-[1600px] mx-auto`, `px-4 md:px-12`, `pt-24 pb-12` |
| Header | "Now Playing" label (`text-xs uppercase tracking-[0.2em] text-netflix`), title (`text-2xl md:text-3xl font-bold`), runtime (`text-sm text-zinc-400`) |
| Back button | `<ArrowLeft>` + "Back to Browse", border outline style, links to `/` |
| Player | Vidstack `<MediaPlayer>` — `aspect-video`, HLS source, poster from TMDB `original`, `controls`, `crossOrigin` |
| Skin | `<MediaCommunitySkin />` with Netflix-red accent via CSS custom properties |
| Skip Intro button | Visible when `0 <= currentTime <= 30`. Red bg (`bg-netflix`), `<FastForward>` icon. Jumps to `currentTime = 90`. Positioned `absolute bottom-20 right-5`. |
| Next Episode button | Visible when remaining time <= 10 s. White bg, black text, `<PlayCircle>` icon. Shows countdown. Auto-navigates to `/watch/{id+1}` when countdown hits 0. |
| Keyboard shortcuts | `Space` = play/pause, `F` = fullscreen. Ignores when focus is in input/textarea/contentEditable. |
| Movie info panel | Below player. Grid layout. Left: overview text. Right: keyboard shortcuts reference. `border border-zinc-800 bg-zinc-950/70 rounded-lg p-5`. |
| Mock streams | Array of HLS URLs from Mux and Akamai test streams. Deterministic selection by `movieId % streams.length`. |

### 9.7 `<PosterImage />`

| Property | Detail |
|---|---|
| Wraps | `next/image` `<Image>` |
| Props | `path`, `alt`, `width`, `height`, `size` (w300/w500/w780/original), `className`, `priority` |
| Error handling | `onError` callback swaps `src` to `/placeholder.svg` |
| Reactivity | Re-syncs `src` state when `path` or `size` props change via `useEffect` |

### 9.8 `<Skeleton />`

| Property | Detail |
|---|---|
| Props | `cards` (default 8) |
| Renders | Title placeholder (`h-7 w-44 rounded-md skeleton-shimmer`) + row of card placeholders (responsive heights matching `MovieCard`) |

---

## 10. Page Specifications

### 10.1 Home Page (`app/page.tsx`)

- **Server Component.** Parallel-fetches `getFeaturedMovie()` and `getHomeRows()`.
- Passes results to `<HomePageClient />`.
- `<HomePageClient />` is a `"use client"` component that:
  - Initialises watchlist via `useWatchlist()`.
  - Renders `<Navbar />`, `<Hero />`, then `<main>` with My List row (if non-empty and hydrated) followed by all category rows.
  - `main` has `-mt-20` to overlap hero gradient, `space-y-10 pb-16`.

### 10.2 Watch Page (`app/watch/[id]/page.tsx`)

- **Server Component.** Parses `params.id` to number. Calls `notFound()` if invalid or if `getMovieDetails()` returns null.
- Dynamically imports `<WatchPlayer />` (`ssr: false`) with animated loading placeholder.
- Selects mock HLS stream deterministically.

### 10.3 Search API (`app/api/search/route.ts`)

- `export const dynamic = "force-dynamic"` — never cached at the edge.
- Reads `q` from search params, delegates to `searchMovies()`, returns max 20 results.
- Returns `{ results: [] }` on error — never throws to client.

### 10.4 Not Found (`app/not-found.tsx`)

- Centred layout. "404" label in netflix red. Title "Title not found". Descriptive paragraph. "Back Home" button (`bg-netflix`).

### 10.5 Loading States

- `app/loading.tsx`: Three `<Skeleton cards={12} />` rows.
- `app/watch/[id]/loading.tsx`: Title placeholder + aspect-video placeholder + info placeholder. All with `skeleton-shimmer`.

---

## 11. Root Layout (`app/layout.tsx`)

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "MFLIX | Stream Movies & Series",
  description:
    "MFLIX is a production-ready Netflix-inspired movie streaming app built with Next.js.",
  applicationName: "MFLIX",
  manifest: "/manifest.json",
  icons: { icon: "/icon-192.svg", apple: "/icon-192.svg" }
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-pitch font-sans text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

---

## 12. Complete Feature Checklist (100+ Features)

### A. Navigation & Header (Features 1–12)

1. Fixed-position top navbar with `z-50`
2. Scroll-aware background transition: transparent -> `bg-black/95 backdrop-blur-sm`
3. Passive scroll listener for performance
4. Netflix-red "MFLIX" brand logo with letter-spacing
5. Logo links back to home page
6. Desktop navigation links: Home, TV Shows, Movies, New & Popular, My List
7. Navigation links hidden on mobile (responsive breakpoint `md`)
8. Navigation link hover state: `text-zinc-300` -> `text-white`
9. Integrated search bar in navbar right section
10. Navbar max-width constraint `1600px` with auto margins
11. Responsive horizontal padding: `px-4` mobile, `px-12` desktop
12. Smooth colour transition on scroll (`duration-300`)

### B. Hero Section (Features 13–28)

13. Full-viewport hero section: `82vh` height, `min-height: 620px`
14. Dynamic backdrop image from TMDB `original` size
15. Automatic YouTube trailer embed after 3-second delay
16. Muted, looping auto-play trailer with no controls
17. Trailer iframe scaled `1.35x` to crop YouTube branding
18. Multi-layer gradient overlay (hero-gradient + bottom fade)
19. Framer Motion fade-in + slide-up animation on content
20. Movie title with responsive font sizing (4xl / 5xl / 6xl)
21. Overview text with `line-clamp-3` truncation
22. "Play" CTA button: white background, black text, Play icon filled black
23. "More Info" CTA button: semi-transparent zinc background
24. Both buttons link to `/watch/{movieId}`
25. Button hover state transitions
26. Skeleton shimmer placeholder when hero data is loading
27. Graceful fallback when no trending movie found
28. Balance text wrapping on title (`text-balance`)

### C. Movie Rows — Horizontal Scroll (Features 29–44)

29. Multiple category rows: Trending, Top Rated, Action, Comedy, Horror, Romance, Documentaries
30. "My List" row (watchlist) appears first when non-empty
31. Row title with `text-xl font-semibold`
32. Left/Right scroll arrow buttons (desktop only)
33. Scroll buttons: circular, `bg-zinc-900/90`, hover `bg-zinc-700`
34. Smooth scrolling on button click (`scrollBy 500px`)
35. Horizontal overflow scroll with custom-styled scrollbar
36. Netflix-red scrollbar thumb with full border-radius
37. Firefox scrollbar support via `scrollbar-width: thin`
38. Gap between cards: `gap-3` (12px)
39. Responsive card container with `overflow-x-auto`
40. IntersectionObserver-based infinite reveal (initial 10, step 8)
41. Sentinel element at end of visible cards for lazy loading
42. Root margin `200px` for pre-loading before cards enter view
43. Rows return `null` when movie array is empty
44. Parallel data fetching for all rows via `Promise.all`

### D. Movie Cards (Features 45–62)

45. Fixed-width cards: `128px` / `145px` / `165px` responsive
46. Poster image with `object-cover` cropping
47. Responsive poster height: `180px` / `205px` / `235px`
48. Rounded corners on poster (`rounded-md`)
49. Deep card shadow: `0 18px 32px rgba(0,0,0,0.45)`
50. Framer Motion hover scale: `1.1x` with `zIndex: 25`
51. Scale transition: `0.18s ease-out`
52. Layout animation enabled for smooth position transitions
53. Watchlist toggle button: top-right corner circle
54. Plus icon when not in watchlist, Check icon when added
55. Watchlist button hover: `bg-black/75` -> `bg-netflix`
56. Full ARIA labels on watchlist button (dynamic based on state)
57. Info overlay at bottom: gradient from transparent to `black/95`
58. Overlay hidden by default, fades in on hover (`opacity-0 -> opacity-100`)
59. Title with `line-clamp-1` in overlay
60. Star rating with Netflix-red star icon
61. Release year extracted and displayed
62. Card links to `/watch/{movieId}` via `<Link>`

### E. Search System (Features 63–78)

63. Search input with `backdrop-blur-md` glass effect
64. Search icon (Lucide `<Search>`)
65. Placeholder text "Search movies..."
66. Clear button (`<X>`) appears when query is non-empty
67. 300ms debounce on search input
68. Minimum 2-character query threshold
69. Fetch with `AbortController` for request cancellation
70. Search dropdown with `max-h-[70vh]` scroll
71. Dropdown background: `bg-black/95` with border and shadow
72. Result items: poster thumbnail (42x60 px) + title + meta
73. Result hover state: `bg-zinc-900`
74. Result links navigate to `/watch/{id}`
75. Loading state: "Searching..." text
76. Empty state: "No matches found."
77. Maximum 10 results displayed
78. Click-outside detection to close dropdown

### F. Video Player (Features 79–96)

79. Vidstack `<MediaPlayer>` with HLS adaptive streaming
80. `<MediaCommunitySkin />` for full player controls
81. Custom Netflix-red accent colour via CSS variables
82. Focus ring styled in Netflix red
83. Poster image displayed before playback
84. Cross-origin enabled for CDN streaming
85. Dynamic import with `ssr: false` for client-only rendering
86. Loading placeholder with `animate-pulse`
87. "Skip Intro" button: visible during first 30 seconds
88. Skip Intro jumps to timestamp 90s
89. Skip Intro styled: `bg-netflix`, `<FastForward>` icon
90. "Next Episode" button: visible when <= 10 seconds remain
91. Next Episode shows live countdown in seconds
92. Auto-navigate to next movie when countdown reaches 0
93. Keyboard shortcut: `Space` for play/pause
94. Keyboard shortcut: `F` for fullscreen
95. Keyboard handler ignores inputs/textareas/contentEditable
96. Player state polling every 250ms for time updates

### G. Watch Page Layout (Features 97–106)

97. "Now Playing" label with Netflix-red uppercase tracking
98. Movie title: `text-2xl md:text-3xl font-bold`
99. Runtime display formatted as `Xh Ym`
100. "Back to Browse" button with `<ArrowLeft>` icon
101. Back button with outline/border style
102. Player container with `rounded-lg border border-zinc-800 shadow-2xl`
103. Movie overview/description panel below player
104. Keyboard shortcuts reference panel
105. Grid layout: description left, shortcuts right on desktop
106. Mock HLS streams from Mux/Akamai test endpoints

### H. Watchlist / My List (Features 107–114)

107. localStorage persistence with key `mflix_watchlist`
108. Hydration guard prevents flash of empty state
109. Type-safe JSON validation on read
110. Automatic write-back on every state change
111. Set-based fast lookup for `isInWatchlist`
112. Toggle adds movie to front (newest first)
113. Toggle removes movie if already present
114. Watchlist movies converted to `TMDBMovie` shape for row rendering

### I. Images & Assets (Features 115–122)

115. `<PosterImage>` wrapper with Next.js `<Image>` optimisation
116. Automatic TMDB image URL construction with configurable sizes
117. Fallback to `/placeholder.svg` on error
118. Reactive `src` state synced to prop changes
119. `priority` prop support for above-the-fold images
120. TMDB remote pattern configured in `next.config.mjs`
121. YouTube thumbnail remote pattern (`i.ytimg.com`) configured
122. SVG placeholder for missing posters

### J. Loading & Error States (Features 123–130)

123. Full-page skeleton with 3 shimmer rows (home loading)
124. Watch page skeleton: title + video + info placeholders
125. Skeleton shimmer animation: gradient sweep every 1.8 seconds
126. `#111` base background for skeleton elements
127. Custom 404 page with branded design
128. 404 page includes descriptive text and "Back Home" CTA
129. API route returns empty results array on error (never crashes)
130. TMDB fetch wrapper catches and logs errors, returns `null`

### K. Performance Optimisations (Features 131–142)

131. Server Components by default — minimal client JS
132. ISR via `next: { revalidate }` on TMDB fetches (15 min default)
133. Parallel data fetching with `Promise.all` for home page
134. `next/dynamic` with `ssr: false` for video player (reduces initial bundle)
135. `next/font` for Inter (eliminates layout shift)
136. `next/image` for optimised poster delivery
137. IntersectionObserver for lazy card rendering in rows
138. `useMemo` to avoid re-computation of derived data
139. `useCallback` for stable function references (watchlist toggle)
140. Passive scroll listener on navbar
141. AbortController on search to prevent stale responses
142. Short revalidation (60s) for search, longer (30 min) for movie details

### L. Responsive Design (Features 143–150)

143. Mobile-first breakpoints: `sm:640px`, `md:768px`, `lg:1024px`
144. Card widths scale across breakpoints
145. Poster heights scale across breakpoints
146. Navigation links hidden on mobile
147. Scroll buttons hidden on mobile
148. Hero text sizes scale responsively
149. Padding scales: `px-4` -> `px-12`
150. Max-width container: `1600px`

### M. Accessibility (Features 151–160)

151. Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`
152. ARIA labels on all icon buttons
153. Dynamic ARIA labels (e.g., "Add X to watchlist" / "Remove X from watchlist")
154. Focus-visible styling on interactive elements
155. Keyboard-navigable search results
156. Screen reader text on scroll buttons
157. `alt` text on all images
158. `title` attribute on player
159. `lang="en"` on `<html>` element
160. Colour contrast ratios meeting WCAG AA

### N. PWA & Metadata (Features 161–168)

161. Web App Manifest at `/manifest.json`
162. App icons at 192px and 512px (SVG)
163. Theme colour `#050505`
164. `color-scheme: dark` viewport meta
165. SEO metadata: title, description, applicationName
166. Apple touch icon configured
167. Favicon configured
168. Open Graph-ready metadata structure

### O. Code Quality & Developer Experience (Features 169–178)

169. TypeScript strict mode with comprehensive interfaces
170. ESLint with Next.js config — zero warnings
171. Consistent code style with clear naming conventions
172. All components are single-responsibility
173. Utility functions are pure and testable
174. Custom hooks encapsulate side effects cleanly
175. No inline styles except computed background-image on Hero
176. Tailwind utility classes exclusively (no raw CSS except globals)
177. Environment variable support with fallback
178. Console error logging with `[Module]` prefixes for debugging

---

## 13. Animation & Micro-Interaction Specifications

### 13.1 Framer Motion Animations

| Element | Animation | Config |
|---|---|---|
| Hero content | Fade-in + slide-up | `initial={{ opacity: 0, y: 18 }}`, `animate={{ opacity: 1, y: 0 }}`, `duration: 0.45` |
| Movie card hover | Scale up | `whileHover={{ scale: 1.1, zIndex: 25 }}`, `duration: 0.18, ease: "easeOut"` |
| Movie card | Layout animation | `layout` prop for smooth reflow |

### 13.2 CSS Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Navbar background | `background-color` | `300ms` | Default ease |
| Nav links | `color` | Default (`150ms`) | Default ease |
| Buttons (all) | Multiple | Default (`150ms`) | Default ease |
| Card info overlay | `opacity` | `200ms` | Default ease |
| Watchlist button | `background-color` | Default (`150ms`) | Default ease |
| Search dropdown items | `background-color` | Default (`150ms`) | Default ease |
| Back button | `border-color, background-color` | Default (`150ms`) | Default ease |

### 13.3 Skeleton Animation

- **Technique:** `::after` pseudo-element with `translateX(-100%)` -> `translateX(100%)`
- **Duration:** 1.8 seconds, infinite loop
- **Gradient:** `90deg` from transparent -> `rgba(255,255,255,0.08)` -> `rgba(255,255,255,0.15)` -> `rgba(255,255,255,0.08)` -> transparent

---

## 14. Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `pitch` | `#050505` | Primary background |
| `netflix` | `#E50914` | Brand accent, buttons, scrollbar, star rating |
| White | `#FFFFFF` | Primary text, Play button bg |
| `zinc-100` | `#F4F4F5` | Hero overview text |
| `zinc-200` | `#E4E4E7` | Play button hover |
| `zinc-300` | `#D4D4D8` | Nav links, card meta text |
| `zinc-400` | `#A1A1AA` | Placeholder text, search icon, secondary text |
| `zinc-500` | `#71717A` | Input placeholder |
| `zinc-600/70` | `rgba(82,82,91,0.7)` | More Info button |
| `zinc-700` | `#3F3F46` | Borders |
| `zinc-800` | `#27272A` | Player border, dropdown border |
| `zinc-900` | `#18181B` | Scroll buttons, dropdown hover |
| `zinc-950/70` | `rgba(9,9,11,0.7)` | Info panel bg |
| `black/75` | `rgba(0,0,0,0.75)` | Watchlist button bg |
| `black/95` | `rgba(0,0,0,0.95)` | Card overlay, dropdown bg |

---

## 15. Typography Scale

| Element | Classes |
|---|---|
| Hero title | `text-4xl sm:text-5xl md:text-6xl font-bold text-balance` |
| Hero overview | `text-sm sm:text-base text-zinc-100 line-clamp-3` |
| Row title | `text-xl font-semibold text-white` |
| Card title (overlay) | `text-sm font-semibold line-clamp-1` |
| Card meta | `text-xs text-zinc-300` |
| Player title | `text-2xl md:text-3xl font-bold` |
| "Now Playing" label | `text-xs uppercase tracking-[0.2em] text-netflix` |
| Buttons | `text-sm font-semibold` |
| Search input | `text-sm text-white` |
| Body | `font-sans text-white antialiased` (Inter) |

---

## 16. Spacing & Layout Constants

| Constant | Value | Where Used |
|---|---|---|
| Page max-width | `1600px` | Navbar, WatchPlayer |
| Horizontal padding | `px-4 md:px-12` | Navbar, Rows, WatchPlayer |
| Row vertical gap | `space-y-10` | Main content |
| Card gap | `gap-3` (12px) | MovieRow |
| Hero bottom padding | `pb-24` | Hero content |
| Main overlap | `-mt-20` | Main over hero |
| Hero min-height | `620px` | Hero section |
| Dropdown max-height | `70vh` | Search dropdown |

---

## 17. Data Flow Architecture

```
┌────────────────────────────────────────────────────┐
│                   TMDB API (v3)                     │
│  /trending  /top_rated  /discover  /search  /movie  │
└───────────────┬───────────────────────┬─────────────┘
                │ (Server-side fetch    │ (Client fetch
                │  with ISR revalidate) │  via API route)
                ▼                       ▼
     ┌──────────────────┐    ┌──────────────────┐
     │  lib/tmdb.ts     │    │ app/api/search/  │
     │  (Server Utils)  │    │   route.ts       │
     └───────┬──────────┘    └────────┬─────────┘
             │                        │
             ▼                        ▼
     ┌──────────────────┐    ┌──────────────────┐
     │  Server Components│    │  SearchBar.tsx   │
     │  (page.tsx files) │    │  (Client)        │
     └───────┬──────────┘    └──────────────────┘
             │
             ▼
     ┌──────────────────┐
     │  Client Components│
     │  (HomePageClient, │
     │   Hero, MovieRow,  │
     │   MovieCard, etc.) │
     └───────┬──────────┘
             │
             ▼
     ┌──────────────────┐
     │  Custom Hooks     │
     │  useWatchlist     │
     │  useDebounce      │
     │  useInfiniteVC    │
     └──────────────────┘
             │
             ▼
     ┌──────────────────┐
     │  localStorage     │
     │  (Watchlist)      │
     └──────────────────┘
```

---

## 18. API Request Caching Strategy

| Endpoint | Revalidate | Rationale |
|---|---|---|
| `/trending/movie/week` | 15 min | Weekly data, moderate freshness |
| `/movie/top_rated` | 15 min | Stable list |
| `/discover/movie?with_genres=X` | 15 min | Genre lists change slowly |
| `/search/movie` | 60 sec | Search needs fresher results |
| `/movie/{id}?append_to_response=videos` | 30 min | Movie details rarely change |
| `/movie/{id}/videos` | 15 min | Video list is stable |

---

## 19. Error Handling Strategy

| Layer | Strategy |
|---|---|
| `fetchFromTMDB` | Try/catch wrapping `fetch`. Returns `null` on HTTP error or network error. Logs `[TMDB]` prefixed messages. |
| `normalizeList` | Returns empty array if payload is null or has no results |
| `PosterImage` | `onError` fallback to `/placeholder.svg` |
| Search API route | Returns `{ results: [] }` on any error |
| Watch page | Calls `notFound()` if movie ID is invalid or details fetch returns null |
| Watchlist | Wrapped in try/catch for `localStorage.getItem` and `JSON.parse` |

---

## 20. Build & Run Instructions

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

### Environment Variables (Optional)

```env
TMDB_API_KEY=aa844700ff3f44363be5bf50f78df0b1
NEXT_PUBLIC_TMDB_API_KEY=aa844700ff3f44363be5bf50f78df0b1
```

If neither is set, the hardcoded fallback key is used automatically.

---

## 21. Quality Assurance Checklist

- [ ] `npm run build` completes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] TypeScript compiles with `strict: true`
- [ ] Home page loads with hero + all category rows
- [ ] Hero auto-plays trailer after 3 seconds
- [ ] Movie cards scale on hover with info overlay
- [ ] Watchlist toggle works and persists across page refreshes
- [ ] "My List" row appears when watchlist is non-empty
- [ ] Search returns results within 500ms of typing
- [ ] Search dropdown closes on click-outside
- [ ] Watch page plays video with Skip Intro and Next Episode
- [ ] Keyboard shortcuts (Space, F) work on watch page
- [ ] 404 page displays for invalid movie IDs
- [ ] Loading skeletons appear during data fetches
- [ ] Responsive layout works from 320px to 2560px
- [ ] Custom scrollbars display on all row containers
- [ ] All images have alt text
- [ ] All icon buttons have ARIA labels
- [ ] No hydration mismatches in console
- [ ] No runtime errors in console

---

## 22. Summary

This Master Prompt defines **every component, every hook, every utility function, every API call, every animation, every hover effect, every colour, every spacing token, every responsive breakpoint, every loading state, every error state, every keyboard shortcut, and every accessibility consideration** required to build MFLIX — a production-grade, world-class Netflix clone.

When you receive this prompt, build the **entire project** file by file, implementing every specification exactly as described. The result should be a fully functional, visually stunning, performant streaming platform that rivals Netflix, Amazon Prime Video, and Disney+ Hotstar in UI quality and user experience.

**TMDB API Key:** `aa844700ff3f44363be5bf50f78df0b1`
**Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS 3 + Framer Motion + Vidstack + Lucide Icons

---

*End of Master Prompt — MFLIX v1.0*
