import type { Block } from "payload/types";
import { t } from '../i18n';

export const Heading: Block = {
  slug: 'heading',
  labels: {
    singular: t('Heading'),
    plural: t('Headings'),
  },
  fields: [
    {
      name: 'text',
      label: t('Text'),
      type: 'text',
      localized: true,
    }
  ],
}

export default Heading;