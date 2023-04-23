import React from 'react';
import RichText from '~/components/RichText';
import classes from './index.module.css';

export type Type = {
  blockType: 'content'
  blockName?: string
  content?: unknown
}

export const Content: React.FC<Type> = ({ content }) => (
  <div className={classes.container}>
    <RichText
      content={content}
    />
  </div>
);

export default Content;