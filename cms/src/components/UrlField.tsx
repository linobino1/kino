'use client'

import { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'
import { env } from '@/util/env'

const UrlField: TextFieldClientComponent = () => {
  const { value: relativeUrl } = useField({})
  const absoluteUrl = `${env.FRONTEND_URL}${relativeUrl}`
  return (
    <div className="field-type text">
      <label className="field-label">URL</label>
      {typeof relativeUrl === 'string' && (
        <a href={absoluteUrl} target="_blank" rel="noreferrer">
          {relativeUrl}
        </a>
      )}
    </div>
  )
}

export default UrlField
