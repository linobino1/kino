import type { DocGenerator } from '../types'
import { translate } from '../util/translate'

export const hfgRental: DocGenerator<'rentals'> = ({ locale, context: { media } }) => ({
  name: translate(
    {
      de: 'Sammlung HfG',
      en: 'HfG Collection',
    },
    locale,
  ),
  credits: translate(
    {
      en: 'Loan of the film print with kind support of HfG Karlsruhe.',
      de: 'Leihgabe des Filmprints mit freundlicher Unterstützung der HfG Karlsruhe.',
    },
    locale,
  ),
  logo: media.get('favicon.webp')?.id as string,
})
