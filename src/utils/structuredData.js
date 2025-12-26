/**
 * Structured Data Generators for SEO/AIO optimization
 * JSON-LD schemas for rich search results and AI understanding
 */

const SITE_URL = 'https://weiinsight.com';
const SITE_NAME = 'Wei In Sight';
const ARTIST_NAME = 'Jacky (Wei) Ho';

/**
 * Organization Schema - Brand identity for search engines
 */
export const generateOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: `${ARTIST_NAME} - Contemporary Artist specializing in Artwork, Fashion Design, Product Design, and Watchmaking.`,
    founder: {
        '@type': 'Person',
        name: ARTIST_NAME
    },
    sameAs: [
        // Add social media links here when available
    ]
});

/**
 * Person Schema - Artist profile for knowledge graph
 */
export const generatePersonSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: ARTIST_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    jobTitle: 'Contemporary Artist',
    description: 'Contemporary Artist specializing in Artwork, Fashion Design, Product Design, and Watchmaking.',
    knowsAbout: [
        'Contemporary Art',
        'Fashion Design',
        'Product Design',
        'Watchmaking',
        'Painting',
        'Sculpture',
        'Digital Art',
        'Mixed Media'
    ]
});

/**
 * WebSite Schema - Site-level search features
 */
export const generateWebSiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: `${ARTIST_NAME} - Contemporary Artist Portfolio`,
    publisher: {
        '@type': 'Person',
        name: ARTIST_NAME
    }
});

/**
 * ArtGallery Schema - For category pages
 */
export const generateArtGallerySchema = (category) => ({
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: `${category.title} - ${SITE_NAME}`,
    description: category.description || `${category.title} collection by ${ARTIST_NAME}`,
    url: `${SITE_URL}/gallery/${category.slug}`,
    image: category.image_url || `${SITE_URL}/logo.png`,
    creator: {
        '@type': 'Person',
        name: ARTIST_NAME
    }
});

/**
 * VisualArtwork Schema - For individual artwork pages
 */
export const generateArtworkSchema = (artwork, category) => ({
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    description: artwork.description || `${artwork.title} by ${ARTIST_NAME}`,
    image: artwork.images?.[0] || `${SITE_URL}/logo.png`,
    url: `${SITE_URL}/gallery/${category?.slug || 'artwork'}/artwork/${artwork.id}`,
    creator: {
        '@type': 'Person',
        name: ARTIST_NAME
    },
    dateCreated: artwork.year ? `${artwork.year}` : undefined,
    artMedium: artwork.medium || undefined,
    artform: 'Visual Art',
    inLanguage: 'en'
});

/**
 * Event Schema - For exhibitions and events
 */
export const generateEventSchema = (event) => ({
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    name: event.title,
    description: event.description || `Exhibition: ${event.title}`,
    image: event.image_url || `${SITE_URL}/logo.png`,
    startDate: event.date, // Note: This should ideally be ISO 8601 format
    location: {
        '@type': 'Place',
        name: event.location || 'To be announced'
    },
    organizer: {
        '@type': 'Person',
        name: ARTIST_NAME
    },
    url: event.button_link || SITE_URL
});

/**
 * BreadcrumbList Schema - Navigation breadcrumbs
 */
export const generateBreadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${SITE_URL}${item.url}` : undefined
    }))
});

/**
 * Helper to inject schema into page
 */
export const injectSchema = (schema) => {
    return JSON.stringify(schema);
};
