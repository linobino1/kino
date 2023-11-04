import type { Media } from 'payload/generated-types';
import React, { Fragment } from 'react'
import { escape } from 'html-escaper'
import { Link } from '@remix-run/react';
import { MyReactPlayer } from '../../MyReactPlayer';
import { Image } from '~/components/Image';
import classes from './index.module.css';
import { Node as SlateNode } from 'slate';

export type Node = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Node[]
  url?: string
  [key: string]: unknown
  newTab?: boolean
  doc?: any
}

export const serializeToPlainText = ({ content }: { content: any }) => {
  return content.map((n: any) => SlateNode.string(n)).join('\n')
}

type SerializeFunction = React.FC<{
  content?: Node[]
}>

const isText = (value: any): boolean =>
  typeof value === 'object' && value !== null && typeof value.text === 'string'

export const Serialize: SerializeFunction = ({ content }) => {
  return (
    <Fragment>
      {content?.map((node, i) => {
        if (isText(node)) {
          // escape text and convert line breaks to <br />
          let escapedText = escape(node.text as string).replace(/(\r\n|\n|\r)/gm, "<br />");
          let text = <span dangerouslySetInnerHTML={{ __html: escapedText }} />

          if (node.bold) {
            text = <strong key={i}>{text}</strong>
          }

          if (node.code) {
            text = <code key={i}>{text}</code>
          }

          if (node.italic) {
            text = <em key={i}>{text}</em>
          }

          if (node.underline) {
            text = (
              <span style={{ textDecoration: 'underline' }} key={i}>
                {text}
              </span>
            )
          }

          if (node.strikethrough) {
            text = (
              <span style={{ textDecoration: 'line-through' }} key={i}>
                {text}
              </span>
            )
          }

          return <Fragment key={i}>{text}</Fragment>
        }

        if (!node) {
          return null
        }

        switch (node.type) {
          case 'br':
            return <br key={i} />
          case 'h1':
            return (
              <h1 key={i}>
                <Serialize content={node.children} />
              </h1>
            )
          case 'h2':
            return (
              <h2 key={i}>
                <Serialize content={node.children} />
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i}>
                <Serialize content={node.children} />
              </h3>
            )
          case 'h4':
            return (
              <h4 key={i}>
                <Serialize content={node.children} />
              </h4>
            )
          case 'h5':
            return (
              <h5 key={i}>
                <Serialize content={node.children} />
              </h5>
            )
          case 'h6':
            return (
              <h6 key={i}>
                <Serialize content={node.children} />
              </h6>
            )
          case 'quote':
            return (
              <blockquote key={i}>
                <Serialize content={node.children} />
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={i}>
                <Serialize content={node.children} />
              </ul>
            )
          case 'ol':
            return (
              <ol key={i}>
                <Serialize content={node.children} />
              </ol>
            )
          case 'li':
            return (
              <li key={i}>
                <Serialize content={node.children} />
              </li>
            )
          case 'link':
            const target = node.newTab ? '_blank' : '_self';
            // treat internal links
            if (node.linkType === 'internal') {
              return (
                <Link
                  key={i}
                  to={node.doc.value.url as string}
                  target={target}
                >
                  <Serialize content={node.children} />
                </Link>
              );
            }
            return (
              <a
                key={i}
                href={escape(node.url ?? '')}
                target={target}
              >
                <Serialize content={node.children} />
              </a>
            );

          case 'upload':
            return (
              <div className={classes.imageWrapper} key={i}>
                <Image
                  image={node.value as Media}
                />
              </div>
            );

          case 'video':
            return (
              <div className={classes.videoWrapper} key={i}>
                <MyReactPlayer
                  url={node.url}
                />
              </div>
            );

          default:
            return (
              <p key={i}>
                <Serialize content={node.children} />
              </p>
            )
        }
      })}
    </Fragment>
  )
}