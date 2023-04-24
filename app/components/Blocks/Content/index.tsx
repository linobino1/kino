import React from 'react';
import RichText from '~/components/RichText';

export type Type = {
  blockType: 'content'
  blockName?: string
  content?: unknown
}

export const Content: React.FC<Type> = ({ content }) => (
  <RichText
    content={content}
  />
);

export default Content;