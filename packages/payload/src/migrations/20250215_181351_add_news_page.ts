import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
  return
  const doc = await payload.create({
    collection: 'pages',
    data: {
      title: 'News',
      slug: 'news',
      slugLock: false,
      hero: {
        type: 'headline',
        headline: 'News',
      },
      meta: {
        title: 'News',
        description: 'The latest news from the Kino im Blauen Salon.',
      },
    },
    locale: 'en',
  })

  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: {
      title: 'Aktuelles',
      hero: {
        type: 'headline',
        headline: 'Aktuelles',
      },
      meta: {
        title: 'Aktuelles',
        description: 'Alle Nachrichten aus dem Blauen Salon.',
      },
    },
    locale: 'de',
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
  // Migration code
}
