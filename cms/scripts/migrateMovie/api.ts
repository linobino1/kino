import { Axios } from "axios";

export const themoviedb = new Axios({
  baseURL: 'https://api.themoviedb.org/3',
});

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
export interface tmdbCredits {
  cast: tmdbPerson[];
  crew: tmdbPerson[];
}
