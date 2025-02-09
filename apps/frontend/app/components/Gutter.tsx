import { cn } from '~/util/cn'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large'
}

export const Gutter: React.FC<Props> = ({ size = 'medium', className, ...props }) => {
  return (
    <div
      className={cn(
        {
          'mx-auto w-full max-w-[96vw]': true,
          'sm:max-w-[min(45rem,96vw)]': size === 'small',
          'lg:max-w-[min(60rem,96vw)]': size === 'medium',
          'xl:max-w-[min(80rem,96vw)]': size === 'large',
        },
        className,
      )}
    >
      {props.children}
    </div>
  )
}

export default Gutter
