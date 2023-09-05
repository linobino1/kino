import type { Post } from 'payload/generated-types';
import type { Media } from 'payload/generated-types';
import React from 'react';
import Date from '~/components/Date';
import Image from '~/components/Image';
import RichText from '~/components/RichText';
import classes from './index.module.css';
import { useTranslation } from 'react-i18next';
import { Link } from '@remix-run/react';
import type { LinkableCollection } from 'cms/fields/url';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export const PostPreview: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { post } = props;
  let link: string | undefined;
  switch (post.link?.type) {
    case 'internal':
      link = (post.link.doc?.value as LinkableCollection)?.url;
      break;
    case 'external':
      link = post.link?.url;
      break;
    case 'none':
      link = post.details?.length ? post.url : undefined;
  }
  return (
    <div
      {...props}
      className={`${classes.container} ${props.className}`}
    >
      <Image
        image={post.header as Media}
        onClick={link ? () => window.open(link, '_self') : undefined}
        className={post.link ? classes.link : undefined}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <Date className={classes.date} iso={post.date} format='PPP' />
      <h2>{post.title}</h2>
      <RichText content={post.content} className={classes.content} />
      { post.details?.length ? (
        <Link
          className={classes.more}
          to={post.url}
        >{t('Read more')}</Link>
      ) : null}
    </div>
  )
}

export default PostPreview;