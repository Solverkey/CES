import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

/** PDFs y otros documentos descargables (dictámenes firmados, memorias…). */
export const Documentos: CollectionConfig = {
  slug: 'documentos',
  labels: { singular: 'Documento', plural: 'Documentos' },
  admin: { useAsTitle: 'titulo', defaultColumns: ['titulo', 'filename', 'filesize'], group: 'Archivos' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    { name: 'wpUrl', label: 'URL original en WordPress', type: 'text', index: true, admin: { readOnly: true } },
  ],
  upload: {
    staticDir: 'uploads/documentos',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
}
