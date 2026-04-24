const SITE_URL = 'https://www.atmospheris.org'

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Atmospheris',
    url: SITE_URL,
    description: 'Reference implementation of the ISO 2533 Standard Atmosphere',
    publisher: {
      '@type': 'Organization',
      name: 'Ribose',
      url: 'https://www.ribose.com'
    }
  }
}

export function buildWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Atmospheris Standard Atmosphere Calculator',
    url: `${SITE_URL}/calculator`,
    applicationCategory: 'ScientificApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: 'Interactive calculator for ISO 2533 Standard Atmosphere properties at any altitude from -2,000 m to 80,000 m.'
  }
}

export function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'atmospheris',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    programmingLanguage: 'Ruby',
    description: 'Ruby gem and TypeScript library implementing the ISO 2533 Standard Atmosphere model.',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    license: 'https://opensource.org/licenses/BSD-2-Clause'
  }
}
