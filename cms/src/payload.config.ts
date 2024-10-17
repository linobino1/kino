import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import { s3Storage } from '@payloadcms/storage-s3'
import { de } from 'payload/i18n/de'
import { addUrlField } from './plugins/addUrlField'
import { addSlugField } from './plugins/addSlugField'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Movies } from './collections/Movies'
import { FilmPrints } from './collections/FilmPrints'
import { Events } from './collections/Events'
import { ScreeningSeries } from './collections/Events/ScreeningSeries'
import { Posts } from './collections/Posts'
import { Mailings } from './collections/Mailings'
import { Pages } from './collections/Pages'
import { Formats } from './collections/FilmPrints/Formats'
import { AspectRatios } from './collections/FilmPrints/AspectRatios'
import { Carriers } from './collections/FilmPrints/Carriers'
import { LanguageVersions } from './collections/FilmPrints/LanguageVersions'
import { SoundFormats } from './collections/FilmPrints/SoundFormats'
import { Conditions } from './collections/FilmPrints/Conditions'
import { Seasons } from './collections/Events/Seasons'
import { Genres } from './collections/Movies/Genres'
import { Locations } from './collections/Events/Locations'
import { Rentals } from './collections/FilmPrints/Rentals'
import { Colors } from './collections/FilmPrints/Colors'
import { Categories } from './collections/FilmPrints/Categories'
import { Persons } from './collections/Movies/Persons'
import { Jobs } from './collections/Movies/Jobs'
import { Companies } from './collections/Movies/Companies'
import { Countries } from './collections/Movies/Countries'
import { Navigations } from './collections/Navigations'
import { Site } from './globals/Site'
import { Blog } from './globals/pages/Blog'
import { EventsPage } from './globals/pages/EventsPage'
import { SeasonsPage } from './globals/pages/Seasons'
import { Archive } from './globals/pages/Archive'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      // baseDir: path.resolve(dirname),
      baseDir: '@',
    },
  },
  collections: [
    // Movie Database
    Movies,

    // Film Prints
    FilmPrints,

    // Screenings
    Events,
    ScreeningSeries,

    // Blog
    Posts,

    // Mailings
    Mailings,

    // Media
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
    Seasons,
    Genres,
    Locations,
    Rentals,
    Colors,
    Categories,
    Persons,
    Jobs,
    Companies,
    Countries,

    // System
    Navigations,
    Users,
  ],
  globals: [Site, Blog, EventsPage, SeasonsPage, Archive],
  editor: slateEditor({
    admin: {
      elements: ['h2', 'h3', 'h4', 'h5', 'h6', 'link', 'ol', 'ul', 'indent', 'upload'],
      leaves: ['bold', 'italic', 'underline', 'strikethrough'],
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  plugins: [
    addUrlField,
    addSlugField,
    s3Storage({
      enabled: process.env.S3_ENABLED === 'true',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION,
      },
      bucket: process.env.S3_BUCKET || '',
      collections: {
        media: {
          prefix: 'media/',
          disablePayloadAccessControl: true, // serve files directly from S3
          generateFileURL: (file) => {
            return `${process.env.MEDIA_URL}/${file.filename}`
          },
        },
      },
    }),
  ],
  // content localization
  localization: {
    defaultLocale: 'de',
    locales: ['en', 'de'],
    fallback: true,
  },
  // admin panel localization (to be removed)
  i18n: {
    supportedLanguages: {
      de,
    },
  },
  upload: {
    defCharset: 'utf8',
    defParamCharset: 'utf8',
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  },
  graphQL: {
    disable: true,
  },
})
