import type { PutCampaignRequestBody } from '../types'
import type { Mailing } from '@app/types/payload'
import type { CollectionBeforeChangeHook } from 'payload'
import { env } from '@app/util/env/backend.server'
import { formatDate } from '@app/util/formatDate'
import { CustomAPIError } from '#payload/util/CustomAPIError'

export const updateListmonkCampaign: CollectionBeforeChangeHook<Mailing> = async ({ data }) => {
  if (data.listmonkAction === 'update') {
    if (!data.sendAt) {
      throw new CustomAPIError('Kein Versanddatum festgelegt')
    }
    if (new Date(data.sendAt) < new Date()) {
      throw new CustomAPIError('Versanddatum liegt in der Vergangenheit')
    }
    if (!data.subject) {
      throw new CustomAPIError('Kein Betreff festgelegt')
    }
    if (!data.listmonkCampaignID) {
      throw new CustomAPIError('Keine Listmonk-Kampagnen-ID gegeben')
    }

    const listID = env.LISTMONK_LIST_ID ? parseInt(env.LISTMONK_LIST_ID as string) : NaN
    if (isNaN(listID)) {
      throw new CustomAPIError('LISTMONK_LIST_ID ist nicht definiert oder ungültig')
    }

    // create campaign in listmonk
    const body: PutCampaignRequestBody = {
      name: `${formatDate(data.sendAt, 'yyyy-MM-dd')} ${data.subject}`,
      subject: data.subject,
      lists: [listID],
      type: 'regular',
      content_type: 'html',
      send_at: data.sendAt,
      body: data.html ?? '',
    }

    let res
    try {
      res = await fetch(`${env.LISTMONK_URL}/api/campaigns/${data.listmonkCampaignID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `token ${env.LISTMONK_API_KEY}`,
        },
        body: JSON.stringify(body),
      })
    } catch (e) {
      console.error(e)
      throw new CustomAPIError('Fehler beim Aktualisieren der Kampagne in Listmonk')
    }

    if (!res.ok) {
      console.error(res)
      throw new CustomAPIError('Fehler beim Aktualisieren  der Kampagne in Listmonk')
    }

    return {
      ...data,
      listmonkAction: null,
    }
  }
}
