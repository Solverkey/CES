'use server'

import { getPayload } from 'payload'

import config from '@payload-config'
import { validarMensaje } from '@/lib/mensaje'

export type MensajeState = { ok: true } | { ok: false; error: string } | null

export async function enviarMensaje(_prev: MensajeState, formData: FormData): Promise<MensajeState> {
  const parsed = validarMensaje({
    nombre: String(formData.get('nombre') || ''),
    apellidos: String(formData.get('apellidos') || ''),
    correo: String(formData.get('correo') || ''),
    telefono: String(formData.get('telefono') || ''),
    mensaje: String(formData.get('mensaje') || ''),
    privacidad: formData.get('privacidad') === 'on',
    completo: formData.get('completo') === '1',
  })
  if (!parsed.ok) return parsed

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'mensajes',
      data: parsed.data,
      overrideAccess: true,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se ha podido enviar el mensaje. Inténtalo de nuevo más tarde.' }
  }
}
