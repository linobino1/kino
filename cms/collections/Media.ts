import type { CollectionConfig } from 'payload/types';
import { t } from '../i18n';
import path from 'path';
import type { Payload } from 'payload';
import type { Media as MediaType } from 'payload/generated-types';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: t('Media singular'),
    plural: t('Media'),
  },
  admin: {
    group: t('Media'),
  },
  access: {
    read: (): boolean => true, // Everyone can read Media
  },
  upload: {
    adminThumbnail: 'card',
    staticDir: path.resolve(__dirname, '../../media'),
    staticURL: '/media',
    imageSizes: [
      // Film Poster
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
      // Film Still
      {
        name: '250w',
        width: 320,
      },
      {
        name: '400w',
        width: 480,
      },
      {
        name: '500w',
        width: 512,
      },
      {
        name: '750w',
        width: 768,
      },
      {
        name: '1000w',
        width: 1280,
      },
      {
        name: '1500w',
        width: 1920,
      },
      {
        name: '2560w',
        width: 2560,
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
      // make sure the media is not being migrated twice from themoviedb.org
      // validate: async (value, { t, payload, data }: { t: any, payload?: Payload, data: Partial<MediaType>}) => {
      //   if (value === null) return true;
      //   if (!payload) return true;  // only validate on server
        
      //   const { docs } = await payload.find({
      //     collection: 'media',
      //     where: {
      //       tmdbFilepath: {
      //         equals: value,
      //       },
      //     },
      //   });
      //   if (docs.length > 1) {
      //     return t('Media already exists');
      //   }
      //   if (docs.length === 1 && docs[0].id !== data.id) {
      //     return t('Media already exists');
      //   }
      //   return true;
      // },
    }
  ],
};

export default Media;
