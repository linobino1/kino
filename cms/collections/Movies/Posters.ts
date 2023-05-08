import type { CollectionConfig } from 'payload/types';
import { staticDir, staticURL } from '../Media';
import { t } from '../../i18n';
import { TmdbFilepath } from '../../fields/TmdbFilepath';

export const Posters: CollectionConfig = {
  slug: 'posters',
  labels: {
    singular: t('Poster'),
    plural: t('Posters'),
  },
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: t('Movie Database'),
    hidden: true,
  },
  upload: {
    adminThumbnail: 'default',
    staticDir: `${staticDir}/posters`,
    staticURL: `${staticURL}/posters`,
    mimeTypes: [
      'image/jpeg',
      'image/png',
    ],
    imageSizes: [
      {
        name: '120w',
        width: 120,
        height: 180,
      },
      {
        name: '260w',
        width: 260,
        height: 390,
      },
    ],
  },
  fields: [
    TmdbFilepath(),
  ],
};

export default Posters;
