import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
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
import { Imagenes } from './collections/Imagenes'
import { Noticias } from './collections/Noticias'
import { Organizaciones } from './collections/Organizaciones'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SITE_NAME = 'CES La Rioja'
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
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
    Users,
  ],
  editor: lexicalEditor(),
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
  plugins: [
    redirectsPlugin({
      collections: ['dictamenes', 'actividades', 'noticias'],
      overrides: {
        labels: { singular: 'Redirección', plural: 'Redirecciones' },
        admin: { group: 'Ajustes' },
      },
    }),
  ],
})
