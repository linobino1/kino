import type { Job, Person } from '@/payload-types'
import type { MigrationFunction } from './types'
import { tmdbFetch } from '@/third-party/tmdb/tmdbFetch'
import type { tmdbPerson } from '@/third-party/tmdb/types'
import { defaultLanguage } from '@/third-party/tmdb'
import { findOrCreateDoc } from '@/util/findOrCreateDoc'
import { updateDocInAllLocales } from '@/util/updateDocInAllLocales'

export const migrateCredits: MigrationFunction = async ({ payload, movie, warnings }) => {
  if (!(typeof movie.tmdbId === 'number')) throw new Error('Cannot migrate credits without tmdbId')

  const data = await tmdbFetch('credits', movie.tmdbId)

  // cast
  const cast: string[] = []
  for await (const castMember of data.cast as tmdbPerson[]) {
    try {
      const doc = (
        await findOrCreateDoc({
          collection: 'persons',
          data: {
            name: castMember.name,
          },
          payload,
          where: {
            name: {
              equals: castMember.name,
            },
          },
        })
      ).doc
      cast.push(doc.id)
    } catch {
      warnings.push(new Error(`Could neither find or create cast member ${castMember.name}`))
    }
  }
  // console.log(`migrated ${cast.length} / ${data.cast.length} cast members`)

  // crew and directors
  const crew: { job: string; person: string }[] = []
  const directors: string[] = []
  for await (const crewMember of data.crew as tmdbPerson[]) {
    let person: Person | undefined
    try {
      person = (
        await findOrCreateDoc({
          collection: 'persons',
          data: {
            name: crewMember.name,
          },
          payload,
          where: {
            name: {
              equals: crewMember.name,
            },
          },
        })
      ).doc

      // is this a director?
      if (['Director', 'director'].includes(crewMember.job)) directors.push(person.id)
    } catch {
      warnings.push(
        new Error(
          `Could not create crew member because person '${crewMember.name}' could not be found or created`,
        ),
      )
      return
    }

    let job: Job | undefined
    try {
      const { doc, wasCreated } = await findOrCreateDoc({
        collection: 'jobs',
        data: {
          name: crewMember.job,
        },
        payload,
        where: {
          name: {
            like: crewMember.job,
          },
        },
        locale: defaultLanguage,
      })
      job = doc

      if (wasCreated) {
        // HACK: we add the english name to all languages because jobs are not translated in themoviedb.org
        await updateDocInAllLocales({
          collection: 'jobs',
          id: job.id,
          data: {
            name: crewMember.job,
          },
          payload,
        })
      }
    } catch {
      warnings.push(
        new Error(
          `Could not create crew item because job '${crewMember.job}' could not be found or created`,
        ),
      )
      return
    }

    crew.push({
      person: person.id,
      job: job.id,
    })
  }
  // console.log(`migrated ${crew.length} / ${data.crew.length} crew members`)

  // update movie
  await payload.update({
    collection: 'movies',
    id: movie.id,
    data: {
      cast,
      crew,
      directors,
    },
    draft: true,
  })
}
