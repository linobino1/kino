import { type ContainerProps, Container } from '@react-email/components'
import { cn } from '@app/util/cn'

const Gutter: React.FC<ContainerProps> = ({ className, ...props }) => {
  return <Container {...props} className={cn('px-1 max-sm:px-4', className)} />
}
export default Gutter
