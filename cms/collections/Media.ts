import type { CollectionConfig } from 'payload/types';
import { t } from '../i18n';
import path from 'path';

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
        name: '120x180',
        width: 120,
        height: 180,
      },
      {
        name: '260x390',
        width: 260,
        height: 390,
      },
      // Film Still
      {
        name: '320x160',
        width: 320,
        height: 160,
      },
      {
        name: '480x320',
        width: 480,
        height: 320,
      },
      {
        name: '768x384',
        width: 768,
        height: 384,
      },
      // Square
      {
        name: '512x512',
        width: 512,
        height: 512,
      },
      {
        name: '768x768',
        width: 768,
        height: 768,
      },
      // Landscape
      {
        name: '1280x853',
        width: 1280,
        height: 853,
      },
      {
        name: '1920x1280',
        width: 1920,
        height: 1280,
      },
      {
        name: '2560x1706',
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
    {
      name: 'tmdbFilepath',
      type: 'text',
      label: t('TMDB Filepath'),
      required: false,
      admin: {
        readOnly: true,
      },
      // make sure the media is not being migrated twice from themoviedb.org
      validate: async (value, { t, payload }) => {
        if (value === null) return true;
        
        // on server we need the base url, on client we don't
        const baseUrl = payload ? payload.config.serverURL : '';
        try {
          const res = await fetch(`${baseUrl}/api/media?where[tmdbFilepath][equals]=${value}`);
          const data = await res.json();
          if (data.totalDocs > 0) {
            return t('Media already exists');
          }
        } catch (err) {
          return t(`Unable to check if media has already been imported (${err})`);
        }
        return true;
      },
    }
  ],
};

export default Media;
