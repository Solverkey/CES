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

En desarrollo, Payload actualiza el esquema al arrancar. Este repositorio no trae migraciones: contra la base real se generan con `pnpm payload migrate:create` y se aplican con `pnpm payload migrate`.

## Modelo de contenido

| Panel | Colección | Notas |
|---|---|---|
| Contenido | `dictamenes` | Número, año, fecha, comisión, tipo de norma, PDF. Borradores, autoguardado, programación y pestaña SEO. |
| Contenido | `actividades` | Órgano, fecha del acto, hora, lugar, foto. Igual que los dictámenes. |
| Contenido | `noticias` | Notas de prensa (sección Comunicación). |
| Contenido | `imagenes` | Fotos. El texto alternativo es obligatorio (si se deja vacío, se usa el nombre del archivo). |
| Contenido | `comisiones`, `organizaciones` | Datos de institución. Las páginas institucionales siguen en `src/content/pages.json`. |
| Oculta | `documentos` | PDFs que se suben desde el dictamen. |
| Ajustes | `mensajes` | Lo que llega del formulario de contacto. Solo lo lee quien tiene sesión. |
| Ajustes | `redirects` | 301 o 302. La web las aplica al pedir una ruta que no existe. |
| Ajustes | `users` | Sesión del panel y clave API para el MCP. |

**URLs:** dictámenes, actividades y notas cuelgan de la raíz (`/<slug>`).
El slug es único entre esas tres colecciones (validación en `src/fields/slug.ts`).

El editor incluye las funciones de serie, la barra fija, tablas y la subida de fotos. Cada ficha tiene vista previa en vivo. La cola de tareas publica lo programado cada cinco minutos mientras el servidor está en marcha. Con `CRON_SECRET`, un cron externo puede llamar a `POST /api/payload-jobs/run` con `Authorization: Bearer <CRON_SECRET>`.

## SEO

Título, descripción, canonical, Open Graph y Twitter salen de la pestaña SEO de la ficha (si está vacía, del título y del resumen). Hay `sitemap.xml`, `robots.txt` (cierra `/admin` y `/api`) y datos estructurados de organismo público y de artículo.

## MCP

El endpoint es `POST /api/mcp`. En el usuario del panel, genera una clave API y envíala así:

```http
Authorization: users API-Key <clave>
Accept: application/json, text/event-stream
```

El plugin trae una colección interna de claves; está oculta y cerrada. Quien llama solo puede hacer lo que ya puede hacer ese usuario en dictámenes, actividades, noticias, fotos, PDFs, comisiones y redirecciones.

## Cookies

No hay analítica. El aviso permite «Solo necesarias», «Configurar» y «Aceptar» con la misma jerarquía. El mapa de Google no se carga hasta que se acepta. La elección se guarda seis meses y se puede cambiar en «Configurar cookies», en el pie.

## Fases

1. ✅ Estructura: Next + Payload, colecciones de contenido, plugins y seed.
2. ✅ Contenido público importado desde WordPress (`src/content`, `pnpm importar` vuelve a descargarlo).
3. ✅ Frontend con el diseño de ceslarioja.org.
4. ✅ SEO, sitemap, consentimiento de cookies y guardado del formulario en el panel. El correo saliente y el despliegue siguen pendientes.
