/**
 * Before running this script, make sure to add the SlateToLexicalFeature to the root config lexical editor, with SlateToLexicalFeature and disableHooks: true.
 *
 * After running this script, you can remove the SlateToLexicalFeature from the payload confi
 */
import { CollectionSlug, getPayload } from 'payload'
import config from '@payload-config'
import { migrateBlocks } from './migrateBlocks'
import { migratePageFromGlobal } from './migratePageFromGlobal'
import { migrateSlateToLexical } from '@payloadcms/richtext-lexical/migrate'
import { mongoReplace } from './mongoReplace'
import { locales } from 'shared/config'

async function migrationV2() {
  const payload = await getPayload({ config })
  const { db } = payload

  payload.logger.info('Migration V2 started')

  payload.logger.info('rename staticpages collection to pages')
  // wait 2s until index is rebuilt
  await new Promise((resolve) => setTimeout(resolve, 2000))
  await db.connection.db?.collection('staticpages').rename('pages', { dropTarget: true })

  // migrate staticPages collection to pages collection
  const pages = JSON.parse(JSON.stringify(await db.collections.pages.find({})))
  await Promise.all(
    pages.map(async (page: any) => {
      payload.logger.info(`migrate static page ${page.slug}`)
      const migratedBlocks = migrateBlocks(page.layout.blocks)

      await db.collections.pages.updateOne({ _id: page._id }, [
        {
          $set: {
            layoutType: page.layout.type,
            blocks: migratedBlocks.blocks,
            hero: migratedBlocks.hero,
          },
        },
        {
          $unset: ['layout'],
        },
      ])
    }),
  )
  await mongoReplace(db, 'staticPages', 'pages')

  payload.logger.info('migrate screening series')
  const screeningSeries = JSON.parse(JSON.stringify(await db.collections.screeningSeries.find({})))
  await Promise.all(
    screeningSeries.map(async (src: any) => {
      payload.logger.info(`migrate screening series ${src.slug}`)
      const migratedBlocks = migrateBlocks(src.layout.blocks)

      await db.collections.screeningSeries.updateOne({ _id: src._id }, [
        {
          $set: {
            hero: migratedBlocks.hero,
            blocks: migratedBlocks.blocks,
          },
        },
        {
          $unset: ['layout'],
        },
      ])
    }),
  )

  payload.logger.info('migrate landing page')
  const landingPageID = await migratePageFromGlobal({ globalType: 'blog', slug: 'home', payload })
  // set page title to 'Home' for all locales
  await Promise.all(
    locales.map(async (locale) =>
      payload.update({
        collection: 'pages',
        id: landingPageID,
        data: {
          title: 'Home',
        },
        locale,
      }),
    ),
  )

  payload.logger.info('migrate events page')
  await migratePageFromGlobal({ globalType: 'eventsPage', slug: 'events', payload })

  payload.logger.info('migrate seasons page')
  await migratePageFromGlobal({ globalType: 'seasonsPage', slug: 'seasons', payload })

  payload.logger.info('migrate archive page')
  await migratePageFromGlobal({ globalType: 'archive', slug: 'archive', payload })

  payload.logger.info('migrate all slate JSON to lexical JSON')
  await migrateSlateToLexical({ payload })

  payload.logger.info('saving all docs')
  // this is done to trigger the hooks, we want the url to be generated for all docs
  await Promise.all(
    payload.config.collections
      .filter((collection) => !['payload-preferences', 'mailings'].includes(collection.slug))
      .map(async (collection) => {
        // find all docs
        const docs = await payload.find({
          collection: collection.slug as CollectionSlug,
        })
        await Promise.all(
          docs.docs.map(async (doc: any) => {
            // save doc to update
            try {
              await payload.update({
                collection: collection.slug as CollectionSlug,
                id: doc.id,
                data: {},
              })
            } catch (err) {
              payload.logger.error(`error saving ${collection.slug} doc ${doc.id}`)
              payload.logger.error(err)
            }
          }),
        )
      }),
  )

  payload.logger.info('migrationV2 done')
  process.exit(0)
}

migrationV2()
