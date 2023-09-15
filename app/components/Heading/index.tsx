import React from 'react';

export type Type = {
  text?: string
  children?: React.ReactNode
}

export const Heading: React.FC<Type> = ({ text, children }) => (
  <h1>{text || children}</h1>
);

export default Heading;