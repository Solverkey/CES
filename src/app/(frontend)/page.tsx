import Link from 'next/link'

import { ContactBlock } from '@/components/ContactBlock'
import { PostGrid } from '@/components/PostCard'
import { SearchBar } from '@/components/SearchBar'
import { loadPosts } from '@/lib/cms'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'

export const metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website' as const,
    locale: 'es_ES',
    siteName: SITE_NAME,
    title: 'Inicio - CES La Rioja',
    description: SITE_DESCRIPTION,
    url: '/',
    images: ['/brand/logo.png'],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Inicio - CES La Rioja',
    description: SITE_DESCRIPTION,
    images: ['/brand/logo.png'],
  },
}

export default async function HomePage() {
  const latest = (await loadPosts()).slice(0, 6)
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            Consultas
            <br />
            <span>socio-económicas</span>
            <br />
            de La Rioja
          </h1>
        </div>
      </section>

      <div className="container band overlap">
        <SearchBar />
      </div>

      <section className="about">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">La Rioja</p>
            <h2>Consejo Económico y Social</h2>
            <p>
              El Consejo Económico y Social es un organismo de carácter consultivo de la Comunidad Autónoma de La
              Rioja en materia socio-económica que se configura como un Ente de Derecho Público, con personalidad
              jurídica propia y plena capacidad para el cumplimiento de sus fines.
            </p>
            <p>
              El Consejo Económico y Social llevará a cabo sus actuaciones con total autonomía orgánica y funcional de
              los restantes órganos e instituciones de la Comunidad Autónoma de La Rioja.
            </p>
          </div>
          <div className="about-photo" role="img" aria-label="Sede y trabajo del Consejo Económico y Social" />
        </div>
        <div className="container access">
          <Link href="/actividades">
            <CalendarIcon />
            Actividades
          </Link>
          <Link href="/dictamenes">
            <DocIcon />
            Dictámenes
          </Link>
          <Link href="/comunicacion">
            <NewsIcon />
            Comunicación
          </Link>
        </div>
      </section>

      <section className="pubs">
        <div className="container">
          <p className="eyebrow light">CES La Rioja</p>
          <h2>
            Últimas <span>publicaciones</span>
          </h2>
          <p className="pubs-lead">Últimas actividades, dictámenes y notas de prensa del CES La Rioja</p>
          <PostGrid posts={latest} />
        </div>
      </section>

      <ContactBlock />
    </>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm12 8H5v10h14V10zM5 6v2h14V6H5z"
      />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6 2h8l6 6v14H6V2zm7 1.5V9h5.5L13 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
    </svg>
  )
}

function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h13v14H4V4zm2 2v10h9V6H6zm11 1h3v13H7v-2h12V7zM8 8h5v2H8V8zm0 3h5v2H8v-2z"
      />
    </svg>
  )
}
