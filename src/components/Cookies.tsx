'use client'

import { useEffect, useState } from 'react'

export function Cookies() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!window.localStorage.getItem('ces-cookies')) setOpen(true)
  }, [])

  if (!open) return null

  const choose = (value: string) => {
    window.localStorage.setItem('ces-cookies', value)
    setOpen(false)
  }

  return (
    <div className="cookies" role="dialog" aria-label="Aviso de cookies">
      <p>
        Utilizamos cookies técnicas y analíticas, propias y de terceros, estrictamente necesarias para el correcto
        funcionamiento de la web.
      </p>
      <div className="cookies-actions">
        <button type="button" onClick={() => choose('cancelada')}>
          Cancelar
        </button>
        <button type="button" className="accept" onClick={() => choose('aceptada')}>
          Aceptar
        </button>
      </div>
    </div>
  )
}
