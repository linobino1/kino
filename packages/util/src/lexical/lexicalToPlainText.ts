import type { SerializedLexicalNode } from './types'

export function lexicalToPlainText(json: any): string {
  if (!json || typeof json !== 'object' || !json.root || !Array.isArray(json.root.children)) {
    return ''
  }
  return serializeToPlainText(json?.root?.children)
}

function serializeToPlainText(nodes: SerializedLexicalNode[]): string {
  if (!Array.isArray(nodes)) return ''
  return nodes
    .map((n) => {
      if (n.type === 'text') {
        return n.text
      }

      if (n.type === 'block') {
        return ''
      }

      if (Array.isArray(n.children)) {
        return serializeToPlainText(n.children)
      }

      return ''
    })
    .join('\n')
}
