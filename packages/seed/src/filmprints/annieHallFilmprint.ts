import type { DocGenerator } from '../types'

export const annieHallFilmprint: DocGenerator<'filmPrints'> = ({ context }) => ({
  // title will be "Annie Hall 35mm engl. OV"
  _status: 'published',
  movie: context.movies.get('Annie Hall')?.id as string,
  isRented: true,
  rental: context.rentals.get('DK Collection')?.id as string,
  format: context.formats.get('35mm')?.id as string,
  languageVersion: context.languageVersions.get('engl. OV')?.id as string,
})
