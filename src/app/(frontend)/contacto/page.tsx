import { ContactForm } from '@/components/ContactForm'
import { PageBanner } from '@/components/PageBanner'

export const metadata = { title: 'Contacto' }

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
            <iframe
              className="map"
              title="Mapa de la sede del Consejo Económico y Social de La Rioja"
              src="https://maps.google.com/maps?q=C%2F%20Vara%20de%20Rey%2042%2C%206%2C%2026002&hl=es&z=15&output=embed"
              loading="lazy"
            />
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
