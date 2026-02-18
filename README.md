# MFLIX - Production-Ready Netflix Clone

A pixel-perfect Netflix clone built with Next.js 14, Tailwind CSS, Framer Motion, Lucide React, and Vidstack Player.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Video Player:** @vidstack/react with HLS support
- **Data:** TMDB API

## Features

- **Hero Section:** Full-screen hero with trending movie, muted trailer background after 3 seconds
- **Movie Rows:** Horizontal scrollable rows with hover cards (scale 1.1x, metadata)
- **Navbar:** Transparent on top, becomes black on scroll
- **Skeleton Loading:** Shimmer effects (no spinners)
- **Video Player:** Vidstack player with HLS streaming, Skip Intro (0:00-0:30), Next Episode countdown (10s)
- **Keyboard Shortcuts:** F for Fullscreen, Space for Play/Pause
- **Instant Search:** Debounced search while typing
- **Watchlist:** Persisted to localStorage, "My List" row
- **Infinite Scroll:** Lazy loading for row items
- **PWA:** manifest.json for mobile installation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Environment

Uses TMDB API Key (configured in `lib/tmdb.ts`).
