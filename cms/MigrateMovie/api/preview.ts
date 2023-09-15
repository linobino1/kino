import type { PreviewFunction } from "./types";
import { fixedT } from "../../i18n";
import { tmdbLng } from "../tmdb";
import { getTmdbData } from "./helpers";

/**
 * Check if movie exists in database, if not fetch it from themoviedb.org
 * @param body { tmdbId: number, locale: string }
 * @param payload Payload instance
 * @returns tmdbPreview the movie details and images from themoviedb.org
 */
export const preview: PreviewFunction = async ({
  payload, tmdbId, locale,
}) => {
  // check if movie has already been created
  let doc = (await payload.find({
    collection: 'movies',
    where: {
      tmdbId: {
        equals: tmdbId,
      },
    },
    depth: 0,
  })).docs[0];
  if (doc) {
    throw new Error(
      fixedT('MovieExists', locale, { title: doc.originalTitle, id: doc.id }));
  }
  
  // fetch movie details from TMDB in their default language
  const movie = await getTmdbData('movie', tmdbId, tmdbLng);
  
  // fetch images
  const images = await getTmdbData('images', tmdbId);
  
  return {
    movie,
    images,
  }
}