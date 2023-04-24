import React from 'react';
import type { Media } from 'payload/generated-types';
import PageHeader from '~/components/PageHeader';

export type Type = {
  blockType: 'headerImage'
  blockName?: string
  image?: Media | string
}

export const HeaderImage: React.FC<Type> = ({ image }) => {
  return (
    <PageHeader image={image} />
  )
};

export default HeaderImage;
