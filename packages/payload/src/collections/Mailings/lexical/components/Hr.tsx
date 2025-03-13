import { type HrProps, Hr as _Hr } from '@react-email/components'

type Props = HrProps & {
  color?: string
}

const Hr: React.FC<Props> = ({ color, ...props }) => {
  return (
    <_Hr
      {...props}
      style={{
        borderColor: color,
        borderStyle: 'dotted',
        borderBottomWidth: '4px',
        borderTopWidth: 0,
        marginBlock: '1em',
        ...props.style,
      }}
    />
  )
}
export default Hr
