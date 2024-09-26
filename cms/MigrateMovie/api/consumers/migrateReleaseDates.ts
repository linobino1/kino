import type { Movie } from "payload/generated-types";
import type { MigrationFunction } from "../types";
import { getTmdbData } from "../helpers";
import { ageRatingAges } from "../../../collections/Movies";

export const migrateReleaseDates: MigrationFunction = async ({
  payload,
  movie,
}) => {
  if (!movie.tmdbId) throw new Error("Cannot migrate credits without tmdbId");

  const data = await getTmdbData("releaseDates", movie.tmdbId);

  // find release dates for germany
  const germany = data.results.find((country) => country.iso_3166_1 === "DE");
  if (!germany) {
    return undefined;
  }
  const { release_dates } = germany;

  // filter out age ratings we do not use
  release_dates.filter((release_date) => {
    return ageRatingAges
      .map((x) => `${x}`)
      .includes(release_date.certification);
  });

  // find the latest release
  release_dates.sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return dateB.getTime() - dateA.getTime();
  });

  const ageRating =
    (release_dates[0]?.["certification"] as Movie["ageRating"]) || undefined;

  // update movie
  await payload.update({
    collection: "movies",
    id: movie.id,
    data: {
      ageRating,
    },
    draft: true,
  });
};
