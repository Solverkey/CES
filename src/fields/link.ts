import type { ArrayField, Field } from 'payload'

/** Enlace simple: texto + URL (interna como /dictamenes o externa con https://). */
export const linkFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'etiqueta', label: 'Texto', type: 'text', required: true, admin: { width: '40%' } },
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        required: true,
        admin: { width: '45%', description: 'Interna: /dictamenes · Externa: https://…' },
      },
      { name: 'nuevaPestana', label: 'Nueva pestaña', type: 'checkbox', admin: { width: '15%' } },
    ],
  },
]

type Extra = Partial<Omit<ArrayField, 'type' | 'fields' | 'name'>>

export const linkArray = (name: string, label: string, extra: Extra = {}): ArrayField => ({
  name,
  label,
  type: 'array',
  labels: { singular: 'Enlace', plural: 'Enlaces' },
  fields: linkFields,
  ...extra,
  admin: { initCollapsed: true, ...extra.admin },
})
