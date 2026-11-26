import type { Metadata } from 'next'

export const SITE_NAME = 'CES La Rioja'

export const SITE_DESCRIPTION =
  'El Consejo Económico y Social es el órgano consultivo de la Comunidad Autónoma de La Rioja en materia socio-económica.'

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const canonical = path.startsWith('/') ? path : `/${path}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ['/brand/logo.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/logo.png'],
    },
  }
}
