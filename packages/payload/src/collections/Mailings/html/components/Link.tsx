import { type LinkProps, Link as _Link } from '@react-email/components'

type Props = LinkProps & {
  color?: string
}

const Link: React.FC<Props> = ({ color, ...props }) => {
  return (
    <_Link
      {...props}
      style={{
        color: color,
        ...props.style,
      }}
    />
  )
}
export default Link
