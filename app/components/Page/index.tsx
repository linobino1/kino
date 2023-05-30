import Blocks from "../Blocks";
import React from "react";
import classes from "./index.module.css";
import type { PageLayout } from "cms/fields/pageLayout";

export type Type = {
  layout?: PageLayout
  children?: React.ReactNode
}

export const Page: React.FC<Type> = ({
  layout, children,
}) => (
  <div className={classes.page} data-layout-type={layout?.type}>
    { layout?.blocks ? (
      <Blocks
        blocks={layout.blocks}
      >
        {children}
      </Blocks>
    ) : children}
  </div>
);

export default Page;
