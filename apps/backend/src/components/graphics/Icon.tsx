import type { Media } from '@app/types/payload'
import type { ServerComponentProps } from 'payload'

export const Icon: React.FC<ServerComponentProps> = async ({ payload }) => {
  const { favicon } = await payload.findGlobal({
    slug: 'site',
    select: {
      favicon: true,
    },
  })
  return <img src={(favicon as Media).url as string} className="" />
}
