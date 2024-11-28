import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { GalleryBlockType } from '@/payload-types'

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
