import Blocks from "../Blocks";
import React from "react";
import classes from "./index.module.css";
import type { PageLayout } from "cms/fields/pageLayout";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  layout?: PageLayout
  layoutType?: PageLayout['type']
  children?: React.ReactNode
}

export const Page: React.FC<Props> = (props) => {
  const { layout, children } = props;
  return (
    <div
      {...props}
      data-layout-type={layout?.type || props.layoutType || 'default'}
      className={`${classes.page} ${props.className}`}
    >
      { layout?.blocks ? (
        <Blocks blocks={layout.blocks} className={classes.blocks}>
          {children}
        </Blocks>
      ) : children}
    </div>
  )
};

export default Page;
