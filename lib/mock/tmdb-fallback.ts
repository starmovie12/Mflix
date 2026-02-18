import type { FeaturedMedia, GenreTag, MediaItem, MediaRail, MediaType, SearchResult, TitleDetails } from "@/types/media";

const MOCK_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 990001,
    mediaType: "movie",
    title: "Crimson Protocol",
    overview: "A rogue analyst uncovers a global surveillance conspiracy and races against time to expose it.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2025-09-14",
    voteAverage: 8.2,
    voteCount: 2410,
    popularity: 94.4,
    genreIds: [28, 53],
    originalLanguage: "en",
    adult: false
  },
  {
    id: 990002,
    mediaType: "movie",
    title: "Midnight Harbour",
    overview: "A washed-up detective returns to the city where one unresolved case still haunts every alley.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2024-11-02",
    voteAverage: 7.7,
    voteCount: 1702,
    popularity: 82.3,
    genreIds: [80, 9648, 53],
    originalLanguage: "en",
    adult: false
  },
  {
    id: 990003,
    mediaType: "movie",
    title: "Orbit Zero",
    overview: "After a mining station goes dark, a rescue team discovers something alive in deep orbit.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2025-03-21",
    voteAverage: 8.0,
    voteCount: 1330,
    popularity: 88.7,
    genreIds: [878, 27, 53],
    originalLanguage: "en",
    adult: false
  },
  {
    id: 990004,
    mediaType: "movie",
    title: "Paper Suns",
    overview: "Two estranged siblings reunite to save their family cinema from corporate demolition.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2023-08-18",
    voteAverage: 7.4,
    voteCount: 954,
    popularity: 65.9,
    genreIds: [18, 35],
    originalLanguage: "en",
    adult: false
  },
  {
    id: 991001,
    mediaType: "tv",
    title: "Neon District",
    overview: "In a cyberpunk megacity, a former cop and a hacker expose crimes hidden behind perfect AI governance.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2025-01-09",
    voteAverage: 8.5,
    voteCount: 3100,
    popularity: 97.2,
    genreIds: [80, 9648, 10765],
    originalLanguage: "en",
    adult: false
  },
  {
    id: 991002,
    mediaType: "tv",
    title: "Kingdom of Ash",
    overview: "Rival houses battle for the volcanic throne while an ancient force wakes beneath the mountains.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2024-06-11",
    voteAverage: 8.1,
    voteCount: 2242,
    popularity: 90.2,
    genreIds: [10759, 18, 10765],
    originalLanguage: "en",
    adult: false
  },
  {
    id: 991003,
    mediaType: "tv",
    title: "Northline",
    overview: "A high-speed rail expansion uncovers political corruption, sabotage, and an impossible cover-up.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2023-10-30",
    voteAverage: 7.8,
    voteCount: 1498,
    popularity: 71.5,
    genreIds: [18, 80],
    originalLanguage: "en",
    adult: false
  },
  {
    id: 991004,
    mediaType: "tv",
    title: "Little Legends",
    overview: "A group of children discover a magical library where stories rewrite reality.",
    posterPath: null,
    backdropPath: null,
    releaseDate: "2022-04-27",
    voteAverage: 7.2,
    voteCount: 830,
    popularity: 52.8,
    genreIds: [10762, 10751, 10765],
    originalLanguage: "en",
    adult: false
  }
];

const GENRE_LOOKUP: Record<number, string> = {
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  53: "Thriller",
  80: "Crime",
  878: "Sci-Fi",
  9648: "Mystery",
  10751: "Family",
  10759: "Action & Adventure",
  10762: "Kids",
  10765: "Sci-Fi & Fantasy"
};

function dedupeById(items: MediaItem[]) {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function pickByMediaType(mediaType: MediaType) {
  return MOCK_MEDIA_ITEMS.filter((item) => item.mediaType === mediaType);
}

function toGenres(genreIds: number[]): GenreTag[] {
  return genreIds
    .map((id) => ({
      id,
      name: GENRE_LOOKUP[id] ?? `Genre ${id}`
    }))
    .slice(0, 4);
}

function getMockItem(mediaType: MediaType, id: number) {
  return MOCK_MEDIA_ITEMS.find((item) => item.id === id && item.mediaType === mediaType) ?? null;
}

function createDetailFromItem(item: MediaItem): TitleDetails {
  const sameType = pickByMediaType(item.mediaType).filter((candidate) => candidate.id !== item.id);
  const similar = dedupeById(sameType.slice(0, 4));
  const recommendations = dedupeById(
    [...sameType.filter((candidate) => candidate.genreIds.some((id) => item.genreIds.includes(id))), ...sameType].slice(0, 6)
  );

  return {
    ...item,
    tagline: "Demo catalog fallback while TMDB is unavailable.",
    status: "Released",
    runtimeMinutes: item.mediaType === "movie" ? 124 : 49,
    genres: toGenres(item.genreIds),
    videos: [],
    cast: [
      { id: item.id * 10 + 1, name: "Alex Mercer", profilePath: null, character: "Lead", job: null },
      { id: item.id * 10 + 2, name: "Rin Park", profilePath: null, character: "Support", job: null },
      { id: item.id * 10 + 3, name: "Noah Vale", profilePath: null, character: "Mentor", job: null }
    ],
    crewHighlights: [
      { id: item.id * 10 + 4, name: "S. Hoffman", profilePath: null, character: null, job: "Director" },
      { id: item.id * 10 + 5, name: "T. Iqbal", profilePath: null, character: null, job: "Writer" }
    ],
    similar,
    recommendations,
    backdrops: [],
    posters: [],
    seasons:
      item.mediaType === "tv"
        ? [
            {
              id: item.id * 100 + 1,
              name: "Season 1",
              episodeCount: 8,
              airDate: item.releaseDate,
              overview: `${item.title} begins with a city-shaking incident.`,
              posterPath: null
            }
          ]
        : []
  };
}

export function getMockHomeRails(): MediaRail[] {
  const movies = pickByMediaType("movie");
  const tv = pickByMediaType("tv");

  return [
    { id: "trending-day", title: "Trending Today", items: [...movies, ...tv].slice(0, 8) },
    { id: "trending-week", title: "Trending This Week", items: [...tv, ...movies].slice(0, 8) },
    { id: "popular-movies", title: "Popular Movies", items: movies },
    { id: "popular-tv", title: "Popular TV", items: tv },
    { id: "top-rated-movies", title: "Top Rated Movies", items: movies.slice(0, 4) },
    { id: "upcoming-movies", title: "Upcoming Movies", items: movies.slice(1) },
    { id: "now-playing", title: "Now Playing", items: movies },
    { id: "airing-today", title: "Airing Today", items: tv }
  ];
}

export function getMockFeaturedWithTrailer(): FeaturedMedia {
  const featured = MOCK_MEDIA_ITEMS[0];

  return {
    ...featured,
    trailerKey: null
  };
}

export function getMockTitleDetails(mediaType: MediaType, id: number): TitleDetails | null {
  const item = getMockItem(mediaType, id);
  if (!item) {
    return null;
  }

  return createDetailFromItem(item);
}

export function getMockGenres(mediaType: MediaType): GenreTag[] {
  const ids = new Set<number>();

  for (const item of pickByMediaType(mediaType)) {
    for (const genreId of item.genreIds) {
      ids.add(genreId);
    }
  }

  return Array.from(ids).map((id) => ({ id, name: GENRE_LOOKUP[id] ?? `Genre ${id}` }));
}

export function getMockMediaByGenre(mediaType: MediaType, genreId: number): MediaItem[] {
  return pickByMediaType(mediaType).filter((item) => item.genreIds.includes(genreId));
}

export function getMockSearchResults(query: string, page = 1): SearchResult {
  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? MOCK_MEDIA_ITEMS.filter((item) => item.title.toLowerCase().includes(trimmed) || item.overview.toLowerCase().includes(trimmed))
    : [];

  return {
    query,
    page,
    totalPages: 1,
    totalResults: results.length,
    results
  };
}
