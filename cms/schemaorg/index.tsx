import React from "react";
import { parseISO } from 'date-fns';
import type { Country, FilmPrint, Genre, Media, Movie, Person, Screening, Site } from "payload/generated-types";
import type {
  ItemList,
  Movie as SchemaOrgMovie,
  ScreeningEvent,
  Thing,
  WithContext,
  MovieTheater
} from "schema-dts";

export const locationMarkup = (site: Site): MovieTheater => {
  return {
    "@type": "MovieTheater",
    name: site.location.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.location.street,
      addressCountry: (site.location.country as Country).id,
      addressRegion: site.location.region,
      addressLocality: site.location.city,
      postalCode: site.location.zip,
    },
  }
}

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

export const screeningMarkup = (screening: Screening, site: Site): ScreeningEvent => {
  const movie = (screening.featureFilms[0] as FilmPrint).movie as Movie;
  return {
    "@type": "Event",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    name: screening.title,
    startDate: screening.date,
    endDate: new Date(parseISO(screening.date).getTime() + (movie.duration * 60 * 1000)).toISOString(),
    location: locationMarkup(site),
    workPresented: movieMarkup(movie),
  };
};

export const screeningsListMarkup = (screenings: Screening[], site: Site): ItemList => {
  return {
    '@type': 'ItemList',
    itemListElement: screenings.map((screening) => screeningMarkup(screening, site)),
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