import type { DocGenerator } from '../types'

export const casablancaFilmprint: DocGenerator<'filmPrints'> = ({ context }) => ({
  // title will be "Casablanca 35mm engl. OV"
  _status: 'published',
  movie: context.movies.get('Casablanca')?.id as string,
  aspectRatio: context.aspectRatios.get('1.37')?.id as string,
  carrier: context.carriers.get('Acetate')?.id as string,
  category: context.categories.get('Feature Film')?.id as string,
  color: context.colors.get('B/W')?.id as string,
  condition: context.conditions.get('Good')?.id as string,
  format: context.formats.get('35mm')?.id as string,
  isRented: false,
  languageVersion: context.languageVersions.get('engl. OV')?.id as string,
  numActs: 3,
  soundFormat: context.soundFormats.get('Mono')?.id as string,
  url: '',
})
