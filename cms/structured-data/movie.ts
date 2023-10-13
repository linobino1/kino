import type { Genre, Media, Movie, Person } from "payload/generated-types";
import type { Movie as SchemaOrgMovie } from "schema-dts";

export const movieSchema = (movie: Movie): SchemaOrgMovie => {
  const res: SchemaOrgMovie = {
    "@type": "Movie",
    name: movie.title,
    description: movie.synopsis,
    image: movie.poster && encodeURI((movie.poster as Media).url as string),
    duration: `PT${movie.duration}M`,
    dateCreated: movie.year.toString(),
  };
  if (movie.directors.length) {
    res.director = (movie.directors[0] as Person).name;
  }
  if (movie.genres.length) {
    res.genre = (movie.genres[0] as Genre).name;
  }
  return res;
}
