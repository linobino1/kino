import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  return
  // set locations.address to locations.name for a start
  await payload.db.connection.collection('locations').updateMany(
    {
      _id: { $exists: true },
    },
    [
      {
        $set: {
          address: '$name.de',
        },
      },
    ],
  )

  // initialize pressReleasesConfig
  const { logoMobile } = await payload.findGlobal({
    slug: 'site',
    select: {
      logoMobile: true,
    },
    depth: 0,
  })
  await payload.updateGlobal({
    slug: 'pressReleasesConfig',
    data: {
      logo: logoMobile as string,
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
              children: [
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
                    url: 'https://kinoimblauensalon.de',
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
              textFormat: 0,
              textStyle: '',
            },

            {
              children: [
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
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  return
  // unset locations.address
  await payload.db.connection.collection('locations').updateMany(
    {
      address: { $exists: true },
    },
    [
      {
        $unset: 'address',
      },
    ],
  )
}
