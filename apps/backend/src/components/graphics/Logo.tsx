import type { Media } from '@app/types/payload'
import type { ServerComponentProps } from 'payload'

export const Logo: React.FC<ServerComponentProps> = async ({ payload }) => {
  const { logo } = await payload.findGlobal({
    slug: 'site',
    select: {
      logo: true,
    },
  })
  return (
    <div className="flex w-full items-center justify-center rounded bg-white p-4">
      <img src={(logo as Media).url as string} alt="Logo" className="max-w-[320px]" />
    </div>
  )
}
