import { buildConfig } from 'payload/config';
import path from 'path';
import { options } from './app/i18n';
import en from './public/locales/en/backend.json';
import de from './public/locales/de/backend.json'
import Media from './cms/collections/Media';
import Navigations from './cms/collections/Navigations';
import Pages from './cms/collections/Pages';
import Users from './cms/collections/Users';
import Site from './cms/globals/Site';
import Posts from './cms/collections/Posts';
import Blog from './cms/globals/pages/Blog';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  // this is for the translation of the admin panel
  i18n: {
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    ns: ['backend'],
    resources: {
      en: {
        backend: en,
      },
      de: {
        backend: de,
      },
    },
  },
  graphQL: {
    disable: true,
  },
  collections: [
    // Movies & Screenings
    // ...

    // Blog
    Posts,

    // Pages
    Pages,

    // Config
    Navigations,
    Users,

    // Media
    Media,
    
  ],
  globals: [
    Site,
    Blog,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'cms/payload-types.ts'),
  },
  // here we stay consistent with the i18n config of remix since this affects
  // the public frontend
  localization: {
    defaultLocale: options.fallbackLng,
    locales: options.supportedLngs,
    fallback: true,
  },
});
