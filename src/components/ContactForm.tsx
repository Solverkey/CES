'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'

import { enviarMensaje, type MensajeState } from '@/app/(frontend)/contacto/actions'

const initial: MensajeState = null

export function ContactForm({ requireDetails = true }: { requireDetails?: boolean }) {
  const [state, action, pending] = useActionState(enviarMensaje, initial)
  const [fields, setFields] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    mensaje: '',
    privacidad: false,
  })

  if (state?.ok) {
    return <p className="thanks">Gracias por escribirnos. Te responderemos lo antes posible.</p>
  }

  const set =
    (name: 'nombre' | 'apellidos' | 'correo' | 'telefono' | 'mensaje') =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((current) => ({ ...current, [name]: event.target.value }))
    }

  return (
    <form className="form" action={action}>
      {requireDetails ? <input type="hidden" name="completo" value="1" /> : null}
      <div className="form-row">
        <label>
          <span>
            Nombre <i className="req">*</i>
          </span>
          <input name="nombre" required autoComplete="given-name" value={fields.nombre} onChange={set('nombre')} />
        </label>
        <label>
          <span>
            Apellidos {requireDetails ? <i className="req">*</i> : null}
          </span>
          <input
            name="apellidos"
            required={requireDetails}
            autoComplete="family-name"
            value={fields.apellidos}
            onChange={set('apellidos')}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>
            Correo <i className="req">*</i>
          </span>
          <input name="correo" type="email" required autoComplete="email" value={fields.correo} onChange={set('correo')} />
        </label>
        <label>
          <span>
            Teléfono {requireDetails ? <i className="req">*</i> : null}
          </span>
          <input
            name="telefono"
            type="tel"
            required={requireDetails}
            autoComplete="tel"
            value={fields.telefono}
            onChange={set('telefono')}
          />
        </label>
      </div>
      <label>
        <span>
          Mensaje <i className="req">*</i>
        </span>
        <textarea name="mensaje" required rows={6} value={fields.mensaje} onChange={set('mensaje')} />
      </label>
      <label className="check">
        <input
          name="privacidad"
          type="checkbox"
          required
          checked={fields.privacidad}
          onChange={(event) => setFields((current) => ({ ...current, privacidad: event.target.checked }))}
        />
        <span>
          Haciendo click aquí, usted acepta el tratamiento de sus datos personales según nuestra{' '}
          <Link href="/politica-de-privacidad">Política de privacidad</Link>.
        </span>
      </label>
      {state && !state.ok ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn btn-wide" type="submit" disabled={pending}>
        {pending ? 'Enviando…' : 'Enviar'}
      </button>
    </form>
  )
}
