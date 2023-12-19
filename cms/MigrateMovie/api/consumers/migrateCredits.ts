import type { Payload } from "payload";
import type { Job, Movie, Person } from "payload/generated-types";
import type { tmdbPerson } from "../../tmdb/types";
import { getTmdbData } from "../helpers";
import type { MigrationFunction } from "../types";
import { tmdbLng } from "../../tmdb";

export const migrateCredits: MigrationFunction = async ({
  payload,
  movie,
  warnings,
}) => {
  if (!(typeof movie.tmdbId === "number"))
    throw new Error("Cannot migrate credits without tmdbId");

  const data = await getTmdbData("credits", movie.tmdbId);

  // cast
  const cast: Person[] = [];
  await Promise.all(
    data.cast.map(async (person: tmdbPerson) => {
      let doc: Person;

      // try to create person
      try {
        doc = (await payload.create({
          collection: "persons",
          data: {
            name: person.name,
          },
        })) as unknown as Person;
      } catch (err) {
        // could not be created, try to find it
        doc = (
          await payload.find({
            collection: "persons",
            where: {
              name: {
                equals: person.name,
              },
            },
            limit: 1,
          })
        ).docs[0] as unknown as Person;
      }
      if (!doc)
        warnings.push(
          new Error(`Could neither find or create person ${person.name}`)
        );
      cast.push(doc);
    })
  );

  // crew and directors
  const crew: Movie["crew"] = [];
  const directors: Person[] = [];
  await Promise.all(
    data.crew.map(async (tmdbPerson: tmdbPerson) => {
      let person: Person;

      // try to create person
      try {
        person = (await payload.create({
          collection: "persons",
          data: {
            name: tmdbPerson.name,
          },
        })) as unknown as Person;
      } catch (err) {
        // could not be created, try to find it
        person = (
          await payload.find({
            collection: "persons",
            where: {
              name: {
                equals: tmdbPerson.name,
              },
            },
            limit: 1,
          })
        ).docs[0] as unknown as Person;
      }

      if (!person)
        warnings.push(
          new Error(`Could neither find or create person ${tmdbPerson.name}`)
        );

      // migrate job
      const job = await migrateJob(payload, warnings, tmdbPerson.job);

      crew.push({
        person,
        job,
      });

      // add to directors
      if (job?.name === "Director") directors.push(person);
    })
  );

  // update movie
  await payload.update({
    collection: "movies",
    id: movie.id,
    data: {
      cast,
      crew,
      directors,
    },
  });
};

/**
 * migrate or find a job from themoviedb.org data
 * @returns
 */
const migrateJob = async (
  payload: Payload,
  warnings: Error[],
  tmdbJob: tmdbPerson["job"]
): Promise<Job> => {
  let job: Job;

  // try to create job
  try {
    job = (await payload.create({
      collection: "jobs",
      data: {
        name: tmdbJob,
      },
      locale: tmdbLng,
    })) as unknown as Job;

    // HACK: we add the english name to all languages because jobs are not translated in themoviedb.org
    const fallbackLng = payload.config.i18n.fallbackLng as string;
    (payload.config.i18n.supportedLngs as []).forEach(async (lng) => {
      if (lng === fallbackLng) return; // we already have the default language...
      try {
        await payload.update({
          collection: "jobs",
          id: job.id,
          data: {
            name: tmdbJob,
          },
          locale: lng,
        });
      } catch (err) {
        warnings.push(
          new Error(`Could not add job name ${tmdbJob} to ${lng} version`)
        );
      }
    });
  } catch (err) {
    // could not be created, try to find it
    job = (
      await payload.find({
        collection: "jobs",
        where: {
          name: {
            equals: tmdbJob,
          },
        },
        locale: tmdbLng,
        limit: 1,
      })
    ).docs[0] as unknown as Job;
  }

  if (!job)
    warnings.push(new Error(`Could neither find or create job ${tmdbJob}`));

  return job;
};
