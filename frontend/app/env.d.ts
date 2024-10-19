import { type Environment } from './env.server'

export {}

declare global {
  interface Window {
    process: {
      env: ClientEnvironment
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {
      SUPABASE_ANON_KEY: string
      SUPABASE_PROJECT_URL: string
      ENV: 'test' | 'dev' | 'prod'
    }
  }
}
