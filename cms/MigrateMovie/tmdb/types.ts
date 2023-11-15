export interface tmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  adult: boolean;
  genres: {
    id: number;
    name: string;
  }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  production_companies: tmdbCompany[];
}
export interface tmdbImages {
  backdrops: {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
  posters: {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
}
export interface tmdbPerson {
  id: number;
  name: string;
  job: string;
  order: number;
}
export interface tmdbCompany {
  name: string;
}
export interface tmdbCredits {
  cast: tmdbPerson[];
  crew: tmdbPerson[];
}
export interface tmdbRelease {
  iso_3166_1: string;
  release_dates: {
    certification: string;
    iso_639_1: string;
    note: string;
    release_date: string;
    type: number;
  }[];
}
export interface tmdbReleaseDates {
  results: tmdbRelease[];
}
export interface tmdbVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: "YouTube" | string;
  size: number;
  type: "Trailer" | string;
  official: boolean;
  published_at: string;
  id: string;
}
export interface tmdbVideos {
  results: tmdbVideo[];
}

export interface tmdbKeywords {
  keywords: {
    id: number;
    name: string;
  }[];
}
