import { describe, expect, it } from 'vitest'

import { CONSENT_MAX_AGE_MS, CONSENT_VERSION, parseConsent } from '@/lib/consent'
import { validarMensaje } from '@/lib/mensaje'

describe('consentimiento', () => {
  const now = Date.parse('2026-11-26T12:00:00Z')

  it('acepta una preferencia vigente', () => {
    const raw = JSON.stringify({ version: CONSENT_VERSION, maps: false, at: now - 1000 })
    expect(parseConsent(raw, now)).toEqual({ version: CONSENT_VERSION, maps: false, at: now - 1000 })
  })

  it('rechaza el formato antiguo, una versión distinta y una elección caducada', () => {
    expect(parseConsent('aceptada', now)).toBeNull()
    expect(parseConsent('cancelada', now)).toBeNull()
    expect(parseConsent(JSON.stringify({ version: 0, maps: true, at: now }), now)).toBeNull()
    expect(parseConsent(JSON.stringify({ version: CONSENT_VERSION, maps: true, at: now - CONSENT_MAX_AGE_MS - 1 }), now)).toBeNull()
  })
})

describe('mensaje de contacto', () => {
  const base = {
    nombre: 'Ana',
    apellidos: 'Ruiz',
    correo: 'ana@example.org',
    telefono: '941000000',
    mensaje: 'Hola',
    privacidad: true,
    completo: true,
  }

  it('rechaza el envío sin los campos obligatorios o sin la casilla', () => {
    expect(validarMensaje({ ...base, nombre: '  ' }).ok).toBe(false)
    expect(validarMensaje({ ...base, privacidad: false }).ok).toBe(false)
    expect(validarMensaje({ ...base, apellidos: '', telefono: '' }).ok).toBe(false)
    expect(validarMensaje({ ...base, correo: 'no-es-correo' }).ok).toBe(false)
  })

  it('acepta el formulario corto de la portada sin apellidos ni teléfono', () => {
    const result = validarMensaje({ ...base, apellidos: '', telefono: '', completo: false })
    expect(result.ok).toBe(true)
  })
})
