import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FALLBACK_ARTICLES } from '../src/data/fallbackArticles.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const templatePath = path.resolve(distDir, 'index.html');

const ROUTES_MANIFEST = [
  {
    url: '/',
    title: 'Free Website SEO Health & Performance Audit Tool | SEO++',
    description: 'Analyze your website SEO health, meta tags, page speed, mobile performance, and backlink authority in seconds with actionable recommendations.',
    canonical: 'https://seoplusplus.vercel.app/'
  },
  {
    url: '/tools',
    breadcrumbName: 'All Tools',
    title: 'Free SEO & Digital Marketing Tools Directory | SEO++',
    description: 'Explore the SEO++ suite of 10 free search engine optimization and digital marketing utilities. Fast, privacy-first, client-side tools.',
    canonical: 'https://seoplusplus.vercel.app/tools'
  },
  {
    url: '/tools/search-console',
    breadcrumbName: 'Search Console',
    title: 'Google Search Console Integration & Performance Analytics | SEO++',
    description: 'Connect Google Search Console to monitor real organic clicks, impressions, average CTR, and keyword rankings directly inside SEO++.',
    canonical: 'https://seoplusplus.vercel.app/tools/search-console'
  },
  {
    url: '/tools/dr-checker',
    breadcrumbName: 'Domain Rating Checker',
    title: 'Free Website Domain Rating (DR) Checker | SEO++',
    description: 'Check website Domain Rating (DR) and backlink authority tier metrics. Transparent evaluation using Ahrefs metrics and benchmarks.',
    canonical: 'https://seoplusplus.vercel.app/tools/dr-checker'
  },
  {
    url: '/tools/keyword-finder',
    breadcrumbName: 'Keyword Finder',
    title: 'Free Keyword Finder & Search Term Generator | SEO++',
    description: 'Discover related keywords, search questions, long-tail variations, and SEO search volume ideas with real-time suggestions.',
    canonical: 'https://seoplusplus.vercel.app/tools/keyword-finder'
  },
  {
    url: '/tools/hashtags',
    breadcrumbName: 'Hashtag Generator',
    title: 'Free Multi-Platform Hashtag Generator | SEO++',
    description: 'Generate targeted, high-reach hashtags for Instagram, TikTok, LinkedIn, and YouTube. Instant copying and platform tag counters.',
    canonical: 'https://seoplusplus.vercel.app/tools/hashtags'
  },
  {
    url: '/tools/captions',
    breadcrumbName: 'Caption Generator',
    title: 'Free Social Media Caption Generator | SEO++',
    description: 'Generate compelling social media captions for Instagram, LinkedIn, and TikTok across 5 distinct tones. Fast and privacy-first.',
    canonical: 'https://seoplusplus.vercel.app/tools/captions'
  },
  {
    url: '/tools/hooks',
    breadcrumbName: 'Hook Generator',
    title: 'Free Video & Post Hook Generator | SEO++',
    description: 'Generate scroll-stopping hook opening lines for short-form video, reels, TikTok, and social copy across 7 proven engagement angles.',
    canonical: 'https://seoplusplus.vercel.app/tools/hooks'
  },
  {
    url: '/tools/content-ideas',
    breadcrumbName: 'Content Ideas',
    title: 'Free Content Ideas & Topic Generator | SEO++',
    description: 'Generate high-engagement content ideas and topic outlines for blog posts, tutorials, lists, case studies, and social videos.',
    canonical: 'https://seoplusplus.vercel.app/tools/content-ideas'
  },
  {
    url: '/tools/character-counter',
    breadcrumbName: 'Character Counter',
    title: 'Free Online Character & Word Counter | SEO++',
    description: 'Count characters, words, sentences, and paragraphs in real time. Validate live character limits for Twitter, Google SEO, LinkedIn, and Meta.',
    canonical: 'https://seoplusplus.vercel.app/tools/character-counter'
  },
  {
    url: '/tools/utm-builder',
    breadcrumbName: 'UTM Campaign Builder',
    title: 'Free UTM Campaign URL Builder | SEO++',
    description: 'Generate Google Analytics UTM tracking parameters for marketing campaigns. Real-time URL validation and clean copy formatting.',
    canonical: 'https://seoplusplus.vercel.app/tools/utm-builder'
  },
  {
    url: '/blog',
    breadcrumbName: 'Blog',
    title: 'SEO++ Blog – Search Engine Optimization & Growth Guides',
    description: 'Master SEO, website growth, Google Search Console, on-page optimization, and digital marketing with actionable, data-backed guides from the SEO++ team.',
    canonical: 'https://seoplusplus.vercel.app/blog'
  },
  {
    url: '/write-for-us',
    breadcrumbName: 'Write for Us',
    title: 'Write for Us & Publish with SEO++ | Editorial Guidelines & Pitches',
    description: 'Contribute to SEO++. We publish actionable SEO guides, website growth case studies, and sponsored articles. Submit your pitch to our editorial team.',
    canonical: 'https://seoplusplus.vercel.app/write-for-us'
  },
  {
    url: '/blog/what-is-seo-beginners-guide',
    breadcrumbName: "What Is SEO?",
    title: "What Is SEO? The Complete Beginner Guide (2026) | SEO++",
    description: 'Discover how search engine optimization works, why organic traffic matters, and the foundational pillars every website owner needs to know.',
    canonical: 'https://seoplusplus.vercel.app/blog/what-is-seo-beginners-guide'
  },
  {
    url: '/blog/how-to-check-website-seo-audit-guide',
    breadcrumbName: 'Website SEO Audit Guide',
    title: 'How to Check Your Website SEO: 10-Step Audit Checklist (2026) | SEO++',
    description: 'Run a thorough SEO audit on any website. Learn how to diagnose meta tags, headings, canonical links, mobile speed, and indexing bottlenecks.',
    canonical: 'https://seoplusplus.vercel.app/blog/how-to-check-website-seo-audit-guide'
  },
  {
    url: '/blog/google-search-console-beginner-guide',
    breadcrumbName: 'Google Search Console Guide',
    title: 'Google Search Console Beginner Guide: Clicks & Impressions (2026) | SEO++',
    description: 'Master Google Search Console. Understand organic clicks, impressions, CTR, average position, and how to spot low-hanging keyword opportunities.',
    canonical: 'https://seoplusplus.vercel.app/blog/google-search-console-beginner-guide'
  },
  {
    url: '/blog/technical-seo-checklist-crawling-indexing',
    breadcrumbName: 'Technical SEO Checklist',
    title: 'Technical SEO Checklist: Crawling, Indexing & Speed (2026) | SEO++',
    description: 'A complete technical SEO checklist for developers and webmasters. Optimize crawl budget, canonical headers, and Core Web Vitals.',
    canonical: 'https://seoplusplus.vercel.app/blog/technical-seo-checklist-crawling-indexing'
  },
  {
    url: '/blog/how-to-write-high-ctr-meta-titles-descriptions',
    breadcrumbName: 'High-CTR Meta Titles',
    title: 'How to Write High-CTR Meta Titles & Descriptions (2026) | SEO++',
    description: 'Proven copywriting formulas for meta titles and descriptions. Increase search snippet CTR without clickbait.',
    canonical: 'https://seoplusplus.vercel.app/blog/how-to-write-high-ctr-meta-titles-descriptions'
  },
  {
    url: '/blog/guest-posting-quality-guidelines-outreach',
    breadcrumbName: 'Guest Posting Guidelines',
    title: 'Guest Posting in 2026: Editorial Standards & Outreach Best Practices | SEO++',
    description: 'Learn how to publish guest articles on authoritative industry publications. Guidelines for original writing, editorial review, and sponsored disclosures.',
    canonical: 'https://seoplusplus.vercel.app/blog/guest-posting-quality-guidelines-outreach'
  },
  {
    url: '/about',
    breadcrumbName: 'About Us',
    title: 'About SEO++ – Free Website SEO & Marketing Toolkit',
    description: 'Learn about SEO++, our mission to provide practical, free search optimization and marketing utilities, our data handling principles, and our open tools.',
    canonical: 'https://seoplusplus.vercel.app/about'
  },
  {
    url: '/contact',
    breadcrumbName: 'Contact Us',
    title: 'Contact Us – Get in Touch with SEO++',
    description: 'Have questions, feedback, bug reports, or feature requests for SEO++? Reach out to our team through our contact form and official channels.',
    canonical: 'https://seoplusplus.vercel.app/contact'
  },
  {
    url: '/privacy',
    breadcrumbName: 'Privacy Policy',
    title: 'Privacy Policy – Data & Cookie Practices | SEO++',
    description: 'Learn how SEO++ protects your privacy, handles client-side tool calculations, manages Google Search Console data, and complies with advertising cookie standards.',
    canonical: 'https://seoplusplus.vercel.app/privacy'
  },
  {
    url: '/terms',
    breadcrumbName: 'Terms of Service',
    title: 'Terms of Service – Usage Guidelines | SEO++',
    description: 'Read the Terms of Service for using SEO++ tools, website audit utilities, and content publication services.',
    canonical: 'https://seoplusplus.vercel.app/terms'
  },
  {
    url: '/disclaimer',
    breadcrumbName: 'Disclaimer',
    title: 'Disclaimer – Website SEO & Marketing Tools | SEO++',
    description: 'Read the official disclaimer for SEO++. Understand our automated SEO audit limitations, trademark disclosures, and accuracy statements.',
    canonical: 'https://seoplusplus.vercel.app/disclaimer'
  }
];

function generateSchema(route) {
  const origin = 'https://seoplusplus.vercel.app';
  const graph = [];

  // 1. Root WebSite entity
  graph.push({
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: 'SEO++',
    description: 'Free website SEO checker, Google Search Console analytics, keyword finder, and marketing toolkit.',
    inLanguage: 'en'
  });

  // 2. SoftwareApplication entity for homepage and tool directory/pages
  if (route.url === '/' || route.url.startsWith('/tools')) {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${origin}/#application`,
      name: 'SEO++ Toolkit',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      url: `${origin}/`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    });
  }

  // 3. BreadcrumbList where breadcrumbs accurately represent page hierarchy
  if (route.url !== '/') {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${origin}/`
      }
    ];

    if (route.url.startsWith('/tools/')) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'All Tools',
        item: `${origin}/tools`
      });
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: route.breadcrumbName || route.title.split('|')[0].trim(),
        item: route.canonical
      });
    } else if (route.url === '/tools') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'All Tools',
        item: `${origin}/tools`
      });
    } else if (route.url.startsWith('/blog/')) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${origin}/blog`
      });
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: route.breadcrumbName || route.title.split('|')[0].trim(),
        item: route.canonical
      });
    } else if (route.url === '/blog') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${origin}/blog`
      });
    } else {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: route.breadcrumbName || route.title.split('|')[0].trim(),
        item: route.canonical
      });
    }

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${route.canonical}#breadcrumb`,
      itemListElement: items
    });
  }

  // 4. Article schema ONLY on actual blog articles, using verified data from FALLBACK_ARTICLES
  if (route.url.startsWith('/blog/') && route.url !== '/blog') {
    const slug = route.url.replace('/blog/', '');
    const article = FALLBACK_ARTICLES.find((a) => a.slug === slug);
    if (article) {
      graph.push({
        '@type': 'Article',
        '@id': `${route.canonical}#article`,
        headline: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt,
        image: article.featuredImage,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
          '@type': 'Organization',
          name: article.author?.name || 'SEO++ Editorial Team',
          url: `${origin}/about`
        },
        publisher: {
          '@type': 'Organization',
          name: 'SEO++',
          url: `${origin}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${origin}/favicon.svg`
          }
        },
        mainEntityOfPage: route.canonical
      });
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

async function prerender() {
  if (!fs.existsSync(templatePath)) {
    console.error('Template file not found at:', templatePath);
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(templatePath, 'utf8');

  // Dynamically import the SSR bundle
  let renderFn;
  try {
    const ssrEntryPath = path.resolve(rootDir, 'dist-ssr', 'entry-server.js');
    const { render } = await import(pathToFileURL(ssrEntryPath).href);
    renderFn = render;
  } catch (err) {
    console.error('Failed to import SSR bundle:', err);
    process.exit(1);
  }

  console.log(`Prerendering ${ROUTES_MANIFEST.length} public routes...`);

  for (const route of ROUTES_MANIFEST) {
    const { html: renderedBody } = renderFn(route.url);

    let html = rawTemplate;

    // Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
    html = html.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escapeHtml(route.title)}" />`);

    // Replace Description
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(route.description)}" />`);

    // Replace Canonical
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${route.canonical}" />`);

    // Replace OG Tags
    html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${route.canonical}" />`);

    // Replace Twitter Tags
    html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`);
    html = html.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${route.canonical}" />`);

    // Replace Structured Data Schema (clean unified @graph without duplicates)
    const schemaJson = generateSchema(route);
    html = html.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n    ${JSON.stringify(schemaJson, null, 4)}\n    </script>`
    );

    // Inject rendered React HTML into root div
    html = html.replace('<div id="root"></div>', `<div id="root">${renderedBody}</div>`);

    // Determine target output file path
    const routePath = route.url === '/' ? '' : route.url.replace(/^\//, '');
    const outDir = routePath ? path.resolve(distDir, routePath) : distDir;
    const outFile = path.resolve(outDir, 'index.html');

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outFile, html, 'utf8');
    console.log(` ✓ Prerendered: ${route.url} -> ${path.relative(rootDir, outFile)}`);

    // Also write flat .html file (e.g. dist/tools/dr-checker.html, dist/about.html)
    // for seamless cleanUrls resolution on Vercel without trailing slash redirects
    if (routePath) {
      const flatFile = path.resolve(distDir, `${routePath}.html`);
      const flatDir = path.dirname(flatFile);
      if (!fs.existsSync(flatDir)) {
        fs.mkdirSync(flatDir, { recursive: true });
      }
      fs.writeFileSync(flatFile, html, 'utf8');
      console.log(` ✓ Flat HTML:   ${route.url} -> ${path.relative(rootDir, flatFile)}`);
    }
  }

  // Generate dedicated utility route: /analyze (explicit noindex, nofollow, not in sitemap)
  const analyzeRoute = {
    url: '/analyze',
    title: 'Website SEO Audit Report | SEO++',
    description: 'Free website SEO audit report analyzing meta tags, performance, security, and structured data.',
    canonical: 'https://seoplusplus.vercel.app/analyze'
  };
  const { html: analyzeBody } = renderFn('/analyze');
  let analyzeHtml = rawTemplate;
  analyzeHtml = analyzeHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${analyzeRoute.title}</title>`);
  analyzeHtml = analyzeHtml.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${analyzeRoute.title}" />`);
  analyzeHtml = analyzeHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${analyzeRoute.description}" />`);
  analyzeHtml = analyzeHtml.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${analyzeRoute.canonical}" />`);
  analyzeHtml = analyzeHtml.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, '<meta name="robots" content="noindex, nofollow" />');
  analyzeHtml = analyzeHtml.replace('<div id="root"></div>', `<div id="root">${analyzeBody}</div>`);
  const analyzeDir = path.resolve(distDir, 'analyze');
  if (!fs.existsSync(analyzeDir)) {
    fs.mkdirSync(analyzeDir, { recursive: true });
  }
  fs.writeFileSync(path.resolve(analyzeDir, 'index.html'), analyzeHtml, 'utf8');
  fs.writeFileSync(path.resolve(distDir, 'analyze.html'), analyzeHtml, 'utf8');
  console.log(` ✓ Generated utility route (noindex): dist/analyze.html and dist/analyze/index.html`);

  // Also write 404.html and 404/index.html
  const notFoundRoute = {
    url: '/404',
    title: '404 – Page Not Found | SEO++',
    description: 'The page you requested could not be found on SEO++. Browse our free SEO checker, marketing tools, or guides.',
    canonical: 'https://seoplusplus.vercel.app/404'
  };
  const { html: notFoundBody } = renderFn('/404');
  let notFoundHtml = rawTemplate;
  notFoundHtml = notFoundHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${notFoundRoute.title}</title>`);
  notFoundHtml = notFoundHtml.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, '<meta name="robots" content="noindex, nofollow" />');
  notFoundHtml = notFoundHtml.replace('<div id="root"></div>', `<div id="root">${notFoundBody}</div>`);
  fs.writeFileSync(path.resolve(distDir, '404.html'), notFoundHtml, 'utf8');
  const notFoundSubDir = path.resolve(distDir, '404');
  if (!fs.existsSync(notFoundSubDir)) {
    fs.mkdirSync(notFoundSubDir, { recursive: true });
  }
  fs.writeFileSync(path.resolve(notFoundSubDir, 'index.html'), notFoundHtml, 'utf8');
  console.log(` ✓ Generated 404 fallback: dist/404.html and dist/404/index.html`);

  // Clean up dist-ssr directory
  const distSsr = path.resolve(rootDir, 'dist-ssr');
  if (fs.existsSync(distSsr)) {
    fs.rmSync(distSsr, { recursive: true, force: true });
  }

  console.log('\nPrerendering complete! All 24 public routes + utility routes have exact static HTML files.');
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

prerender().catch((err) => {
  console.error('Prerender error:', err);
  process.exit(1);
});
