import { Icon } from '@iconify/react'
import arrow from '@iconify-icons/material-symbols/arrow-forward'
import download from '@iconify-icons/material-symbols/download'
import external from '@iconify-icons/material-symbols/open-in-new'
import play from '@iconify-icons/material-symbols/play-arrow'
import { cn } from '@app/util/cn'

export type ButtonIconName = 'arrow' | 'download' | 'external' | 'play'

const icons = {
  arrow,
  download,
  external,
  play,
}

type Props = {
  icon: ButtonIconName
  className?: string
}

export const ButtonIcon: React.FC<Props> = ({ icon, className }) => (
  <Icon
    icon={icons[icon]}
    aria-hidden="true"
    className={cn(
      'text-lg',
      {
        'button-icon-arrow translate-x-1 transition-transform': icon === 'arrow',
        'translate-y-px': icon === 'download',
        'transition-transform': icon === 'play',
      },
      className,
    )}
  />
)
