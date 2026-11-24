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

  // 2. Cabecera, pie y datos de contacto
  const menu = [
    ['Institución', '/institucion'],
    ['Actividades', '/actividades'],
    ['Dictámenes', '/dictamenes'],
    ['Comunicación', '/comunicacion'],
    ['Transparencia', '/transparencia'],
    ['Enlaces', '/enlaces-de-interes'],
    ['Contacto', '/contacto'],
  ].map(([etiqueta, url]) => ({ etiqueta, url }))

  await payload.updateGlobal({ slug: 'header', data: { navegacion: menu }, context })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      usarMenuPrincipal: true,
      legal: [
        { etiqueta: 'Política de privacidad', url: '/politica-de-privacidad' },
        { etiqueta: 'Aviso legal', url: '/aviso-legal' },
        { etiqueta: 'Política de cookies', url: '/politica-de-cookies' },
      ],
      textoInferior: 'Consejo Económico y Social de La Rioja',
    },
    context,
  })
  await payload.updateGlobal({
    slug: 'contacto',
    data: {
      telefono: '941 545 178',
      email: 'ces@larioja.org',
      emailPrensa: 'prensa@ceslarioja.org',
      direccion: 'C/ Vara de Rey 42, 6ª planta\n26002 Logroño (La Rioja)',
      horario: 'Lunes - Viernes / 8.00 - 18.00',
      mapaQuery: 'C/ Vara de Rey 42, 26002 Logroño',
    },
    context,
  })

  // 3. Comisiones de trabajo (los alias son las variantes vistas en WordPress)
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

  // 5. Formulario de contacto (mismos campos que en WordPress)
  const rich = (text: string) => ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        },
      ],
    },
  })
  await upsert(payload, 'forms', { title: { equals: 'Contacto' } }, {
    title: 'Contacto',
    submitButtonLabel: 'Enviar',
    confirmationType: 'message',
    confirmationMessage: rich('Gracias por escribirnos. Te responderemos lo antes posible.'),
    fields: [
      { blockType: 'text', name: 'nombre', label: 'Nombre', required: true, width: 50 },
      { blockType: 'text', name: 'apellidos', label: 'Apellidos', width: 50 },
      { blockType: 'email', name: 'email', label: 'Correo', required: true, width: 50 },
      { blockType: 'text', name: 'telefono', label: 'Teléfono', width: 50 },
      { blockType: 'textarea', name: 'mensaje', label: 'Mensaje', required: true, width: 100 },
      {
        blockType: 'checkbox',
        name: 'privacidad',
        label: 'He leído y acepto la política de privacidad',
        required: true,
        width: 100,
      },
    ],
    emails: [
      {
        emailTo: 'ces@larioja.org',
        replyTo: '{{email}}',
        subject: 'Nuevo mensaje desde la web: {{nombre}} {{apellidos}}',
        message: rich('Has recibido un mensaje desde el formulario de contacto de ceslarioja.org.'),
      },
    ],
  })

  await importarContenido(payload)
  payload.logger.info('Seed completado.')
}

const payload = await getPayload({ config })
await seed(payload)
process.exit(0)
