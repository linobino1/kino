import { type FieldHook } from 'payload'
import { renderMailing } from '../html/renderMailing'

export const generateHTML: FieldHook = async ({ data, operation }) => {
  // we cannot generate HTML on create, because the mailing is not yet saved
  if (operation === 'create') {
    return
  }

  if (!data) {
    return
  }

  return await renderMailing(data.id, data._status === 'draft')
}
