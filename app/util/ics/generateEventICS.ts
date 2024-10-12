import * as ics from "ics";
import type { Event, Location } from "payload/generated-types";

export const generateEventICS = (event: Event) => {
  const attributes: ics.EventAttributes = {
    uid: event.id,
    title: event.title as string,
    start: new Date(event.date).getTime(),
    duration: { hours: 2 },
    location: (event.location as Location).name ?? undefined,
    url: event.url,
  };
  const { error, value } = ics.createEvent(attributes);

  if (error) {
    throw error;
  }

  return value;
};
