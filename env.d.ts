declare global {
  interface AppEnvironment {
    NODE_ENV: string
    PAYLOAD_PUBLIC_SERVER_URL: string
    HCAPTCHA_SITE_KEY: string
    HCAPTCHA_SECRET_KEY: string
    THEMOVIEDB_API_KEY: string
    TIMEZONE: string
    S3_ENABLED: string
    S3_BUCKET: string
    S3_REGION: string
    S3_ACCESS_KEY: string
    S3_SECRET_KEY: string
  }
  interface Window {
    ENV: AppEnvironment
  }
  namespace NodeJS {
    interface ProcessEnv extends AppEnvironment {}
  }
}

export {}