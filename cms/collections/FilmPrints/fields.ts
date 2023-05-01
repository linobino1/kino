import type { Field } from 'payload/types';
import { t } from '../../i18n';

function analogDigitalTypeField(name: string): Field {
  return {
    name,
    label: t('Type'),
    type: 'radio',
    defaultValue: 'analog',
    options: [
      {
        label: t('analog'),
        value: 'analog',
      },
      {
        label: t('digital'),
        value: 'digital',
      },
    ],
  };
}

export default analogDigitalTypeField;
