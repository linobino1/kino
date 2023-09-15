import type { Genre, Company } from "payload/generated-types";
import type { tmdbCompany } from "../../tmdb/types";
import type { Payload } from "payload";
import { createOrFindItemByName, getTmdbData } from "../helpers";
import { tmdbLng } from "../../tmdb";
import type { MigratedMovie } from "../types";

export const migrateMovie = async (payload: Payload, tmdbId: number): Promise<MigratedMovie> => {
  const data = await getTmdbData('movie', tmdbId, tmdbLng);
  
  // create genre
  let genre: Genre | undefined;
  try {
    genre = await createOrFindItemByName('genres', data.genres[0].name, payload, tmdbLng);
  } catch (err) {
    throw new Error(`Unable to create genre (${err})`);
  }
  
  // create production companies
  const productionCompanies = (await Promise.all(
    data.production_companies.map(async (company: tmdbCompany) => (
      createOrFindItemByName('companies', company.name, payload)
    )
  ))).map((company: Company) => company.id);
  
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
      year: parseInt(data.release_date?.split('-')[0]),
      countries: data.production_countries.map((country: any) => country.iso_3166_1.toUpperCase()),
      tmdbId: data.id,
      duration: data.runtime,
      genre,
      productionCompanies,
    },
  });
  
  if (!movie) throw new Error('Unable to create movie');
  
  // add translations
  for (const language of payload.config.i18n.supportedLngs as []) {
    if (language === tmdbLng) continue; // we already have the default language...
    
    // fetch movie details from TMDB in language
    let dataTranslated = await getTmdbData('movie', tmdbId, language);

    // title & synopsis
    await payload.update({
      collection: 'movies',
      id: movie.id,
      draft: true,
      locale: language,
      data: {
        title: dataTranslated.title,
        synopsis: dataTranslated.overview,
      },
    });
    
    // genre name
    // IDEA: let's hope the genres are sorted the same way in all languages
    if (genre) {
      try {
        await payload.update({
          collection: 'genres',
          id: genre.id,
          data: {
            name: data.genres[0].name,
          },
          locale: language,
        });
      } catch (err) {
        throw new Error(`Unable to update genre (${err})`);
      }
    }
  }

  return movie;
}