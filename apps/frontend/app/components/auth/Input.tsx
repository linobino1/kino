import { cn } from '@app/util/cn'

type Props = React.HTMLProps<HTMLInputElement>

export const Input: React.FC<Props> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={cn('min-w-[min(90vw,15em)] rounded-sm border px-2 py-1', className)}
    />
  )
}
