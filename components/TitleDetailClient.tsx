"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Play,
  Plus,
  Check,
  Share2,
  Star,
  Clock,
  Calendar,
  Globe,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import type {
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBCastMember,
  TMDBCrewMember,
  TMDBVideo,
  TMDBMovie,
  MediaType,
  WatchlistItem,
} from "@/types/tmdb";
import {
  getTitle,
  getYear,
  getRating,
  formatRuntime,
  formatEpisodeCount,
  tmdbBackdrop,
  tmdbPoster,
  tmdbProfile,
  getTrailerKey,
  getYouTubeThumbnail,
  getDirectors,
  getWriters,
  getKeyCrewMembers,
  normalizeResults,
  getMediaType,
} from "@/lib/tmdb/mappers";
import { useWatchlistStore, useToastStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentRow from "@/components/ContentRow";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ToastContainer from "@/components/ui/Toast";
import type { ContentRow as ContentRowType } from "@/types/tmdb";

interface TitleDetailClientProps {
  details: TMDBMovieDetails | TMDBTVDetails;
  mediaType: MediaType;
}

function isTV(details: TMDBMovieDetails | TMDBTVDetails): details is TMDBTVDetails {
  return "number_of_seasons" in details;
}

export default function TitleDetailClient({ details, mediaType }: TitleDetailClientProps) {
  const hydrateWatchlist = useWatchlistStore((s) => s.hydrate);
  const toggle = useWatchlistStore((s) => s.toggle);
  const isInList = useWatchlistStore((s) => s.isInList(details.id));
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);
  const addToast = useToastStore((s) => s.addToast);

  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    hydrateWatchlist();
  }, [hydrateWatchlist]);

  const title = getTitle(details);
  const year = getYear(details);
  const rating = getRating(details);
  const overview = details.overview ?? "";
  const genres = details.genres ?? [];
  const cast = details.credits?.cast ?? [];
  const crew = details.credits?.crew ?? [];
  const videos = details.videos?.results ?? [];
  const similar = normalizeResults(details.similar?.results);
  const recommendations = normalizeResults(details.recommendations?.results);
  const trailerKey = getTrailerKey(videos);

  const runtime = isTV(details)
    ? formatEpisodeCount(details)
    : formatRuntime((details as TMDBMovieDetails).runtime);

  const directors = getDirectors(crew);
  const writers = getWriters(crew);
  const keyCrewMembers = getKeyCrewMembers(crew);

  const languages = details.spoken_languages?.map((l) => l.english_name).filter(Boolean) ?? [];

  const watchlistItem: WatchlistItem = {
    id: details.id,
    title,
    overview,
    posterPath: details.poster_path,
    backdropPath: details.backdrop_path,
    rating: details.vote_average ?? 0,
    year,
    mediaType,
    addedAt: Date.now(),
  };

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      addToast("Link copied to clipboard", "success");
    }
  }, [title, addToast]);

  const similarRow: ContentRowType | null =
    similar.length > 0
      ? { id: "similar", title: "More Like This", items: similar, variant: "poster" }
      : null;

  const recommendationsRow: ContentRowType | null =
    recommendations.length > 0
      ? { id: "recommendations", title: "Recommended For You", items: recommendations, variant: "poster" }
      : null;

  return (
    <div className="min-h-screen bg-pitch text-white">
      <Navbar />

      {/* Hero Backdrop */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden lg:h-[70vh]">
        <Image
          src={tmdbBackdrop(details.backdrop_path)}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-vignette" />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/60 to-transparent" />
      </section>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-[1400px] px-4 pb-16 md:px-12">
        <div className="-mt-40 grid gap-8 lg:-mt-48 lg:grid-cols-[280px_1fr]">
          {/* Poster sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="overflow-hidden rounded-xl shadow-card-hover ring-1 ring-white/10">
              <Image
                src={tmdbPoster(details.poster_path)}
                alt={title}
                width={280}
                height={420}
                className="aspect-poster w-full object-cover"
                sizes="280px"
              />
            </div>
          </motion.div>

          {/* Main info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-zinc-500" aria-label="Breadcrumb">
              <Link href="/" className="transition hover:text-white">Home</Link>
              <span>/</span>
              <Link href={mediaType === "tv" ? "/tv" : "/movies"} className="transition hover:text-white">
                {mediaType === "tv" ? "TV Shows" : "Movies"}
              </Link>
              <span>/</span>
              <span className="text-zinc-300">{title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-fluid-3xl font-bold leading-tight">{title}</h1>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              {rating > 0 && (
                <Badge variant="success">
                  <Star className="h-3 w-3" />
                  {rating}% Match
                </Badge>
              )}
              {year && <Badge variant="outline">{year}</Badge>}
              {runtime && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3" />
                  {runtime}
                </Badge>
              )}
              {isTV(details) && (
                <Badge variant="outline">
                  {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? "s" : ""}
                </Badge>
              )}
              <Badge variant="default">HD</Badge>
              {languages[0] && (
                <Badge variant="default">
                  <Globe className="h-3 w-3" />
                  {languages[0]}
                </Badge>
              )}
            </div>

            {/* Tagline */}
            {details.tagline && (
              <p className="text-fluid-base italic text-zinc-400">&ldquo;{details.tagline}&rdquo;</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href={`/watch/${details.id}`}>
                <Button variant="white" size="lg" icon={<Play className="h-5 w-5 fill-current" />}>
                  Play
                </Button>
              </Link>
              {trailerKey && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="lg" icon={<ExternalLink className="h-4 w-4" />}>
                    Trailer
                  </Button>
                </a>
              )}
              <Button
                variant={isInList ? "netflix" : "secondary"}
                size="lg"
                icon={isInList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                onClick={() => toggle(watchlistItem)}
              >
                {isInList ? "In My List" : "My List"}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Overview */}
            {overview && (
              <div>
                <p className={`text-fluid-base leading-relaxed text-zinc-300 ${!showFullOverview && overview.length > 300 ? "line-clamp-3" : ""}`}>
                  {overview}
                </p>
                {overview.length > 300 && (
                  <button
                    onClick={() => setShowFullOverview(!showFullOverview)}
                    className="mt-2 flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
                  >
                    {showFullOverview ? (
                      <>Show Less <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Read More <ChevronDown className="h-4 w-4" /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition hover:border-netflix hover:text-white"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Crew */}
            {keyCrewMembers.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-zinc-800 pt-4 text-sm sm:grid-cols-3">
                {directors.length > 0 && (
                  <div>
                    <span className="text-zinc-500">Director</span>
                    <p className="text-zinc-200">{directors.map((d) => d.name).join(", ")}</p>
                  </div>
                )}
                {writers.length > 0 && (
                  <div>
                    <span className="text-zinc-500">Writer</span>
                    <p className="text-zinc-200">{writers.slice(0, 3).map((w) => w.name).join(", ")}</p>
                  </div>
                )}
                {isTV(details) && details.created_by?.length > 0 && (
                  <div>
                    <span className="text-zinc-500">Created By</span>
                    <p className="text-zinc-200">{details.created_by.map((c) => c.name).join(", ")}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-fluid-xl font-semibold">Cast</h2>
            <div className="row-scroll hide-scrollbar flex gap-4 overflow-x-auto pb-4">
              {cast.slice(0, 20).map((person) => (
                <CastCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        )}

        {/* Videos / Trailers */}
        {videos.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-fluid-xl font-semibold">Videos & Trailers</h2>
            <div className="row-scroll hide-scrollbar flex gap-4 overflow-x-auto pb-4">
              {videos
                .filter((v) => v.site === "YouTube" && v.key)
                .slice(0, 8)
                .map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
            </div>
          </section>
        )}

        {/* Seasons (TV only) */}
        {isTV(details) && details.seasons && details.seasons.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-fluid-xl font-semibold">Seasons</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {details.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                  <div
                    key={season.id}
                    className="flex gap-3 rounded-lg border border-zinc-800 bg-surface p-3 transition hover:border-zinc-700"
                  >
                    <Image
                      src={tmdbPoster(season.poster_path, "w185")}
                      alt={season.name}
                      width={80}
                      height={120}
                      className="h-[100px] w-[67px] flex-shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold text-white">{season.name}</p>
                      <p className="text-xs text-zinc-400">
                        {season.episode_count} Episode{season.episode_count !== 1 ? "s" : ""}
                        {season.air_date ? ` · ${season.air_date.slice(0, 4)}` : ""}
                      </p>
                      {season.overview && (
                        <p className="line-clamp-2 text-xs text-zinc-500">{season.overview}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {details.images && details.images.backdrops && details.images.backdrops.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-fluid-xl font-semibold">Gallery</h2>
            <div className="row-scroll hide-scrollbar flex gap-3 overflow-x-auto pb-4">
              {details.images.backdrops.slice(0, 12).map((img, idx) => (
                <div key={idx} className="flex-none overflow-hidden rounded-lg">
                  <Image
                    src={tmdbBackdrop(img.file_path)}
                    alt={`${title} still ${idx + 1}`}
                    width={400}
                    height={225}
                    className="h-[150px] w-[267px] object-cover transition hover:scale-105 sm:h-[180px] sm:w-[320px]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Titles */}
        {similarRow && (
          <div className="mt-12">
            <ContentRow row={similarRow} />
          </div>
        )}

        {/* Recommendations */}
        {recommendationsRow && (
          <div className="mt-10">
            <ContentRow row={recommendationsRow} />
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function CastCard({ person }: { person: TMDBCastMember }) {
  return (
    <div className="w-[110px] flex-none text-center sm:w-[120px]">
      <div className="mx-auto h-[110px] w-[110px] overflow-hidden rounded-full bg-surface ring-1 ring-zinc-800 sm:h-[120px] sm:w-[120px]">
        <Image
          src={tmdbProfile(person.profile_path)}
          alt={person.name}
          width={240}
          height={240}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-2 text-xs font-semibold text-white line-clamp-1">{person.name}</p>
      <p className="text-[10px] text-zinc-500 line-clamp-1">{person.character}</p>
    </div>
  );
}

function VideoCard({ video }: { video: TMDBVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.key}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-none"
    >
      <div className="relative h-[130px] w-[230px] overflow-hidden rounded-lg bg-surface sm:h-[150px] sm:w-[267px]">
        <Image
          src={getYouTubeThumbnail(video.key)}
          alt={video.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="267px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
      </div>
      <p className="mt-2 line-clamp-1 w-[230px] text-xs text-zinc-300 sm:w-[267px]">{video.name}</p>
      <p className="text-[10px] text-zinc-500">{video.type}</p>
    </a>
  );
}
