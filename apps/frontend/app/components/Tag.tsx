import { cn } from '@app/util/cn'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}

export const Tag: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        className,
        'bg-theme-400 inline-flex max-w-[15em] px-[0.5em] py-[0.3em] text-center text-sm font-semibold leading-none tracking-tight text-white hover:bg-black',
      )}
    />
  )
}
