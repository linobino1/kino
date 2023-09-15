import type { Payload } from "payload";
import type {
  Genre,
  Person,
  Config,
  Company,
  Movie,
} from "payload/generated-types";
import type {
  tmdbCredits,
  tmdbMovie,
  tmdbVideos,
  tmdbReleaseDates,
  tmdbKeywords,
  tmdbImages,
} from "../tmdb/types";
import type { Document } from "payload/types";
import type { Endpoint } from "./types";
import { ageRatingAges } from "../../collections/Movies";
import { themoviedb } from "../tmdb";

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
 * find an item by name or create it if it doesn't exist
 * @param collection slug of the collection, it needs to have a field "name"
 * @param name name of the item
 * @param payload Payload instance
 * @param locale locale in which the name should be checked
 * @returns the created or found doc
 */
export async function createOrFindItemByName(collection: 'genres', name: string, payload: Payload, locale?: string): Promise<Genre>;
export async function createOrFindItemByName(collection: 'persons', name: string, payload: Payload, locale?: string): Promise<Person>;
export async function createOrFindItemByName(collection: 'companies', name: string, payload: Payload, locale?: string): Promise<Company>;
export async function createOrFindItemByName(
  collection: keyof Config['collections'], name: string, payload: Payload, locale?: string
): Promise<Document> {
  if (!payload.collections[collection].config.fields.find(field => 'name' in field && field.name === 'name')) {
    throw new Error(`Collection ${collection} does not have a field "name"`);
  }
  // find the item
  let item;
  try {
    item = (await payload.find({
      collection,
      where: {
        name: {
          like: name,
        },
      },
      locale,
    }))?.docs[0]
    
    if (!item) {
      throw new Error('not found')
    }
  } catch (_) {
    // ok, we didn't find it, let's create it
    try {
      return await payload.create({
        collection,
        data: {
          // @ts-expect-error
          name,
        },
        locale,
      });
    } catch (err) {
      throw new Error(`Could neither find or create ${collection} item ${name} (${err})`);
    }
  }
  return item;
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