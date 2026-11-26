import Link from 'next/link'

import { ConfigurarCookies } from '@/components/Cookies'

const MENU = [
  ['/institucion', 'Institución'],
  ['/actividades', 'Actividades'],
  ['/dictamenes', 'Dictámenes'],
  ['/comunicacion', 'Comunicación'],
  ['/transparencia', 'Transparencia'],
  ['/enlaces-de-interes', 'Enlaces'],
  ['/contacto', 'Contacto'],
] as const

const LEGAL = [
  ['/politica-de-privacidad', 'Política de privacidad'],
  ['/aviso-legal', 'Aviso legal'],
  ['/politica-de-cookies', 'Política de cookies'],
] as const

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <a className="footer-logo" href="https://www.larioja.org" target="_blank" rel="noopener noreferrer">
          <img src="/brand/larioja.png" alt="Gobierno de La Rioja" />
        </a>
        <Link className="footer-mark" href="/" aria-label="Inicio">
          <img src="/brand/isotipo.svg" alt="" />
        </Link>
        <div>
          <h2>Menú</h2>
          <ul className="chevrons">
            {MENU.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul className="chevrons">
            {LEGAL.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
            <li>
              <ConfigurarCookies />
            </li>
          </ul>
        </div>
        <div>
          <h2>Contacto</h2>
          <ul>
            <li>
              <a href="tel:941545178">941 545 178</a>
            </li>
            <li>
              <a href="mailto:info@ceslarioja.org">info@ceslarioja.org</a>
            </li>
            <li>Lunes - Viernes / 8.00 - 18.00</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
