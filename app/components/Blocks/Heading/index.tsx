import React from 'react';

export type Type = {
  blockType: 'heading'
  blockName?: string
  text?: string
}

export const Heading: React.FC<Type> = ({ text }) => (
  <h1>{text}</h1>
);

export default Heading;