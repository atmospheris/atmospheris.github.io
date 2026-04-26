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
    title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Standard Atmosphere Models`
  )

  const canonicalUrl = `${SITE_URL}${path}`
  const defaultDescription = 'Open-source standard atmosphere models. Interactive calculators for ISO 2533 atmospheric properties and ISO 5878 wind distributions, with Ruby gem and TypeScript library.'

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
