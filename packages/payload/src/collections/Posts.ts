import type { CollectionConfig } from 'payload'
import { Content } from '#payload/blocks/Content'
import { Image } from '#payload/blocks/Image'
import { Gallery } from '#payload/blocks/Gallery'
import { Video } from '#payload/blocks/Video'
import { slugField } from 'payload'
import { env } from '@app/util/env/backend.server'
import { postSlugHook } from './Posts/slugHook'
import { formatSlug } from '@app/util/formatSlug'
import { postPath } from '@app/util/routes'
import { attachedLinksField } from '#payload/fields/attachedLinks'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  admin: {
    group: 'Blog',
    defaultColumns: ['date', 'title'],
    useAsTitle: 'title',
    preview: (data) =>
      `${env.FRONTEND_URL}${postPath(typeof data.slug === 'string' ? data.slug : undefined)}?preview=true`,
  },
  defaultSort: '-date',
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField({
      useAsSlug: 'title',
      checkboxName: 'slugLock',
      disableUnique: true,
      required: false,
      slugify: ({ valueToSlugify }) => formatSlug(valueToSlugify),
      overrides: (field) => {
        // A post's URL is generated once and is independent of localized title edits.
        const slugTextField = field.fields[1]
        if (slugTextField?.type === 'text') {
          slugTextField.hooks = {
            ...slugTextField.hooks,
            beforeValidate: [postSlugHook],
          }
        }
        return field
      },
    }),
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: Date(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Vorschau',
          fields: [
            {
              name: 'header',
              label: 'Titelbild',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'content',
              label: 'Text',
              type: 'richText',
              localized: true,
              required: true,
            },
          ],
        },
        {
          label: 'Inhalt',
          fields: [
            attachedLinksField(),
            {
              name: 'details',
              label: false,
              type: 'blocks',
              blocks: [Content, Image, Gallery, Video],
              admin: {
                description:
                  'Optionale ausführliche Informationen zum Beitrag. Die Detailseite wird auch ohne diese Inhalte angezeigt.',
              },
            },
          ],
        },
      ],
    },
  ],
}
