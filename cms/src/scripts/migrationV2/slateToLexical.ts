/**
 * first run the migration script to migrate all data into the new data structure, then run this script to migrate all richtext fields from slate to lexical
 *
 * Before running this script, make sure to add the SlateToLexicalFeature to the root config lexical editor, with SlateToLexicalFeature.
 *
 * After running this script, you can remove the SlateToLexicalFeature from the payload config
 *
 * You will need to correct all the warnings that are displayed when the script has finished.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { migrateSlateToLexical } from '@payloadcms/richtext-lexical/migrate'

async function run() {
  const payload = await getPayload({ config })
  await migrateSlateToLexical({ payload })
  process.exit(0)
}

run()
