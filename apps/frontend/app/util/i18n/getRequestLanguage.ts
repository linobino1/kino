import { universalLanguageDetect } from '@unly/universal-language-detector'
import i18n from '~/i18n'

export const getRequestLanguage = (request: Request): string => {
  return universalLanguageDetect({
    supportedLanguages: [...i18n.supportedLngs],
    fallbackLanguage: i18n.fallbackLng,
    acceptLanguageHeader: request.headers.get('accept-language') ?? '',
    errorHandler: (error) => {
      console.error("An error occurred while trying to detect the user's language:")
      console.error(error)
    },
  })
}
