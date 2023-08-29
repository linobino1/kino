import React from 'react';
import { Content } from './Content';
import { HeaderImage } from './HeaderImage';
import Gallery from './Gallery';
import type { PageLayout } from 'cms/fields/pageLayout';

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
              
            case 'headerImage':
              return <HeaderImage {...block} />;
              
            case 'gallery':
              return <Gallery images={block.images} />;
              
            case 'outlet':
              return children;
          }
        })()}
      </section>
    ))}
  </div>
);

export default Blocks;