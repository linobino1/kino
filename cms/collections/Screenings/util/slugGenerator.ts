import type { slugGeneratorArgs } from "../../../plugins/addSlugField";
import type { Movie } from "payload/generated-types";

export const slugGenerator = async ({ data, req }: slugGeneratorArgs) => {
  // we need the date and at least one film
  if (
    !data ||
    !("date" in data) ||
    !("films" in data) ||
    !data.films.length ||
    !("filmprint" in data.films[0])
  ) {
    return undefined;
  }

  // date is an ISO string, let's just use the first 10 characters (YYYY-MM-DD)
  const date = data.date.substr(0, 10);

  // movie is just an id
  const filmPrint = await req.payload.findByID({
    collection: "filmPrints",
    id: data.films[0].filmprint,
    locale: req.payload.config.i18n.fallbackLng as string,
    depth: 2,
  });

  // if we cannot find the movie title we abort
  if (!filmPrint || !filmPrint.movie) return undefined;

  // e.g. My Movie-2021-01-01-
  return `${(filmPrint.movie as Movie)?.internationalTitle}-${date}`;
};
