import { cn } from '@app/util/cn'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  aside?: React.ReactNode
}

export const AsideLayout: React.FC<Props> = ({ aside, children, className, ...props }) => (
  <div
    className={cn(
      'grid grid-cols-1 gap-4',
      {
        'sm:grid-cols-[220px_auto]': aside,
        'md:grid-cols-[260px_auto]': aside,
      },
      className,
    )}
    {...props}
  >
    {aside && <aside className="">{aside}</aside>}
    <div className="">{children}</div>
  </div>
)
