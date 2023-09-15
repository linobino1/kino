import type { Movie, Person } from "payload/generated-types";
import type { tmdbPerson } from "../../tmdb/types";
import { getTmdbData } from "../helpers";
import type { MigrationFunction } from "../types";

export const migrateCredits: MigrationFunction = async ({
  payload, movie, warnings,
}) => {
  if (!movie.tmdbId) throw new Error('Cannot migrate credits without tmdbId');

  const data = await getTmdbData('credits', movie.tmdbId);

  // cast
  const cast: Person[] = [];
  await Promise.all(
    data.cast.map(async (person: tmdbPerson) => {
      let doc: Person;

      // try to create person
      try {
        doc = await payload.create({
          collection: 'persons',
          data: {
            name: person.name,
          },
        });
      } catch (err) {
        // could not be created, try to find it
        doc = (await payload.find({
          collection: 'persons',
          where: {
            name: {
              equals: person.name,
            },
          },
          limit: 1,
        })).docs[0];
      }
      if (!doc) warnings.push(new Error(`Could neither find or create person ${person.name}`));
      cast.push(doc);
    })
  );

  // crew and directors
  const crew: Movie['crew'] = [];
  const directors: Person[] = [];
  await Promise.all(
    data.crew.map(async (person: tmdbPerson) => {
      let doc: Person;

      // try to create person
      try {
        doc = await payload.create({
          collection: 'persons',
          data: {
            name: person.name,
          },
        });
      } catch (err) {
        // could not be created, try to find it
        doc = (await payload.find({
          collection: 'persons',
          where: {
            name: {
              equals: person.name,
            },
          },
          limit: 1,
        })).docs[0];
      }
      
      if (!doc) warnings.push(new Error(`Could neither find or create person ${person.name}`));
      crew.push({
        person: doc,
        role: person.job, 
      });
      if (person.job === 'Director') directors.push(doc);
    })
  );

  // update movie
  await payload.update({
    collection: 'movies',
    id: movie.id,
    data: {
      cast,
      crew,
      directors,
    },
  });
}