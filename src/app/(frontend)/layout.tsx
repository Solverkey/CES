import { Catamaran, Martel, Roboto } from 'next/font/google'
import type { Metadata } from 'next'
import React from 'react'

import { ConsentProvider } from '@/components/Cookies'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'
import { siteUrl } from '@/lib/site'

import './styles.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

const catamaran = Catamaran({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-catamaran',
  display: 'swap',
})

const martel = Martel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-martel',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'Inicio - CES La Rioja',
    template: '%s - CES La Rioja',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/brand/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/brand/logo.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/brand/favicon.png' },
}

const organization = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'Consejo Económico y Social de La Rioja',
  url: siteUrl(),
  email: 'ces@larioja.org',
  telephone: '+34941545178',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C/ Vara de Rey 42, 6ª planta',
    postalCode: '26002',
    addressLocality: 'Logroño',
    addressRegion: 'La Rioja',
    addressCountry: 'ES',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${roboto.variable} ${catamaran.variable} ${martel.variable}`}>
      <body>
        <a className="skip" href="#contenido">
          Saltar al contenido
        </a>
        <ConsentProvider>
          <Header />
          <main id="contenido" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </ConsentProvider>
        <JsonLd data={organization} />
      </body>
    </html>
  )
}
