import { themoviedb } from "../tmdb";
import { fixedT } from "../../i18n";
import type { Payload } from "payload";
import { tmdbLng } from "../tmdb";
import {
  getLocalMovie,
  getTmdbMovie,
} from "./helpers";
import type {
  PreviewBody,
  tmdbPreview,
} from "./types";

/**
 * Check if movie exists in database, if not fetch it from themoviedb.org
 * @param body { tmdbId: number, locale: string }
 * @param payload Payload instance
 * @returns tmdbPreview the movie details and images from themoviedb.org
 */
export const preview = async (body: PreviewBody, payload: Payload): Promise<tmdbPreview> => {
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