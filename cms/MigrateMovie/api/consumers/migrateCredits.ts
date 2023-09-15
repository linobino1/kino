import type { Person } from "payload/generated-types";
import type { tmdbPerson } from "../../tmdb/types";
import { createOrFindItemByName, getTmdbData } from "../helpers";
import type { MigrationFunction } from "../types";

export const migrateCredits: MigrationFunction = async ({
  payload, movie,
}) => {
  if (!movie.tmdbId) throw new Error('Cannot migrate credits without tmdbId');

  const data = await getTmdbData('credits', movie.tmdbId);

  // create cast
  const cast = (await Promise.all(
    data.cast.map(async (person: tmdbPerson) => (
      createOrFindItemByName('persons', person.name, payload)
    )
  ))).map((person: Person) => person.id);

  // create crew
  const crew = await Promise.all(
    data.crew.map(async (person: tmdbPerson) => ({
      role: person.job, 
      person: (await createOrFindItemByName('persons', person.name, payload)).id,
    }))
  );
  
  // create directors
  const directors = (await Promise.all(
    data.crew.filter((person) => person.job === 'Director').map(async (person: tmdbPerson) => (
      createOrFindItemByName('persons', person.name, payload)
    )
  ))).map((person: Person) => person.id);
  
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