import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { GalleryBlockType } from '@/payload-types'

export type SerializedBlockNodes = SerializedBlockNode<GalleryBlockType>

export type NodeTypes = DefaultNodeTypes | SerializedBlockNodes
