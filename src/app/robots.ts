import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media'],
      disallow: ['/admin', '/api'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
