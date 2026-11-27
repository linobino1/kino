import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'
import type { CollectionSlug } from 'payload'
import { locales } from '@app/i18n'
import { linkableDocumentPath, linkableCollectionSlugs } from '@app/util/routes'

type LegacyLink = {
  type?: string
  url?: string
  doc?: {
    relationTo?: string
    value?: unknown
  }
}

type MigratedLink =
  | { type: 'custom'; url: string; label?: Record<string, string> }
  | {
      type: 'event'
      event: unknown
      url: string
    }

const getLegacyID = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (typeof value !== 'object' || value === null) return undefined

  const objectValue = value as Record<string, unknown> & { toHexString?: () => string }
  if (typeof objectValue.toHexString === 'function') return objectValue.toHexString()

  for (const key of ['id', '_id', '$oid']) {
    if (typeof objectValue[key] === 'string') return objectValue[key]
  }

  return undefined
}

const getLegacyRelationshipValue = (
  payload: MigrateUpArgs['payload'],
  value: unknown,
  id: string,
) => {
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toHexString?: unknown }).toHexString === 'function'
  ) {
    return value
  }

  return /^[\da-f]{24}$/i.test(id) ? new payload.db.connection.base.Types.ObjectId(id) : id
}

const getMigratedLink = async (
  payload: MigrateUpArgs['payload'],
  link: LegacyLink,
): Promise<MigratedLink | undefined> => {
  if (link.type === 'external') {
    return link.url ? { type: 'custom', url: link.url, label: localizedEmptyLabel } : undefined
  }
  if (link.type !== 'internal') return undefined

  const relationTo = link.doc?.relationTo
  const value = link.doc?.value
  const id = getLegacyID(value)
  if (
    !relationTo ||
    !linkableCollectionSlugs.includes(relationTo as (typeof linkableCollectionSlugs)[number]) ||
    !id
  ) {
    return undefined
  }

  try {
    const relatedDoc =
      typeof value === 'object' &&
      value !== null &&
      typeof (value as { slug?: unknown }).slug === 'string'
        ? value
        : await payload.findByID({
            collection: relationTo as CollectionSlug,
            id,
            depth: 0,
            draft: true,
            overrideAccess: true,
          })

    const slug = (relatedDoc as { slug?: string | null }).slug
    if (!slug) return undefined

    const url = linkableDocumentPath(relationTo, slug)
    return relationTo === 'events'
      ? { type: 'event', event: getLegacyRelationshipValue(payload, value, id), url }
      : { type: 'custom', url, label: localizedEmptyLabel }
  } catch (error) {
    const statusCode =
      typeof error === 'object' && error !== null
        ? 'status' in error
          ? error.status
          : 'statusCode' in error
            ? error.statusCode
            : undefined
        : undefined
    const message = error instanceof Error ? error.message : String(error)

    if (statusCode === 404 || /not found|does not exist/i.test(message)) {
      // A dangling relationship should not prevent the rest of the posts migrating.
      return undefined
    }

    throw error
  }
}

const localizedEmptyLabel = Object.fromEntries(locales.map((locale) => [locale, '']))

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const migrate = async (
    collection: ReturnType<typeof payload.db.connection.collection>,
    id: unknown,
    record: Record<string, unknown>,
    linkPath: 'link' | 'version.link',
    linksPath: 'links' | 'version.links',
    hasDetailPagePath: 'hasDetailPage' | 'version.hasDetailPage',
    recordType: 'post' | 'post version',
  ) => {
    const legacyLink = record.link as LegacyLink | undefined
    const migratedLink = legacyLink ? await getMigratedLink(payload, legacyLink) : undefined
    const links = Array.isArray(record.links) ? [...record.links] : []

    if (migratedLink) {
      const { url, ...link } = migratedLink
      links.push(link)
      payload.logger.info(
        `Resolved posts.link for ${recordType} ${String(id)} to ${migratedLink.type} link ${url}`,
      )
    } else if (legacyLink?.type === 'internal') {
      payload.logger.warn(
        `Could not migrate legacy post link on ${String(id)}: unresolved ${legacyLink.doc?.relationTo} document ${String(legacyLink.doc?.value)}`,
      )
    }

    const $unset: Record<string, ''> = { [linkPath]: '', [hasDetailPagePath]: '' }
    const update: { $set?: Record<string, unknown>; $unset: Record<string, ''> } = { $unset }
    if (links.length) update.$set = { [linksPath]: links }

    await collection.updateOne({ _id: id as never }, update)
  }

  const posts = payload.db.connection.collection('posts')
  for await (const post of posts.find({
    $or: [{ link: { $exists: true } }, { hasDetailPage: { $exists: true } }],
  })) {
    await migrate(posts, post._id, post, 'link', 'links', 'hasDetailPage', 'post')
  }

  const versions = payload.db.connection.collection('_posts_versions')
  for await (const version of versions.find({
    $or: [{ 'version.link': { $exists: true } }, { 'version.hasDetailPage': { $exists: true } }],
  })) {
    await migrate(
      versions,
      version._id,
      version.version as Record<string, unknown>,
      'version.link',
      'version.links',
      'version.hasDetailPage',
      'post version',
    )
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  void _args
  // Legacy link destinations cannot be reconstructed from the new custom link fields.
}
