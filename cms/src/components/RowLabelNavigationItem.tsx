'use client'

import { useRowLabel } from '@payloadcms/ui'
import { ArrayFieldClientComponent } from 'payload'

const RowLabelNavigationItem: ArrayFieldClientComponent = () => {
  const { data, rowNumber } = useRowLabel() as { data: any; rowNumber: number }
  return data?.name || data?.type || rowNumber
}
export default RowLabelNavigationItem
