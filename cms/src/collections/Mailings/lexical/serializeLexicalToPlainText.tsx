import { SerializedLexicalNode } from './types'

function serializeToPlainText(nodes: SerializedLexicalNode[]): string {
  return nodes
    .map((node): string => {
      if (node.type === 'text') {
        return node.text ?? ''
      }

      if (node.type === 'block') {
        return ''
      }

      return ''
    })
    .join('\n')
}

export function serializeLexicalToPlainText(json: any): string {
  if (!Array.isArray(json?.root?.children)) {
    console.error('Invalid JSON structure', json)
    throw new Error('Invalid JSON structure')
  }
  return serializeToPlainText(json?.root?.children)
}
