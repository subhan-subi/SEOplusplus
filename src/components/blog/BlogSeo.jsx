import { useEffect } from 'react';

const DEFAULT_ORIGIN = 'https://seoplusplus.vercel.app';

/**
 * Updates head meta tags and JSON-LD structured data dynamically for Blog pages.
 */
export default function BlogSeo({
  title,
  description,
  canonicalUrl,
  canonical,
  ogImage,
  ogType = 'article',
  publishedAt,
  updatedAt,
  author,
  category,
  breadcrumbs = []
}) {
  useEffect(() => {
    // 1. Update Document Title
    const originalTitle = document.title;
    const cleanTitle = title ? title.replace(/&amp;/g, '&') : '';
    const computedTitle = cleanTitle
      ? (cleanTitle.includes('SEO++') ? cleanTitle : `${cleanTitle} | SEO++ Blog`)
      : 'SEO++ Blog – Proven Search Engine Optimization & Growth Guides';

    document.title = computedTitle;

    // Helper to set or create meta tags
    function setMeta(name, content, isProperty = false) {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    // 2. Standard Meta Description
    if (description) {
      setMeta('description', description);
    }

    // 3. Canonical URL
    const rawCanonical = canonicalUrl || canonical;
    let finalCanonical;
    if (rawCanonical) {
      if (rawCanonical.startsWith('http://') || rawCanonical.startsWith('https://')) {
        finalCanonical = rawCanonical === `${DEFAULT_ORIGIN}/` ? rawCanonical : rawCanonical.replace(/\/+$/, '');
      } else {
        const cleanPath = rawCanonical.startsWith('/') ? rawCanonical : `/${rawCanonical}`;
        finalCanonical = cleanPath === '/' ? `${DEFAULT_ORIGIN}/` : `${DEFAULT_ORIGIN}${cleanPath.replace(/\/+$/, '')}`;
      }
    } else {
      finalCanonical = `${DEFAULT_ORIGIN}${window.location.pathname.replace(/\/+$/, '')}`;
    }

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', finalCanonical);

    // 4. Open Graph Tags
    const fullUrl = finalCanonical;
    setMeta('og:title', computedTitle, true);
    if (description) setMeta('og:description', description, true);
    setMeta('og:url', fullUrl, true);
    setMeta('og:type', ogType, true);
    if (ogImage) setMeta('og:image', ogImage, true);
    setMeta('og:site_name', 'SEO++', true);

    if (publishedAt) {
      setMeta('article:published_time', new Date(publishedAt).toISOString(), true);
    }
    if (updatedAt) {
      setMeta('article:modified_time', new Date(updatedAt).toISOString(), true);
    }
    if (category) {
      setMeta('article:section', category, true);
    }

    // 5. Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title || document.title);
    if (description) setMeta('twitter:description', description);
    if (ogImage) setMeta('twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const jsonLdId = 'seo-blog-jsonld';
    let scriptEl = document.getElementById(jsonLdId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = jsonLdId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const schemas = [];

    // Article Schema
    if (ogType === 'article') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        image: ogImage ? [ogImage] : undefined,
        datePublished: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        dateModified: updatedAt ? new Date(updatedAt).toISOString() : publishedAt ? new Date(publishedAt).toISOString() : undefined,
        author: {
          '@type': 'Person',
          name: author?.name || 'SEO++ Editorial Team'
        },
        publisher: {
          '@type': 'Organization',
          name: 'SEO++',
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/favicon.svg`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullUrl
        }
      });
    }

    // Breadcrumbs Schema
    if (breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.url ? (crumb.url.startsWith('http') ? crumb.url : `${window.location.origin}${crumb.url}`) : undefined
        }))
      });
    }

    if (schemas.length > 0) {
      scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
    }

    // Cleanup on unmount
    return () => {
      document.title = originalTitle;
      const scriptToRemove = document.getElementById(jsonLdId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonicalUrl, ogImage, ogType, publishedAt, updatedAt, author, category, breadcrumbs]);

  return null;
}
