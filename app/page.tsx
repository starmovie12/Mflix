import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import WatchlistRow from "@/components/WatchlistRow";
import Footer from "@/components/Footer";
import { SkeletonHero, SkeletonRow } from "@/components/Skeleton";
import {
  getTrending,
  getTopRated,
  getNetflixOriginals,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
  getSciFiMovies,
  getThrillerMovies,
  getAnimationMovies,
  getUpcoming,
  getNowPlaying,
} from "@/lib/tmdb";
import type { VideoResult } from "@/lib/types";
import { TMDB_API_KEY, TMDB_BASE_URL } from "@/lib/constants";

async function getHeroTrailer(movieId: number, type: string = "movie"): Promise<string | null> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/${movieId}/videos?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const trailer = (data.results as VideoResult[])?.find(
      (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );
    return trailer?.key ?? null;
  } catch {
    return null;
  }
}

async function HomeContent() {
  const [
    trending,
    topRated,
    originals,
    action,
    comedy,
    horror,
    romance,
    documentaries,
    scifi,
    thriller,
    animation,
    upcoming,
    nowPlaying,
  ] = await Promise.all([
    getTrending(),
    getTopRated(),
    getNetflixOriginals(),
    getActionMovies(),
    getComedyMovies(),
    getHorrorMovies(),
    getRomanceMovies(),
    getDocumentaries(),
    getSciFiMovies(),
    getThrillerMovies(),
    getAnimationMovies(),
    getUpcoming(),
    getNowPlaying(),
  ]);

  const heroMovie = trending[0];
  let trailerKey: string | null = null;
  if (heroMovie) {
    trailerKey = await getHeroTrailer(heroMovie.id, heroMovie.media_type || "movie");
  }

  return (
    <>
      {heroMovie && <Hero movie={heroMovie} trailerKey={trailerKey} />}
      <div className="relative z-10 -mt-16 md:-mt-24">
        <WatchlistRow />
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="MFLIX Originals" movies={originals} isLarge />
        <MovieRow title="Now Playing" movies={nowPlaying} />
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="Action Movies" movies={action} />
        <MovieRow title="Upcoming" movies={upcoming} />
        <MovieRow title="Comedy Movies" movies={comedy} />
        <MovieRow title="Sci-Fi Movies" movies={scifi} />
        <MovieRow title="Horror Movies" movies={horror} />
        <MovieRow title="Romance Movies" movies={romance} />
        <MovieRow title="Thriller Movies" movies={thriller} />
        <MovieRow title="Animation" movies={animation} />
        <MovieRow title="Documentaries" movies={documentaries} />
      </div>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Suspense
        fallback={
          <>
            <SkeletonHero />
            <div className="-mt-16 md:-mt-24">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} isLarge={i === 1} />
              ))}
            </div>
          </>
        }
      >
        <HomeContent />
      </Suspense>
    </main>
  );
}
