import { Post as PostComponent } from '~/components/Post';
import type { Post } from 'payload/generated-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import classes from './index.module.css';

export type Props = {
  posts: Post[]
}

export const PostsList: React.FC<Props> = ({ posts }) => {
  const { t } = useTranslation(); 

  return posts?.length ? (
    <div className={classes.posts}>
      {posts.map((post) => (
        <div key={post.slug} className={classes.postWrapper}>
          <PostComponent post={post} />
          <hr />
        </div>
      ))}
    </div>
  ) : (
    <div className={classes.empty}>{t('No posts.')}</div>
  );
};

export default PostsList;