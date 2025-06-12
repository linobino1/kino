import { unauthorized } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayloadClient } from '#payload/util/getPayloadClient'
import { renderMailing } from '#payload/collections/Mailings/html/renderMailing'
import { ClientOnly } from '@/components/ClientOnly'

export const dynamic = 'force-dynamic'

type Component = 'mailing'

export default async function Page({ params }: { params: Promise<{ args: string[] }> }) {
  const { args } = await params
  const component = args[0] as Component

  const payload = await getPayloadClient()
  const { user } = await payload.auth({
    headers: await headers(),
  })

  if (!user) {
    unauthorized()
  }

  switch (component) {
    case 'mailing':
      const id = args[1]

      if (!id) {
        return <p>Missing mailing ID</p>
      }

      const html = await renderMailing(id, true)

      return (
        <ClientOnly>
          <div dangerouslySetInnerHTML={{ __html: html }} className="mx-auto max-w-[700px]" />
        </ClientOnly>
      )
    default:
      throw new Error('Invalid component')
  }
}
