import https from "https";
import fs from "fs";
import type { Genre, Person } from "payload/generated-types";
import type { Payload } from "payload";
import { themoviedb } from "./api";
import { tmdbMediaUrl } from "./config";
import type { Movie, Media } from "payload/generated-types";
import type {
  tmdbCredits,
  tmdbMovie,
  tmdbReleaseDatesResponse,
} from "./api";
import { ageRatingAges } from "../../collections/Movies";
import type { Document } from "payload/types";
import type { Config } from "payload/generated-types";
import type { Company } from "payload/generated-types";

/**
 * find the movie in our database
 * @param tmdbId the movie id from themoviedb.org
 * @param payload Payload instance
 */
export const getLocalMovie = async (tmdbId: number, payload: Payload): Promise<Movie> => {
  return (await payload.find({
    collection: 'movies',
    where: {
      tmdbId: {
        equals: tmdbId,
      },
    },
  }))?.docs[0];
}

/**
 * get the movie details from themoviedb.org
 * @param tmdbId id of the movie on themoviedb.org
 * @param language response language
 * @returns the API response
 */
export const getTmdbMovie = async (tmdbId: number, language: string): Promise<tmdbMovie> => {
  let data;
  try {
    const res = await themoviedb.get(`/movie/${tmdbId}`, {
      params: {
        language,
      },
    });
    data = JSON.parse(res?.data);
  } catch (err) {
    throw new Error('Unable to get themoviedb response for movie');
  }
  if (!data || data.success === false) {
    throw new Error(`Movie ${tmdbId} not found`);
  }
  return data
};

/**
 * get the movie credits from themoviedb.org
 * @param tmdbId id of the movie on themoviedb.org
 * @returns the API response
 */
export const getTmdbCredits = async (tmdbId: number): Promise<tmdbCredits> => {
  let data;
  try {
    const res = await themoviedb.get(`/movie/${tmdbId}/credits`);
    data = JSON.parse(res?.data);
  } catch (err) {
    throw new Error('Unable to get themoviedb response for credits');
  }
  if (!data || data.success === false) {
    throw new Error(`Movie ${tmdbId} not found`);
  }
  return data
};

/**
 * get the movie release dates from themoviedb.org, used to get the age rating
 * @param tmdbId id of the movie on themoviedb.org
 * @returns the API response
 */
export const getTmdbReleaseDates = async (tmdbId: number): Promise<tmdbReleaseDatesResponse> => {
  let data;
  try {
    const res = await themoviedb.get(`/movie/${tmdbId}/release_dates`);
    data = JSON.parse(res?.data);
  } catch (err) {
    throw new Error('Unable to get themoviedb response for release dates');
  }
  if (!data || data.success === false) {
    throw new Error(`Movie ${tmdbId} not found`);
  }
  return data
};

/**
 * download an image from themoviedb.org
 * @param tmdbFilepath necessary to identify the image on themoviedb.org
 * @param target target filepath
 * @param size image dimensions
 */
export const downloadTmdbImage = async (tmdbFilepath: string, target: string, size: 'original' | 'w500') => {  
  await new Promise((resolve, reject) => {
    const url = `${tmdbMediaUrl}/t/p/${size}/${tmdbFilepath}`;

    https.get(url, response => {
      const code = response.statusCode ?? 0
      if (code >= 300) {  // we don't do redirects
        return reject(new Error(response.statusMessage))
      }

      // save the file to disk
      const fileWriter = fs
        .createWriteStream(target)
        .on('finish', () => {
          resolve({})
        })

      response.pipe(fileWriter)
    }).on('error', error => {
      reject(error)
    })
  })
}

/**
 * update or create a poster or still
 * @param tmdbFilepath the filepath of the image on themoviedb.org (acts as an id)
 * @param collection slug of Poster or Still collection
 * @param filePath path of the image to be uploaded
 * @param payload Payload instance
 * @returns Image instance
 */
export async function updateOrCreateImage(tmdbFilepath: string, filePath: string, payload: Payload): Promise<Media> {
  let image: Media = (await payload.find({
    collection: 'media',
    where: {
      tmdbFilepath: {
        equals: tmdbFilepath,
      },
    }
  })).docs[0];
  if (image) {
    return await payload.update({
      collection: 'media',
      id: image.id,
      filePath,
      data: {},
    });
  }
  return await payload.create({
    collection: 'media',
    filePath,
    data: {
      tmdbFilepath,
    },
  });
}

/**
 * find an item by name or create it if it doesn't exist
 * @param collection slug of the collection, it needs to have a field "name"
 * @param name name of the item
 * @param payload Payload instance
 * @returns the created or found doc
 */
export async function createOrFindItemByName(collection: 'genres', name: string, payload: Payload): Promise<Genre>;
export async function createOrFindItemByName(collection: 'persons', name: string, payload: Payload): Promise<Person>;
export async function createOrFindItemByName(collection: 'companies', name: string, payload: Payload): Promise<Company>;
export async function createOrFindItemByName(
  collection: keyof Config['collections'], name: string, payload: Payload
): Promise<Document> {
  if (!payload.collections[collection].config.fields.find(field => 'name' in field && field.name === 'name')) {
    throw new Error(`Collection ${collection} does not have a field "name"`);
  }
  // try to create the item
  try {
    return await payload.create({
      collection,
      data: {
        // @ts-expect-error
        name,
      },
    });
  } catch (err) {
    // try to find the item
    const item = (await payload.find({
      collection,
      where: {
        name: {
          like: name,
        },
      },
    }))?.docs[0]
    if (!item) {
      throw new Error(`Could neither find or create ${collection} item ${name} (${err})`);
    }
    return item
  }
}

/**
 * 
 * @param tmdbId id of the movie on themoviedb.org
 * @returns string | undefined age certification of the latest release in germany
 */
export async function getReleaseDates(tmdbId: number): Promise<Movie['ageRating'] | undefined> {
  const data = await getTmdbReleaseDates(tmdbId);
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