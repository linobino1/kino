import type { Country, Site } from '@app/types/payload'
import type { MovieTheater } from 'schema-dts'

export const locationSchema = (site: Site): MovieTheater => {
  return {
    '@type': 'MovieTheater',
    name: site.location.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.location.street,
      addressCountry: (site.location.country as Country).id,
      addressRegion: site.location.region,
      addressLocality: site.location.city,
      postalCode: site.location.zip,
      // TODO add optimized image url without using media.sizes
      // image: site.meta?.image
      //   ? encodeURI((site.meta?.image as Media)?.sizes['1500w']?.url)
      //   : undefined,
    },
  }
}
