import type { CollectionConfig } from 'payload'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdminOrEditor } from '#payload/access'
// import { colorPickerField } from '@innovixx/payload-color-picker-field'
import { generateHTML } from './hooks/generateHTML'
import { EventBlock } from './lexical/blocks/EventBlock'
import { FilmPrintBlock } from './lexical/blocks/FilmPrintBlock'

export const Mailings: CollectionConfig = {
  slug: 'mailings',
  admin: {
    group: 'Mailings',
    defaultColumns: ['id', 'updatedAt'],
    components: {
      beforeList: ['/components/mailings/HowTo#HowTo'],
    },
    useAsTitle: 'subject',
  },
  defaultSort: '-updatedAt',
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      label: 'Betreff',
      required: true,
    },
    {
      type: 'row',
      fields: [
        // TODO: use color picker when it's available
        // https://github.com/innovixx/payload-color-picker-field/issues/7
        // colorPickerField({
        //   name: 'color',
        //   label: "Farbe",
        //   defaultValue: '#000000',
        // }),
        {
          name: 'color',
          label: 'Farbe',
          type: 'text',
          defaultValue: '#000000',
        },
        {
          name: 'language',
          label: 'Sprache',
          type: 'radio',
          options: [
            { value: 'en', label: 'English' },
            { value: 'de', label: 'Deutsch' },
          ],
          defaultValue: 'de',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'header',
      label: 'Header',
      fields: [
        {
          name: 'image',
          label: 'Bild',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'overlay',
          label: 'Overlay',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'content',
      label: 'Inhalt',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [EventBlock, FilmPrintBlock],
          }),
        ],
      }),
    },
    {
      type: 'group',
      name: 'footer',
      label: 'Footer',
      fields: [
        {
          name: 'image',
          label: 'Bild',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'label',
          label: 'Bezeichnung',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
    {
      name: 'html',
      type: 'textarea',
      hooks: {
        beforeChange: [generateHTML],
      },
      validate: () => true, // by default has a 40k char limit
      admin: {
        components: {
          Field: '/components/mailings/HtmlField#HtmlField',
        },
      },
    },
  ],
}
