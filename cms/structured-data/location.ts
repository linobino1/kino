import type { Country, Site } from "payload/generated-types";
import type { MovieTheater } from "schema-dts";

export const locationSchema = (site: Site): MovieTheater => {
  return {
    "@type": "MovieTheater",
    name: site.location.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.location.street,
      addressCountry: (site.location.country as Country).id,
      addressRegion: site.location.region,
      addressLocality: site.location.city,
      postalCode: site.location.zip,
      image: site.meta?.image ? encodeURI((site.meta?.image as any)?.url) : undefined,
    },
  }
}
