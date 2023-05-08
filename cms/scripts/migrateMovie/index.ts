import path from "path";
import os from "os";
import fs from "fs";
import { themoviedb } from "./api";
import { slugFormat } from "../../fields/slug";
import { fixedT } from "../../i18n";
import type { Payload } from "payload";
import type { Movie, Poster, Still, Person } from "payload/generated-types";
import type {
  tmdbPerson,
  tmdbPreview,
} from "./api";
import { tmdbLng } from "./config";
import {
  getLocalMovie,
  getTmdbMovie,
  createOrFindGenre,
  updateOrCreateImage,
  downloadTmdbImage,
  addGenreTranslation,
  getTmdbCredits,
  createOrFindPerson,
} from "./helpers";

export interface PreviewBody {
  tmdbId: number;
  locale: string;
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
  const genre = await createOrFindGenre(data.genres[0].name, payload);
  
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
  let poster: Poster, still: Still;
  try {
    poster = await updateOrCreateImage(body.images.poster, 'posters', filePoster, payload);
    still = await updateOrCreateImage(body.images.backdrop, 'stills', fileBackdrop, payload);
  } catch (err) {
    throw new Error('Unable to create poster or still');
  }
  
  // create cast & directors
  const credits = await getTmdbCredits(tmdbId);
  const cast = credits.cast.map(async (person: tmdbPerson) => (
    await createOrFindPerson(person.name, payload)
  ));
  const directors = credits.crew.filter((person) => person.job === 'Director').map(async (person: tmdbPerson) => (
    await createOrFindPerson(person.name, payload)
  ));
  
  // create movie
  try {
    movie = await payload.create({
      collection: 'movies',
      // @ts-ignore
      data: {
        originalTitle: data.original_title,
        title: data.title,
        synopsis: data.overview,
        year: parseInt(data.release_date?.split('-')[0]),
        countries: data.production_countries.map((country: any) => country.iso_3166_1.toLowerCase()),
        slug: slugFormat(data.original_title),
        tmdbId: data.id,
        isHfgProduction: false,
        genre: genre.id,
        poster: poster.id,
        still: still.id,
        cast: (await Promise.all(cast)).map((person: Person) => person.id),
        directors: (await Promise.all(directors)).map((person: Person) => person.id),
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
    await addGenreTranslation(genre.id, data.genres[0].name, language, payload);
  }
  
  return movie;
}

export default migrateMovie;
