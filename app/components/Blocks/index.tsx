import React from 'react';
import type { StaticPage } from 'payload/generated-types';
import { Content } from './Content';
import { Image } from './Image';
import { HeaderImage } from './HeaderImage';

type Layout = StaticPage['layout'];

type Props = {
  layout: Layout
  className?: string
  children?: React.ReactNode
}

const Blocks: React.FC<Props> = ({
  layout, className, children,
}) => (
  <div className={className}>
    {layout?.map((block, i) => (
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