import type { Block } from 'payload'

export const HeaderImage: Block = {
  slug: 'headerImage',
  labels: {
    singular: 'Header',
    plural: 'Headers',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      required: true,
      relationTo: 'media',
    },
    {
      name: 'navigation',
      type: 'relationship',
      relationTo: 'navigations',
      hasMany: false,
      required: false,
      defaultValue: () =>
        fetch(`/api/navigations/?[where][type][equals]=socialMedia`)
          .then((res) => res.json())
          .then((res) => res.docs[0].id),
    },
  ],
}

export default HeaderImage
