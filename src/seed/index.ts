/**
 * Datos base del sitio (no el contenido de WordPress, eso va en la migración).
 * Se puede ejecutar varias veces: actualiza en lugar de duplicar.
 *
 *   pnpm seed
 */
import 'dotenv/config'
import type { CollectionSlug, Payload, Where } from 'payload'
import { getPayload } from 'payload'

import config from '../payload.config'
import { importarContenido } from './contenido'

const context = { disableRevalidate: true }

async function upsert(payload: Payload, collection: CollectionSlug, where: Where, data: Record<string, unknown>) {
  const { docs } = await payload.find({ collection, where, limit: 1, depth: 0, context })
  if (docs[0]) return payload.update({ collection, id: docs[0].id, data, context })
  return payload.create({ collection, data, context } as never)
}

export async function seed(payload: Payload) {
  // 1. Usuario administrador
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@ceslarioja.org'
  const password = process.env.SEED_ADMIN_PASSWORD
  const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } })
  if (!totalDocs) {
    if (!password) throw new Error('Define SEED_ADMIN_PASSWORD en .env para crear el usuario administrador.')
    await payload.create({ collection: 'users', data: { email, password, nombre: 'Administración CES' }, context })
    payload.logger.info(`Usuario creado: ${email}`)
  }

  // 2. Comisiones de trabajo (los alias son las variantes vistas en WordPress)
  const comisiones = [
    {
      nombre: 'Comisión de Trabajo de Empleo y Relaciones Laborales',
      nombreCorto: 'Empleo y Relaciones Laborales',
      alias: ['Comisión de Empleo y Relaciones Laborales'],
    },
    {
      nombre:
        'Comisión de Trabajo de Promoción, Economía, Desarrollo Regional, Agricultura, Infraestructura, Transporte y Medio Ambiente',
      nombreCorto: 'Promoción Económica',
      alias: ['Comisión de Promoción Económica', 'Comisión de Trabajo de Promoción Económica'],
    },
    {
      nombre: 'Comisión de Trabajo de Salud, Educación, Cultura e Integración Social',
      nombreCorto: 'Salud, Educación, Cultura e Integración Social',
      alias: [
        'Comisión de Trabajo de Salud, Educación Cultura e Integración Social',
        'Comisión de Salud, Educación, Cultura e Integración Social',
      ],
    },
  ]
  for (const [i, c] of comisiones.entries()) {
    await upsert(payload, 'comisiones', { nombre: { equals: c.nombre } }, {
      ...c,
      alias: c.alias.map((texto) => ({ texto })),
      orden: i,
    })
  }

  // 4. Organizaciones representadas (página Transparencia)
  const organizaciones = [
    { nombre: 'Unión General de Trabajadores', siglas: 'UGT', grupo: 'primero', tipo: 'sindicato' },
    { nombre: 'Comisiones Obreras', siglas: 'CCOO', grupo: 'primero', tipo: 'sindicato' },
    { nombre: 'Federación de Empresas de La Rioja', siglas: 'FER', grupo: 'segundo', tipo: 'empresarial' },
    { nombre: 'UAGR-COAG', siglas: 'UAGR-COAG', grupo: 'tercero', tipo: 'agraria' },
    { nombre: 'ARAG-ASAJA', siglas: 'ARAG-ASAJA', grupo: 'tercero', tipo: 'agraria' },
    { nombre: 'Unión de Pequeños Agricultores', siglas: 'UPA', grupo: 'tercero', tipo: 'agraria' },
    { nombre: 'Universidad de La Rioja', siglas: 'UR', grupo: 'tercero', tipo: 'universidad' },
    { nombre: 'Expertos nombrados por el Gobierno de La Rioja', grupo: 'tercero', tipo: 'gobierno' },
  ]
  for (const [i, o] of organizaciones.entries()) {
    await upsert(payload, 'organizaciones', { nombre: { equals: o.nombre } }, { ...o, orden: i })
  }

  await importarContenido(payload)
  payload.logger.info('Seed completado.')
}

const payload = await getPayload({ config })
await seed(payload)
process.exit(0)
