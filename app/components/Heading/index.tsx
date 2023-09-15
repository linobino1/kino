import React from 'react';

export type Type = {
  text?: string
}

export const Heading: React.FC<Type> = ({ text }) => (
  <h1>{text}</h1>
);

export default Heading;