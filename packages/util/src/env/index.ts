import { z } from 'zod'

const variables = z.object({
  NODE_ENV: z.string().default('development'),
  CI: z.string().optional(),
  SEEDING: z.string().optional(),

  FRONTEND_URL: z.string().default('http://localhost:5173'),
  BACKEND_URL: z.string().default('http://localhost:3000'),

  // build in CI must work without DATABASE_URI and PAYLOAD_SECRET, but we still want the runtime to fail if they are missing
  DATABASE_URI: process.env.CI === 'true' ? z.string().optional() : z.string(),
  PAYLOAD_SECRET: process.env.CI === 'true' ? z.string().optional() : z.string(),

  S3_ENABLED: z.string().default('false'),
  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),

  MEDIA_URL: z.string().optional(),
  CDN_CGI_IMAGE_URL: z.string().optional(),

  SENTRY_DSN: z.string().optional(),

  TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),

  LISTMONK_URL: z.string().optional(),
  LISTMONK_API_KEY: z.string().optional(),
  LISTMONK_LIST_UUID: z.string().optional(),
  LISTMONK_LIST_ID: z.string().optional(),

  ZEPTOMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM_ADDRESS: z.string().optional(),
  EMAIL_FROM_NAME: z.string().optional(),
})

const backendServerEnv = variables

const backendBrowserEnv = variables.pick({
  NODE_ENV: true,
  FRONTEND_URL: true,
  BACKEND_URL: true,
  MEDIA_URL: true,
  CDN_CGI_IMAGE_URL: true,
})

const frontendServerEnv = variables

const frontendBrowserEnv = variables.pick({
  NODE_ENV: true,
  BACKEND_URL: true,
  FRONTEND_URL: true,
  MEDIA_URL: true,
  CDN_CGI_IMAGE_URL: true,
  TURNSTILE_SITE_KEY: true,
  LISTMONK_URL: true,
  LISTMONK_LIST_UUID: true,
})

export type BackendServerEnvironment = z.infer<typeof backendServerEnv>
export type BackendBrowserEnvironment = z.infer<typeof backendBrowserEnv>
export type FrontendServerEnvironment = z.infer<typeof frontendServerEnv>
export type FrontendBrowserEnvironment = z.infer<typeof frontendBrowserEnv>

export const parseBackendServerEnv = (env: any) => backendServerEnv.parse(env)

export const parseBackendBrowserEnv = (env: any) => backendBrowserEnv.parse(env)

export const parseFrontendServerEnv = (env: any) => frontendServerEnv.parse(env)

export const parseFrontendBrowserEnv = (env: any) => frontendBrowserEnv.parse(env)
