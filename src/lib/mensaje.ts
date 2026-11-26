export type MensajeInput = {
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  mensaje: string
  privacidad: boolean
  completo: boolean
}

export type MensajeValido = {
  nombre: string
  apellidos: string
  correo: string
  telefono: string
  mensaje: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarMensaje(
  input: MensajeInput,
): { ok: true; data: MensajeValido } | { ok: false; error: string } {
  const nombre = input.nombre.trim()
  const apellidos = input.apellidos.trim()
  const correo = input.correo.trim()
  const telefono = input.telefono.trim()
  const mensaje = input.mensaje.trim()

  if (!nombre || !correo || !mensaje || !input.privacidad) {
    return { ok: false, error: 'Revisa los campos obligatorios y acepta la política de privacidad.' }
  }
  if (input.completo && (!apellidos || !telefono)) {
    return { ok: false, error: 'Revisa los campos obligatorios y acepta la política de privacidad.' }
  }
  if (!EMAIL.test(correo) || correo.length > 200) {
    return { ok: false, error: 'El correo no es válido.' }
  }
  if (nombre.length > 120 || apellidos.length > 160 || telefono.length > 40) {
    return { ok: false, error: 'Alguno de los datos es demasiado largo.' }
  }
  if (mensaje.length > 5000) {
    return { ok: false, error: 'El mensaje es demasiado largo.' }
  }
  return { ok: true, data: { nombre, apellidos, correo, telefono, mensaje } }
}
