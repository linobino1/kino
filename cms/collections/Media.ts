import type { CollectionConfig } from 'payload/types';
import type { ImageUploadFormatOptions } from 'payload/dist/uploads/types';
import { t } from '../i18n';
import path from 'path';

export const formatOptions: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 100,
    force: true,
  },
};

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: t('Media file'),
    plural: t('Media'),
  },
  admin: {
    group: t('Media'),
    pagination: {
      defaultLimit: 100,
      limits: [50, 100, 250, 500],
    },
  },
  access: {
    read: (): boolean => true, // Everyone can read Media
  },
  upload: {
    adminThumbnail: '175w',
    staticDir: path.resolve(__dirname, '../../media'),
    formatOptions,
    imageSizes: [
      {
        name: '120w', // small filmposter on desktop
        width: 120,
        formatOptions,
      },
      {
        name: '175w', // backend thumbnail
        width: 175,
        formatOptions,
      },
      {
        name: '260w', // big filmposter on desktop
        width: 260,
        formatOptions,
      },
      {
        name: '350w', // small filmposter on retina desktop
        width: 350,
        formatOptions,
      },
      {
        name: '520w', // big filmpost on retina desktop
        width: 520,
        formatOptions,
      },
      {
        name: '750w',
        width: 750,
        formatOptions,
      },
      {
        name: '1000w',
        width: 1000,
        formatOptions,
      },
      {
        name: '1500w',
        width: 1500,
        formatOptions,
      },
      {
        name: '2560w',
        width: 2560,
        formatOptions,
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
    {
      name: 'tmdbFilepath',
      type: 'text',
      label: t('TMDB Filepath'),
      required: false,
      unique: false,
      admin: {
        readOnly: true,
      },
    }
  ],
};

export default Media;
