import type { Media } from 'packages/types/payload'

export const getObjectPosition = (media: Media) =>
  `${media.focalX ?? 0.5 * 100}% ${media.focalY ?? 0.5 * 100}%`
