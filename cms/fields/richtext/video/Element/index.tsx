/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { useFocused, useSelected } from "slate-react";
import VideoIcon from "../Icon";

import "./index.scss";

const baseClass = "rich-text-video";

const Element = (props: any) => {
  const { attributes, children, element } = props;
  const { url } = element as { url: string };
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div
      className={[baseClass, selected && focused && `${baseClass}--selected`]
        .filter(Boolean)
        .join(" ")}
      contentEditable={false}
      {...attributes}
    >
      <div className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__label`}>
          <VideoIcon />
          <div className={`${baseClass}__title`}>{url}</div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Element;
