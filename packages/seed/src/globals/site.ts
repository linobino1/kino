import type { GlobalGenerator } from '../types'
import { translate } from '../util/translate'

export const site: GlobalGenerator<'site'> = ({ context: { media }, locale }) => ({
  title: 'Kino Im Blauen Salon',
  favicon: media.get('favicon.webp')?.id,
  logo: media.get('logo.png')?.id,
  logoMobile: media.get('logo_mobile.png')?.id,
  meta: {
    title: 'Kino Im Blauen Salon',
    description: translate(
      {
        de: 'Kino im Blauen Salon ist das Uni-Kino der HfG Karlsruhe und besteht seit dem Wintersemester 2017. Die Mitglieder des Filmclubs wechseln mit den Semestern, manche bleiben länger, manche kommen spontan dazu um eine Idee, eine Filmreihe oder ähnliches in die Tat umzusetzen. Zusammen kümmern wir uns um das Filmprogramm, Filmdisposition, Archivarbeit, Getränkebestellungen oder Specials wie das Open-Air, das einmal im Sommer vor der HfG stattfindet.',
        en: 'Kino im Blauen Salon is the university cinema of the HfG Karlsruhe and has existed since the winter semester 2017. The members of the film club change with the semesters, some stay longer, some join spontaneously to implement an idea, a film series or similar. Together we take care of the film program, film disposition, archiving, drink orders or specials like the open-air, which takes place once in the summer in front of the HfG.',
      },
      locale,
    ),
    image: media.get('hero.avif')?.id,
  },
  location: {
    country: {
      id: 'DE',
      name: 'Deutschland',
      createdAt: '2023-05-23T10:29:18.026Z',
      updatedAt: '2023-05-23T10:29:18.027Z',
    },
    region: 'Baden-Württemberg',
    city: 'Karlsruhe',
    zip: '76135',
    street: 'Lorenzstraße 15',
    name: 'Kino im blauen Salon',
    latitude: '49.002322001454324',
    longitude: '8.383308875340374',
  },
  footerContent: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Kino im Blauen Salon e.V.',
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
              text: 'c/o Staatl. Hochschule für Gestaltung',
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
              text: '76135 Karlsruhe',
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
              text: 'Tel. +49 721 8203 2172',
              type: 'text',
              version: 1,
            },
          ],
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
