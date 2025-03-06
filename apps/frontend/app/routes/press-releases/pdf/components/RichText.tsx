import React from 'react'
import {
  type JSXConvertersFunction,
  RichText as _RichText,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { Link, Text } from '@react-pdf/renderer'
import { IS_BOLD, IS_ITALIC } from '@app/util/lexical/NodeFormat'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  data: SerializedEditorState
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  text: ({ node }) => (
    <Text
      style={{
        fontWeight: IS_BOLD & node.format ? 'bold' : undefined,
        fontStyle: IS_ITALIC & node.format ? 'italic' : undefined,
      }}
    >
      {node.text}
    </Text>
  ),
  link: ({ node, nodesToJSX, ...args }) => (
    <Link href={node.fields.url}>{nodesToJSX({ ...args, nodes: node.children })}</Link>
  ),
  autolink: ({ node, nodesToJSX, ...args }) => (
    <Link href={node.fields.url}>{nodesToJSX({ ...args, nodes: node.children })}</Link>
  ),
  paragraph: ({ node, nodesToJSX, ...args }) => (
    <Text style={{ marginTop: 6, marginBottom: 6 }}>
      {nodesToJSX({ ...args, nodes: node.children })}
    </Text>
  ),
  linebreak: () => <Text>{'\n'}</Text>,
})

export const RichText = ({ data, ...props }: Props) => {
  return <_RichText {...props} converters={jsxConverters} data={data} />
}
