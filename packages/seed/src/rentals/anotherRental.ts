import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const anotherRental: DocGenerator<'rentals'> = ({ locale, context: { media } }) => ({
  name: translate(
    {
      de: 'DK Sammlung',
      en: 'DK Collection',
    },
    locale,
  ),
  credits: translate(
    {
      en: 'Loan of the film print with kind support of DK Collection.',
      de: 'Leihgabe des Filmprints mit freundlicher Unterstützung der DK Sammlung.',
    },
    locale,
  ),
  logo: media.get('favicon.webp')?.id as string,
})
