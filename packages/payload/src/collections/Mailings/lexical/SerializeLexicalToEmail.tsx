import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
} from './RichTextNodeFormat'
import type { SerializedLexicalNode } from './types'
import { Heading, Text, Link, Hr } from '@react-email/components'
import Event from './components/Event'
import Gutter from './components/Gutter'
import FilmPrint from './components/FilmPrint'

interface Props {
  nodes: SerializedLexicalNode[]
  color: string
}
const fontSize = '16px'

export function SerializeLexicalToEmail({ nodes, color }: Props): React.ReactNode {
  return (
    <Fragment>
      {nodes?.map((node, index): React.ReactNode | null => {
        if (node.type === 'text') {
          let text = (
            <span key={index} dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />
          )
          if (typeof node.format === 'number' || typeof node.format === 'bigint') {
            if (node.format & IS_BOLD) {
              text = <strong key={index}>{text}</strong>
            }
            if (node.format & IS_ITALIC) {
              text = <em key={index}>{text}</em>
            }
            if (node.format & IS_STRIKETHROUGH) {
              text = (
                <span key={index} className="line-through">
                  {text}
                </span>
              )
            }
            if (node.format & IS_UNDERLINE) {
              text = (
                <span key={index} className="underline">
                  {text}
                </span>
              )
            }
            if (node.format & IS_CODE) {
              text = <code key={index}>{text}</code>
            }
            if (node.format & IS_SUBSCRIPT) {
              text = <sub key={index}>{text}</sub>
            }
            if (node.format & IS_SUPERSCRIPT) {
              text = <sup key={index}>{text}</sup>
            }
          }

          return text
        }

        if (node == null) {
          return null
        }

        // alignment
        const textAlign = (node.format ?? 'left') as 'left' | 'center' | 'right'

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: SerializedLexicalNode): React.ReactNode | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if (!item?.checked) {
                  item.checked = false
                }
              }
              return SerializeLexicalToEmail({ nodes: node.children, color })
            } else {
              return SerializeLexicalToEmail({ nodes: node.children, color })
            }
          }
        }

        const serializedChildren = serializedChildrenFn(node)

        switch (node.type) {
          case 'linebreak': {
            return <br key={index} />
          }
          case 'paragraph': {
            if (!node.children || node.children.length === 0) return null
            return (
              <Gutter key={index}>
                <Text key={index} style={{ textAlign, fontSize }}>
                  {serializedChildren}
                </Text>
              </Gutter>
            )
          }
          case 'heading': {
            let fontSize = '16px'
            let fontWeight = 'normal'
            let marginBlock = '1em'
            switch (node.tag) {
              case 'h1':
                fontSize = '23px'
                fontWeight = 'bold'
                marginBlock = '50px'
                break
            }

            return (
              <Gutter key={index}>
                <Heading style={{ textAlign, fontSize, fontWeight, marginBlock }}>
                  {serializedChildren}
                </Heading>
              </Gutter>
            )
          }
          case 'list': {
            const Tag = node?.tag as 'ol' | 'ul'
            return (
              <Gutter key={index}>
                <Tag key={index}>{serializedChildren}</Tag>;
              </Gutter>
            )
          }
          case 'listitem': {
            if (node?.checked != null) {
              return (
                <li
                  key={index}
                  value={node?.value}
                  role="checkbox"
                  aria-checked={node.checked ? 'true' : 'false'}
                  tabIndex={-1}
                >
                  {serializedChildren}
                </li>
              )
            } else {
              return (
                <li key={index} value={node?.value}>
                  {serializedChildren}
                </li>
              )
            }
          }
          case 'quote': {
            return (
              <Gutter key={index}>
                <blockquote key={index} style={{ textAlign }}>
                  {serializedChildren}
                </blockquote>
              </Gutter>
            )
          }
          case 'autolink':
          case 'link': {
            return (
              <Link key={index} href={node.fields.url} target={'target="_blank"'}>
                {serializedChildren}
              </Link>
            )
          }

          case 'upload':
            const media = node.value
            if (!media.mimeType.startsWith('image/')) {
              throw new Error('Only images are supported')
            }
            return (
              <Gutter key={index}>
                <img key={index} src={media.url} alt={media.alt} />;
              </Gutter>
            )

          case 'horizontalrule':
            return (
              <Gutter key={index}>
                <Hr
                  key={index}
                  style={{
                    borderColor: color,
                    borderStyle: 'dotted',
                    borderBottomWidth: '4px',
                    borderTopWidth: 0,
                    marginBlock: '1em',
                  }}
                />
              </Gutter>
            )

          case 'block':
            switch (node.fields.blockType) {
              case 'eventBlock':
                return (
                  <Event
                    key={index}
                    event={node.fields.event}
                    color={color}
                    additionalText={node.fields.additionalText}
                  />
                )
              case 'filmPrintBlock':
                return (
                  <FilmPrint
                    key={index}
                    filmPrint={node.fields.filmPrint}
                    additionalText={node.fields.additionalText}
                    color={color}
                  />
                )
              default:
                return <p key={index}>unimplemented block type {node.fields.blockType}</p>
            }

          default:
            return <p key={index}>unimplemented node type {node.type}</p>
        }
      })}
    </Fragment>
  )
}
