import path from 'path'
import { buildConfig, deepMerge, type Config } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { attachDatabasePool } from '@vercel/functions'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { de } from 'payload/i18n/de'
import { addUrlField } from './plugins/addUrlField'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Movies } from './collections/Movies'
import { FilmPrints } from './collections/FilmPrints'
import { Events } from './collections/Events'
import { EventSeries } from './collections/Events/EventSeries'
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
import { PressReleases } from './collections/PressReleases'
import { Site } from './globals/Site'
import { PressReleasesConfig } from './globals/PressReleasesConfig'
import { locales } from '@app/i18n'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { ZeptomailTransport } from 'nodemailer-zeptomail-transport'
import { createTransport } from 'nodemailer'
import { projectRoot } from '@app/util/projectRoot'
import { env } from '@app/util/env/backend.server'
import { translations } from '@app/i18n/translations/index'
import { Sitemap } from './collections/Sitemap'
import { generateSitemap } from './tasks/generateSitemap'

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
  collections: [
    // Movie Database
    Movies,

    // Film Prints
    FilmPrints,

    // Screenings
    Events,
    EventSeries,

    // Blog
    Posts,

    // Mailings
    Mailings,

    // Media
    Media,
    PressReleases,

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
    Sitemap,
  ],
  globals: [PressReleasesConfig, Site],
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
    connectOptions: {
      // Connection pool limits - critical to prevent hitting MongoDB connection limits
      maxPoolSize: 10, // Max connections per function instance
      minPoolSize: 2,  // Keep 2 connections warm for better performance
      maxIdleTimeMS: 60000, // Close idle connections after 60s (balance between cleanup and performance)
      serverSelectionTimeoutMS: 30000, // 30s timeout for server selection
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000, // 30s timeout for initial connection
    },
    afterOpenConnection: async (adapter) => {
      // Only use attachDatabasePool on Vercel (not available on other platforms like Fly.io)
      if (process.env.VERCEL) {
        const client = adapter.connection.getClient()
        attachDatabasePool(client)
      }
    },
  }),
  telemetry: false,
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
  // admin panel localization
  i18n: {
    supportedLanguages: {
      de,
    },
    translations,
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
  jobs: {
    tasks: [
      {
        slug: 'generateSitemap',
        handler: generateSitemap,
      },
    ],
  },
}))()

export const configurePayload = async (overrides?: Partial<Config>) => {
  return await buildConfig(deepMerge(await configPromise, overrides ?? {}))
}

export default configurePayload()
