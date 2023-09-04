import type { PageLayout } from 'cms/fields/pageLayout';
import React from 'react';
import { Heading } from './Heading';
import { HeaderImage } from './HeaderImage';
import { Content } from './Content';
import { Gallery } from './Gallery';
import { MyReactPlayer } from '../MyReactPlayer';

type Props = {
  blocks: PageLayout['blocks']
  className?: string
  children?: React.ReactNode
}

const Blocks: React.FC<Props> = ({
  blocks, className, children,
}) => (
  <div className={className}>
    {blocks?.map((block, i) => (
      <section key={i} className={block.blockType}>
        { (() => {
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
              return children;
          }
        })()}
      </section>
    ))}
  </div>
);

export default Blocks;