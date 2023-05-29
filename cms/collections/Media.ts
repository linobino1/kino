import type { CollectionConfig } from 'payload/types';
import { t } from '../i18n';
import path from 'path';

export const staticDir = path.resolve(__dirname, '../../media');
export const staticURL = '/media';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: t('other Media'),
    plural: t('Other Media'),
  },
  admin: {
    group: t('Media'),
  },
  access: {
    read: (): boolean => true, // Everyone can read Media
  },
  upload: {
    adminThumbnail: 'card',
    staticDir,
    staticURL,
    imageSizes: [
      // Square
      {
        name: 'square-360w',
        width: 360,
        height: 360,
      },
      {
        name: 'square-512w',
        width: 512,
        height: 512,
      },
      {
        name: 'square-768w',
        width: 768,
        height: 768,
      },

      // Portrait
      {
        name: 'portrait-360w',
        width: 360,
        height: 540,
      },
      {
        name: 'portrait-512w',
        width: 512,
        height: 768,
      },
      {
        name: 'portrait-768w',
        width: 768,
        height: 1152,
      },
      // Landscape
      {
        name: 'landscape-360w',
        width: 360,
        height: 240,
      },
      {
        name: 'landscape-512w',
        width: 512,
        height: 340,
      },
      {
        name: 'landscape-768w',
        width: 768,
        height: 512,
      },
      {
        name: 'landscape-1280w',
        width: 1280,
        height: 853,
      },
      {
        name: 'landscape-1920w',
        width: 1920,
        height: 1280,
      },
      {
        name: 'landscape-2560w',
        width: 2560,
        height: 1706,
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      admin: {
        description: t('Leave empty to use the filename as alt text'),
      },
      hooks: {
        beforeValidate: [
          // use filename as alt text if alt text is empty
          ({ value, data }) => {
            if (typeof value === 'string' && value.length > 0) {
              return value;
            }
            if (typeof data?.filename === 'string') {
              return data.filename.split('.')[0];
            }
            return value;
          },
        ],
      },
    },
  ],
};

export default Media;
