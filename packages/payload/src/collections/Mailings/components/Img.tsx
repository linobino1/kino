import { type ImgProps, Img as _Img } from '@react-email/components'

type Props = ImgProps

const Img: React.FC<Props> = ({ ...props }) => {
  return <_Img {...props} src={encodeURI(props.src ?? '')} />
}
export default Img
