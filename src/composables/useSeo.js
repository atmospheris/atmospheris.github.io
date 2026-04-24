import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import {
  buildWebSiteSchema,
  buildWebApplicationSchema,
  buildSoftwareApplicationSchema
} from '../utils/seoHelpers'

const SITE_NAME = 'Atmospheris'
const SITE_URL = 'https://www.atmospheris.org'

export function useSeo({ title, description, path = '', schema = null }) {
  const fullTitle = computed(() =>
    title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ISO 2533 Standard Atmosphere`
  )

  const canonicalUrl = `${SITE_URL}${path}`
  const defaultDescription = 'Reference implementation of the ISO 2533 Standard Atmosphere. Interactive calculator, Ruby gem, and TypeScript library for atmospheric property computations.'

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description || defaultDescription },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description || defaultDescription },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description || defaultDescription }
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ],
    script: schema ? [
      { type: 'application/ld+json', children: JSON.stringify(schema) }
    ] : []
  })
}

export { SITE_NAME, SITE_URL, buildWebSiteSchema, buildWebApplicationSchema, buildSoftwareApplicationSchema }
