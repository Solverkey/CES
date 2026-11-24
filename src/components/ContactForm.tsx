'use client'

import Link from 'next/link'
import { useState } from 'react'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return <p className="thanks">Gracias por escribirnos. Te responderemos lo antes posible.</p>
  }

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault()
        setSent(true)
      }}
    >
      <div className="form-row">
        <label>
          <span>
            Nombre <i className="req">*</i>
          </span>
          <input name="nombre" required autoComplete="given-name" />
        </label>
        <label>
          <span>
            Apellidos <i className="req">*</i>
          </span>
          <input name="apellidos" required autoComplete="family-name" />
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
            Teléfono <i className="req">*</i>
          </span>
          <input name="telefono" type="tel" required autoComplete="tel" />
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
      <button className="btn btn-wide" type="submit">
        Enviar
      </button>
    </form>
  )
}
