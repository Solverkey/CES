import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { cuerpoField } from '../fields/cuerpo'
import { slugField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'

/** Sección «Comunicación» del menú. */
export const Noticias: CollectionConfig = {
  slug: 'noticias',
  labels: { singular: 'Comunicación', plural: 'Comunicación' },
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
    {
      name: 'imagen',
      label: 'Foto',
      type: 'upload',
      relationTo: 'imagenes',
      admin: { description: 'La foto de la noticia. Arrástrala o elígela en el ordenador.' },
    },
    { name: 'imagenUrl', type: 'text', admin: { hidden: true } },
    {
      name: 'extracto',
      label: 'Resumen',
      type: 'textarea',
      admin: { description: 'Una frase para la tarjeta. Si lo dejas vacío, se usa el principio del texto.' },
    },
    { ...cuerpoField, label: 'Texto' },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
    },
    { name: 'autor', label: 'Autor', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateDoc('/comunicacion')],
    afterDelete: [revalidateDelete('/comunicacion')],
  },
}
