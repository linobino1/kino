import type { PageLayout } from 'cms/fields/pageLayout';
import React from 'react';
import { Heading } from './Heading';
import { HeaderImage } from './HeaderImage';
import { Content } from './Content';
import { Gallery } from './Gallery';
import { MyReactPlayer } from '../MyReactPlayer';

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  block?: PageLayout['blocks'][0]
}

export const Block: React.FC<BlockProps> = (props) => {
  const { block, children } = props;
  if (!block) return null;
  switch (block.blockType) {
    case 'content':
      return <Content {...block} />;
      
    case 'heading':
      return <Heading {...block} />;
      
    case 'headerImage':
      return <HeaderImage {...block} />;
      
    case 'gallery':
      return <Gallery images={block.images} />;
    
    case 'video':
      return <MyReactPlayer url={block.url} />;

    case 'outlet':
      return children as React.ReactElement;
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