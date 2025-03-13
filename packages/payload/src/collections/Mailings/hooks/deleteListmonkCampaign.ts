import type { Mailing } from '@app/types/payload'
import type { CollectionBeforeChangeHook } from 'payload'
import { CustomAPIError } from '#payload/util/CustomAPIError'
import { env } from '@app/util/env/backend.server'

export const deleteListmonkCampaign: CollectionBeforeChangeHook<Mailing> = async ({ data }) => {
  if (data.listmonkAction === 'delete') {
    if (data.listmonkCampaignID) {
      let res
      try {
        res = await fetch(`${env.LISTMONK_URL}/api/campaigns/${data.listmonkCampaignID}`, {
          method: 'DELETE',
          headers: {
            Authorization: `token ${env.LISTMONK_API_KEY}`,
          },
        })
      } catch (e) {
        console.error(e)
        throw new CustomAPIError('Fehler beim Löschen der Kampagne in Listmonk')
      }

      if (!res.ok) {
        // this means the campaign was not found, propably because it was already deleted manually
      }
    }

    return {
      ...data,
      listmonkAction: null,
      listmonkCampaignID: null,
    }
  }
}
