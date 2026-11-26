'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { enviarMensaje, type MensajeState } from '@/app/(frontend)/contacto/actions'

const initial: MensajeState = null

export function ContactForm({ requireDetails = true }: { requireDetails?: boolean }) {
  const [state, action, pending] = useActionState(enviarMensaje, initial)

  if (state?.ok) {
    return <p className="thanks">Gracias por escribirnos. Te responderemos lo antes posible.</p>
  }

  return (
    <form className="form" action={action}>
      {requireDetails ? <input type="hidden" name="completo" value="1" /> : null}
      <div className="form-row">
        <label>
          <span>
            Nombre <i className="req">*</i>
          </span>
          <input name="nombre" required autoComplete="given-name" />
        </label>
        <label>
          <span>
            Apellidos {requireDetails ? <i className="req">*</i> : null}
          </span>
          <input name="apellidos" required={requireDetails} autoComplete="family-name" />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>
            Correo <i className="req">*</i>
          </span>
          <input name="correo" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>
            Teléfono {requireDetails ? <i className="req">*</i> : null}
          </span>
          <input name="telefono" type="tel" required={requireDetails} autoComplete="tel" />
        </label>
      </div>
      <label>
        <span>
          Mensaje <i className="req">*</i>
        </span>
        <textarea name="mensaje" required rows={6} />
      </label>
      <label className="check">
        <input name="privacidad" type="checkbox" required />
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
