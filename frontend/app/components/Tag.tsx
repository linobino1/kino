import { cn } from '~/util/cn'

type Props = {
  color?: 'turquoise'
  children: React.ReactNode
}

const Tag: React.FC<Props> = ({ color = 'turquoise', children }) => {
  return (
    <div
      className={cn(
        'inline-flex max-w-[15em] rounded-lg px-[0.5em] py-[0.2em] text-center text-sm font-semibold leading-none text-white',
        {
          'bg-turquoise-500': color === 'turquoise',
        },
      )}
    >
      {children}
    </div>
  )
}
export default Tag
