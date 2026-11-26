import { describe, expect, it } from 'vitest'

import { CONSENT_MAX_AGE_MS, CONSENT_VERSION, parseConsent } from '@/lib/consent'
import { validarMensaje } from '@/lib/mensaje'
import { previewOrigin, safePreviewPath } from '@/lib/previewPath'

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

describe('ruta de vista previa', () => {
  it('solo admite rutas internas', () => {
    expect(safePreviewPath('/dictamen-1')).toBe('/dictamen-1')
    expect(safePreviewPath('//evil.com')).toBe('/')
    expect(safePreviewPath('/\\evil.com')).toBe('/')
    expect(safePreviewPath('/%5Cevil.com')).toBe('/')
    expect(safePreviewPath('/%2F%2Fevil.com')).toBe('/')
    expect(safePreviewPath('/admin')).toBe('/')
    expect(safePreviewPath('/admin/login')).toBe('/')
    expect(safePreviewPath('/api/users')).toBe('/')
    expect(safePreviewPath('/administracion')).toBe('/administracion')
    expect(safePreviewPath('/apicultura')).toBe('/apicultura')
  })

  it('usa HTTPS cuando el panel no indica el protocolo y no es local', () => {
    const headers = (values: Record<string, string>) => ({
      get: (name: string) => values[name] ?? null,
    })
    expect(previewOrigin(headers({ host: 'ces.vercel.app' }))).toBe('https://ces.vercel.app')
    expect(previewOrigin(headers({ host: 'ces.vercel.app', 'x-forwarded-proto': 'https,http' }))).toBe(
      'https://ces.vercel.app',
    )
    expect(previewOrigin(headers({ host: 'localhost:3001' }))).toBe('http://localhost:3001')
    expect(previewOrigin(headers({}), 'https://www.ceslarioja.org')).toBe('https://www.ceslarioja.org')
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
