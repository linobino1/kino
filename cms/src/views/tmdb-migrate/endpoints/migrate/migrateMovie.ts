import type { Genre, Company } from '@/payload-types'
import type { Payload } from 'payload'
import { tmdbCompany, tmdbMovie } from '../../api/types'
import { MigratedMovie } from './types'
import { tmdbFetch } from '../../api/tmdbFetch'
import { defaultLanguage } from '../../api'
import { locales } from 'shared/config'

export const migrateMovie = async (
  payload: Payload,
  tmdbId: number,
  warnings: Error[],
): Promise<MigratedMovie> => {
  const data = await tmdbFetch('movie', tmdbId, defaultLanguage)

  // create genres
  let genres: string[] = []
  await Promise.all(
    data.genres.map(async (genre: any) => {
      genres.push((await migrateGenre(payload, tmdbId, warnings, genre)).id)
    }),
  )

  // create production companies
  let productionCompanies: string[] = []
  await Promise.all(
    data.production_companies.map(async (company: tmdbCompany) => {
      let doc: Company

      // try to create company
      try {
        doc = (await payload.create({
          collection: 'companies',
          data: {
            name: company.name,
          },
          locale: defaultLanguage,
        })) as unknown as Company
      } catch (err) {
        // could not be created, try to find it
        doc = (
          await payload.find({
            collection: 'companies',
            where: {
              name: {
                equals: company.name,
              },
            },
            locale: defaultLanguage,
            limit: 1,
          })
        ).docs[0] as unknown as Company
      }

      if (doc) {
        productionCompanies.push(doc.id)
      } else {
        warnings.push(new Error(`Could neither find or create production company ${company.name}`))
      }
    }),
  )

  let movie = await payload.create({
    collection: 'movies',
    draft: true,
    // @ts-ignore data is partial, that is ok because draft is true
    data: {
      originalTitle: data.original_title,
      title: data.title,
      internationalTitle: data.title,
      isHfgProduction: false,
      synopsis: data.overview,
      year: parseInt(data.release_date?.split('-')[0] || '0') ?? undefined,
      countries: data.production_countries.map((country: any) => country.iso_3166_1.toUpperCase()),
      tmdbId: data.id,
      duration: data.runtime,
      genres,
      productionCompanies,
    },
    locale: defaultLanguage,
  })

  if (!movie) throw new Error('Unable to create movie')

  // add translations
  for (const locale of locales) {
    if (locale === defaultLanguage) continue // we already have the default language...

    // fetch movie details from TMDB in language
    let dataTranslated = await tmdbFetch('movie', tmdbId, locale)

    // title & synopsis
    await payload.update({
      collection: 'movies',
      id: movie.id,
      draft: true,
      locale: locale,
      data: {
        title: dataTranslated.title,
        synopsis: dataTranslated.overview,
      },
    })
  }

  return movie as unknown as MigratedMovie
}

/**
 * migrate or find a genre from themoviedb.org data
 * @returns
 */
const migrateGenre = async (
  payload: Payload,
  tmdbId: number,
  warnings: Error[],
  tmdbGenre: tmdbMovie['genres'][0],
): Promise<Genre> => {
  let genre: Genre
  let created = false

  // try to create genre
  try {
    genre = (await payload.create({
      collection: 'genres',
      data: {
        name: tmdbGenre.name,
      },
      locale: defaultLanguage,
    })) as unknown as Genre
    created = true
  } catch (err) {
    // could not be created, try to find it
    genre = (
      await payload.find({
        collection: 'genres',
        where: {
          name: {
            equals: tmdbGenre.name,
          },
        },
        locale: defaultLanguage,
        limit: 1,
      })
    ).docs[0] as unknown as Genre
  }

  if (!genre) warnings.push(new Error(`Could neither find or create genre ${tmdbGenre.name}`))

  // add translations
  if (created) {
    locales.forEach(async (locale) => {
      if (locale === defaultLanguage) return // we already have the default language...

      tmdbFetch('movie', tmdbId, locale)
        .then(async (tmdbMovieLng) => {
          let name = tmdbMovieLng.genres.find((g) => g.id === tmdbGenre.id)?.name

          try {
            await payload.update({
              collection: 'genres',
              id: genre.id,
              data: {
                name,
              },
              locale: locale,
            })
          } catch (err) {
            console.error(err)
            warnings.push(new Error(`Unable to add genre translation (${err})`))
          }
        })
        .catch((err) => {
          console.error(err)
          warnings.push(new Error(`Unable to get genre translation (${err})`))
        })
    })
  }

  return genre
}
