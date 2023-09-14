import path from "path";
import os from "os";
import fs from "fs";
import { fixedT } from "../../i18n";
import type { Media, Person, Company, Genre } from "payload/generated-types";
import type {
  tmdbPerson,
  tmdbCompany,
} from "../tmdb/types";
import { tmdbLng } from "../tmdb";
import {
  getLocalMovie,
  getTmdbMovie,
  updateOrCreateImage,
  getTmdbCredits,
  getReleaseDates,
  createOrFindItemByName,
  getTmdbVideos,
} from "./helpers";
import type { MigrateFunction } from "./types";
import { slugFormat } from "../../plugins/addSlugField";

/**
 * Create a movie in database from themoviedb.org data and user selected images 
 * @param body { tmdbId: number, locale: string, images: { poster: string, backdrop: string } }
 * @param payload Payload instance
 * @returns Movie the created movie
 */
export const migrate: MigrateFunction = async (body, payload) => {
  const { tmdbId, locale } = body;
  const warnings: Error[] = [];

  // check if movie has already been created
  let movie = await getLocalMovie(tmdbId, payload);
  if (movie) {
    throw new Error(
      fixedT('MovieExists', locale, { title: movie.internationalTitle, id: movie.id }));
  }
  
  // fetch movie details from TMDB in default language
  const language = payload.config.i18n.fallbackLng as string;
  let tmdb = await getTmdbMovie(tmdbId, language);
  
  // slug (used for images, the movies slug will be created later)
  const slug = slugFormat(tmdb.title);

  // find or create genre
  let genre: Genre | undefined;
  try {
    genre = await createOrFindItemByName('genres', tmdb.genres[0].name, payload, language);
  } catch (err) {
    warnings.push(new Error(`Unable to create genre (${err})`));
  }
  
  // create temp directory for images
  let tmpDir;
  try {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'tmdb-migrate-images-'));
  } catch (err) {
    throw new Error('Unable to create temp directory for images');
  }

  // find or create poster
  let poster: Media | undefined, still: Media | undefined;
  try {
    poster = await updateOrCreateImage(
      body.images.poster,
      'w500',
      path.join(tmpDir, `${slug}-poster.jpg`),
      payload
    );
  } catch (err) {
    warnings.push(new Error(`Unable to create poster (${err})`));
  }

  // find or create still
  try {  
    still = await updateOrCreateImage(
      body.images.backdrop,
      'original',
      path.join(tmpDir, `${slug}-backdrop.jpg`),
      payload
    );
  } catch (err) {
    warnings.push(new Error(`Unable to create still (${err})`));
  }
  
  // create cast
  const credits = await getTmdbCredits(tmdbId);
  const cast = (await Promise.all(
    credits.cast.map(async (person: tmdbPerson) => (
      createOrFindItemByName('persons', person.name, payload)
    )
  ))).map((person: Person) => person.id);

  // create crew
  const crew = await Promise.all(
    credits.crew.map(async (person: tmdbPerson) => ({
      role: person.job, 
      person: (await createOrFindItemByName('persons', person.name, payload)).id,
    }))
  );
  
  // create directors
  const directors = (await Promise.all(
    credits.crew.filter((person) => person.job === 'Director').map(async (person: tmdbPerson) => (
      createOrFindItemByName('persons', person.name, payload)
    )
  ))).map((person: Person) => person.id);
  
  // create production companies
  const productionCompanies = (await Promise.all(
    tmdb.production_companies.map(async (company: tmdbCompany) => (
      createOrFindItemByName('companies', company.name, payload)
    )
  ))).map((company: Company) => company.id);
  
  // get release date and age restriction
  const ageRating = await getReleaseDates(tmdbId) || '';
  
  // get trailer URL
  const videos = await getTmdbVideos(tmdbId);
  const tmdbTrailer = videos.results.find((video) => (
    video.type === 'Trailer' && video.site === 'YouTube'
  ))?.key;
  const trailer = tmdbTrailer ? `https://www.youtube.com/watch?v=${tmdbTrailer}` : undefined;
  
  // create movie
  try {
    movie = await payload.create({
      collection: 'movies',
      data: {
        originalTitle: tmdb.original_title,
        title: tmdb.title,
        internationalTitle: tmdb.title,
        synopsis: tmdb.overview,
        year: parseInt(tmdb.release_date?.split('-')[0]),
        countries: tmdb.production_countries.map((country: any) => country.iso_3166_1.toUpperCase()),
        tmdbId: tmdb.id,
        isHfgProduction: false,
        cast,
        directors,
        crew,
        productionCompanies,
        duration: tmdb.runtime,
        ageRating,
        trailer,
        genre: genre?.id || '',
        poster: poster?.id || '',
        still: still?.id || '',
      },
      draft: true,
      locale: tmdbLng,
    });
  } catch (err) {
    throw new Error(`Unable to create movie (${err})`);
  }

  // add translations
  for (const language of payload.config.i18n.supportedLngs as []) {
    // we already have the default language...
    if (language === tmdbLng) { continue; }
    
    // fetch movie details from TMDB in language
    let data = await getTmdbMovie(tmdbId, language);

    // update movie title, synopsis
    await payload.update({
      collection: 'movies',
      id: movie.id,
      data: {
        title: data.title,
        synopsis: data.overview,
      },
      locale: language,
      draft: true,
    });
    
    // add genre name
    // IDEA: let's hope the genres are sorted the same way in all languages
    if (genre) {
      try {
        await payload.update({
          collection: 'genres',
          id: genre.id,
          data: {
            name: data.genres[0].name,
          },
          locale: language,
        });
      } catch (err) {
        warnings.push(new Error(`Unable to update genre (${err})`));
      }
    }
  }
  
  return {
    movie,
    warnings,
  }
}

export default migrate;
