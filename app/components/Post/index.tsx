import React from 'react';
import classes from './index.module.css';
import type { Media, Post as PostType } from 'payload/generated-types';
import RichText from '~/components/RichText';
import { Date } from '~/components/Date';
import Image from '~/components/Image';

type Props = {
  post: PostType
};

export const Post: React.FC<Props> = ({ post }) => (
  <div className={classes.post}>

    <Date className={classes.postDate} iso={post.date} format='PPP' />
    <h2 className={classes.postTitle}>{post.title}</h2>

    <div className={classes.postPreview}>
      <div className={classes.postImageWrapper}>
        {post.link ? (
          <a href={post.link}>
            <Image image={post.header as Media} />
          </a>
        ) : (
          <Image image={post.header as Media} />
        )}
      </div>
      <RichText content={post.content} className={classes.postContent} />
    </div>
  </div>
);
