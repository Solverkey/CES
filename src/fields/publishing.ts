import type { CollectionConfig } from 'payload'

export const contentVersions: NonNullable<CollectionConfig['versions']> = {
  drafts: {
    autosave: { interval: 2000 },
    schedulePublish: true,
  },
  maxPerDoc: 50,
}

export const contentPreview = {
  url: ({ data, req }: { data: { slug?: string | null }; req: { headers: Headers } }) => {
    const slug = typeof data?.slug === 'string' && data.slug ? data.slug : ''
    const host = req.headers.get('host')
    const proto = req.headers.get('x-forwarded-proto') || 'http'
    const fromRequest = host ? `${proto}://${host}` : ''
    const base = (fromRequest || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
    return `${base}/next/preview?path=${encodeURIComponent(slug ? `/${slug}` : '/')}`
  },
}
