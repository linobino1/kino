import type { JSX } from 'react'
import React, { Fragment } from 'react'
import type { Media as MediaType } from '@app/types/payload'
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'
import { cn } from '@app/util/cn'
import { Link } from '@remix-run/react'
import { Image } from '~/components/Image'
import type { NodeTypes } from './types'
import ArrowOutward from '../icons/ArrowOutward'

type Props = {
  nodes: NodeTypes[]
  enableMarginBlock?: boolean
}

export function serializeLexical(props: Props): JSX.Element {
  const { nodes, enableMarginBlock } = props
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        const disableMarginTop = !enableMarginBlock && index === 0
        const disableMarginBottom = !enableMarginBlock && index === nodes.length - 1

        if (node == null) {
          return null
        }

        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
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
            text = <code key={index}>{node.text}</code>
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }

          return text
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: NodeTypes): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({ ...props, nodes: node.children as NodeTypes[] })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        if (node.type === 'block') {
          const block = node.fields

          const blockType = block?.blockType

          if (!block || !blockType) {
            return null
          }

          switch (blockType) {
            default:
              return <p key={index}>unimplemented block type {blockType}</p>
          }
        } else {
          // alignment
          const className = cn({
            'text-center': 'format' in node && node.format === 'center',
            'text-right': 'format' in node && node.format === 'right',
            'mt-0': disableMarginTop,
            'mb-0': disableMarginBottom,
          })

          switch (node.type) {
            case 'linebreak': {
              return <br className={className} key={index} />
            }
            case 'paragraph': {
              return (
                <p className={cn('min-h-[0.1px]', className)} key={index}>
                  {serializedChildren}
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag
              return (
                <Tag className={className} key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'list': {
              const Tag = node?.tag
              return (
                <Tag className={cn(className, 'list')} key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              const cls = 'leading-tight'
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={cn(cls, {})}
                    key={index}
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    {serializedChildren}
                  </li>
                )
              } else {
                return (
                  <li key={index} value={node?.value} className={cls}>
                    {serializedChildren}
                  </li>
                )
              }
            }
            case 'quote': {
              return (
                <blockquote className={className} key={index}>
                  {serializedChildren}
                </blockquote>
              )
            }

            case 'horizontalrule': {
              return <hr key={index} className="not-prose" />
            }

            case 'autolink':
            case 'link': {
              const { linkType, newTab, doc, url } = node.fields

              return (
                <Link
                  to={linkType === 'internal' ? (doc?.value as any).url : url}
                  key={index}
                  target={newTab ? '_blank' : '_self'}
                  prefetch={linkType === 'internal' ? 'intent' : 'none'}
                  className={cn({ 'inline-flex items-center': newTab })}
                >
                  {serializedChildren}
                  {newTab && <ArrowOutward />}
                </Link>
              )
            }

            case 'upload': {
              const media = node.value as MediaType
              if (media === null || typeof media !== 'object') {
                return null
              }
              // let isPortrait = false
              // const size = node.fields?.size
              // if (media.width && media.height) {
              //   isPortrait = media.height > media.width
              // }
              return <Image key={index} image={media} />
            }

            default:
              return <p>{`unimplemented node type ${node.type}`}</p>
          }
        }
      })}
    </Fragment>
  )
}
