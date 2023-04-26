import Blocks from "../Blocks";
import type { StaticPage } from "payload/generated-types";
import React from "react";
import classes from "./index.module.css";

export type Type = {
  layout?: StaticPage['layout']
  children?: React.ReactNode
}

export const Page: React.FC<Type> = ({
  layout, children,
}) => layout ? (
  <Blocks layout={layout} className={classes.page}>
    {children}
  </Blocks>
) : (
  <div className={classes.page}>
    {children}
  </div>
);

export default Page;
