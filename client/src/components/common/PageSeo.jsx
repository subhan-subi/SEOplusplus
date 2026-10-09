import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_ORIGIN = 'https://seoplusplus.vercel.app';
const DEFAULT_IMAGE = 'https://seoplusplus.vercel.app/og-preview.png';

/**
 * Universal Head Metadata and Canonical Manager for SEO++ pages.
 */
export default function PageSeo({
  title,
  description,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  noindex = false,
  breadcrumbs = []
}) {
  const location = useLocation();

  useEffect(() => {
    const originalTitle = document.title;
    const computedTitle = title 
      ? (title.includes('SEO++') ? title : `${title} | SEO++`)
      : 'SEO++ – Free Website SEO Checker, Search Console & Marketing Toolkit';

    document.title = computedTitle;

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

    // 1. Meta Description
    if (description) {
      setMeta('description', description);
    }

    // 2. Canonical URL
    const finalCanonical = canonicalUrl || `${DEFAULT_ORIGIN}${location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '')}`;
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', finalCanonical);

    // 3. Robots directive (if noindex)
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // 4. Open Graph
    setMeta('og:title', computedTitle, true);
    if (description) setMeta('og:description', description, true);
    setMeta('og:url', finalCanonical, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', 'SEO++', true);
    setMeta('og:image', ogImage, true);

    // 5. Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', computedTitle);
    if (description) setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // 6. JSON-LD Breadcrumb Schema (optional)
    const jsonLdId = 'page-seo-breadcrumb-jsonld';
    let scriptEl = document.getElementById(jsonLdId);
    if (breadcrumbs.length > 0) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = jsonLdId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.url?.startsWith('http') ? crumb.url : `${DEFAULT_ORIGIN}${crumb.url || ''}`
        }))
      };
      scriptEl.textContent = JSON.stringify(schema);
    }

    return () => {
      document.title = originalTitle;
      const el = document.getElementById(jsonLdId);
      if (el) el.remove();
    };
  }, [title, description, canonicalUrl, ogImage, ogType, noindex, breadcrumbs, location.pathname]);

  return null;
}
