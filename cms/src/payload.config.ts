import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
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
import { locales, siteTitle } from 'shared/config'
import { search } from './views/tmdb-migrate/endpoints/search'
import { preview } from './views/tmdb-migrate/endpoints/preview'
import { migrate } from './views/tmdb-migrate/endpoints/migrate'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import * as dotenv from 'dotenv'

dotenv.config() // required when using node scripts outside of NextJS

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: {
    origins: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: '@',
    },
    components: {
      beforeDashboard: ['/components/MigrateMovieLink'],
      views: {
        customView: {
          Component: '/views/tmdb-migrate/index',
          path: '/tmdb-migrate',
          meta: {
            title: 'Neuen Film anlegen',
          },
        },
      },
    },
    meta: {
      title: siteTitle,
      titleSuffix: ` - ${siteTitle}`,
    },
  },
  endpoints: [search, preview, migrate],
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
    // StaticPages,

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
  globals: [Site],
  editor: lexicalEditor({
    features({ defaultFeatures }) {
      return [...defaultFeatures]
    },
  }),
  // editor: slateEditor({}),
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
          disablePayloadAccessControl: true, // serve files directly from S3
          generateFileURL: (file) => {
            return `${process.env.MEDIA_URL}/${file.filename}`
          },
        },
      },
    }),
    seoPlugin({
      collections: ['pages'],
      generateImage: ({ doc }) => doc.hero?.image,
      generateTitle: ({ doc }) => doc.hero?.headline,
      generateURL: (doc: any) => doc.url,
      uploadsCollection: 'media',
    }),
    seoPlugin({
      globals: ['site'],
      uploadsCollection: 'media',
    }),
  ],
  // content localization
  localization: {
    defaultLocale: 'de',
    locales: [...locales],
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
