import { Catamaran, Martel, Roboto } from 'next/font/google'
import React from 'react'

import { Cookies } from '@/components/Cookies'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

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

export const metadata = {
  title: {
    default: 'Inicio - CES La Rioja',
    template: '%s - CES La Rioja',
  },
  description:
    'El Consejo Económico y Social es el órgano consultivo de la Comunidad Autónoma de La Rioja en materia socio-económica.',
  icons: { icon: '/brand/favicon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${roboto.variable} ${catamaran.variable} ${martel.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Cookies />
      </body>
    </html>
  )
}
