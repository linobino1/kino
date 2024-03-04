import type { PageLayout } from "cms/fields/pageLayout";
import React from "react";
import type { Media } from "payload/generated-types";
import { Heading } from "../Heading";
import { HeaderImage } from "../HeaderImage";
import { Gallery } from "../Gallery";
import { MyReactPlayer } from "../MyReactPlayer";
import { Image } from "../Image";
import { RichText } from "../RichText";
import Gutter from "../Gutter";

export interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
  block?: PageLayout["blocks"][0];
}

export const Block: React.FC<BlockProps> = ({ block, ...props }) => {
  const { children } = props;
  if (!block) return null;
  switch (block.blockType) {
    case "content":
      return (
        <Gutter size="small">
          <RichText content={block.content} />
        </Gutter>
      );

    case "heading":
      return <Heading text={block.text ?? undefined} />;

    case "headerImage":
      const { blockType, blockName, id, ...props } = block;
      return <HeaderImage {...props} />;

    case "image":
      return (
        <Gutter size="small">
          <Image
            image={block.image as Media}
            width={"100%"}
            height={"auto"}
            style={{ marginBlock: "1rem" }}
            srcSet={[
              { options: { width: 500 }, size: "500w" },
              { options: { width: 720 }, size: "720w" },
              { options: { width: 1440 }, size: "1440w" },
            ]}
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </Gutter>
      );

    case "gallery":
      return (
        <Gutter size="small">
          <Gallery images={block.images} />
        </Gutter>
      );

    case "video":
      return (
        <Gutter size="small">
          <MyReactPlayer url={block.url} />;
        </Gutter>
      );

    default:
    case "outlet":
      return children as React.ReactElement;
  }
};

export interface BlocksProps extends React.HTMLAttributes<HTMLDivElement> {
  blocks: PageLayout["blocks"];
}

export const Blocks: React.FC<BlocksProps> = ({
  blocks,
  children,
  ...props
}) => (
  <div {...props}>
    {blocks?.map((block, i) => (
      <Block key={i} block={block}>
        {children}
      </Block>
    ))}
  </div>
);

export default Blocks;
