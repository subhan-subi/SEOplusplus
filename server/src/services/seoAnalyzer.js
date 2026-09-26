const cheerio = require('cheerio');

/**
 * Analyzes the crawled page HTML and metadata according to SEO standards.
 */
function analyzeSeo(crawlData, targetUrl) {
  const { statusCode, headers, responseTimeMs, html, robotsInfo, sitemapInfo, pageSizeBytes, finalUrl } = crawlData;

  const $ = cheerio.load(html || '');
  const checks = [];

  // Helper to add check result
  const addCheck = (data) => {
    checks.push({
      id: data.id,
      category: data.category, // 'Technical SEO' | 'On-Page SEO' | 'Content' | 'Performance'
      title: data.title,
      status: data.status, // 'passed' | 'warning' | 'failed' | 'info'
      severity: data.severity, // 'high' | 'medium' | 'low' | 'info'
      description: data.description,
      recommendation: data.recommendation,
      details: data.details || null
    });
  };

  const parsedUrl = new URL(finalUrl || targetUrl);

  // ----------------------------------------------------
  // 1. TECHNICAL SEO CHECKS
  // ----------------------------------------------------

  // HTTPS check
  const isHttps = parsedUrl.protocol === 'https:';
  if (isHttps) {
    addCheck({
      id: 'tech-https',
      category: 'Technical SEO',
      title: 'HTTPS Protocol Enabled',
      status: 'passed',
      severity: 'high',
      description: 'Your website is served over secure HTTPS encryption.',
      recommendation: 'Keep SSL/TLS certificates updated and ensure HTTP always redirects to HTTPS.'
    });
  } else {
    addCheck({
      id: 'tech-https',
      category: 'Technical SEO',
      title: 'Website is Not Using HTTPS',
      status: 'failed',
      severity: 'high',
      description: 'Your page is served over unencrypted HTTP, which poses a security risk and hurts search engine rankings.',
      recommendation: 'Install an SSL certificate and enforce HTTPS across all pages of your website.'
    });
  }

  // HTTP Status Code
  if (statusCode === 200) {
    addCheck({
      id: 'tech-status',
      category: 'Technical SEO',
      title: 'HTTP Status Code (200 OK)',
      status: 'passed',
      severity: 'high',
      description: 'The server responded with HTTP 200 OK status.',
      recommendation: 'Ensure your server remains reliable with low downtime.'
    });
  } else if (statusCode >= 300 && statusCode < 400) {
    addCheck({
      id: 'tech-status',
      category: 'Technical SEO',
      title: `Redirect Detected (HTTP ${statusCode})`,
      status: 'warning',
      severity: 'medium',
      description: `The page issued an HTTP redirect (${statusCode}) to ${finalUrl}.`,
      recommendation: 'Direct users and crawlers directly to the destination URL to avoid redirect hops.'
    });
  } else {
    addCheck({
      id: 'tech-status',
      category: 'Technical SEO',
      title: `Unfavorable HTTP Status (${statusCode})`,
      status: 'failed',
      severity: 'high',
      description: `The web server returned HTTP error status code ${statusCode}.`,
      recommendation: 'Investigate your web server logs to resolve this error response.'
    });
  }

  // Canonical Tag
  const canonicalEl = $('link[rel="canonical"]').attr('href');
  if (canonicalEl) {
    let canonicalUrl;
    try {
      canonicalUrl = new URL(canonicalEl, parsedUrl.origin).href;
    } catch {
      canonicalUrl = canonicalEl;
    }

    addCheck({
      id: 'tech-canonical',
      category: 'Technical SEO',
      title: 'Canonical URL Specified',
      status: 'passed',
      severity: 'medium',
      description: `Found rel="canonical" pointing to: ${canonicalUrl}`,
      recommendation: 'Ensure every key page sets a clean, self-referencing canonical URL to prevent duplicate content.'
    });
  } else {
    addCheck({
      id: 'tech-canonical',
      category: 'Technical SEO',
      title: 'Canonical Tag Missing',
      status: 'warning',
      severity: 'medium',
      description: 'No rel="canonical" link was detected in the document head.',
      recommendation: 'Add a <link rel="canonical" href="..."> tag to specify the authoritative version of this page.'
    });
  }

  // Robots Meta Tag
  const robotsMeta = $('meta[name="robots" i], meta[name="googlebot" i]').attr('content');
  if (robotsMeta) {
    const isNoIndex = /noindex/i.test(robotsMeta);
    const isNoFollow = /nofollow/i.test(robotsMeta);

    if (isNoIndex) {
      addCheck({
        id: 'tech-robots-meta',
        category: 'Technical SEO',
        title: 'Robots "noindex" Directive Active',
        status: 'failed',
        severity: 'high',
        description: `Robots meta tag explicitly instructs search engines NOT to index this page ("${robotsMeta}").`,
        recommendation: 'If this page is intended for public search traffic, remove the "noindex" attribute from your robots meta tag.'
      });
    } else {
      addCheck({
        id: 'tech-robots-meta',
        category: 'Technical SEO',
        title: 'Robots Meta Tag Configured',
        status: 'passed',
        severity: 'low',
        description: `Robots directive is set to: "${robotsMeta}" (indexing permitted).`,
        recommendation: 'Ensure intended index/follow directives remain aligned with your SEO goals.'
      });
    }
  } else {
    addCheck({
      id: 'tech-robots-meta',
      category: 'Technical SEO',
      title: 'Robots Meta Tag Not Specified',
      status: 'passed',
      severity: 'low',
      description: 'No explicit robots meta tag was found; search engines will index and follow by default.',
      recommendation: 'Consider explicitly defining <meta name="robots" content="index, follow"> for clearer bot instructions.'
    });
  }

  // robots.txt Check
  if (robotsInfo.exists) {
    addCheck({
      id: 'tech-robots-txt',
      category: 'Technical SEO',
      title: 'robots.txt Found',
      status: 'passed',
      severity: 'medium',
      description: `Accessible at ${robotsInfo.url} (Status: ${robotsInfo.status}).`,
      recommendation: 'Review your robots.txt file regularly to avoid unintentionally blocking valuable crawl pathways.'
    });
  } else {
    addCheck({
      id: 'tech-robots-txt',
      category: 'Technical SEO',
      title: 'robots.txt Not Found',
      status: 'warning',
      severity: 'medium',
      description: `Could not retrieve robots.txt at ${robotsInfo.url}.`,
      recommendation: 'Create a robots.txt file in your domain root directory to guide search engine web crawlers.'
    });
  }

  // sitemap.xml Check
  if (sitemapInfo.exists) {
    addCheck({
      id: 'tech-sitemap',
      category: 'Technical SEO',
      title: 'XML Sitemap Found',
      status: 'passed',
      severity: 'medium',
      description: `Valid XML sitemap detected at ${sitemapInfo.url}.`,
      recommendation: 'Keep your XML sitemap automatically updated and submitted in Google Search Console.'
    });
  } else {
    addCheck({
      id: 'tech-sitemap',
      category: 'Technical SEO',
      title: 'XML Sitemap Not Detected',
      status: 'warning',
      severity: 'medium',
      description: 'No reachable XML sitemap was discovered at the standard locations or robots.txt.',
      recommendation: 'Generate an XML sitemap (e.g. /sitemap.xml) and declare it in your robots.txt file.'
    });
  }

  // HTML Lang attribute
  const htmlLang = $('html').attr('lang');
  if (htmlLang && htmlLang.trim().length > 0) {
    addCheck({
      id: 'tech-lang',
      category: 'Technical SEO',
      title: `Language Declared ("${htmlLang.trim()}")`,
      status: 'passed',
      severity: 'low',
      description: `The <html> tag declares language as "${htmlLang.trim()}".`,
      recommendation: 'Language declaration helps browsers, screen readers, and international search engines.'
    });
  } else {
    addCheck({
      id: 'tech-lang',
      category: 'Technical SEO',
      title: 'Missing HTML Language Attribute',
      status: 'warning',
      severity: 'low',
      description: 'The <html> element does not specify a "lang" attribute.',
      recommendation: 'Add a lang attribute to the <html> tag (e.g. <html lang="en">).'
    });
  }

  // Favicon
  const favicon = $('link[rel~="icon"]').attr('href');
  if (favicon) {
    addCheck({
      id: 'tech-favicon',
      category: 'Technical SEO',
      title: 'Favicon Configured',
      status: 'passed',
      severity: 'low',
      description: 'A favicon link tag is configured for this page.',
      recommendation: 'Modern search engines display favicons beside search snippets on mobile and desktop.'
    });
  } else {
    addCheck({
      id: 'tech-favicon',
      category: 'Technical SEO',
      title: 'Favicon Not Detected',
      status: 'warning',
      severity: 'low',
      description: 'No <link rel="icon"> or shortcut icon tag found.',
      recommendation: 'Include a favicon tag in the document <head> to improve brand recognition in search results.'
    });
  }

  // Security Headers
  const hsts = headers['strict-transport-security'];
  const xContentType = headers['x-content-type-options'];
  if (hsts || xContentType) {
    addCheck({
      id: 'tech-security-headers',
      category: 'Technical SEO',
      title: 'Basic Security Headers Present',
      status: 'passed',
      severity: 'low',
      description: `Server sent security headers (${[hsts ? 'HSTS' : '', xContentType ? 'X-Content-Type-Options' : ''].filter(Boolean).join(', ')}).`,
      recommendation: 'Maintain strict transport security and modern HTTP security headers.'
    });
  } else {
    addCheck({
      id: 'tech-security-headers',
      category: 'Technical SEO',
      title: 'Security Headers Recommended',
      status: 'info',
      severity: 'low',
      description: 'Headers like Strict-Transport-Security or X-Content-Type-Options were not observed.',
      recommendation: 'Enable HSTS and security headers on your reverse proxy or hosting provider.'
    });
  }


  // ----------------------------------------------------
  // 2. ON-PAGE SEO CHECKS
  // ----------------------------------------------------

  // Title tag
  const titleText = $('title').first().text().trim();
  const titleLength = titleText.length;

  if (!titleText) {
    addCheck({
      id: 'onpage-title',
      category: 'On-Page SEO',
      title: 'Page Title Tag Missing',
      status: 'failed',
      severity: 'high',
      description: 'No <title> tag was found in the HTML document.',
      recommendation: 'Add a descriptive <title> tag between 50 and 60 characters.'
    });
  } else if (titleLength < 25) {
    addCheck({
      id: 'onpage-title',
      category: 'On-Page SEO',
      title: `Page Title Too Short (${titleLength} chars)`,
      status: 'warning',
      severity: 'medium',
      description: `"${titleText}" is only ${titleLength} characters long.`,
      recommendation: 'Aim for 50–60 characters to convey your main topic and brand clearly.'
    });
  } else if (titleLength > 65) {
    addCheck({
      id: 'onpage-title',
      category: 'On-Page SEO',
      title: `Page Title Too Long (${titleLength} chars)`,
      status: 'warning',
      severity: 'low',
      description: `"${titleText.slice(0, 50)}..." is ${titleLength} characters and may be truncated in search results.`,
      recommendation: 'Shorten your title to 50–60 characters so it fits neatly within search engine snippet bounds.'
    });
  } else {
    addCheck({
      id: 'onpage-title',
      category: 'On-Page SEO',
      title: `Optimal Title Length (${titleLength} chars)`,
      status: 'passed',
      severity: 'high',
      description: `"${titleText}" is well-sized for search engine display.`,
      recommendation: 'Maintain unique, compelling titles for every indexable page.'
    });
  }

  // Meta Description
  const metaDesc = $('meta[name="description" i]').attr('content')?.trim() || '';
  const metaDescLength = metaDesc.length;

  if (!metaDesc) {
    addCheck({
      id: 'onpage-meta-desc',
      category: 'On-Page SEO',
      title: 'Meta Description Missing',
      status: 'failed',
      severity: 'high',
      description: 'This page does not contain a meta description.',
      recommendation: 'Add a clear description of approximately 140–160 characters describing the page.'
    });
  } else if (metaDescLength < 70) {
    addCheck({
      id: 'onpage-meta-desc',
      category: 'On-Page SEO',
      title: `Meta Description Too Short (${metaDescLength} chars)`,
      status: 'warning',
      severity: 'medium',
      description: `Your meta description is only ${metaDescLength} characters.`,
      recommendation: 'Expand your meta description to 130–160 characters to increase click-through rates.'
    });
  } else if (metaDescLength > 165) {
    addCheck({
      id: 'onpage-meta-desc',
      category: 'On-Page SEO',
      title: `Meta Description Too Long (${metaDescLength} chars)`,
      status: 'warning',
      severity: 'low',
      description: `Your meta description has ${metaDescLength} characters and might be truncated by search engines.`,
      recommendation: 'Keep meta descriptions within 130–160 characters.'
    });
  } else {
    addCheck({
      id: 'onpage-meta-desc',
      category: 'On-Page SEO',
      title: `Optimal Meta Description (${metaDescLength} chars)`,
      status: 'passed',
      severity: 'high',
      description: `"${metaDesc.slice(0, 90)}..." is well-proportioned for snippets.`,
      recommendation: 'Ensure your description includes your target search intent and a clear call to action.'
    });
  }

  // Viewport
  const viewport = $('meta[name="viewport" i]').attr('content');
  if (viewport && viewport.includes('width=device-width')) {
    addCheck({
      id: 'onpage-viewport',
      category: 'On-Page SEO',
      title: 'Mobile Viewport Configured',
      status: 'passed',
      severity: 'high',
      description: 'Mobile-friendly viewport tag detected.',
      recommendation: 'Ensure all UI components scale gracefully across phones and tablets.'
    });
  } else {
    addCheck({
      id: 'onpage-viewport',
      category: 'On-Page SEO',
      title: 'Missing or Incomplete Viewport Tag',
      status: 'failed',
      severity: 'high',
      description: 'No standard viewport tag was detected. This damages mobile usability and mobile search rankings.',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> in the document head.'
    });
  }

  // Headings (H1, H2, H3)
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const h2Count = $('h2').length;
  const h3Count = $('h3').length;

  const h1Texts = [];
  h1Elements.each((i, el) => {
    if (i < 3) h1Texts.push($(el).text().trim());
  });

  if (h1Count === 0) {
    addCheck({
      id: 'onpage-h1',
      category: 'On-Page SEO',
      title: 'H1 Heading Missing',
      status: 'failed',
      severity: 'high',
      description: 'The page has no <h1> tag. The H1 heading is a primary topical signal for search engines.',
      recommendation: 'Add exactly one <h1> heading that clearly describes the page topic.'
    });
  } else if (h1Count === 1) {
    addCheck({
      id: 'onpage-h1',
      category: 'On-Page SEO',
      title: 'Single H1 Heading Present',
      status: 'passed',
      severity: 'high',
      description: `Found 1 H1 heading: "${h1Texts[0] ? h1Texts[0].slice(0, 60) : 'H1 present'}"`,
      recommendation: 'Ensure your H1 reinforces your main primary keyword.'
    });
  } else {
    addCheck({
      id: 'onpage-h1',
      category: 'On-Page SEO',
      title: `Multiple H1 Headings Found (${h1Count})`,
      status: 'warning',
      severity: 'medium',
      description: `The page contains ${h1Count} <h1> tags. Using a single H1 per page provides clearer hierarchy.`,
      recommendation: 'Consider keeping one main <h1> and downgrading secondary headings to <h2>.'
    });
  }

  // Headings Hierarchy Check
  if (h2Count > 0) {
    addCheck({
      id: 'onpage-subheadings',
      category: 'On-Page SEO',
      title: `Subheadings Structure (${h2Count} H2, ${h3Count} H3)`,
      status: 'passed',
      severity: 'medium',
      description: `Page is structured with ${h2Count} H2 subheadings and ${h3Count} H3 subheadings.`,
      recommendation: 'Organize content with clear logical heading levels.'
    });
  } else {
    addCheck({
      id: 'onpage-subheadings',
      category: 'On-Page SEO',
      title: 'No H2 Subheadings Found',
      status: 'warning',
      severity: 'medium',
      description: 'The page has no <h2> headings to segment sections.',
      recommendation: 'Divide long content into scannable sections using descriptive <h2> tags.'
    });
  }

  // Image ALT Tags
  const images = $('img');
  const totalImages = images.length;
  let imagesWithAlt = 0;
  let imagesMissingAlt = 0;
  const missingAltSamples = [];

  images.each((i, el) => {
    const alt = $(el).attr('alt');
    const src = $(el).attr('src') || $(el).attr('data-src') || 'image';
    if (typeof alt === 'string' && alt.trim().length > 0) {
      imagesWithAlt++;
    } else {
      imagesMissingAlt++;
      if (missingAltSamples.length < 5) {
        missingAltSamples.push(src.slice(0, 80));
      }
    }
  });

  if (totalImages === 0) {
    addCheck({
      id: 'onpage-images',
      category: 'On-Page SEO',
      title: 'No Images Detected',
      status: 'info',
      severity: 'low',
      description: 'This page does not contain any <img> tags.',
      recommendation: 'Relevant images and illustrations can increase visitor engagement.'
    });
  } else if (imagesMissingAlt === 0) {
    addCheck({
      id: 'onpage-images',
      category: 'On-Page SEO',
      title: `All Images Have ALT Attributes (${totalImages}/${totalImages})`,
      status: 'passed',
      severity: 'medium',
      description: `All ${totalImages} image(s) on the page include descriptive alt text.`,
      recommendation: 'Ensure your alt descriptions remain accurate and helpful for accessibility and image search.'
    });
  } else {
    const isMajor = imagesMissingAlt > (totalImages * 0.3);
    addCheck({
      id: 'onpage-images',
      category: 'On-Page SEO',
      title: `${imagesMissingAlt} Image(s) Missing ALT Text`,
      status: isMajor ? 'failed' : 'warning',
      severity: isMajor ? 'high' : 'medium',
      description: `${imagesMissingAlt} of ${totalImages} image(s) lack an alt attribute.`,
      recommendation: 'Add descriptive alt text to all meaningful images to enhance accessibility and image SEO.',
      details: missingAltSamples.length > 0 ? { sampleMissing: missingAltSamples } : null
    });
  }

  // Links analysis
  const links = $('a[href]');
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  let emptyAnchorCount = 0;

  links.each((i, el) => {
    const href = $(el).attr('href')?.trim();
    const text = $(el).text().trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    if (!text && $(el).find('img').length === 0 && $(el).find('svg').length === 0) {
      emptyAnchorCount++;
    }

    try {
      const linkUrl = new URL(href, parsedUrl.origin);
      if (linkUrl.hostname === parsedUrl.hostname) {
        internalLinksCount++;
      } else {
        externalLinksCount++;
      }
    } catch {
      // Relative link
      internalLinksCount++;
    }
  });

  if (internalLinksCount > 0) {
    addCheck({
      id: 'onpage-links',
      category: 'On-Page SEO',
      title: `Internal Links Detected (${internalLinksCount})`,
      status: 'passed',
      severity: 'medium',
      description: `Found ${internalLinksCount} internal link(s) and ${externalLinksCount} external link(s).`,
      recommendation: 'A healthy internal linking structure distributes page authority and helps crawl discovery.'
    });
  } else {
    addCheck({
      id: 'onpage-links',
      category: 'On-Page SEO',
      title: 'Few or No Internal Links Found',
      status: 'warning',
      severity: 'medium',
      description: 'Could not detect internal navigation links on this page.',
      recommendation: 'Provide contextual links to related articles, categories, and main services.'
    });
  }

  if (emptyAnchorCount > 0) {
    addCheck({
      id: 'onpage-empty-links',
      category: 'On-Page SEO',
      title: `${emptyAnchorCount} Link(s) Without Descriptive Anchor Text`,
      status: 'warning',
      severity: 'low',
      description: 'Discovered link tags without visible text or labels.',
      recommendation: 'Ensure every link has descriptive anchor text or an aria-label for accessibility and crawling.'
    });
  }


  // ----------------------------------------------------
  // 3. SOCIAL SEO CHECKS (Open Graph & Twitter)
  // ----------------------------------------------------

  const ogTitle = $('meta[property="og:title" i]').attr('content');
  const ogDescription = $('meta[property="og:description" i]').attr('content');
  const ogImage = $('meta[property="og:image" i]').attr('content');
  const twitterCard = $('meta[name="twitter:card" i]').attr('content');

  const ogComplete = ogTitle && ogDescription && ogImage;

  if (ogComplete) {
    addCheck({
      id: 'social-og',
      category: 'Content',
      title: 'Complete Open Graph Tags',
      status: 'passed',
      severity: 'medium',
      description: 'og:title, og:description, and og:image are all defined.',
      recommendation: 'Your page will render rich social cards when shared on platforms like LinkedIn, Facebook, and Discord.'
    });
  } else if (ogTitle || ogDescription || ogImage) {
    addCheck({
      id: 'social-og',
      category: 'Content',
      title: 'Partial Open Graph Tags',
      status: 'warning',
      severity: 'low',
      description: `Missing: ${[!ogTitle ? 'og:title' : '', !ogDescription ? 'og:description' : '', !ogImage ? 'og:image' : ''].filter(Boolean).join(', ')}.`,
      recommendation: 'Add all three core Open Graph tags (title, description, and image) for polished social sharing.'
    });
  } else {
    addCheck({
      id: 'social-og',
      category: 'Content',
      title: 'Open Graph Tags Missing',
      status: 'warning',
      severity: 'medium',
      description: 'No Open Graph metadata found.',
      recommendation: 'Add og:title, og:description, and og:image in the head.'
    });
  }

  // Twitter/X Card
  if (twitterCard) {
    addCheck({
      id: 'social-twitter',
      category: 'Content',
      title: `Twitter/X Card Configured ("${twitterCard}")`,
      status: 'passed',
      severity: 'low',
      description: `Twitter card format is set to "${twitterCard}".`,
      recommendation: 'Use "summary_large_image" for maximum visual impact on Twitter/X.'
    });
  } else {
    addCheck({
      id: 'social-twitter',
      category: 'Content',
      title: 'Twitter/X Card Missing',
      status: 'info',
      severity: 'low',
      description: 'No twitter:card tag specified.',
      recommendation: 'Add <meta name="twitter:card" content="summary_large_image">.'
    });
  }


  // ----------------------------------------------------
  // 4. CONTENT CHECKS
  // ----------------------------------------------------

  // Calculate approximate word count
  // Remove script, style, noscript, etc.
  const clone = $('body').clone();
  clone.find('script, style, noscript, iframe, svg').remove();
  const bodyText = clone.text().replace(/\s+/g, ' ').trim();
  const words = bodyText.length > 0 ? bodyText.split(' ').filter(w => w.length > 1) : [];
  const wordCount = words.length;

  if (wordCount < 150) {
    addCheck({
      id: 'content-word-count',
      category: 'Content',
      title: `Thin Text Content (${wordCount} words)`,
      status: 'warning',
      severity: 'medium',
      description: `The page contains only approximately ${wordCount} words of readable text.`,
      recommendation: 'Provide substantive, informative content (300+ words) that thoroughly answers user questions.'
    });
  } else {
    addCheck({
      id: 'content-word-count',
      category: 'Content',
      title: `Sufficient Content Length (${wordCount} words)`,
      status: 'passed',
      severity: 'medium',
      description: `The page features approximately ${wordCount} words of textual content.`,
      recommendation: 'Keep content fresh, relevant, and well-structured.'
    });
  }

  // Text to HTML ratio
  const htmlLength = (html || '').length;
  const textLength = bodyText.length;
  const textRatio = htmlLength > 0 ? Math.round((textLength / htmlLength) * 100) : 0;

  if (textRatio < 10 && htmlLength > 5000) {
    addCheck({
      id: 'content-text-ratio',
      category: 'Content',
      title: `Low Text-to-HTML Ratio (${textRatio}%)`,
      status: 'warning',
      severity: 'low',
      description: `Text content accounts for ${textRatio}% of overall HTML size. High code overhead may slow down parsing.`,
      recommendation: 'Clean up inline scripts/styles and streamline bloated DOM markup.'
    });
  } else {
    addCheck({
      id: 'content-text-ratio',
      category: 'Content',
      title: `Healthy Text-to-HTML Ratio (${textRatio}%)`,
      status: 'passed',
      severity: 'low',
      description: `Readable text represents ${textRatio}% of document code size.`,
      recommendation: 'Ensure clean semantic HTML structure.'
    });
  }

  // URL Structure
  const urlPath = parsedUrl.pathname;
  const hasUnderscores = urlPath.includes('_');
  const isUrlClean = !hasUnderscores && urlPath.length < 90 && !parsedUrl.search.includes('&session');

  if (isUrlClean) {
    addCheck({
      id: 'content-url-structure',
      category: 'Content',
      title: 'SEO-Friendly URL Structure',
      status: 'passed',
      severity: 'low',
      description: 'The URL uses clean formatting without underscores or excessive parameters.',
      recommendation: 'Use hyphens to separate words in URLs and keep slugs concise.'
    });
  } else {
    addCheck({
      id: 'content-url-structure',
      category: 'Content',
      title: 'Suboptimal URL Structure',
      status: 'warning',
      severity: 'low',
      description: hasUnderscores ? 'The URL contains underscores instead of hyphens.' : 'The URL is unusually long or parameterized.',
      recommendation: 'Use clean hyphenated lowercase slugs for better search readability.'
    });
  }


  // ----------------------------------------------------
  // 5. PERFORMANCE CHECKS
  // ----------------------------------------------------

  // Response Time (TTFB estimate)
  if (responseTimeMs < 500) {
    addCheck({
      id: 'perf-response-time',
      category: 'Performance',
      title: `Fast Server Response Time (${responseTimeMs}ms)`,
      status: 'passed',
      severity: 'high',
      description: `The page loaded within ${responseTimeMs}ms, well below Google's recommended 600ms threshold.`,
      recommendation: 'Maintain optimal server performance, CDN caching, and database indexing.'
    });
  } else if (responseTimeMs < 1300) {
    addCheck({
      id: 'perf-response-time',
      category: 'Performance',
      title: `Moderate Server Response Time (${responseTimeMs}ms)`,
      status: 'warning',
      severity: 'medium',
      description: `The page took ${responseTimeMs}ms to respond. This is acceptable but has room for improvement.`,
      recommendation: 'Consider caching dynamic assets and utilizing a CDN to bring response times under 500ms.'
    });
  } else {
    addCheck({
      id: 'perf-response-time',
      category: 'Performance',
      title: `Slow Server Response Time (${responseTimeMs}ms)`,
      status: 'failed',
      severity: 'high',
      description: `The server took ${responseTimeMs}ms to respond, which significantly impairs user experience and SEO ranking.`,
      recommendation: 'Optimize backend query execution, upgrade hosting, or implement server-side caching.'
    });
  }

  // HTML Page Size
  const pageSizeKb = Math.round((pageSizeBytes / 1024) * 10) / 10;
  if (pageSizeKb < 150) {
    addCheck({
      id: 'perf-page-size',
      category: 'Performance',
      title: `Lightweight HTML Size (${pageSizeKb} KB)`,
      status: 'passed',
      severity: 'medium',
      description: `The initial document download is ${pageSizeKb} KB, ensuring rapid parsing.`,
      recommendation: 'Keep base document size low to accelerate first contentful paint.'
    });
  } else if (pageSizeKb < 500) {
    addCheck({
      id: 'perf-page-size',
      category: 'Performance',
      title: `Moderate HTML Size (${pageSizeKb} KB)`,
      status: 'warning',
      severity: 'medium',
      description: `HTML document size is ${pageSizeKb} KB. Large documents take longer to transmit on mobile devices.`,
      recommendation: 'Minify HTML and defer large inline payloads.'
    });
  } else {
    addCheck({
      id: 'perf-page-size',
      category: 'Performance',
      title: `Heavy HTML Document (${pageSizeKb} KB)`,
      status: 'failed',
      severity: 'medium',
      description: `The document is ${pageSizeKb} KB. Excessive DOM nodes slow down parsing and rendering.`,
      recommendation: 'Break up large pages, remove inline scripts/styles, and paginate extensive datasets.'
    });
  }

  // Compression Header check
  const contentEncoding = headers['content-encoding'];
  if (contentEncoding && (contentEncoding.includes('gzip') || contentEncoding.includes('br') || contentEncoding.includes('deflate'))) {
    addCheck({
      id: 'perf-compression',
      category: 'Performance',
      title: `HTTP Compression Enabled (${contentEncoding})`,
      status: 'passed',
      severity: 'medium',
      description: `Server employs ${contentEncoding} compression to reduce network transfer sizes.`,
      recommendation: 'Brotli (br) or Gzip compression significantly cuts bandwidth and boosts page speed.'
    });
  } else {
    addCheck({
      id: 'perf-compression',
      category: 'Performance',
      title: 'HTTP Compression Not Detected',
      status: 'warning',
      severity: 'medium',
      description: 'Response did not indicate active gzip or brotli compression.',
      recommendation: 'Enable Gzip or Brotli compression on your web server to shrink payload sizes by up to 70%.'
    });
  }

  return {
    checks,
    meta: {
      title: titleText || null,
      description: metaDesc || null,
      h1: h1Texts[0] || null,
      h1Count,
      h2Count,
      h3Count,
      totalImages,
      imagesMissingAlt,
      internalLinksCount,
      externalLinksCount,
      wordCount,
      responseTimeMs,
      pageSizeKb,
      canonicalUrl: canonicalEl || null,
      hasOg: Boolean(ogTitle || ogDescription || ogImage),
      hasTwitter: Boolean(twitterCard)
    }
  };
}

module.exports = {
  analyzeSeo
};
