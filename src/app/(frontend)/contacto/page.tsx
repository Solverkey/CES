import { ContactForm } from '@/components/ContactForm'
import { MapEmbed } from '@/components/Cookies'
import { PageBanner } from '@/components/PageBanner'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Contacto',
  description: 'Dirección, teléfono y formulario de contacto del Consejo Económico y Social de La Rioja.',
  path: '/contacto',
})

export default function ContactoPage() {
  return (
    <div className="page-contacto">
      <PageBanner title="Contacto" image="/brand/pages/contacto.jpg" position="center center" search={false} />
      <section className="contact is-page">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2>Contacta con nosotros</h2>
              <ContactForm />
            </div>
            <MapEmbed />
          </div>
          <div className="contact-details">
            <div>
              <h3>Dirección</h3>
              <p>C/ Vara de Rey 42, 6ª planta (26002) Logroño/La Rioja</p>
            </div>
            <div>
              <h3>Teléfono</h3>
              <p>
                <a href="tel:941545178">941 545 178</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
