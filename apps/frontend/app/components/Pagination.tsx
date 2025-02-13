import { type PaginatedDocs } from 'payload'
import { Link, useSearchParams } from 'react-router';
import { classes } from '~/classes'
import { cn } from '@app/util/cn'
import type { LinkProps } from 'react-router';

export type Props = React.HTMLAttributes<HTMLDivElement> &
  PaginatedDocs & {
    linkProps?: Omit<LinkProps, 'to'>
  }

type PageLinkProps = Omit<LinkProps, 'to'> & {
  to: string
  disabled: boolean
}
const PageLink: React.FC<PageLinkProps> = ({ to, disabled, ...props }) => (
  <Link
    {...props}
    to={to}
    className={cn('text-xl', { 'opacity-50': disabled })}
    prefetch="intent"
    aria-disabled={disabled}
  />
)

export const Pagination: React.FC<Props> = ({
  linkProps,
  page,
  nextPage,
  hasNextPage,
  prevPage,
  hasPrevPage,
  totalPages,
  // we don't want to pass these to the div
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  docs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalDocs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  limit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pagingCounter,
  className,
  ...props
}) => {
  const [searchParams] = useSearchParams()

  searchParams.set('page', `${nextPage || totalPages}`)
  const next = `?${searchParams.toString()}`

  searchParams.set('page', `${prevPage || totalPages}`)
  const prev = `?${searchParams.toString()}`

  return totalPages > 1 ? (
    <div
      {...props}
      className={cn('mx-auto grid w-[20em] grid-cols-3 items-center text-center', className)}
    >
      <PageLink to={prev} disabled={!hasPrevPage} {...linkProps}>
        &lt;
      </PageLink>
      <div className={classes.current}>
        {page} / {totalPages}
      </div>
      <PageLink to={next} disabled={!hasNextPage} {...linkProps}>
        &gt;
      </PageLink>
    </div>
  ) : null
}

export default Pagination
