import { RawHTMLBlockType } from '@/payload-types'

type Props = RawHTMLBlockType

const RawHtmlBlock: React.FC<Props> = ({ html }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}
export default RawHtmlBlock
