import React from "react";
import { Serialize } from "./Serialize";
import classes from "./index.module.css";

export const RichText: React.FC<{
  className?: string;
  content: any;
}> = ({ className, content }) => {
  if (!content) return null;

  return (
    <div className={[classes.container, className].filter(Boolean).join(" ")}>
      <Serialize content={content} />
    </div>
  );
};

export const RichTextPlain: ({ content }: { content: any }) => string = ({
  content,
}) => {
  return "s";
};

export default RichText;
