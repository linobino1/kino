import Blocks from "../Blocks";
import React from "react";
import classes from "./index.module.css";
import type { PageLayout } from "cms/fields/pageLayout";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  layout?: PageLayout
  children?: React.ReactNode
}

export const Page: React.FC<Props> = (props) => {
  const { layout, children } = props;
  return (
    <div
      className={`${classes.page} ${props.className}`}
      data-layout-type={layout?.type}
      {...props}
    >
      { layout?.blocks ? (
        <Blocks
          blocks={layout.blocks}
        >
          {children}
        </Blocks>
      ) : children}
    </div>
  )
};

export default Page;
