import React from 'react';
import classes from './index.module.css';

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

const onPaginate = (page: number) => {
  window.open(`?page=${page}`, '_self');
}

export const Pagination: React.FC<Props> = (props) => {
  return (
    <div className={classes.container}>
      <button
        type='button'
        className={classes.prev}
        disabled={!props.hasPrevPage}
        onClick={() => onPaginate(props.prevPage as number)}
      >&lt;</button>
      <div className={classes.current}>
        {props.page} / {props.totalPages}
      </div>
      <button
        type='button'
        className={classes.next}
        disabled={!props.hasNextPage}
        onClick={() => onPaginate(props.nextPage as number)}
      >&gt;</button>
    </div>
  )
};

export default Pagination;
