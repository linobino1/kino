import { cn } from '@app/util/cn'
import { Button } from './Button'
import { ButtonIcon, type ButtonIconName } from './ButtonIcon'

type Props = React.ComponentPropsWithoutRef<typeof Button> & {
  icon?: ButtonIconName
}

export const CTAButton: React.FC<Props> = ({ icon, children, className, ...props }) => (
  <Button
    {...props}
    look="white"
    size="lg"
    className={cn(
      'flex items-center disabled:opacity-50 [&:enabled:hover_.button-icon-arrow]:translate-x-2',
      className,
    )}
  >
    {children}
    {icon ? <ButtonIcon icon={icon} /> : null}
  </Button>
)
