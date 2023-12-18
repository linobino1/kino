import { parseISO } from "date-fns";
import type {
  FilmPrint,
  Movie,
  Screening,
  Site,
} from "payload/generated-types";
import type { ItemList, ScreeningEvent } from "schema-dts";
import { locationSchema } from "./location";
import { movieSchema } from "./movie";
import { itemList } from ".";

export const screeningSchema = (
  screening: Screening,
  site: Site
): ScreeningEvent => {
  const movie = (screening.films[0].filmprint as FilmPrint).movie as Movie;
  return {
    "@type": "ScreeningEvent",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    name: screening.title as string,
    startDate: screening.date,
    endDate: new Date(
      parseISO(screening.date).getTime() + movie.duration * 60 * 1000
    ).toISOString(),
    location: locationSchema(site),
    workPresented: movieSchema(movie),
  };
};

export const screeningsListSchema = (
  screenings: Screening[],
  site: Site
): ItemList => {
  return itemList(screenings.map((s) => screeningSchema(s, site)));
};
