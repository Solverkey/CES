import type { CollectionConfig, Field } from 'payload'

import { anyone, authenticated } from '../access'
import { grupoField } from './Organizaciones'

export const Miembros: CollectionConfig = {
  slug: 'miembros',
  labels: { singular: 'Miembro', plural: 'Miembros' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'cargo', 'grupo', 'organizacion', 'activo'],
    group: 'Institución',
  },
  defaultSort: 'orden',
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'nombre', label: 'Nombre y apellidos', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'cargo',
          label: 'Cargo',
          type: 'select',
          defaultValue: 'consejero',
          admin: { width: '50%' },
          options: [
            { label: 'Presidente/a', value: 'presidencia' },
            { label: 'Vicepresidente/a', value: 'vicepresidencia' },
            { label: 'Secretario/a', value: 'secretaria' },
            { label: 'Consejero/a titular', value: 'consejero' },
            { label: 'Consejero/a suplente', value: 'suplente' },
          ],
        },
        { ...grupoField, admin: { width: '50%' } } as Field,
      ],
    },
    { name: 'organizacion', label: 'Organización', type: 'relationship', relationTo: 'organizaciones' },
    { name: 'email', label: 'Email público', type: 'email' },
    { name: 'foto', label: 'Foto', type: 'upload', relationTo: 'media' },
    {
      name: 'activo',
      label: 'Miembro actual',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Desmárcalo en lugar de borrar cuando haya renovación.' },
    },
    { name: 'orden', label: 'Orden', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
