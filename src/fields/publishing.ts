import type { CollectionConfig } from 'payload'

import { previewOrigin } from '../lib/previewPath'

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
    const base = previewOrigin(req.headers)
    return `${base}/next/preview?path=${encodeURIComponent(slug ? `/${slug}` : '/')}`
  },
}
