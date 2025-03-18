import { cn } from '@app/util/cn'
import { Button, type Props as ButtonProps } from './Button'

type Props = ButtonProps & {}

export const CTAButton: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <Button look="white" size="lg" className={cn('group flex items-center', className)} {...props}>
      {children}
      <span className="i-material-symbols:arrow-forward translate-x-1 text-lg transition-transform group-hover:translate-x-2" />
    </Button>
  )
}
