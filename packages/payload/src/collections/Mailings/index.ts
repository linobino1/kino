import type { CollectionConfig } from 'payload'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdminOrEditor } from '#payload/access'
// import { colorPickerField } from '@innovixx/payload-color-picker-field'
import { generateHTML } from './hooks/generateHTML'
import { ImageBlock } from './html/lexical/blocks/ImageBlock'
import { EventBlock } from './html/lexical/blocks/EventBlock'
import { FilmPrintBlock } from './html/lexical/blocks/FilmPrintBlock'
import { createListmonkCampaign } from './hooks/createListmonkCampaign'
import { updateListmonkCampaign } from './hooks/updateListmonkCampaign'
import { deleteListmonkCampaign } from './hooks/deleteListmonkCampaign'

export const Mailings: CollectionConfig<'mailings'> = {
  slug: 'mailings',
  admin: {
    group: 'Promo',
    defaultColumns: ['id', 'updatedAt'],
    components: {
      beforeList: ['/components/mailings/HowTo#HowTo'],
    },
    useAsTitle: 'subject',
    livePreview: {
      url: ({ data }) => `/preview/mailing/${data.id}`,
    },
    preview: (doc) => `/preview/mailing/${doc.id}`,
  },
  defaultSort: '-updatedAt',
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [createListmonkCampaign, updateListmonkCampaign, deleteListmonkCampaign],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
    },
  },
  fields: [
    {
      label: 'Listmonk Kampagne',
      name: 'listmonkCampaignID',
      type: 'text',
      admin: {
        position: 'sidebar',
        components: {
          Field: {
            path: '/components/mailings/ListmonkCampaignIDField#ListmonkCampaignIDField',
            clientProps: {
              listmonkURL: process.env.LISTMONK_URL,
            },
          },
        },
      },
      hooks: {
        beforeDuplicate: [() => null],
      },
    },
    {
      name: 'listmonkAction',
      type: 'select',
      options: ['create', 'update', 'delete'],
      hidden: true,
    },
    {
      label: 'tatsächlich versendet',
      name: 'sentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        condition: (data) => data.sendAt && new Date(data.sendAt) < new Date(),
        readOnly: true,
      },
    },
    {
      name: 'sendAtDate',
      label: 'Versenden am',
      type: 'date',
      admin: {
        position: 'sidebar',
        condition: (data) => !data.sentAt,
      },
    },
    {
      name: 'sendAtTime',
      label: 'Uhrzeit',
      type: 'select',
      defaultValue: 'morning',
      options: [
        { label: 'morgens', value: 'morning' },
        { label: 'nachmittags', value: 'afternoon' },
      ],
      admin: {
        position: 'sidebar',
        condition: (data) => !data.sentAt,
      },
    },
    {
      name: 'sendAt',
      label: 'Versanddatum',
      type: 'date',
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data?.sendAtDate || !data?.sendAtTime) {
              return null
            }
            const res = new Date(data.sendAtDate)
            switch (data.sendAtTime) {
              case 'morning':
                res.setHours(9)
                break
              case 'afternoon':
                res.setHours(14)
                break
            }
            return res
          },
        ],
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
      },
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
        position: 'sidebar',
      },
    },
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
      admin: {
        position: 'sidebar',
        description: "Hex-Farbwert, z.B. '#FF0000' https://www.fffuel.co/cccolor/",
      },
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Betreff',
      required: true,
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
            blocks: [ImageBlock, EventBlock, FilmPrintBlock],
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
      label: 'Vorschau',
      type: 'textarea',
      hooks: {
        beforeChange: [generateHTML],
      },
      validate: () => true, // by default has a 40k char limit
      admin: {
        hidden: true,
      },
    },
  ],
}
