import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  BACKEND_URL: z.string().default('http://localhost:3000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URI: z.string(),
  PAYLOAD_SECRET: z.string(),
  S3_ENABLED: z.string().default('false'),
  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  MEDIA_URL: z.string(),
  CDN_CGI_IMAGE_URL: z.string(),
  SENTRY_DSN: z.string().optional(),
  TURNSTILE_SITE_KEY: z.string(),
  TURNSTILE_SECRET_KEY: z.string(),
  LISTMONK_URL: z.string(),
  LISTMONK_LIST_ID: z.string(),
  TIMEZONE: z.string(),
})

const clientSchema = schema.pick({
  NODE_ENV: true,
  BACKEND_URL: true,
  FRONTEND_URL: true,
  MEDIA_URL: true,
  CDN_CGI_IMAGE_URL: true,
  TURNSTILE_SITE_KEY: true,
  LISTMONK_URL: true,
  LISTMONK_LIST_ID: true,
  TIMEZONE: true,
})

export const env = schema.parse(process.env)

export const envClient = clientSchema.parse(process.env)

// types
export type Environment = z.infer<typeof schema>
export type ClientEnvironment = z.infer<typeof clientSchema>
