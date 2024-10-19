import { locales } from 'shared/config'

export const returnLanguageIfSupported = (lang?: string): string | undefined => {
  if ((locales as unknown as string[]).includes(lang ?? '')) {
    return lang
  }
  return undefined
}
