import type { MigrateFunction, MigratedMovie } from "./types";
import { migrateMovie } from "./consumers/migrateMovie";
import { migrateCredits } from "./consumers/migrateCredits";
import { migrateReleaseDates } from "./consumers/migrateReleaseDates";
import { migrateVideos } from "./consumers/migrateVideos";
import { migrateKeywords } from "./consumers/migrateKeywords";
import { migrateImages } from "./consumers/migrateImages";


/**
 * Create a movie in database from themoviedb.org data and user selected images 
 * @returns the created movie
 */
export const migrate: MigrateFunction = async ({
  images, payload, tmdbId,
}) => {
  const warnings: Error[] = [];

  // migrate base data
  let movie: MigratedMovie | undefined;
  try {
    movie = await migrateMovie(payload, tmdbId);
  } catch (err) {
    throw new Error(`Unable to create movie (${err})`);
  }
  
  if (!movie) throw new Error('Unable to create movie');

  const context = {
    payload,
    movie,
    warnings,
  }
  
  // migrate data from the various endpoints of themoviedb.org
  // any errors will be added to warnings
  try {
    await Promise.all([
      migrateCredits(context),
      migrateReleaseDates(context),
      migrateVideos(context),
      migrateKeywords(context),
      migrateImages(context, images),
    ]);
  } catch (err) {
    if (err instanceof Error) {
      warnings.push(err);
    } else {
      throw new Error(`Unknown migration error (${err})`);
    }
  }
  
  return {
    movie,
    warnings,
  }
}

export default migrate;
