import https from "https";
import fs from "fs";
import type { Genre, Person } from "payload/generated-types";
import type { Payload } from "payload";
import { themoviedb } from "./api";
import { tmdbLng, tmdbMediaUrl } from "./config";
import type { Movie, Poster, Still } from "payload/generated-types";
import type {
  tmdbCredits,
  tmdbMovie,
} from "./api";

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
    throw new Error('Unable to get themoviedb response');
  }
  if (!data || data.success === false) {
    throw new Error(`Movie ${tmdbId} not found`);
  }
  return data
};

export const getTmdbCredits = async (tmdbId: number): Promise<tmdbCredits> => {
  let data;
  try {
    const res = await themoviedb.get(`/movie/${tmdbId}/credits`);
    data = JSON.parse(res?.data);
  } catch (err) {
    throw new Error('Unable to get themoviedb response');
  }
  if (!data || data.success === false) {
    throw new Error(`Movie ${tmdbId} not found`);
  }
  return data
};

export const downloadTmdbImage = async (tmdbFilepath: string, target: string, size: 'original' | 'w500') => {  
  return await new Promise((resolve, reject) => {
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
export async function updateOrCreateImage(tmdbFilepath: string, collection: 'posters', filePath: string, payload: Payload): Promise<Poster>;
export async function updateOrCreateImage(tmdbFilepath: string, collection: 'stills', filePath: string, payload: Payload): Promise<Still>;
export async function updateOrCreateImage(tmdbFilepath: string, collection: 'stills' | 'posters', filePath: string, payload: Payload): Promise<Poster | Still> {
  let image: Poster | Still = (await payload.find({
    collection: collection,
    where: {
      tmdbFilepath: {
        equals: tmdbFilepath,
      },
    }
  })).docs[0];
  if (image) {
    return await payload.update({
      collection: collection,
      id: image.id,
      filePath,
      data: {},
    });
  }
  return await payload.create({
    collection: collection,
    filePath,
    data: {
      tmdbFilepath,
    },
  });
}

export async function createOrFindGenre(name: string, payload: Payload): Promise<Genre> {
  let genre = (await payload.find({
    collection: 'genres',
    where: {
      name: {
        like: name,
      },
    },
    locale: tmdbLng,
  }))?.docs[0] || null;
  if (!genre) {
    try {
      genre = await payload.create({
        collection: 'genres',
        data: {
          name,
        },
        locale: tmdbLng,
      });
    } catch (err) {
      throw new Error(`Unable to create genre ${name} (${err})`);
    }
  }
  return genre
}

export async function addGenreTranslation(id: string, name: string, language: string, payload: Payload): Promise<Genre> {
  return await payload.update({
    collection: 'genres',
    id,
    data: {
      name,
    },
    locale: language,
  });
}

export async function createOrFindPerson(name: string, payload: Payload): Promise<Person> {
  let person = (await payload.find({
    collection: 'persons',
    where: {
      name: {
        like: name,
      },
    },
  }))?.docs[0] || null;
  if (!person) {
    try {
      person = await payload.create({
        collection: 'persons',
        data: {
          name,
        },
      });
    } catch (err) {
      throw new Error(`Unable to create person ${name} (${err})`);
    }
  }
  return person  
}