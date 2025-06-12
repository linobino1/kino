'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React, { useEffect, useState } from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()

  const [serverURL, setServerURL] = useState<string | null>(null)

  useEffect(() => {
    const url = window.location.origin
    setServerURL(url)
  }, [])

  return serverURL ? (
    <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
  ) : null
}
