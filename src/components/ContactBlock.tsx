'use client'

import Link from 'next/link'
import { useState } from 'react'

export function ContactBlock({ showMap = true }: { showMap?: boolean }) {
  const [sent, setSent] = useState(false)

  return (
    <section className="contact">
      <div className="container contact-card">
        <h2>Contacta con nosotros</h2>
        <div className="contact-grid">
        <div>
          {sent ? (
            <p className="thanks">Gracias por escribirnos. Te responderemos lo antes posible.</p>
          ) : (
            <form
              className="form"
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <div className="form-row">
                <label>
                  Nombre <i className="req">*</i>
                  <input name="nombre" required autoComplete="given-name" />
                </label>
                <label>
                  Apellidos
                  <input name="apellidos" autoComplete="family-name" />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Correo <i className="req">*</i>
                  <input name="correo" type="email" required autoComplete="email" />
                </label>
                <label>
                  Teléfono
                  <input name="telefono" type="tel" autoComplete="tel" />
                </label>
              </div>
              <label>
                Mensaje <i className="req">*</i>
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
          )}
        </div>
        <div className="contact-aside">
          <article className="info-box">
            <span className="info-icon" aria-hidden="true">
              <PinIcon />
            </span>
            <div>
              <h3>Dirección</h3>
              <p>C/ Vara de Rey 42, 6ª planta (26002) Logroño, La Rioja.</p>
            </div>
          </article>
          <article className="info-box">
            <span className="info-icon" aria-hidden="true">
              <PhoneIcon />
            </span>
            <div>
              <h3>Teléfono</h3>
              <p>
                <a href="tel:941545178">941 545 178</a>
              </p>
            </div>
          </article>
          {showMap ? (
            <iframe
              className="map"
              title="Mapa de la sede del Consejo Económico y Social de La Rioja"
              src="https://maps.google.com/maps?q=Calle%20Vara%20de%20Rey%2042%2C%2026002%20Logro%C3%B1o&z=16&output=embed"
              loading="lazy"
            />
          ) : null}
        </div>
        </div>
      </div>
    </section>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1L6.6 10.8z"
      />
    </svg>
  )
}
