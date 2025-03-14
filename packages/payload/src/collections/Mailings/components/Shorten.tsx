import Link from './Link'

type ShortenProps = {
  text: string
  length?: number
  moreLabel?: string
  moreLink?: string
  color: string
}

const Shorten: React.FC<ShortenProps> = ({
  text,
  length = 400,
  moreLabel = 'weiterlesen',
  moreLink,
  color,
}) => {
  if (text.length <= length) {
    return <>{text}</>
  }

  return (
    <>
      {text.slice(0, length - 20).trim()}
      {'... '}
      {moreLink ? (
        <Link href={moreLink} color={color}>
          {moreLabel}
        </Link>
      ) : null}
    </>
  )
}
export default Shorten
