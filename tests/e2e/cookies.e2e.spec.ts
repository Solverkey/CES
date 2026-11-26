import { expect, test } from '@playwright/test'

const origin = 'http://localhost:3000'

test.describe('Cookies y SEO', () => {
  test('rechazar no carga el mapa y se puede cambiar después', async ({ page }) => {
    await page.goto(`${origin}/contacto`)
    const dialog = page.getByRole('dialog', { name: 'Cookies' })
    await expect(dialog).toBeVisible()
    await expect(page.locator('iframe.map')).toHaveCount(0)
    await dialog.getByRole('link', { name: 'Política de cookies' }).click()
    await expect(page).toHaveURL(/politica-de-cookies/)
    await expect(page.getByRole('heading', { name: 'Qué usa este sitio' })).toBeVisible()
    await page.getByRole('button', { name: 'Solo necesarias' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)

    await page.goto(`${origin}/contacto`)
    await expect(page.locator('iframe.map')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Cómo llegar en Google Maps' })).toBeVisible()
    await page.getByRole('button', { name: 'Configurar cookies' }).click()
    await page.getByRole('button', { name: 'Configurar', exact: true }).click()
    await page.getByRole('checkbox', { name: /Mapa de Google/ }).check()
    await page.getByRole('button', { name: 'Guardar selección' }).click()
    await expect(page.locator('iframe.map')).toHaveCount(1)
  })

  test('aceptar carga el mapa', async ({ page }) => {
    await page.goto(`${origin}/contacto`)
    await page.getByRole('button', { name: 'Aceptar' }).click()
    await expect(page.locator('iframe.map')).toHaveCount(1)
  })

  test('el envío vacío no se da por hecho', async ({ page }) => {
    await page.goto(`${origin}/contacto`)
    await page.getByRole('button', { name: 'Solo necesarias' }).click()
    await page.getByRole('button', { name: 'Enviar' }).click()
    const missing = await page.locator('input[name="nombre"]').evaluate((node) => (node as HTMLInputElement).validity.valueMissing)
    expect(missing).toBe(true)
    await expect(page.getByText('Gracias por escribirnos')).toHaveCount(0)
  })

  test('si el guardado falla no se da el mensaje de éxito', async ({ page }) => {
    await page.goto(`${origin}/contacto`)
    await page.getByRole('button', { name: 'Solo necesarias' }).click()
    await page.locator('input[name="nombre"]').fill('Ana')
    await page.locator('input[name="apellidos"]').fill('Ruiz')
    await page.locator('input[name="correo"]').fill('ana@example.org')
    await page.locator('input[name="telefono"]').fill('941000000')
    await page.locator('textarea[name="mensaje"]').fill('Hola')
    await page.locator('input[name="privacidad"]').check()
    await page.getByRole('button', { name: 'Enviar' }).click()
    await expect(page.locator('.form-error')).toContainText('No se ha podido enviar')
    await expect(page.getByText('Gracias por escribirnos')).toHaveCount(0)
  })

  test('sitemap y robots', async ({ request }) => {
    const sitemap = await request.get(`${origin}/sitemap.xml`)
    expect(sitemap.ok()).toBeTruthy()
    const xml = await sitemap.text()
    expect(xml).toContain('/contacto')
    expect(xml).toContain('/politica-de-cookies')

    const robots = await request.get(`${origin}/robots.txt`)
    expect(robots.ok()).toBeTruthy()
    const text = await robots.text()
    expect(text).toContain('Disallow: /admin')
    expect(text).toContain('Disallow: /api')
    expect(text).toContain('Sitemap:')
  })
})
