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
        <Gutter>
          <RichText content={block.content} />
        </Gutter>
      );

    case "heading":
      return <Heading text={block.text ?? undefined} />;

    case "headerImage":
      return <HeaderImage {...block} />;

    case "image":
      return (
        <Gutter>
          <Image
            image={block.image as Media}
            width={"100%"}
            height={"auto"}
            style={{ marginBlock: "1rem" }}
          />
        </Gutter>
      );

    case "gallery":
      return (
        <Gutter>
          <Gallery images={block.images} />;
        </Gutter>
      );

    case "video":
      return (
        <Gutter>
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
