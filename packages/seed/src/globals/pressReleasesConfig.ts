import type { GlobalGenerator } from '../types'

export const pressReleasesConfig: GlobalGenerator<'pressReleasesConfig'> = ({
  context: { media },
}) => ({
  logo: media.get('logo_mobile.png')?.id as string,
  address: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 1,
              mode: 'normal',
              style: '',
              text: 'Kino im Blauen Salon',
              type: 'text',
              version: 1,
            },

            {
              type: 'linebreak',
              version: 1,
            },

            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Staatliche Hochschule für Gestaltung',
              type: 'text',
              version: 1,
            },

            {
              type: 'linebreak',
              version: 1,
            },

            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Lorenzstraße 15',
              type: 'text',
              version: 1,
            },

            {
              type: 'linebreak',
              version: 1,
            },

            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '0721 8203 2172',
              type: 'text',
              version: 1,
            },

            {
              type: 'linebreak',
              version: 1,
            },

            {
              type: 'autolink',

              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'www.kinoimblauensalon.de',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',

              fields: {
                linkType: 'custom',
                url: 'https://www.kinoimblauensalon.de',
              },
              format: '',
              indent: 0,
              version: 2,
            },

            {
              type: 'linebreak',
              version: 1,
            },

            {
              type: 'autolink',

              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'info@kinoimblauensalon.de',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',

              fields: {
                linkType: 'custom',
                url: 'mailto:info@kinoimblauensalon.de',
              },
              format: '',
              indent: 0,
              version: 2,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 1,
          textStyle: '',
        },

        {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
})
