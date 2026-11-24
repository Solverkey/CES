import type { CollectionConfig, Field } from 'payload'

import { anyone, authenticated } from '../access'

export const grupoField: Field = {
  name: 'grupo',
  label: 'Grupo',
  type: 'select',
  options: [
    { label: 'Presidencia / Secretaría', value: 'presidencia' },
    { label: 'Grupo primero · Sindicatos', value: 'primero' },
    { label: 'Grupo segundo · Organizaciones empresariales', value: 'segundo' },
    { label: 'Grupo tercero · Gobierno, agrarias, Universidad y expertos', value: 'tercero' },
  ],
}

export const Organizaciones: CollectionConfig = {
  slug: 'organizaciones',
  labels: { singular: 'Organización', plural: 'Organizaciones' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'siglas', 'grupo'], group: 'Institución' },
  defaultSort: 'orden',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'siglas', label: 'Siglas', type: 'text' },
    { ...grupoField, required: true } as Field,
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        { label: 'Sindicato', value: 'sindicato' },
        { label: 'Organización empresarial', value: 'empresarial' },
        { label: 'Organización agraria', value: 'agraria' },
        { label: 'Universidad', value: 'universidad' },
        { label: 'Gobierno / expertos', value: 'gobierno' },
      ],
    },
    { name: 'web', label: 'Web', type: 'text' },
    { name: 'orden', label: 'Orden', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
