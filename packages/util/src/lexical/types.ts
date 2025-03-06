import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { GalleryBlockType } from '@app/types/payload'

export type SerializedBlockNodes = SerializedBlockNode<GalleryBlockType>

export type NodeTypes = DefaultNodeTypes | SerializedBlockNodes

export type SerializedLexicalNode = {
  children?: SerializedLexicalNode[]
  direction: string
  format: number | string
  indent?: string | number
  type: string
  version: number
  style?: string
  mode?: string
  text?: string
  [other: string]: any
}
