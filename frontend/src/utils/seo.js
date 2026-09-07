/**
 * Dynamic SEO & Metadata Utility for AanuBlooms (aanublooms.in)
 * Updates document.title, meta tags, and Open Graph on client route transitions.
 */

const BASE_URL = 'https://www.aanublooms.in';
const DEFAULT_IMAGE = 'https://www.aanublooms.in/images/aanu-blooms-signature-set.jpeg';

export const updateSEO = ({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  keywords,
  type = 'website'
} = {}) => {
  if (typeof document === 'undefined') return;

  const fullTitle = title
    ? `${title} | AanuBlooms`
    : 'AanuBlooms | Handcrafted Blooms & Everlasting Floral Creations · Pune';

  const fullDescription = description ||
    'Discover boutique handcrafted forever flower bouquets, blossom cupcake pots, floral charms, and bespoke keepsakes crafted with love by Aanu in Pune, India.';

  const fullUrl = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  // 1. Update Title
  document.title = fullTitle;

  // 2. Helper to set or create meta tag
  const setMeta = (attrName, attrVal, content) => {
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Primary Meta Tags
  setMeta('name', 'description', fullDescription);
  if (keywords) {
    setMeta('name', 'keywords', keywords);
  }

  // 4. Open Graph Meta Tags
  setMeta('property', 'og:title', fullTitle);
  setMeta('property', 'og:description', fullDescription);
  setMeta('property', 'og:url', fullUrl);
  setMeta('property', 'og:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);
  setMeta('property', 'og:type', type);

  // 5. Twitter Card Meta Tags
  setMeta('name', 'twitter:title', fullTitle);
  setMeta('name', 'twitter:description', fullDescription);
  setMeta('name', 'twitter:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);

  // 6. Update Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', fullUrl);
};

/**
 * Injects Product Schema.org JSON-LD structured data into the document head
 */
export const injectProductSchema = (product) => {
  if (typeof document === 'undefined' || !product) return;

  const scriptId = 'aanublooms-product-schema';
  let script = document.getElementById(scriptId);
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const primaryImage = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `${BASE_URL}${product.images[0]}`)
    : DEFAULT_IMAGE;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [primaryImage],
    description: product.shortDescription || product.description || `Handcrafted ${product.name} from AanuBlooms Studio`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'AanuBlooms'
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'AanuBlooms'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 5,
      reviewCount: product.reviewCount || 1,
      bestRating: 5,
      worstRating: 1
    }
  };

  script.textContent = JSON.stringify(schema);
};

export const removeProductSchema = () => {
  if (typeof document === 'undefined') return;
  const script = document.getElementById('aanublooms-product-schema');
  if (script) {
    script.remove();
  }
};
