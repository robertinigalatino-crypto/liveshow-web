import Script from 'next/script'

export function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Live Show Producciones',
    image: 'https://liveshowproducciones.com.ar/og-image.jpg',
    '@id': 'https://liveshowproducciones.com.ar',
    url: 'https://liveshowproducciones.com.ar',
    telephone: '+5493510000000', // Update with real phone
    address: {
      '@type': 'PostalAddress',
      streetAddress: '', // Fill if applicable
      addressLocality: 'Buenos Aires',
      addressRegion: 'CABA',
      postalCode: '',
      addressCountry: 'AR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -34.6037,
      longitude: -58.3816
    },
    servesCuisine: '',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    },
    sameAs: [
      'https://www.instagram.com/liveshowproducciones'
      // Add other social links if available
    ],
    description: 'Empresa líder en Argentina dedicada a la producción integral de eventos y contratación de artistas.',
    priceRange: '$$'
  }

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
