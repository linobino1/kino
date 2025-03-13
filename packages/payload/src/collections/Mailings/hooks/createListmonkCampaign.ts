import type { PostCampaignRequestBody, PostCampaignResponseBody } from '../types'
import type { Mailing } from '@app/types/payload'
import type { CollectionBeforeChangeHook } from 'payload'
import { env } from '@app/util/env/backend.server'
import { formatDate } from '@app/util/formatDate'
import { CustomAPIError } from '#payload/util/CustomAPIError'

export const createListmonkCampaign: CollectionBeforeChangeHook<Mailing> = async ({ data }) => {
  if (data.listmonkAction === 'create') {
    if (!data.sendAt) {
      throw new CustomAPIError('Kein Versanddatum festgelegt')
    }
    if (!data.subject) {
      throw new CustomAPIError('Kein Betreff festgelegt')
    }

    const listID = env.LISTMONK_LIST_ID ? parseInt(env.LISTMONK_LIST_ID as string) : NaN
    if (isNaN(listID)) {
      throw new CustomAPIError('LISTMONK_LIST_ID ist nicht definiert oder ungültig')
    }

    // create campaign in listmonk
    const body: PostCampaignRequestBody = {
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
      res = await fetch(`${env.LISTMONK_URL}/api/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `token ${env.LISTMONK_API_KEY}`,
        },
        body: JSON.stringify(body),
      })
    } catch (e) {
      console.error(e)
      throw new CustomAPIError('Fehler beim Erstellen der Kampagne in Listmonk')
    }

    if (!res.ok) {
      throw new CustomAPIError('Fehler beim Erstellen der Kampagne in Listmonk')
    }

    let resData: PostCampaignResponseBody
    try {
      resData = await res.json()
    } catch (e) {
      console.error(e)
      throw new CustomAPIError('Fehler beim Lesen der Antwort von Listmonk')
    }

    return {
      ...data,
      listmonkAction: null,
      listmonkCampaignID: resData.data.id,
    }
  }
}
