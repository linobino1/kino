import Blocks from "../Blocks";
import React from "react";
import classes from "./index.module.css";
import type { PageLayout } from "cms/fields/pageLayout";

export type Type = {
  layout: PageLayout
  children?: React.ReactNode
}

export const Page: React.FC<Type> = ({
  layout, children,
}) => (
  <div className={classes.page} data-layout-type={layout.type}>
    <Blocks
      blocks={layout.blocks}
    >
      {children}
    </Blocks>
  </div>
);

export default Page;
