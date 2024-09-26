import type { MigrationFunction } from "../types";
import { getTmdbData } from "../helpers";

export const migrateKeywords: MigrationFunction = async ({
  payload,
  movie,
}) => {
  if (!movie.tmdbId) throw new Error("Cannot migrate credits without tmdbId");

  const data = await getTmdbData("keywords", movie.tmdbId);

  // update movie
  await payload.update({
    collection: "movies",
    id: movie.id,
    data: {
      tags: data.keywords.map((keyword) => keyword.name).join(", "),
    },
    draft: true,
  });
};
