import type { Event, FilmPrint, Media, Movie, PressRelease } from '@app/types/payload'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { zipSync, strToU8 } from 'fflate'
import { formatDate } from '@app/util/formatDate'
import { formatSlug } from '@app/util/formatSlug'
import { env } from '@app/util/env/frontend.server'
import { getMediaUrl } from '@app/util/media/getMediaUrl'
import { mediaDir } from '@app/util/mediaDir'
import { getPressReleaseEvents } from './data.server'

type Props = {
  pressRelease: PressRelease
}

type ImageAsset = {
  fileName: string
  rightsLine: string
  data: Uint8Array
}

const getMainMovie = (event: Event) => {
  if (!event.isScreeningEvent || !event.mainProgramFilmPrint || typeof event.mainProgramFilmPrint !== 'object') {
    return null
  }

  const { movie } = event.mainProgramFilmPrint as FilmPrint
  if (!movie || typeof movie !== 'object') {
    return null
  }

  return movie as Movie
}

const getHeaderMedia = (event: Event) => {
  if (!event.header || typeof event.header !== 'object') {
    return null
  }

  return event.header as Media
}

const getFileExtension = (media: Media) => {
  const extension = media.filename ? path.extname(media.filename) : ''
  if (extension) {
    return extension
  }

  switch (media.mimeType) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/webp':
      return '.webp'
    case 'image/gif':
      return '.gif'
    default:
      return ''
  }
}

const readMediaData = async (media: Media) => {
  if (media.filename) {
    try {
      return await readFile(path.join(mediaDir, media.filename))
    } catch {
      // fall back to the public URL when the original upload is not stored locally
    }
  }

  const response = await fetch(getMediaUrl(media, env))
  if (!response.ok) {
    throw new Error(`Unable to fetch media ${media.id}: ${response.status} ${response.statusText}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

const getImageBaseName = (event: Event, media: Media, movie: Movie | null) => {
  if (event.isScreeningEvent) {
    return movie?.internationalTitle || movie?.title || event.title || media.filename?.replace(/\.[^.]+$/, '') || 'abbildung'
  }

  return [event.title, event.date?.slice(0, 10)].filter(Boolean).join('-') || media.filename?.replace(/\.[^.]+$/, '') || 'abbildung'
}

const createImageFileName = ({ index, event, media, movie, usedNames }: {
  index: number
  event: Event
  media: Media
  movie: Movie | null
  usedNames: Set<string>
}) => {
  const extension = getFileExtension(media)
  const baseName = formatSlug(getImageBaseName(event, media, movie)) || 'abbildung'

  let fileName = `${String(index).padStart(2, '0')}-${baseName}${extension}`
  let duplicateIndex = 2
  while (usedNames.has(fileName)) {
    fileName = `${String(index).padStart(2, '0')}-${baseName}-${duplicateIndex}${extension}`
    duplicateIndex += 1
  }

  usedNames.add(fileName)
  return fileName
}

const getRightsHolder = (event: Event, media: Media) =>
  media.rightsholder?.trim() || (event.isScreeningEvent ? event.mainFilmDistributor?.trim() : '') || 'unbekannt'

const createRightsLine = (event: Event, movie: Movie | null, rightsHolder: string) => {
  if (event.isScreeningEvent) {
    const movieTitle = movie?.internationalTitle?.trim() || movie?.title?.trim() || event.title?.trim() || 'Unbekannter Film'
    const year = movie?.year ? `, ${movie.year}` : ''

    return `Ausschnitt: ${movieTitle}${year} © ${rightsHolder}`
  }

  const eventDate = event.date ? formatDate(event.date, 'dd.MM.yyyy') : ''

  return eventDate
    ? `${event.title} am ${eventDate} © ${rightsHolder}`
    : `${event.title} © ${rightsHolder}`
}

const collectImageAssets = async (events: Event[]) => {
  const assetsByMediaId = new Map<string, ImageAsset>()
  const usedNames = new Set<string>()

  for (const event of events) {
    const media = getHeaderMedia(event)
    if (!media || assetsByMediaId.has(media.id)) {
      continue
    }

    const movie = getMainMovie(event)
    const rightsHolder = getRightsHolder(event, media)

    const fileName = createImageFileName({
      index: assetsByMediaId.size + 1,
      event,
      media,
      movie,
      usedNames,
    })

    assetsByMediaId.set(media.id, {
      fileName,
      rightsLine: createRightsLine(event, movie, rightsHolder),
      data: new Uint8Array(await readMediaData(media)),
    })
  }

  return [...assetsByMediaId.values()]
}

export const renderPressImagesZip = async ({ pressRelease }: Props) => {
  const events = await getPressReleaseEvents({ pressRelease })
  const imageAssets = await collectImageAssets(events)

  const files = Object.fromEntries(
    imageAssets.map((asset) => [asset.fileName, asset.data] as const),
  )

  files['bildrechte.txt'] = strToU8(
    imageAssets.map((asset) => asset.rightsLine).join('\n'),
  )

  return Buffer.from(zipSync(files, { level: 0 }))
}
