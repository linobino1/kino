import type { PressPdf } from '@app/types/payload'
import type { CollectionBeforeChangeHook } from 'payload'
import { renderToBuffer } from '@react-pdf/renderer'
import { PressPDF } from '../template'

export const generatePDF: CollectionBeforeChangeHook<PressPdf> = async ({
  data,
  req: { payload },
}) => {
  // render the PDF
  let buffer
  try {
    buffer = await renderToBuffer(<PressPDF title={data.title as string} events={[]} />)
  } catch (error) {
    payload.logger.error('Failed to render invoice in confirm endpoint')
    payload.logger.error(error)
    throw error
  }

  return {
    ...data,
    file: buffer,
  }
}
