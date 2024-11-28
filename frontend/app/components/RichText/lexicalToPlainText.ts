import type { SerializedLexicalNode } from './types'

export function lexicalToPlainText(json: any): string {
  if (!Array.isArray(json?.root?.children)) {
    console.error('Invalid JSON structure', json)
    throw new Error('Invalid JSON structure')
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
