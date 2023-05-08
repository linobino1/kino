declare global {
  interface AppEnvironment {
    NODE_ENV: string
    PAYLOAD_PUBLIC_SERVER_URL: string
    HCAPTCHA_SITE_KEY: string
    HCAPTCHA_SECRET_KEY: string
    THEMOVIEDB_API_KEY: string
  }
  interface Window {
    ENV: AppEnvironment
  }
  namespace NodeJS {
    interface ProcessEnv extends AppEnvironment {}
  }
}

export {}