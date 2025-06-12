import { type ContainerProps, Container, Head } from '@react-email/components'
import { cn } from '@app/util/cn'

const Gutter: React.FC<ContainerProps> = ({ className, ...props }) => {
  return (
    <>
      {/* the <Head> component is somehow required for the tailwind media queries to work */}
      <Head />
      <Container {...props} className={cn('px-4 sm:px-1', className)} />
    </>
  )
}
export default Gutter
