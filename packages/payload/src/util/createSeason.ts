import {
  summerSemesterEnd,
  summerSemesterStart,
  winterSemesterDefaultSlug,
  winterSemesterEnd,
  winterSemesterStart,
} from '@app/util/config'
import { getPayloadClient } from './getPayloadClient'
import { getFixedT } from '@app/i18n/getFixedT'
import { defaultLocale, locales } from '@app/i18n'
import type { PayloadRequest } from 'payload'

export const createSeason = async ({
  date,
  header,
  req,
}: {
  date: Date
  header: string
  req?: PayloadRequest
}) => {
  const payload = req?.payload ?? (await getPayloadClient())
  const t = await getFixedT(defaultLocale)

  const isWinterSemester = date.getMonth() <= 3 || date.getMonth() >= 10
  const year = date.getMonth() <= 3 ? date.getFullYear() - 1 : date.getFullYear()
  const yearTwoDigits = year.toString().slice(-2)

  const from = isWinterSemester
    ? new Date(winterSemesterStart.replace('yyyy', year.toString()))
    : new Date(summerSemesterStart.replace('yyyy', year.toString()))

  const until = isWinterSemester
    ? new Date(winterSemesterEnd.replace('yyyy', (year + 1).toString()))
    : new Date(summerSemesterEnd.replace('yyyy', year.toString()))

  const doc = await payload.create({
    collection: 'seasons',
    data: {
      from: from.toISOString(),
      until: until.toISOString(),
      name: t(`seasons.${isWinterSemester ? 'winterSemester' : 'summerSemester'}`, { year }),
      slug: isWinterSemester
        ? winterSemesterDefaultSlug.replace('yy', yearTwoDigits)
        : winterSemesterDefaultSlug.replace('yy', yearTwoDigits),
      slugLock: false,
      header,
    },
    req,
  })

  // add translations
  for await (const locale of locales) {
    if (locale === defaultLocale) continue
    const t = await getFixedT(locale)
    await payload.update({
      collection: 'seasons',
      id: doc.id,
      data: {
        name: t(`seasons.${isWinterSemester ? 'winterSemester' : 'summerSemester'}`, { year }),
      },
      locale,
      req,
    })
  }

  return doc
}
