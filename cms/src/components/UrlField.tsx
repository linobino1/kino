'use client'

import { TextFieldClientComponent } from 'payload'
import { FieldLabel, useField } from '@payloadcms/ui'
import { env } from '@/util/env'

const UrlField: TextFieldClientComponent = ({ field }) => {
  const { value: relativeUrl } = useField({})
  const absoluteUrl = `${env.FRONTEND_URL}${relativeUrl}`
  return typeof relativeUrl === 'string' ? (
    <>
      <FieldLabel field={field} />
      <a href={absoluteUrl} target="_blank" rel="noreferrer" className="mb-2 inline-block">
        {relativeUrl}
      </a>
    </>
  ) : null
}

export default UrlField
