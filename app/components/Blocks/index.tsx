import React from 'react';
import type { Page } from 'payload/generated-types';
import { Content } from '~/components/Blocks/Content';
import { Image } from '~/components/Blocks/Image';

type Layout = Page['layout'];

type Props = {
  layout: Layout
  className?: string
}

const Blocks: React.FC<Props> = ({
  layout, className,
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
          }
        })()}
      </section>
    ))}
  </div>
);

export default Blocks;