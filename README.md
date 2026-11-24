# CES La Rioja · Next.js + Payload CMS

Migración de ceslarioja.org (WordPress + Elementor) a Next.js 16 + Payload 3. La base de datos es Postgres en Supabase.

## Puesta en marcha

```bash
cp .env.example .env        # pega la cadena Session pooler de Supabase en DATABASE_URL
pnpm install
pnpm seed                   # usuario admin, menú, pie, contacto, comisiones, organizaciones, formulario
pnpm dev                    # web en http://localhost:3000 y panel en /admin
```

La base de datos es el Postgres de Supabase. En el panel de Supabase: Project Settings → Database → Connection string → Session pooler (puerto 5432) y esa URI va en `DATABASE_URL`.

## Modelo de contenido

| Panel | Colección / global | Notas |
|---|---|---|
| Contenido | `paginas` | Páginas montadas con bloques. `inicio` es la home. |
| Contenido | `dictamenes` | Número, año, fecha, comisión, tipo de norma, PDF. |
| Contenido | `actividades` | Órgano, fecha del acto, hora, lugar, imagen. |
| Contenido | `noticias` | Notas de prensa (sección Comunicación). |
| Institución | `comisiones`, `organizaciones`, `miembros` | Comisiones normalizadas (con alias de WordPress). |
| Archivos | `media` (imágenes, alt obligatorio), `documentos` (PDF) | |
| Ajustes del sitio | `header`, `footer`, `contacto` | Contacto = única fuente de teléfono, emails, dirección, horario y mapa. |
| Formularios | `forms`, `form-submissions` | Plugin Form Builder. |
| Ajustes | `redirects`, `users` | Plugin Redirects para las 301. |

**URLs:** páginas, dictámenes, actividades y notas cuelgan de la raíz (`/<slug>`), igual que en WordPress.
Por eso el slug es único entre esas cuatro colecciones (validación en `src/fields/slug.ts`).

Todas las colecciones de contenido tienen borradores (`_status`) y SEO (pestaña SEO, plugin oficial).

## Fases

1. ✅ Estructura: Next + Payload, colecciones, globals, plugins y seed.
2. ✅ Contenido público importado desde WordPress (`src/content`, `pnpm importar` vuelve a descargarlo).
3. ✅ Frontend con el diseño de ceslarioja.org.
4. ⏳ SEO, sitemap, email del formulario y despliegue.
