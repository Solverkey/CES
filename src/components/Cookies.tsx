'use client'

import Link from 'next/link'
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'

import { CONSENT_KEY, CONSENT_VERSION, parseConsent, type Consent } from '@/lib/consent'

const MAP_SRC =
  'https://maps.google.com/maps?q=C%2F%20Vara%20de%20Rey%2042%2C%206%2C%2026002&hl=es&z=15&output=embed'
const MAP_LINK =
  'https://www.google.com/maps/search/?api=1&query=Calle%20Vara%20de%20Rey%2042%2C%2026002%20Logro%C3%B1o'

type ConsentContextValue = {
  consent: Consent | null
  openPanel: () => void
}

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  openPanel: () => {},
})

export function useConsent() {
  return useContext(ConsentContext)
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null)
  const [open, setOpen] = useState(false)
  const [configuring, setConfiguring] = useState(false)
  const [maps, setMaps] = useState(false)

  useEffect(() => {
    const stored = parseConsent(window.localStorage.getItem(CONSENT_KEY))
    setConsent(stored)
    if (!stored) setOpen(true)
  }, [])

  const save = useCallback((allowMaps: boolean) => {
    const next: Consent = { version: CONSENT_VERSION, maps: allowMaps, at: Date.now() }
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next))
    setConsent(next)
    setConfiguring(false)
    setOpen(false)
  }, [])

  const close = useCallback(() => {
    setConfiguring(false)
    setOpen(false)
  }, [])

  const openPanel = useCallback(() => {
    const stored = parseConsent(window.localStorage.getItem(CONSENT_KEY))
    setMaps(stored?.maps === true)
    setConfiguring(false)
    setOpen(true)
  }, [])

  const onEscape = useCallback(() => {
    if (consent) close()
    else save(false)
  }, [close, consent, save])

  return (
    <ConsentContext.Provider value={{ consent, openPanel }}>
      {children}
      {open ? (
        <CookieDialog
          configuring={configuring}
          maps={maps}
          onConfigure={() => setConfiguring(true)}
          onMaps={setMaps}
          onBack={() => setConfiguring(false)}
          onEscape={onEscape}
          onSave={save}
        />
      ) : null}
    </ConsentContext.Provider>
  )
}

function CookieDialog({
  configuring,
  maps,
  onConfigure,
  onMaps,
  onBack,
  onEscape,
  onSave,
}: {
  configuring: boolean
  maps: boolean
  onConfigure: () => void
  onMaps: (value: boolean) => void
  onBack: () => void
  onEscape: () => void
  onSave: (allowMaps: boolean) => void
}) {
  const titleId = useId()
  const descId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusable = () =>
      dialog
        ? [...dialog.querySelectorAll<HTMLElement>('a[href], button, input')].filter((node) => !node.hasAttribute('disabled'))
        : []
    focusable()[0]?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onEscape()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const nodes = focusable()
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      const inside = active instanceof Node && dialog.contains(active)
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [onEscape])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.querySelector<HTMLElement>('a[href], button, input:not([disabled])')?.focus()
  }, [configuring])

  return (
    <div
      ref={dialogRef}
      className="cookies"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div>
        <h2 id={titleId}>Cookies</h2>
        <p id={descId}>
          Este sitio solo usa almacenamiento técnico para recordar tu elección. No hay cookies de analítica ni de
          publicidad. El mapa de Google es opcional y no se carga hasta que lo aceptes.
        </p>
        <p>
          <Link href="/politica-de-cookies">Política de cookies</Link>
        </p>
      </div>
      {configuring ? (
        <div>
          <label className="cookies-option cookies-locked">
            <input type="checkbox" checked disabled />
            <span>Necesarias. Guardan esta elección en tu navegador y no se pueden desmarcar.</span>
          </label>
          <label className="cookies-option">
            <input type="checkbox" checked={maps} onChange={(event) => onMaps(event.target.checked)} />
            <span>Mapa de Google. Muestra la sede. Google puede guardar cookies en tu equipo. Finalidad: localización. Responsable: Google.</span>
          </label>
          <p>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Política de privacidad de Google
            </a>
          </p>
          <div className="cookies-actions">
            <button type="button" onClick={onBack}>
              Volver
            </button>
            <button type="button" onClick={() => onSave(maps)}>
              Guardar selección
            </button>
          </div>
        </div>
      ) : (
        <div className="cookies-actions">
          <button type="button" onClick={() => onSave(false)}>
            Solo necesarias
          </button>
          <button type="button" onClick={onConfigure}>
            Configurar
          </button>
          <button type="button" onClick={() => onSave(true)}>
            Aceptar
          </button>
        </div>
      )}
    </div>
  )
}

export function ConfigurarCookies() {
  const { openPanel } = useConsent()
  return (
    <button type="button" className="footer-text-button" onClick={openPanel}>
      Configurar cookies
    </button>
  )
}

export function MapEmbed() {
  const { consent } = useConsent()
  if (consent?.maps) {
    return (
      <iframe
        className="map"
        title="Mapa de la sede del Consejo Económico y Social de La Rioja"
        src={MAP_SRC}
        loading="lazy"
      />
    )
  }

  return (
    <div className="map map-fallback">
      <p>
        <strong>Sede del Consejo</strong>
      </p>
      <p>C/ Vara de Rey 42, 6ª planta (26002) Logroño, La Rioja</p>
      <p>
        <a href="tel:941545178">941 545 178</a>
      </p>
      <p>
        <a href={MAP_LINK} target="_blank" rel="noopener noreferrer">
          Cómo llegar en Google Maps
        </a>
      </p>
      <p>El mapa incrustado solo se muestra si aceptas esa cookie de terceros.</p>
    </div>
  )
}
