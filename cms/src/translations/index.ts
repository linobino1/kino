import type { Config } from 'payload'
import type {
  DefaultTranslationKeys,
  NestedKeysStripped,
  TFunction,
} from '@payloadcms/translations'
import { en } from './en'
import { de } from './de'

export const translations = {
  en,
  de,
  // de: {
  //   aaa: {
  //     bbb: {
  //       ccc: 'de',
  //     },
  //   },
  //   test: {
  //     key: 'value de',
  //   },
  // },
  // en: {
  //   test: {
  //     key: 'value en',
  //   },
  // },
}

export type CustomTranslationsObject = typeof translations.de
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>
export type AllTranslationKeys = CustomTranslationsKeys | DefaultTranslationKeys
export type CustomTFunction = TFunction<AllTranslationKeys>
