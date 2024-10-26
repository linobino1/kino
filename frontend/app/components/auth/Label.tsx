import { cn } from '~/util/cn'

type Props = React.HTMLProps<HTMLLabelElement>

export const Label: React.FC<Props> = ({ className, ...props }) => {
  return <label {...props} className={cn('flex flex-col items-center', className)} />
}
export default Label
