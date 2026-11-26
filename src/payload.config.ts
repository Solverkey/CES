import { postgresAdapter } from '@payloadcms/db-postgres'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { es } from '@payloadcms/translations/languages/es'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Actividades } from './collections/Actividades'
import { Comisiones } from './collections/Comisiones'
import { Dictamenes } from './collections/Dictamenes'
import { Documentos } from './collections/Documentos'
import { Imagenes } from './collections/Imagenes'
import { Mensajes } from './collections/Mensajes'
import { Noticias } from './collections/Noticias'
import { Organizaciones } from './collections/Organizaciones'
import { Users } from './collections/Users'
import { editor } from './fields/editor'
import { mcpAccess } from './mcp/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SITE_NAME = 'CES La Rioja'
const configuredUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
// En local la dirección lleva un puerto fijo y las fotos no cargan si el panel usa otro.
const serverUrl = /localhost|127\.0\.0\.1/.test(configuredUrl) ? '' : configuredUrl
const connectionString = process.env.DATABASE_URL || ''
const usesSupabase = /supabase\.(co|com)/.test(connectionString)

const localOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']

export default buildConfig({
  serverURL: serverUrl,
  // La cookie de sesión se rechaza si el origen no está en esta lista. El panel local usa el 3001.
  csrf: [...new Set([serverUrl, ...localOrigins].filter(Boolean))],
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ` · ${SITE_NAME}` },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: 'es' },
  collections: [
    Dictamenes,
    Actividades,
    Noticias,
    Documentos,
    Imagenes,
    Comisiones,
    Organizaciones,
    Mensajes,
    Users,
  ],
  editor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    // En Supabase la base ya existe y el usuario no puede crear otra.
    disableCreateDatabase: true,
    pool: {
      connectionString,
      // El pooler en modo sesión admite 15 clientes. Hay 3 procesos generando páginas.
      ...(process.env.VERCEL ? { max: 3 } : {}),
      // Supabase exige SSL. El certificado del pooler no siempre encaja con la cadena por defecto de Node.
      ...(usesSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
    },
  }),
  sharp,
  jobs: {
    access: {
      run: ({ req }) => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        return Boolean(secret && req.headers.get('authorization') === `Bearer ${secret}`)
      },
    },
    autoRun: [{ cron: '*/5 * * * *', queue: 'default' }],
  },
  plugins: [
    seoPlugin({
      collections: ['dictamenes', 'actividades', 'noticias'],
      uploadsCollection: 'imagenes',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = typeof doc?.title === 'string' && doc.title ? doc.title : 'CES La Rioja'
        return `${title} · CES La Rioja`
      },
      generateDescription: ({ doc }) => {
        const text = doc?.extracto || doc?.resumen
        return typeof text === 'string' ? text.slice(0, 160) : ''
      },
      generateURL: ({ doc }) => {
        const slug = typeof doc?.slug === 'string' ? doc.slug : ''
        const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')
        return slug ? `${base}/${slug}` : base
      },
    }),
    redirectsPlugin({
      collections: ['dictamenes', 'actividades', 'noticias'],
      redirectTypes: ['301', '302'],
      overrides: {
        labels: { singular: 'Redirección', plural: 'Redirecciones' },
        admin: { group: 'Ajustes' },
      },
    }),
    mcpPlugin({
      userCollection: 'users',
      collections: {
        dictamenes: { enabled: true },
        actividades: { enabled: true },
        noticias: { enabled: true },
        imagenes: { enabled: true },
        documentos: { enabled: true },
        comisiones: { enabled: true },
        redirects: { enabled: true },
      },
      overrideAuth: async (req) => mcpAccess(req),
      overrideApiKeyCollection: (collection) => ({
        ...collection,
        access: {
          create: () => false,
          read: () => false,
          update: () => false,
          delete: () => false,
        },
        admin: { ...collection.admin, hidden: true },
      }),
    }),
  ],
})
