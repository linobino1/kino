import type { KronolithCalendarEmbedBlockType } from '@app/types/payload'

type Props = KronolithCalendarEmbedBlockType

export const KronolithCalendarEmbed: React.FC<Props> = ({ url }) => {
  const params = new URL(url).searchParams
  const token = params.get('token')
  const calendar = params.get('calendar')

  if (!token || !calendar) {
    return <div>Misconfigured Kronolith Calendar Embed</div>
  }

  return (
    <iframe
      src={`/api/kronolith.html?calendar=${calendar}&token=${token}`}
      className="h-[700px] w-full"
      width={500}
      height={700}
    />
  )
}
