import type { RemixLinkProps } from "@remix-run/react/dist/components";
import React from "react";
import classes from "./index.module.css";
import { Link, useSearchParams } from "@remix-run/react";

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
  linkProps?: Omit<RemixLinkProps, "to">;
}

export const Pagination: React.FC<Props> = (props) => {
  const [searchParams] = useSearchParams();

  searchParams.set("page", `${props.nextPage || props.totalPages}`);
  const next = `?${searchParams.toString()}`;

  searchParams.set("page", `${props.prevPage || props.totalPages}`);
  const prev = `?${searchParams.toString()}`;

  return props.totalPages > 1 ? (
    <div className={classes.container}>
      <Link
        to={prev}
        className={classes.prev}
        prefetch="intent"
        aria-disabled={!props.hasPrevPage}
        {...props.linkProps}
      >
        &lt;
      </Link>
      <div className={classes.current}>
        {props.page} / {props.totalPages}
      </div>
      <Link
        to={next}
        className={classes.next}
        aria-disabled={!props.hasNextPage}
        {...props.linkProps}
      >
        &gt;
      </Link>
    </div>
  ) : null;
};

export default Pagination;
