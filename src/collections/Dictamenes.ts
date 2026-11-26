import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { cuerpoField } from '../fields/cuerpo'
import { contentPreview, contentVersions } from '../fields/publishing'
import { slugField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'

export const Dictamenes: CollectionConfig = {
  slug: 'dictamenes',
  labels: { singular: 'Dictamen', plural: 'Dictámenes' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['numero', 'anio', 'title', 'fecha', 'comision', '_status'],
    group: 'Contenido',
    livePreview: contentPreview,
  },
  defaultSort: '-fecha',
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
        { name: 'numero', label: 'Número', type: 'number', required: true, admin: { width: '25%' } },
        { name: 'anio', label: 'Año', type: 'number', required: true, index: true, admin: { width: '25%' } },
        {
          name: 'fecha',
          label: 'Fecha del dictamen',
          type: 'date',
          required: true,
          index: true,
          admin: { width: '50%', date: { displayFormat: 'dd/MM/yyyy' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'comision',
          label: 'Comisión que lo emite',
          type: 'relationship',
          relationTo: 'comisiones',
          admin: { width: '50%' },
        },
        {
          name: 'tipoNorma',
          label: 'Tipo de norma',
          type: 'select',
          admin: { width: '50%' },
          options: [
            { label: 'Anteproyecto de Ley', value: 'anteproyecto-ley' },
            { label: 'Proyecto de Ley', value: 'proyecto-ley' },
            { label: 'Anteproyecto de Decreto', value: 'anteproyecto-decreto' },
            { label: 'Proyecto de Decreto', value: 'proyecto-decreto' },
            { label: 'Proyecto de Orden', value: 'proyecto-orden' },
            { label: 'Plan / Estrategia', value: 'plan' },
            { label: 'Otro', value: 'otro' },
          ],
        },
      ],
    },
    {
      name: 'resumen',
      label: 'Resumen (opcional)',
      type: 'textarea',
      admin: { description: 'Si se rellena, aparece en la ficha encima del botón de descarga.' },
    },
    cuerpoField,
    {
      name: 'pdf',
      label: 'PDF',
      type: 'upload',
      relationTo: 'documentos',
      admin: { description: 'Súbelo aquí. Es el documento que se abre desde la ficha.' },
    },
    { name: 'archivoUrl', type: 'text', admin: { hidden: true } },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación en la web',
      type: 'date',
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
    },
    { name: 'autor', label: 'Autor', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateDoc('/dictamenes')],
    afterDelete: [revalidateDelete('/dictamenes')],
  },
}
