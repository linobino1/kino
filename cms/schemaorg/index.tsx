import React from "react";
import type { FilmPrint, Genre, Media, Movie, Person, Screening } from "payload/generated-types";
import type { ItemList, Movie as SchemaOrgMovie, ScreeningEvent, Thing, WithContext } from "schema-dts";

export const movieMarkup = (movie: Movie): SchemaOrgMovie => {
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

export const screeningMarkup = (screening: Screening): ScreeningEvent => ({
  '@type': 'ScreeningEvent',
  name: screening.title,
  startDate: screening.date,
  workPresented: movieMarkup((screening.featureFilms[0] as FilmPrint).movie as Movie),
});

export const screeningsListMarkup = (screenings: Screening[]): ItemList => {
  return {
    '@type': 'ItemList',
    itemListElement: screenings.map((screening) => screeningMarkup(screening)),
  };
}

export function addContext<T extends Thing>(json: T): WithContext<T> {
  const jsonWithContext = json as WithContext<T>;
  jsonWithContext["@context"] = "https://schema.org";
  return jsonWithContext;
}
export function JsonLd<T extends Thing>(data: T): React.ReactNode {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(addContext(data))}} />
  );
}