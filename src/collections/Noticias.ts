import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField, wpIdField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'

/** Notas de prensa (sección «Comunicación»). */
export const Noticias: CollectionConfig = {
  slug: 'noticias',
  labels: { singular: 'Nota de prensa', plural: 'Notas de prensa' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    group: 'Contenido',
  },
  defaultSort: '-publishedAt',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'imagen', label: 'Imagen destacada', type: 'upload', relationTo: 'media' },
    {
      name: 'extracto',
      label: 'Extracto',
      type: 'textarea',
      admin: { description: 'Texto de la tarjeta en los listados. Si se deja vacío, se usa el inicio del contenido.' },
    },
    { name: 'contenido', label: 'Contenido', type: 'richText' },
    { name: 'cuerpo', label: 'Texto de la ficha', type: 'textarea' },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
    },
    { name: 'autor', label: 'Autor', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    slugField(),
    wpIdField,
  ],
  hooks: {
    afterChange: [revalidateDoc('/comunicacion')],
    afterDelete: [revalidateDelete('/comunicacion')],
  },
}
