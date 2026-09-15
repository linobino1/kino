import { cn } from '@app/util/cn'
import { Button } from './Button'
import { Icon } from '@iconify/react'
import arrow from '@iconify-icons/material-symbols/arrow-forward'

type Props = React.ComponentPropsWithoutRef<typeof Button> & {
  icon?: 'arrow'
}

export const CTAButton: React.FC<Props> = ({ icon, children, className, ...props }) => (
  <Button
    {...props}
    look="white"
    size="lg"
    className={cn(
      'flex items-center disabled:opacity-50 [&:enabled:hover_.cta-button-arrow]:translate-x-2',
      className,
    )}
  >
    {children}
    {icon === 'arrow' ? (
      <Icon icon={arrow} className="cta-button-arrow translate-x-1 text-lg transition-transform" />
    ) : null}
  </Button>
)
