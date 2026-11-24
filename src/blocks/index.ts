import type { Block, Field } from 'payload'

import { linkArray } from '../fields/link'

/** Ancla para enlazar a la sección (#saludo, #funciones…). Se mantienen las de WordPress. */
const anclaField: Field = {
  name: 'ancla',
  label: 'Ancla (id)',
  type: 'text',
  admin: { description: 'Sin #. Ej.: saludo → /institucion#saludo' },
}

/** Cabecera de página o de la home («La Rioja · Consejo Económico y Social» + accesos). */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Cabecera', plural: 'Cabeceras' },
  fields: [
    { name: 'antetitulo', label: 'Antetítulo', type: 'text' },
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    { name: 'texto', label: 'Texto', type: 'textarea' },
    { name: 'imagen', label: 'Imagen', type: 'upload', relationTo: 'media' },
    linkArray('accesos', 'Accesos rápidos'),
  ],
}

/** Sección de texto enriquecido con título y ancla. */
export const TextoBlock: Block = {
  slug: 'texto',
  labels: { singular: 'Texto', plural: 'Textos' },
  fields: [
    anclaField,
    { name: 'titulo', label: 'Título de la sección', type: 'text' },
    { name: 'contenido', label: 'Contenido', type: 'richText', required: true },
  ],
}

/** Procedimientos de Transparencia, preguntas, etc. */
export const AcordeonBlock: Block = {
  slug: 'acordeon',
  labels: { singular: 'Acordeón', plural: 'Acordeones' },
  fields: [
    anclaField,
    { name: 'titulo', label: 'Título', type: 'text' },
    {
      name: 'items',
      label: 'Elementos',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', required: true },
        { name: 'contenido', label: 'Contenido', type: 'richText', required: true },
      ],
    },
  ],
}

/** Índice con enlaces a las anclas de la página («Las instituciones», «Órganos»). */
export const IndiceBlock: Block = {
  slug: 'indice',
  labels: { singular: 'Índice de secciones', plural: 'Índices de secciones' },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text' },
    {
      name: 'automatico',
      label: 'Generar con las anclas de la página',
      type: 'checkbox',
      defaultValue: true,
    },
    linkArray('enlaces', 'Enlaces manuales', {
      admin: { condition: (_: unknown, s: { automatico?: boolean }) => !s?.automatico },
    }),
  ],
}

/** Últimas publicaciones mezclando dictámenes, actividades y notas. */
export const UltimasPublicacionesBlock: Block = {
  slug: 'ultimasPublicaciones',
  labels: { singular: 'Últimas publicaciones', plural: 'Últimas publicaciones' },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'Últimas publicaciones' },
    {
      name: 'tipos',
      label: 'Qué mostrar',
      type: 'select',
      hasMany: true,
      defaultValue: ['dictamenes', 'actividades', 'noticias'],
      options: [
        { label: 'Dictámenes', value: 'dictamenes' },
        { label: 'Actividades', value: 'actividades' },
        { label: 'Notas de prensa', value: 'noticias' },
      ],
    },
    { name: 'cantidad', label: 'Cantidad', type: 'number', defaultValue: 6, min: 1, max: 24 },
  ],
}

/** Formulario creado en «Formularios» (plugin Form Builder). */
export const FormularioBlock: Block = {
  slug: 'formulario',
  labels: { singular: 'Formulario', plural: 'Formularios' },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'Contacta con nosotros' },
    { name: 'form', label: 'Formulario', type: 'relationship', relationTo: 'forms', required: true },
  ],
}

/** Mapa + dirección, teléfono y horario (salen del global «Datos de contacto»). */
export const MapaBlock: Block = {
  slug: 'mapa',
  labels: { singular: 'Mapa y datos de contacto', plural: 'Mapas' },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text' },
    { name: 'mostrarDatos', label: 'Mostrar dirección, teléfono y horario', type: 'checkbox', defaultValue: true },
  ],
}

/** Lista de enlaces (Enlaces de interés: los CES autonómicos). */
export const ListaEnlacesBlock: Block = {
  slug: 'listaEnlaces',
  labels: { singular: 'Lista de enlaces', plural: 'Listas de enlaces' },
  fields: [
    anclaField,
    { name: 'titulo', label: 'Título', type: 'text' },
    { name: 'intro', label: 'Introducción', type: 'textarea' },
    linkArray('enlaces', 'Enlaces', { minRows: 1 }),
  ],
}

/** Miembros del Consejo agrupados (Transparencia). */
export const MiembrosBlock: Block = {
  slug: 'miembros',
  labels: { singular: 'Miembros del Consejo', plural: 'Miembros del Consejo' },
  fields: [
    anclaField,
    { name: 'titulo', label: 'Título', type: 'text', defaultValue: 'Miembros y colectivos' },
    {
      name: 'modo',
      label: 'Mostrar',
      type: 'radio',
      defaultValue: 'miembros',
      options: [
        { label: 'Miembros (personas)', value: 'miembros' },
        { label: 'Organizaciones representadas', value: 'organizaciones' },
      ],
    },
    { name: 'imagen', label: 'Imagen (p. ej. presidente y secretario)', type: 'upload', relationTo: 'media' },
  ],
}

/** Galería de imágenes (fotos de las comisiones). */
export const GaleriaBlock: Block = {
  slug: 'galeria',
  labels: { singular: 'Galería', plural: 'Galerías' },
  fields: [
    anclaField,
    { name: 'titulo', label: 'Título', type: 'text' },
    {
      name: 'imagenes',
      label: 'Imágenes',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'imagen', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  TextoBlock,
  AcordeonBlock,
  IndiceBlock,
  UltimasPublicacionesBlock,
  FormularioBlock,
  MapaBlock,
  ListaEnlacesBlock,
  MiembrosBlock,
  GaleriaBlock,
]
