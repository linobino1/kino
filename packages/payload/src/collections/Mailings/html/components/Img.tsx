import type { Media } from '@app/types/payload'
import type { BackendServerEnvironment } from '@app/util/env/index'
import { getMediaUrl } from '@app/util/media/getMediaUrl'
import { type ImgProps, Img as _Img } from '@react-email/components'

type Props = Omit<ImgProps, 'src'> & {
  media: Media
}

const Img: React.FC<Props> = ({ media, ...props }) => {
  return <_Img {...props} src={getMediaUrl(media, process.env as BackendServerEnvironment)} />
}
export default Img
