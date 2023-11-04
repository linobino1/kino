import type { Movie } from "payload/generated-types";
import type {
  tmdbCredits,
  tmdbMovie,
  tmdbVideos,
  tmdbReleaseDates,
  tmdbKeywords,
  tmdbImages,
} from "../tmdb/types";
import type { Document } from "payload/types";
import type { Endpoint, FindFunction } from "./types";
import { ageRatingAges } from "../../collections/Movies";
import { themoviedb } from "../tmdb";

export const findInTmdb: FindFunction = async ({ query }) => {
  let data: Document;
  const path = '/search/movie';

  try {
    const res = await themoviedb.get(path, {
      params: {
        query,
      },
    });
    data = JSON.parse(res?.data);
  } catch (err) {
    throw new Error('Unable to get themoviedb response');
  }
  
  if (data.success === false) {
    throw new Error(`Search for '${query}' failed at endpoint '${path}'`);
  }
  
  return {
    results: data.results,
  };
}

/**
 * 
 * @param tmdbId the movie id
 * @param endpoint the endpoint to get the url for 
 */
export const getPath = (tmdbId: number, endpoint: Endpoint) => {
  switch (endpoint) {
      
    case 'movie': return `/movie/${tmdbId}`;
    case 'credits': return `/movie/${tmdbId}/credits`;
    case 'videos': return `/movie/${tmdbId}/videos`;
    case 'keywords': return `/movie/${tmdbId}/keywords`;
    case 'releaseDates': return `/movie/${tmdbId}/release_dates`;
    case 'images': return `/movie/${tmdbId}/images`;
  }
}

/**
 * get data from themoviedb.org for a movie
 */
export async function getTmdbData(endpoint: 'movie', tmdbId: number, language?: string): Promise<tmdbMovie>;
export async function getTmdbData(endpoint: 'credits', tmdbId: number, language?: string): Promise<tmdbCredits>;
export async function getTmdbData(endpoint: 'videos', tmdbId: number, language?: string): Promise<tmdbVideos>;
export async function getTmdbData(endpoint: 'keywords', tmdbId: number, language?: string): Promise<tmdbKeywords>;
export async function getTmdbData(endpoint: 'releaseDates', tmdbId: number, language?: string): Promise<tmdbReleaseDates>;
export async function getTmdbData(endpoint: 'images', tmdbId: number, language?: string): Promise<tmdbImages>;
export async function getTmdbData(endpoint: Endpoint, tmdbId: number, language?: string): Promise<Document> {
  let data: Document;
  const path = getPath(tmdbId, endpoint);
  try {
    const res = await themoviedb.get(path, {
      params: {
        language,
      },
    });
    data = JSON.parse(res?.data);
  } catch (err) {
    throw new Error('Unable to get themoviedb response for movie');
  }
  if (!data || data.success === false) {
    throw new Error(`No data found for movie '${tmdbId}' at endpoint '${path}'`);
  }
  return data;
}


/**
 * 
 * @param tmdbId id of the movie on themoviedb.org
 * @returns string | undefined age certification of the latest release in germany
 */
export async function getAgeRating(tmdbId: number): Promise<Movie['ageRating'] | undefined> {
  const data = await getTmdbData('releaseDates', tmdbId);
  if (!data.results) {
    return undefined;
  }
  
  // find release dates for germany
  const germany = data.results.find((country) => country.iso_3166_1 === 'DE');
  if (!germany) {
    return undefined;
  }
  const { release_dates } = germany;
  
  // filter out age ratings we do not use
  release_dates.filter((release_date) => {
    return ageRatingAges.map((x) => `${x}`).includes(release_date.certification);
  });

  // find the latest release
  release_dates.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return release_dates[0]['certification'] as Movie['ageRating'] || undefined;
}