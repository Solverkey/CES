'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LINKS = [
  ['/institucion', 'Institución'],
  ['/actividades', 'Actividades'],
  ['/dictamenes', 'Dictámenes'],
  ['/comunicacion', 'Comunicación'],
  ['/transparencia', 'Transparencia'],
  ['/enlaces-de-interes', 'Enlaces'],
  ['/contacto', 'Contacto'],
] as const

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <a href="tel:941545178">
            <PhoneIcon /> 941 545 178
          </a>
          <a href="mailto:ces@larioja.org">
            <MailIcon /> ces@larioja.org
          </a>
        </div>
      </div>
      <div className="navwrap">
        <div className="container nav">
          <Link href="/" className="logo" onClick={() => setOpen(false)}>
            <img src="/brand/logo.png" alt="Logo CES La Rioja" />
          </Link>
          <button
            className="burger"
            type="button"
            aria-expanded={open}
            aria-label="Menú"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={open ? 'open' : undefined} aria-label="Principal">
            {LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1L6.6 10.8z"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
      />
    </svg>
  )
}
