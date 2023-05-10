import type { Field } from 'payload/types';
import { t } from '../i18n';

export const TmdbFilepath = (collection: 'posters' | 'stills'): Field => ({
  name: 'tmdbFilepath',
  type: 'text',
  label: t('TMDB Filepath'),
  required: false,
  admin: {
    readOnly: true,
  },
  // make sure the images is not being migrated twice from themoviedb.org
  validate: async (value, { siblingData, t, payload }) => {
    if (value === null) return true;
    
    // on server we need the base url, on client we don't
    const baseUrl = payload ? payload.config.serverURL : '';
    try {
      const res = await fetch(`${baseUrl}/api/${collection}?where[tmdbFilepath][equals]=${value}`);
      const data = await res.json();
      if (data.totalDocs > 0) {
        return t('Movie already exists');
      }
    } catch (err) {
      return t(`Unable to validate TMDB ID (${err})`);
    }
    return true;
  },
});