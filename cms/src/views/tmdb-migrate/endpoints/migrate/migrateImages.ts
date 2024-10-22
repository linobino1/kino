import type { Payload } from 'payload'
import type { Media } from '@/payload-types'
import type { MigrationFunction } from './types'
import https from 'https'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { tmdbMediaUrl } from '../../api'

interface ImagesMigrationFunction {
  (
    context: Parameters<MigrationFunction>[0],
    images: {
      poster?: string
      backdrop?: string
    },
  ): Promise<void>
}
export const migrateImages: ImagesMigrationFunction = async (
  { payload, movie, warnings },
  images,
) => {
  if (!movie.slug) throw new Error('Cannot migrate images without movie slug')

  // create temp directory for images
  let tmpDir
  try {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'tmdb-migrate-images-'))
  } catch {
    throw new Error('Unable to create temp directory for images')
  }

  // find or create poster
  let poster: Media | undefined, still: Media | undefined
  if (images.poster) {
    try {
      poster = await updateOrCreateImage(
        images.poster,
        'w500',
        path.join(tmpDir, `${movie.slug}-poster.jpg`),
        payload,
      )
    } catch (err) {
      warnings.push(new Error(`Unable to create poster (${err})`))
    }
  }

  // find or create still
  if (images.backdrop) {
    try {
      still = await updateOrCreateImage(
        images.backdrop,
        'original',
        path.join(tmpDir, `${movie.slug}-backdrop.jpg`),
        payload,
      )
    } catch (err) {
      warnings.push(new Error(`Unable to create still (${err})`))
    }
  }

  // update movie
  await payload.update({
    collection: 'movies',
    id: movie.id,
    data: {
      poster: poster?.id,
      still: still?.id,
    },
    draft: true,
  })
}

/**
 * download an image from themoviedb.org
 * @param tmdbFilepath necessary to identify the image on themoviedb.org
 * @param target target filepath
 * @param size image dimensions
 */
export const downloadTmdbImage = async (
  tmdbFilepath: string,
  target: string,
  size: 'original' | 'w500',
) => {
  await new Promise((resolve, reject) => {
    const url = `${tmdbMediaUrl}/t/p/${size}${tmdbFilepath}`

    https
      .get(url, (response) => {
        const code = response.statusCode ?? 0
        if (code >= 300) {
          // we don't do redirects
          return reject(new Error(response.statusMessage))
        }

        // save the file to disk
        const fileWriter = fs.createWriteStream(target).on('finish', () => {
          resolve({})
        })

        response.pipe(fileWriter)
      })
      .on('error', (error) => {
        console.error(error)
        reject(error)
      })
  })
}

/**
 * update or create a poster or still
 * @param tmdbFilepath the filepath of the image on themoviedb.org (acts as an id)
 * @param collection slug of Poster or Still collection
 * @param filePath path of the image to be uploaded
 * @param payload Payload instance
 * @returns Image instance
 */
export async function updateOrCreateImage(
  tmdbFilepath: string,
  size: 'original' | 'w500',
  filePath: string,
  payload: Payload,
): Promise<Media> {
  // download image from themoviedb.org to given path
  try {
    await downloadTmdbImage(tmdbFilepath, filePath, size)
  } catch (err) {
    return Promise.reject(new Error(`Unable to download image from themoviedb.org (${err})`))
  }

  // upload image to payload
  const image: Media = (
    await payload.find({
      collection: 'media',
      where: {
        tmdbFilepath: {
          equals: tmdbFilepath,
        },
      },
    })
  ).docs[0] as unknown as Media
  if (image) {
    return (await payload.update({
      collection: 'media',
      id: image.id,
      filePath,
      data: {
        tmdbFilepath,
      },
      overwriteExistingFiles: true,
    })) as unknown as Media
  }
  return (await payload.create({
    collection: 'media',
    filePath,
    data: {
      tmdbFilepath,
    },
  })) as unknown as Media
}
