import { cn } from '@app/util/cn'

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  look?: 'default' | 'white' | 'red' | 'black'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<Props> = ({ look = 'default', size = 'md', className, ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        'flex w-fit items-center justify-center font-semibold tracking-tight shadow transition-colors',
        {
          'bg-theme-400 hover:bg-theme-300 text-white': look === 'default',
          'bg-red-500 text-white hover:bg-red-400': look === 'red',
          'hover:bg-theme-800 bg-black text-white': look === 'black',
          'border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black':
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
