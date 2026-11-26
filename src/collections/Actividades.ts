import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { cuerpoField } from '../fields/cuerpo'
import { contentPreview, contentVersions } from '../fields/publishing'
import { slugField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'

export const Actividades: CollectionConfig = {
  slug: 'actividades',
  labels: { singular: 'Actividad', plural: 'Actividades' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'organo', 'fechaActo', 'publishedAt', '_status'],
    group: 'Contenido',
    livePreview: contentPreview,
  },
  defaultSort: '-publishedAt',
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: contentVersions,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido',
          fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'organo',
          label: 'Órgano',
          type: 'select',
          admin: { width: '50%' },
          options: [
            { label: 'Pleno', value: 'pleno' },
            { label: 'Comisión Permanente', value: 'permanente' },
            { label: 'Comisión de Trabajo', value: 'comision-trabajo' },
            { label: 'Otra actividad', value: 'otra' },
          ],
        },
        {
          name: 'comision',
          label: 'Comisión de trabajo',
          type: 'relationship',
          relationTo: 'comisiones',
          admin: { width: '50%', condition: (_, s) => s?.organo === 'comision-trabajo' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fechaActo',
          label: 'Fecha del acto',
          type: 'date',
          index: true,
          admin: { width: '33%', date: { displayFormat: 'dd/MM/yyyy' } },
        },
        { name: 'hora', label: 'Hora', type: 'text', admin: { width: '17%', placeholder: '13:00' } },
        {
          name: 'lugar',
          label: 'Lugar',
          type: 'text',
          defaultValue: 'Sede del Consejo Económico y Social',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'imagen',
      label: 'Foto',
      type: 'upload',
      relationTo: 'imagenes',
      admin: { description: 'La foto de la actividad. Arrástrala o elígela en el ordenador.' },
    },
    {
      name: 'imagenUrl',
      type: 'text',
      admin: { components: { Field: '@/fields/FotoGuardada#FotoGuardada' } },
    },
    {
      name: 'extracto',
      label: 'Extracto',
      type: 'textarea',
      admin: { description: 'Texto de la tarjeta en los listados. Si se deja vacío, se usa el inicio del contenido.' },
    },
    cuerpoField,
          ],
        },
      ],
    },
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
    afterRead: [
      async ({ doc, findMany, req }) => {
        if (findMany || req.context.fotoPublicada || doc.imagen || doc.imagenUrl || !doc.id) return doc
        const published = await req.payload.findByID({
          collection: 'actividades',
          id: doc.id,
          depth: 0,
          draft: false,
          overrideAccess: true,
          context: { fotoPublicada: true },
        })
        if (typeof published?.imagenUrl === 'string') doc.imagenUrl = published.imagenUrl
        return doc
      },
    ],
    afterChange: [revalidateDoc('/actividades')],
    afterDelete: [revalidateDelete('/actividades')],
  },
}
