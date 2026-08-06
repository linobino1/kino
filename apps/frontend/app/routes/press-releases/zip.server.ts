import type { Event, FilmPrint, Media, Movie, PressRelease } from '@app/types/payload'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { zipSync, strToU8 } from 'fflate'
import { formatSlug } from '@app/util/formatSlug'
import { env } from '@app/util/env/frontend.server'
import { getMediaUrl } from '@app/util/media/getMediaUrl'
import { mediaDir } from '@app/util/mediaDir'
import { getPressReleaseEvents } from './data.server'

type Props = {
  pressRelease: PressRelease
}

type StillAsset = {
  fileName: string
  distributor: string
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

const createStillFileName = ({ index, media, movie, usedNames }: {
  index: number
  media: Media
  movie: Movie
  usedNames: Set<string>
}) => {
  const extension = getFileExtension(media)
  const baseName =
    formatSlug(movie.internationalTitle || movie.title || media.filename?.replace(/\.[^.]+$/, '') || 'filmstill') ||
    'filmstill'

  let fileName = `${String(index).padStart(2, '0')}-${baseName}${extension}`
  let duplicateIndex = 2
  while (usedNames.has(fileName)) {
    fileName = `${String(index).padStart(2, '0')}-${baseName}-${duplicateIndex}${extension}`
    duplicateIndex += 1
  }

  usedNames.add(fileName)
  return fileName
}

const collectStillAssets = async (events: Event[]) => {
  const assetsByMediaId = new Map<string, StillAsset>()
  const usedNames = new Set<string>()

  for (const event of events) {
    const movie = getMainMovie(event)
    const media = getHeaderMedia(event)
    if (!movie || !media || assetsByMediaId.has(media.id)) {
      continue
    }

    const fileName = createStillFileName({
      index: assetsByMediaId.size + 1,
      media,
      movie,
      usedNames,
    })

    assetsByMediaId.set(media.id, {
      fileName,
      distributor: movie.currentDistributor?.trim() || 'unbekannt',
      data: new Uint8Array(await readMediaData(media)),
    })
  }

  return [...assetsByMediaId.values()]
}

export const renderPressStillsZip = async ({ pressRelease }: Props) => {
  const events = await getPressReleaseEvents({ pressRelease })
  const stillAssets = await collectStillAssets(events)

  const files = Object.fromEntries(
    stillAssets.map((asset) => [asset.fileName, asset.data] as const),
  )

  files['bildrechte.txt'] = strToU8(
    stillAssets.map((asset) => `${asset.fileName}: ${asset.distributor}`).join('\n'),
  )

  return Buffer.from(zipSync(files, { level: 0 }))
}
