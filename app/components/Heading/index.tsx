import React from 'react';

export interface Type extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: string
  children?: React.ReactNode
}

export const Heading: React.FC<Type> = ({ text, children, ...props }) => (
  <h1 {...props}>{text || children}</h1>
);

export default Heading;