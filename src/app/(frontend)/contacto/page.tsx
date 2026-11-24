import { ContactBlock } from '@/components/ContactBlock'
import { PageBanner } from '@/components/PageBanner'

export const metadata = { title: 'Contacto' }

export default function ContactoPage() {
  return (
    <>
      <PageBanner title="Contacto" image="/brand/pages/contacto.jpg" position="center center" />
      <ContactBlock />
    </>
  )
}
