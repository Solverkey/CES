import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField, wpIdField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'

export const Dictamenes: CollectionConfig = {
  slug: 'dictamenes',
  labels: { singular: 'Dictamen', plural: 'Dictámenes' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['numero', 'anio', 'title', 'fecha', 'comision', '_status'],
    group: 'Contenido',
  },
  defaultSort: '-fecha',
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
    { name: 'contenido', label: 'Contenido adicional (opcional)', type: 'richText' },
    { name: 'cuerpo', label: 'Texto de la ficha', type: 'textarea' },
    {
      name: 'archivoUrl',
      label: 'Enlace al PDF',
      type: 'text',
      admin: { description: 'Dirección del PDF firmado. Es lo que se abre desde la ficha.' },
    },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación en la web',
      type: 'date',
      admin: { position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy' } },
    },
    { name: 'autor', label: 'Autor', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    slugField(),
    wpIdField,
  ],
  hooks: {
    afterChange: [revalidateDoc('/dictamenes')],
    afterDelete: [revalidateDelete('/dictamenes')],
  },
}
