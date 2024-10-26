import { NodeTypes } from './types'

export function lexicalToPlainText(json: any): string {
  if (!Array.isArray(json?.root?.children)) {
    console.error('Invalid JSON structure', json)
    throw new Error('Invalid JSON structure')
  }
  return serializeToPlainText(json?.root?.children)
}

function serializeToPlainText(nodes: NodeTypes[]): string {
  return nodes
    .map((n): string => {
      if (n.type === 'text') {
        return n.text
      }

      if (n.type === 'block') {
        return ''
      }

      return ''
    })
    .join('\n')
}
