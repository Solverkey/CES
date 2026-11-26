/** Versión de la política. Si cambia, se vuelve a pedir el consentimiento. */
export const CONSENT_VERSION = 1

export const CONSENT_KEY = 'ces-cookies'

/** Seis meses. */
export const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 183

export type Consent = {
  version: number
  maps: boolean
  at: number
}

/** Lee la preferencia guardada. Las cadenas antiguas («aceptada», «cancelada») no valen. */
export function parseConsent(raw: string | null, now = Date.now()): Consent | null {
  if (!raw) return null
  let value: Partial<Consent>
  try {
    value = JSON.parse(raw) as Partial<Consent>
  } catch {
    return null
  }
  if (value.version !== CONSENT_VERSION) return null
  if (typeof value.maps !== 'boolean' || typeof value.at !== 'number') return null
  if (!Number.isFinite(value.at)) return null
  if (value.at > now + 60_000) return null
  if (now - value.at > CONSENT_MAX_AGE_MS) return null
  return { version: CONSENT_VERSION, maps: value.maps, at: value.at }
}
