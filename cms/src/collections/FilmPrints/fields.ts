import type { Field } from 'payload'

function analogDigitalTypeField(name: string): Field {
  return {
    name,
    label: 'Art',
    type: 'radio',
    defaultValue: 'analog',
    options: [
      {
        label: 'analog',
        value: 'analog',
      },
      {
        label: 'digital',
        value: 'digital',
      },
    ],
  }
}

export default analogDigitalTypeField
