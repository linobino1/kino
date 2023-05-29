import path from "path";
import os from "os";
import fs from "fs";
import { themoviedb } from "./api";
import { slugFormat } from "../../fields/slug";
import { fixedT } from "../../i18n";
import type { Payload } from "payload";
import type { Movie, Media, Person, Company } from "payload/generated-types";
import type {
  tmdbPerson,
  tmdbImages,
  tmdbMovie,
 tmdbCompany } from "./api";
import { tmdbLng } from "./config";
import {
  getLocalMovie,
  getTmdbMovie,
  updateOrCreateImage,
  downloadTmdbImage,
  getTmdbCredits,
  getReleaseDates,
  createOrFindItemByName,
} from "./helpers";

export interface PreviewBody {
  tmdbId: number;
  locale: string;
}

export interface tmdbPreview extends tmdbMovie {
  images: tmdbImages;
}

export interface MigrateBody extends PreviewBody {
  images: {
    poster: string;
    backdrop: string;
  };
}

/**
 * Check if movie exists in database, if not fetch it from themoviedb.org
 * @param body { tmdbId: number, locale: string }
 * @param payload Payload instance
 * @returns tmdbPreview the movie details and images from themoviedb.org
 */
export const previewMovie = async (body: PreviewBody, payload: Payload): Promise<tmdbPreview> => {
  const { tmdbId, locale } = body;

  // check if movie has already been created
  let movie = await getLocalMovie(tmdbId, payload);
  if (movie) {
    throw new Error(
      fixedT('MovieExists', locale, { title: movie.originalTitle, id: movie.id }));
  }
  
  // fetch movie details from TMDB in their default language
  let tmdbMovie = await getTmdbMovie(tmdbId, tmdbLng);
  
  // fetch images
  let tmdbImages;
  try {
    const res = await themoviedb.get(`/movie/${tmdbId}/images`);
    tmdbImages = JSON.parse(res?.data);
  } catch (err) {
    throw new Error('Unable to get themoviedb images response');
  }
  if (!tmdbImages || tmdbImages.success === false) {
    throw new Error(`Images of ${tmdbMovie.original_title} not found`);
  }
  
  const data: Partial<tmdbPreview> = tmdbMovie;
  data.images = tmdbImages;
  return {...tmdbMovie, ...tmdbImages}
}

/**
 * Create a movie in database from themoviedb.org data and user selected images 
 * @param body MigrateBody { tmdbId: number, locale: string, images: { poster: string, backdrop: string } }
 * @param payload Payload instance
 * @returns Movie the created movie
 */
export const migrateMovie = async (body: MigrateBody, payload: Payload): Promise<Movie> => {
  const { tmdbId, locale } = body;

  // check if movie has already been created
  let movie = await getLocalMovie(tmdbId, payload);
  if (movie) {
    throw new Error(
      fixedT('MovieExists', locale, { title: movie.originalTitle, id: movie.id }));
  }
  
  // fetch movie details from TMDB in default language
  const language = payload.config.i18n.fallbackLng as string;
  let data = await getTmdbMovie(tmdbId, language);

  // find or create genre
  const genre = await createOrFindItemByName('genres', data.genres[0].name, payload);
  
  // create temp directory for images
  let tmpDir;
  try {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'tmdb-migrate-images-'));
  } catch (err) {
    throw new Error('Unable to create temp directory');
  }

  // download images
  const filePoster = path.join(tmpDir, `${data.original_title}-poster.jpg`);
  const fileBackdrop = path.join(tmpDir, `${data.original_title}-backdrop.jpg`);
  await Promise.all([
    downloadTmdbImage(
      body.images.poster,
      filePoster,
      'w500',
    ),
    downloadTmdbImage(
      body.images.backdrop,
      fileBackdrop,
      'original',
    ),
  ]);

  // find or create poster and still media
  let poster: Media, still: Media;
  try {
    poster = await updateOrCreateImage(body.images.poster, filePoster, payload);
    still = await updateOrCreateImage(body.images.backdrop, fileBackdrop, payload);
  } catch (err) {
    throw new Error('Unable to create poster or still');
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
    data.production_companies.map(async (company: tmdbCompany) => (
      createOrFindItemByName('companies', company.name, payload)
    )
  ))).map((company: Company) => company.id);
  
  // get release date and age restriction
  const ageRating = await getReleaseDates(tmdbId) || '';
  
  // create movie
  try {
    movie = await payload.create({
      collection: 'movies',
      data: {
        originalTitle: data.original_title,
        title: data.title,
        synopsis: data.overview,
        year: parseInt(data.release_date?.split('-')[0]),
        countries: data.production_countries.map((country: any) => country.iso_3166_1.toUpperCase()),
        slug: slugFormat(data.original_title),
        tmdbId: data.id,
        isHfgProduction: false,
        genre: genre.id,
        poster: poster.id,
        still: still.id,
        cast,
        directors,
        crew,
        productionCompanies,
        duration: data.runtime,
        ageRating,
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
    await payload.update({
      collection: 'genres',
      id: genre.id,
      data: {
        name: data.genres[0].name,
      },
      locale: language,
    });
  }
  
  return movie;
}

export default migrateMovie;
