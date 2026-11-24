import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { es } from '@payloadcms/translations/languages/es'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Actividades } from './collections/Actividades'
import { Comisiones } from './collections/Comisiones'
import { Dictamenes } from './collections/Dictamenes'
import { Documentos } from './collections/Documentos'
import { Media } from './collections/Media'
import { Miembros } from './collections/Miembros'
import { Noticias } from './collections/Noticias'
import { Organizaciones } from './collections/Organizaciones'
import { Paginas } from './collections/Paginas'
import { Users } from './collections/Users'
import { globals } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SITE_NAME = 'CES La Rioja'
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const connectionString = process.env.DATABASE_URL || ''
const usesSupabase = /supabase\.(co|com)/.test(connectionString)

const docPath = (doc: { slug?: string | null }, collectionSlug?: string) =>
  collectionSlug === 'paginas' && doc?.slug === 'inicio' ? '/' : `/${doc?.slug ?? ''}`

export default buildConfig({
  serverURL: serverUrl,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ` · ${SITE_NAME}` },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: 'es' },
  collections: [
    Paginas,
    Dictamenes,
    Actividades,
    Noticias,
    Comisiones,
    Miembros,
    Organizaciones,
    Media,
    Documentos,
    Users,
  ],
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    // En Supabase la base ya existe y el usuario no puede crear otra.
    disableCreateDatabase: true,
    pool: {
      connectionString,
      // Supabase exige SSL. El certificado del pooler no siempre encaja con la cadena por defecto de Node.
      ...(usesSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['paginas', 'dictamenes', 'actividades', 'noticias'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => (doc?.title ? `${doc.title} | ${SITE_NAME}` : SITE_NAME),
      generateURL: ({ doc, collectionSlug }) => `${serverUrl}${docPath(doc, collectionSlug)}`,
    }),
    redirectsPlugin({
      collections: ['paginas', 'dictamenes', 'actividades', 'noticias'],
      overrides: {
        labels: { singular: 'Redirección', plural: 'Redirecciones' },
        admin: { group: 'Ajustes' },
      },
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        email: true,
        number: true,
        checkbox: true,
        select: true,
        message: true,
        state: false,
        country: false,
        payment: false,
      },
      redirectRelationships: ['paginas'],
      formOverrides: {
        labels: { singular: 'Formulario', plural: 'Formularios' },
        admin: { group: 'Formularios' },
      },
      formSubmissionOverrides: {
        labels: { singular: 'Mensaje recibido', plural: 'Mensajes recibidos' },
        admin: { group: 'Formularios' },
      },
    }),
  ],
})
