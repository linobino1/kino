import React from 'react'
import type { Media, Page } from '@app/types/payload'
import { Gallery } from '../Gallery'
import { MyReactPlayer } from '../MyReactPlayer'
import { Image } from '../Image'
import { RichText } from '../RichText'
import { Gutter } from '../Gutter'
import { EventsBlock } from './EventsBlock'
import { KronolithCalendarEmbed } from './KronolithCalendarEmbed'

type Block = NonNullable<Page['blocks']>[number]

type BlockProps = React.HTMLAttributes<HTMLDivElement> & {
  block: Block
}

const RenderBlock: React.FC<BlockProps> = ({ block }) => {
  switch (block.blockType) {
    case 'content':
      return (
        <Gutter size="small">
          <RichText content={block.content} />
        </Gutter>
      )

    case 'image':
      return (
        <Gutter size="small">
          <Image
            image={block.image as Media}
            width={'100%'}
            height={'auto'}
            style={{ marginBlock: '1rem' }}
            srcSet={[
              { options: { width: 500 }, size: '500w' },
              { options: { width: 720 }, size: '720w' },
              { options: { width: 1440 }, size: '1440w' },
            ]}
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </Gutter>
      )

    case 'gallery':
      return (
        <Gutter size="small">
          <Gallery images={block.images?.map((item) => item.image as Media) ?? []} />
        </Gutter>
      )

    case 'video':
      return (
        <Gutter size="small">
          <MyReactPlayer url={block.url} />;
        </Gutter>
      )

    case 'events':
      return (
        <Gutter>
          <EventsBlock {...block} />
        </Gutter>
      )

    case 'kronolithCalendarEmbed':
      return (
        <Gutter size="small">
          <KronolithCalendarEmbed {...block} />
        </Gutter>
      )

    default:
      // @ts-expect-error if all types are implemented, this is not possible...
      return <p>{`unimplemented block type ${block.blockType}`}</p>
  }
}

export interface BlocksProps extends React.HTMLAttributes<HTMLDivElement> {
  blocks: Block[]
}

export const RenderBlocks: React.FC<BlocksProps> = ({ blocks, ...props }) => {
  if (!Array.isArray(blocks)) return null
  return (
    <div {...props}>
      {blocks.map((block, index) => (
        <RenderBlock key={index} block={block} />
      ))}
    </div>
  )
}
