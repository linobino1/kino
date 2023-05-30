import React from 'react';
import { Content } from './Content';
import { Image } from './Image';
import { HeaderImage } from './HeaderImage';

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

            case 'image':
              return <Image {...block} />;
              
            case 'headerImage':
              return <HeaderImage {...block} />;
              
            case 'outlet':
              return (
                <main>
                  {children}
                </main>
              )
          }
        })()}
      </section>
    ))}
  </div>
);

export default Blocks;