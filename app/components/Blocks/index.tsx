import type { PageLayout } from 'cms/fields/pageLayout';
import React from 'react';
import type { Media } from 'payload/generated-types';
import { Heading } from './Heading';
import { HeaderImage } from './HeaderImage';
import { Content } from './Content';
import { Gallery } from './Gallery';
import { MyReactPlayer } from '../MyReactPlayer';
import { Image } from '../Image';
import classes from './index.module.css';

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  block?: PageLayout['blocks'][0]
}

export const Block: React.FC<BlockProps> = (props) => {
  const { block, children } = props;
  if (!block) return null;
  switch (block.blockType) {
    case 'content':
      return (
        <section className={classes.block} data-type={block.blockType}>
          <Content {...block} />;
        </section>
      );
    case 'heading':
      return (
        <section className={classes.block} data-type={block.blockType}>
          <Heading {...block} />
        </section>
      );
      
    case 'headerImage':
      return (
        <section className={classes.block} data-type={block.blockType}>
          <HeaderImage {...block} />
        </section>
      );
    case 'image':
      return (
        <section className={classes.block} data-type={block.blockType}>
          <Image
            image={block.image as Media}
            width={'100%'}
            height={'auto'}
            style={{ marginBlock: '1rem' }}
          />
        </section>
      );
    case 'gallery':
      return (
        <section className={classes.block} data-type={block.blockType}>
          <Gallery images={block.images} />
        </section>
      );
    case 'video':
      return (
        <section className={classes.block} data-type={block.blockType}>
          <MyReactPlayer url={block.url} />
        </section>
      );
    case 'outlet':
      return (
        <section className={classes.block} data-type={block.blockType}>
          {children}
        </section>
      );
  }
}

export interface BlocksProps extends React.HTMLAttributes<HTMLDivElement> {
  blocks: PageLayout['blocks']
}

export const Blocks: React.FC<BlocksProps> = (props) => {
  const { blocks, children } = props;
  return (
    <div {...props}>
      {blocks?.map((block, i) => (
        <Block key={i} block={block}>
          {children}
        </Block>
      ))}
    </div>
  );
};


export default Blocks;