import type { KronolithCalendarEmbedBlockType } from '@app/types/payload'
import { Suspense } from 'react'

type Props = KronolithCalendarEmbedBlockType

const KronolithCalendarEmbed: React.FC<Props> = ({ url }) => {
  return (
    <Suspense fallback="Error loading Kronolith calendar">
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <div id="kronolithCal"></div>
          <script src="${url}" type="text/javascript"></script>
          `,
        }}
      />
      <style>
        {`
        .kronolith_embedded {
            overflow-x: scroll;
        }
        .kronolith_embedded .title {
          margin-bottom: 0.5em;
        }
        .kronolith_embedded .title a {
            color: white !important;
        }
      `}
      </style>
    </Suspense>
  )
}
export default KronolithCalendarEmbed
