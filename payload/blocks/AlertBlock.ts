import { Block } from 'payload'
import SlimEditor from '@/editors/SlimEditor'

export const AlertBlock: Block = {
  slug: 'Alert',
  interfaceName: 'AlertBlock',

  labels: {
    singular: {
      en: 'Alert',
      de: 'Hinweis',
    },
    plural: {
      en: 'Alerts',
      de: 'Hinweise',
    },
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Content', de: 'Inhalt' },
          fields: [
            {
              label: false,
              name: 'description',
              type: 'richText',
              required: true,
              editor: SlimEditor,
            },
          ],
        },
        {
          label: { de: 'Stil', en: 'Style' },
          fields: [
            {
              name: 'color',
              type: 'select',
              options: [
                { label: { en: 'Primary color', de: 'Primärfarbe',  }, value: 'primary' },
                { label: { en: 'Red', de: 'Rot' }, value: 'red' },
              ],
              required: true,
              defaultValue: 'primary',
              label: { en: 'Severity', de: 'Color' },
            },

            {
              name: 'variant',
              type: 'select',
              options: [
                { label: { en: 'Solid', de: 'Vollfarbe' }, value: 'solid' },
                { label: { en: 'Outlined', de: 'Umrandet' }, value: 'outline' },
                { label: { en: 'Soft', de: 'Weich' }, value: 'soft' },
                { label: { en: 'Subtle', de: 'Subtil' }, value: 'subtle' },
              ],
              required: true,
              defaultValue: 'solid',
              label: { en: 'Variant', de: 'Variante' },
            },
          ],
        },
      ],
    },
  ],
}
