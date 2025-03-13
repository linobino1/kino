// https://listmonk.app/docs/apis/campaigns/#post-apicampaigns
export type PostCampaignRequestBody = {
  name: string
  subject: string
  lists: number[]
  type: 'regular' | 'optin'
  content_type: 'richtext' | 'html' | 'markdown' | 'plain'
  body: string
  altbody?: string
  send_at?: string // Format: 'YYYY-MM-DDTHH:MM:SSZ'
}

export type PostCampaignResponseBody = {
  data: {
    id: number
    [key: string]: any
  }
}

export type PutCampaignRequestBody = Partial<PostCampaignRequestBody>
export type PutCampaignResponseBody = PostCampaignResponseBody
