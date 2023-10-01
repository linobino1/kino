import type { PageLayout } from 'cms/fields/pageLayout';
import React from 'react';
import type { Media } from 'payload/generated-types';
import { Heading } from '../Heading';
import { HeaderImage } from '../HeaderImage';
import { Gallery } from '../Gallery';
import { MyReactPlayer } from '../MyReactPlayer';
import { Image } from '../Image';
import { RichText } from '../RichText';
import classes from './index.module.css';

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  block?: PageLayout['blocks'][0]
}

export const Block: React.FC<BlockProps> = ({ block, ...props }) => {
  const { children } = props;
  if (!block) return null;
  return (
    <div className={classes.block} data-type={block.blockType}>
      { (() => {
        switch (block.blockType) {
          case 'content':
            return <RichText content={block.content} />;
            
          case 'heading':
            return <Heading text={block.text} />;
            
          case 'headerImage':
            return <HeaderImage {...block} />;
            
          case 'image':
            return <Image
              image={block.image as Media}
              width={'100%'}
              height={'auto'}
              style={{ marginBlock: '1rem' }}
            />;
            
          case 'gallery':
            return <Gallery images={block.images} />;
          
          case 'video':
            return <MyReactPlayer url={block.url} />;
    
          default:
          case 'outlet':
            return children as React.ReactElement;
        }
      })()}
    </div>
  )
}

export interface BlocksProps extends React.HTMLAttributes<HTMLDivElement> {
  blocks: PageLayout['blocks']
}

export const Blocks: React.FC<BlocksProps> = ({ blocks, children, ...props }) => (
  <div {...props}>
    {blocks?.map((block, i) => (
      <Block key={i} block={block}>
        {children}
      </Block>
    ))}
  </div>
);


export default Blocks;