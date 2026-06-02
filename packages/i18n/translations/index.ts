import commonDE from './de/common'
import backendDE from './de/backend'
import authDE from './de/auth'
import commonEN from './en/common'
import backendEN from './en/backend'
import authEN from './en/auth'

export const translations = {
  de: {
    backend: backendDE,
    common: commonDE,
    auth: authDE,
  },
  en: {
    backend: backendEN,
    common: commonEN,
    auth: authEN,
  },
}
