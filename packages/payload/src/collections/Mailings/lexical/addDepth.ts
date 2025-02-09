import type { Payload } from 'payload'
import type { SerializedLexicalEditorState, SerializedLexicalNode } from './types'
import { type Locale } from '@app/i18n'

/**
 * replaces event IDs in event blocks with the actual event objects
 * replaces filmPrint IDs in filmPrint blocks with the actual filmPrint objects
 * replaces movie IDs in movie blocks with the actual movie objects
 */
export const addDepth = async ({
  json,
  payload,
  locale,
}: {
  json: SerializedLexicalEditorState
  payload: Payload
  locale: Locale
}): Promise<SerializedLexicalEditorState> => {
  return {
    ...json,
    root: {
      ...json.root,
      children: await traverseNodes({
        nodes: json.root.children,
        payload,
        locale,
      }),
    },
  }
}

const traverseNodes = async ({
  nodes,
  payload,
  locale,
}: {
  nodes: SerializedLexicalNode[]
  payload: Payload
  locale: Locale
}): Promise<SerializedLexicalNode[]> => {
  return await Promise.all(
    nodes.map(async (node) => {
      if (node.children) {
        return {
          ...node,
          children: await traverseNodes({
            nodes: node.children,
            payload,
            locale,
          }),
        }
      }

      if (node.type === 'block') {
        switch (node.fields.blockType) {
          case 'eventBlock':
            return {
              ...node,
              fields: {
                ...node.fields,
                event: (
                  await payload.find({
                    collection: 'events',
                    where: { id: { equals: node.fields.event } },
                    depth: 3,
                    locale,
                  })
                ).docs[0],
              },
            }
          case 'filmPrintBlock':
            return {
              ...node,
              fields: {
                ...node.fields,
                filmPrint: (
                  await payload.find({
                    collection: 'filmPrints',
                    where: { id: { equals: node.fields.filmPrint } },
                    depth: 3,
                    locale,
                  })
                ).docs[0],
              },
            }

          default:
            return node
        }
      }

      return node
    }),
  )
}
