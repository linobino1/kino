import { cn } from '@app/util/cn'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  color?: 'turquoise'
  children: React.ReactNode
}

export const Tag: React.FC<Props> = ({ color = 'turquoise', className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        className,
        'inline-flex max-w-[15em] rounded-lg px-[0.5em] py-[0.2em] text-center text-sm font-semibold leading-none text-white',
        {
          'bg-turquoise-500': color === 'turquoise',
        },
      )}
    />
  )
}
