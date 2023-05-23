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
import Archive from './cms/globals/pages/Archive';
import Persons from './cms/collections/Movies/Persons';
import Companies from './cms/collections/Movies/Companies';
import Genres from './cms/collections/Movies/Genres';
import Movies from './cms/collections/Movies';
import Countries from './cms/collections/Movies/Countries';
import Stills from './cms/collections/Movies/Stills';
import Posters from './cms/collections/Movies/Posters';
import Screenings from './cms/collections/Screenings';
import ScreeningGroups from './cms/collections/Screenings/ScreeningGroups';
import ScreeningSeries from './cms/collections/Screenings/ScreeningSeries';
import Locations from './cms/collections/Screenings/Locations';
import FilmPrints from './cms/collections/FilmPrints';
import AspectRatios from './cms/collections/FilmPrints/AspectRatios';
import Carriers from './cms/collections/FilmPrints/Carriers';
import Conditions from './cms/collections/FilmPrints/Conditions';
import Formats from './cms/collections/FilmPrints/Formats';
import LanguageVersions from './cms/collections/FilmPrints/LanguageVersions';
import SoundFormats from './cms/collections/FilmPrints/SoundFormats';
import Rentals from './cms/collections/FilmPrints/Rentals';
import ScreeningsPage from './cms/globals/pages/ScreeningsPage';
import MigrateMovie from './cms/components/MigrateMovie';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: [
        MigrateMovie,
      ],
    },
  },
  upload: {
    defCharset: 'utf8',
    defParamCharset: 'utf8',
  },
  i18n: { // admin panel i18n
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
    // Movie Database
    Movies,
    Persons,
    Companies,
    Countries,
    
    // Film Prints
    FilmPrints,
    
    // Screenings
    Screenings,
    ScreeningSeries,

    // Blog
    Posts,

    // Media
    Posters,
    Stills,
    Media,

    // Pages
    Pages,

    // Configuration
    Formats,
    AspectRatios,
    Carriers,
    LanguageVersions,
    SoundFormats,
    Conditions,
    ScreeningGroups,
    Genres,
    Locations,
    Rentals,
    
    // System
    Navigations,
    Users,
  ],
  globals: [
    Site,
    Blog,
    ScreeningsPage,
    Archive,
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
