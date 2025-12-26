import { useEffect } from 'react';
import { injectSchema } from '../utils/structuredData';

const SITE_URL = 'https://weiinsight.com';
const DEFAULT_TITLE = 'Wei In Sight | Jacky (Wei) Ho - Contemporary Artist';
const DEFAULT_DESCRIPTION = 'Jacky (Wei) Ho - Contemporary Artist specializing in Artwork, Fashion Design, Product Design, and Watchmaking.';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

/**
 * SEOHead Component
 * Updates document head with dynamic meta tags for each page
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.image - OG image URL
 * @param {string} props.url - Canonical URL path
 * @param {string} props.type - OG type (website, article, etc.)
 * @param {Object} props.schema - JSON-LD structured data object
 */
const SEOHead = ({
    title,
    description,
    image,
    url = '',
    type = 'website',
    schema = null
}) => {
    const fullTitle = title ? `${title} | Wei In Sight` : DEFAULT_TITLE;
    const fullDescription = description || DEFAULT_DESCRIPTION;
    const fullImage = image || DEFAULT_IMAGE;
    const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Helper to update or create meta tag
        const updateMeta = (selector, content, property = false) => {
            let meta = document.querySelector(selector);
            if (!meta) {
                meta = document.createElement('meta');
                if (property) {
                    meta.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
                } else {
                    meta.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Update primary meta tags
        updateMeta('meta[name="title"]', fullTitle);
        updateMeta('meta[name="description"]', fullDescription);

        // Update Open Graph tags
        updateMeta('meta[property="og:title"]', fullTitle, true);
        updateMeta('meta[property="og:description"]', fullDescription, true);
        updateMeta('meta[property="og:image"]', fullImage, true);
        updateMeta('meta[property="og:url"]', fullUrl, true);
        updateMeta('meta[property="og:type"]', type, true);

        // Update Twitter Card tags
        updateMeta('meta[name="twitter:title"]', fullTitle);
        updateMeta('meta[name="twitter:description"]', fullDescription);
        updateMeta('meta[name="twitter:image"]', fullImage);
        updateMeta('meta[name="twitter:url"]', fullUrl);

        // Update canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', fullUrl);
        }

        // Handle structured data
        const existingSchema = document.querySelector('script[data-seo-schema]');
        if (existingSchema) {
            existingSchema.remove();
        }

        if (schema) {
            const schemaScript = document.createElement('script');
            schemaScript.type = 'application/ld+json';
            schemaScript.setAttribute('data-seo-schema', 'true');
            schemaScript.textContent = injectSchema(schema);
            document.head.appendChild(schemaScript);
        }

        // Cleanup function
        return () => {
            const schemaScript = document.querySelector('script[data-seo-schema]');
            if (schemaScript) {
                schemaScript.remove();
            }
        };
    }, [fullTitle, fullDescription, fullImage, fullUrl, type, schema]);

    return null; // This component doesn't render anything
};

export default SEOHead;
