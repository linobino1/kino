import type { Screening } from "payload/generated-types";
import React from "react";
import classes from "./index.module.css";
import RichText from "../RichText";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  screening: Screening;
}

export const ScreeningInfo: React.FC<Props> = (props) => {
  const { screening } = props;

  return screening.info ? (
    <RichText className={classes.info} content={screening.info} />
  ) : null;
};

export default ScreeningInfo;
