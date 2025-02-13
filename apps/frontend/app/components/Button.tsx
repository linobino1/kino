import { cn } from '@app/util/cn'

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  look?: 'default' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<Props> = ({ look = 'default', size = 'md', className, ...props }) => {
  return (
    <button
      {...props}
      className={cn(
        'flex w-fit items-center justify-center rounded border px-[1em] py-[0.5em] transition-colors',
        {
          'bg-theme-500 hover:bg-theme-700 border-white text-white hover:text-white':
            look === 'default',
          'border-gray-300 bg-white text-black hover:bg-gray-100 hover:text-black':
            look === 'white',
          'py-[0.3em] text-sm font-normal': size === 'sm',
          'text-lg font-normal': size === 'lg',
        },
        className,
      )}
    />
  )
}
export default Button
