import { Link } from '@react-email/components'

type ShortenProps = {
  text: string
  length?: number
  moreLabel?: string
  moreLink?: string
}

const Shorten: React.FC<ShortenProps> = ({
  text,
  length = 400,
  moreLabel = 'weiterlesen',
  moreLink,
}) => {
  if (text.length <= length) {
    return <>{text}</>
  }

  return (
    <>
      {text.slice(0, length - 20)}
      {'... '}
      {moreLink ? <Link href={moreLink}>{moreLabel}</Link> : null}
    </>
  )
}
export default Shorten
