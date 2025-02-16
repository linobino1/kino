import type { GlobalConfig } from 'payload'

export const Site: GlobalConfig = {
  slug: 'site',
  admin: {
    group: 'System',
  },
  label: 'Seiteneinstellungen',
  fields: [
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logoMobile',
      label: 'Logo (mobil)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'footerContent',
      label: 'Inhalt im Footer',
      type: 'richText',
      localized: true,
    },
    {
      name: 'location',
      label: 'Spielstätte',
      type: 'group',
      fields: [
        {
          name: 'country',
          label: 'Land',
          type: 'relationship',
          relationTo: 'countries',
          required: true,
        },
        {
          name: 'region',
          label: 'Region',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          label: 'Stadt',
          type: 'text',
          required: true,
        },
        {
          name: 'zip',
          label: 'PLZ',
          type: 'text',
          required: true,
        },
        {
          name: 'street',
          label: 'Straße',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'latitude',
          label: 'Breitengrad',
          type: 'text',
          required: true,
        },
        {
          name: 'longitude',
          label: 'Längengrad',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'defaultRental',
      label: 'Standardverleiher',
      type: 'relationship',
      relationTo: 'rentals',
      admin: {
        description:
          'Der Standardverleiher, der für Filme verwendet wird, wenn kein anderer Verleiher angegeben ist (sollte die HfG-Sammlung sein).',
      },
    },
  ],
}
