import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { linkArray } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

const access = { read: anyone, update: authenticated }

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Cabecera',
  admin: { group: 'Ajustes del sitio' },
  access,
  fields: [
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    linkArray('navegacion', 'Menú principal', { maxRows: 9 }),
  ],
  hooks: { afterChange: [revalidateGlobal('header')] },
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Pie de página',
  admin: { group: 'Ajustes del sitio' },
  access,
  fields: [
    {
      name: 'logos',
      label: 'Logos',
      type: 'array',
      fields: [
        { name: 'imagen', type: 'upload', relationTo: 'media', required: true },
        { name: 'url', label: 'Enlace', type: 'text' },
      ],
    },
    {
      name: 'usarMenuPrincipal',
      label: 'Repetir el menú principal',
      type: 'checkbox',
      defaultValue: true,
    },
    linkArray('menu', 'Menú propio del pie', {
      admin: { condition: (_: unknown, s: { usarMenuPrincipal?: boolean }) => !s?.usarMenuPrincipal },
    }),
    linkArray('legal', 'Enlaces legales'),
    { name: 'textoInferior', label: 'Texto inferior', type: 'text' },
  ],
  hooks: { afterChange: [revalidateGlobal('footer')] },
}

/** Única fuente para teléfono, emails, dirección, horario y mapa. */
export const Contacto: GlobalConfig = {
  slug: 'contacto',
  label: 'Datos de contacto',
  admin: { group: 'Ajustes del sitio' },
  access,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'telefono', label: 'Teléfono', type: 'text', defaultValue: '941 545 178', admin: { width: '50%' } },
        {
          name: 'email',
          label: 'Email general',
          type: 'email',
          admin: { width: '50%', description: 'Hoy hay dos en la web (ces@larioja.org e info@ceslarioja.org): pon aquí el bueno.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'emailPrensa', label: 'Email de prensa', type: 'email', admin: { width: '50%' } },
        { name: 'telefonoPrensa', label: 'Teléfono de prensa', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'direccion',
      label: 'Dirección',
      type: 'textarea',
      defaultValue: 'C/ Vara de Rey 42, 6ª planta\n26002 Logroño (La Rioja)',
    },
    { name: 'horario', label: 'Horario', type: 'text', defaultValue: 'Lunes - Viernes / 8.00 - 18.00' },
    {
      name: 'mapaQuery',
      label: 'Búsqueda del mapa',
      type: 'text',
      defaultValue: 'C/ Vara de Rey 42, 26002 Logroño',
      admin: { description: 'Texto que se busca en Google Maps para el mapa incrustado.' },
    },
  ],
  hooks: { afterChange: [revalidateGlobal('contacto')] },
}

export const globals = [Header, Footer, Contacto]
