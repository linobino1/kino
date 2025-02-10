import path from 'path'
import { buildConfig, deepMerge, type Config } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { de } from 'payload/i18n/de'
import { addUrlField } from './plugins/addUrlField'
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
import { locales } from '@app/i18n'
import { search } from './endpoints/tmdb/search'
import { preview } from './endpoints/tmdb/preview'
import { migrate } from './endpoints/tmdb/migrate'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { ZeptomailTransport } from 'nodemailer-zeptomail-transport'
import { createTransport } from 'nodemailer'
import { projectRoot } from '@app/util/projectRoot'
import { env } from '@app/util/env/backend.server'

const configPromise: Promise<Config> = (async () => ({
  cors: {
    origins: [env.FRONTEND_URL ?? 'http://localhost:5173'],
  },
  // The email adapter is used to send password reset emails
  ...(env.ZEPTOMAIL_API_KEY
    ? {
        email: await nodemailerAdapter({
          transport: createTransport(
            new ZeptomailTransport({
              apiKey: env.ZEPTOMAIL_API_KEY!,
              region: 'eu',
            }),
          ),
          defaultFromAddress: env.EMAIL_FROM_ADDRESS!,
          defaultFromName: env.EMAIL_FROM_NAME!,
        }),
      }
    : {}),
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
  secret: env.PAYLOAD_SECRET || '',
  typescript: {
    // we'll deploy the types to a shared package
    outputFile: path.resolve(projectRoot, 'packages/types/payload.d.ts'),
  },
  db: mongooseAdapter({
    url: env.DATABASE_URI || '',
  }),
  plugins: [
    addUrlField,
    s3Storage({
      enabled: env.S3_ENABLED === 'true' && env.NODE_ENV !== 'test',
      config: {
        endpoint: env.S3_ENDPOINT,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY || '',
          secretAccessKey: env.S3_SECRET_KEY || '',
        },
        region: env.S3_REGION,
      },
      bucket: env.S3_BUCKET || '',
      collections: {
        media: {
          disablePayloadAccessControl: true, // serve files directly from S3
          generateFileURL: (file) => {
            return `${env.MEDIA_URL}/${file.filename}`
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
}))()

export const configurePayload = async (overrides?: Partial<Config>) => {
  return await buildConfig(deepMerge(await configPromise, overrides ?? {}))
}

export default configurePayload()
