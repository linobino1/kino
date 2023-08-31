import type { RemixLinkProps } from '@remix-run/react/dist/components';
import React from 'react';
import classes from './index.module.css';
import { Link } from '@remix-run/react';

export interface Props extends React.HTMLAttributes<HTMLElement> {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
  limit: number;
  page?: number;
  pagingCounter: number;
  totalDocs: number;
  totalPages: number;
  linkProps?: Omit<RemixLinkProps, 'to'>;
}

export const Pagination: React.FC<Props> = (props) => {
  return props.totalPages > 1 ? (
    <div className={classes.container}>
      <Link
        to={`?page=${props.prevPage || props.totalPages}`}
        className={classes.prev}
        prefetch='intent'
        aria-disabled={!props.hasPrevPage}
        {...props.linkProps}
      >&lt;</Link>
      <div className={classes.current}>
        {props.page} / {props.totalPages}
      </div>
      <Link
        to={`?page=${props.nextPage || props.totalPages}`}
        className={classes.next}
        aria-disabled={!props.hasNextPage}
        {...props.linkProps}
      >&gt;</Link>
    </div>
  ) : null;
};

export default Pagination;
