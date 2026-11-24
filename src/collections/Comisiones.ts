import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

/**
 * Comisiones de trabajo del CES. Una sola versión de cada nombre:
 * en WordPress el mismo órgano aparece escrito de varias formas.
 */
export const Comisiones: CollectionConfig = {
  slug: 'comisiones',
  labels: { singular: 'Comisión', plural: 'Comisiones' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'orden'], group: 'Institución' },
  defaultSort: 'orden',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'nombre', label: 'Nombre oficial', type: 'text', required: true, unique: true },
    { name: 'nombreCorto', label: 'Nombre corto', type: 'text' },
    {
      name: 'alias',
      label: 'Otras formas de escribirlo',
      type: 'array',
      admin: { description: 'Variantes usadas en WordPress. El script de migración las usa para asignar cada dictamen.' },
      fields: [{ name: 'texto', type: 'text', required: true }],
    },
    { name: 'orden', label: 'Orden', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
