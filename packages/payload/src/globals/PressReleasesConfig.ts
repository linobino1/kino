import type { GlobalConfig } from 'payload'

export const PressReleasesConfig: GlobalConfig = {
  slug: 'pressReleasesConfig',
  admin: {
    group: 'Promo',
  },
  label: 'Einstellungen Pressemitteilungen',
  fields: [
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'address',
      label: 'Adresse Briefkopf',
      type: 'richText',
      required: true,
    },
  ],
}
