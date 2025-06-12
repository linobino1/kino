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
import type { Locale, TFunction } from '@app/i18n'
import { env } from '@app/util/env/backend.server'
import { Heading, Text } from '@react-email/components'
import Event from '../components/Event'
import Gutter from '../components/Gutter'
import FilmPrint from '../components/FilmPrint'
import Hr from '../components/Hr'
import Link from '../components/Link'
import Img from '../components/Img'

interface Props {
  nodes: SerializedLexicalNode[]
  color: string
  locale: Locale
  t: TFunction
}
const fontSize = '16px'

export function SerializeLexicalToEmail({ nodes, color, locale, t }: Props): React.ReactNode {
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
                <span key={index} style={{ textDecoration: 'line-through' }}>
                  {text}
                </span>
              )
            }
            if (node.format & IS_UNDERLINE) {
              text = (
                <span key={index} style={{ textDecoration: 'underline' }}>
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
        const textAlign = (node.format ?? 'left') as 'left' | 'center' | 'right' | 'justify'

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
              return SerializeLexicalToEmail({ nodes: node.children, color, locale, t })
            } else {
              return SerializeLexicalToEmail({ nodes: node.children, color, locale, t })
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
            switch (node.tag) {
              case 'h1':
                fontSize = '23px'
                fontWeight = 'bold'
                break
            }

            return (
              <Gutter key={index}>
                <Heading className="my-4 sm:my-8" style={{ textAlign, fontSize, fontWeight }}>
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
            const { linkType, doc, url } = node.fields
            const href =
              linkType === 'internal' ? `${env.FRONTEND_URL}${(doc?.value as any).url}` : url
            return (
              <Link href={href} key={index} target={'target="_blank"'} color={color}>
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
                <Img media={media} alt={media.alt} className="h-auto w-full" />
              </Gutter>
            )

          case 'horizontalrule':
            return (
              <Gutter key={index}>
                <Hr key={index} color={color} />
              </Gutter>
            )

          case 'block':
            switch (node.fields.blockType) {
              case 'eventBlock':
                return (
                  <Event
                    key={index}
                    event={node.fields.event}
                    type={node.fields.type}
                    color={color}
                    additionalText={node.fields.additionalText}
                    locale={locale}
                    t={t}
                  />
                )
              case 'filmPrintBlock':
                return (
                  <FilmPrint
                    key={index}
                    filmPrint={node.fields.filmPrint}
                    additionalText={node.fields.additionalText}
                    color={color}
                    locale={locale}
                    t={t}
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
