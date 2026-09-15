import { cn } from '@app/util/cn'

export type Props<T extends React.ElementType = 'button'> = {
  as?: T
} & {
  look?: 'default' | 'white' | 'red' | 'black'
  size?: 'sm' | 'md' | 'lg'
} & Omit<React.ComponentProps<T>, 'as'>

export function Button<T extends React.ElementType = 'button'>({
  as,
  look = 'default',
  size = 'md',
  className,
  ...props
}: Props<T>) {
  const Component = as ?? 'button'

  return (
    <Component
      {...props}
      className={cn(
        'flex w-fit cursor-pointer items-center justify-center font-semibold tracking-tight shadow transition-colors',
        {
          'bg-theme-400 enabled:hover:bg-theme-300 text-white': look === 'default',
          'bg-red-500 text-white enabled:hover:bg-red-400': look === 'red',
          'enabled:hover:bg-theme-800 bg-black text-white': look === 'black',
          'border-gray-300 bg-white text-black enabled:hover:bg-gray-100 enabled:hover:text-black':
            look === 'white',
        },
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'px-6 py-2 text-lg font-medium tracking-normal': size === 'lg',
        },
        className,
      )}
    />
  )
}
