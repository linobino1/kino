import { SerializedLexicalNode } from './types'

export function serializeLexicalToPlainText(json: any): string {
  return serialize(json?.root?.children ?? [])
}

function serialize(nodes: SerializedLexicalNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        return node.text
      }

      return serialize(node.children ?? [])
    })
    .join(' ')
}
