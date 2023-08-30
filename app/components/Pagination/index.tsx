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
}

export const Pagination: React.FC<Props> = (props) => {
  return props.totalPages > 1 ? (
    <div className={classes.container}>
      <Link
        to={`?page=${props.prevPage || props.totalPages}`}
        className={classes.prev}
        prefetch='intent'
        preventScrollReset={true}
        aria-disabled={!props.hasPrevPage}
      >&lt;</Link>
      <div className={classes.current}>
        {props.page} / {props.totalPages}
      </div>
      <Link
        to={`?page=${props.nextPage || props.totalPages}`}
        className={classes.next}
        prefetch='intent'
        preventScrollReset={true}
        aria-disabled={!props.hasNextPage}
      >&gt;</Link>
    </div>
  ) : null;
};

export default Pagination;
