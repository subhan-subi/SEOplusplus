'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const { Article } = require('../models/Article');

const SEED_ARTICLES = [
  {
    title: "What Is SEO? The Complete Beginner's Guide to Search Engine Optimization",
    slug: 'what-is-seo-beginners-guide',
    category: 'SEO Basics',
    excerpt: 'Learn the fundamentals of Search Engine Optimization (SEO), how search engines discover pages, and the 3 pillars of ranking on Google.',
    featuredImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
    tags: ['SEO Basics', 'Search Engines', 'Organic Growth', 'Beginners'],
    readingTime: 6,
    isFeatured: true,
    isSponsored: false,
    relatedTool: 'seo-checker',
    author: {
      name: 'Elena Vance',
      role: 'Head of SEO Strategy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      bio: 'Elena has helped over 200 SaaS products and content creators scale organic search traffic over the last 8 years.'
    },
    seoTitle: 'What Is SEO? The Complete Beginner Guide (2026)',
    seoDescription: 'Discover how search engine optimization works, why organic traffic matters, and the foundational pillars every website owner needs to know.',
    canonicalUrl: 'https://seoplusplus.vercel.app/blog/what-is-seo-beginners-guide',
    status: 'published',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    content: `
<h2>Introduction: Why Search Engine Optimization Still Matters</h2>
<p>Search Engine Optimization (SEO) is the scientific art of improving a website so that search engines like Google, Bing, and DuckDuckGo present your pages at the top of organic (unpaid) search results. When someone types a question or search term related to your business, strong SEO ensures that your brand provides the answer.</p>

<p>Unlike paid advertising, which stops generating traffic the exact second you turn off your ad spend, organic search generates compounding returns. An authoritative, well-optimized article or product page can bring targeted, high-intent visitors to your platform every single day for years.</p>

<h2>The Three Essential Pillars of Modern SEO</h2>
<p>To succeed in search today, you must align three distinct pillars of your website:</p>

<ol>
  <li><strong>Technical SEO:</strong> Ensuring search crawlers can efficiently access, render, and index your website without friction, speed bottlenecks, or indexing barriers.</li>
  <li><strong>On-Page SEO:</strong> Crafting helpful, relevant content targeting real search intent, with optimized title tags, semantic headings (H1, H2, H3), meta descriptions, and media attributes.</li>
  <li><strong>Off-Page SEO & Authority:</strong> Building legitimate reputation, backlinks, and brand citations across your industry so search engines trust your website as a credible authority.</li>
</ol>

<blockquote>
  <p>"SEO is not about tricking Google. It is about partnering with Google to provide the best possible answer to the searcher's question."</p>
</blockquote>

<h2>How Search Engines Discover and Rank Content</h2>
<p>Search engines work in three continuous phases:</p>

<ul>
  <li><strong>1. Crawling:</strong> Automated bots (such as Googlebot) discover links across the web and download the code and media on each page.</li>
  <li><strong>2. Indexing:</strong> The search engine processes and parses the page content, extracting key signals, semantic topics, images, and structured metadata into a massive global index.</li>
  <li><strong>3. Ranking:</strong> When a user enters a query, the search algorithm evaluates hundreds of ranking factors (relevance, speed, mobile usability, backlinks, user satisfaction) to order the most helpful results.</li>
</ul>

<h2>Actionable First Steps for Every Website Owner</h2>
<p>If you are launching a new site or auditing an existing property, start with these non-negotiable fundamentals:</p>

<ul>
  <li>Set up an automated XML sitemap and submit it to Google Search Console.</li>
  <li>Ensure every primary page has a single, unique <code>&lt;h1&gt;</code> and a descriptive <code>&lt;title&gt;</code> tag.</li>
  <li>Verify that your site loads in under 2.5 seconds on mobile 4G networks.</li>
  <li>Audit your website using our free automated analyzer to identify quick technical wins.</li>
</ul>
`
  },
  {
    title: 'How to Check Your Website SEO: A Practical 10-Step Audit Guide',
    slug: 'how-to-check-website-seo-audit-guide',
    category: 'SEO Tools & Tutorials',
    excerpt: 'Step-by-step instructions on auditing your website for critical on-page, performance, and technical SEO issues in under 15 minutes.',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['SEO Audit', 'Website Health', 'On-Page SEO', 'Technical SEO'],
    readingTime: 7,
    isFeatured: true,
    isSponsored: false,
    relatedTool: 'seo-checker',
    author: {
      name: 'Marcus Sterling',
      role: 'Technical SEO Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      bio: 'Marcus specializes in web crawler diagnostics, Core Web Vitals, and programmatic SEO architecture.'
    },
    seoTitle: 'How to Check Your Website SEO: 10-Step Audit Checklist (2026)',
    seoDescription: 'Run a thorough SEO audit on any website. Learn how to diagnose meta tags, headings, canonical links, mobile speed, and indexing bottlenecks.',
    canonicalUrl: 'https://seoplusplus.vercel.app/blog/how-to-check-website-seo-audit-guide',
    status: 'published',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    content: `
<h2>Why Regular SEO Audits Protect Your Organic Revenue</h2>
<p>Websites are living systems. Every CMS update, theme change, code deployment, or marketing campaign introduces the risk of unintentional SEO regression. Broken canonical tags, accidentally blocked robots.txt directives, missing open graph metadata, and bloated imagery can drastically drag down search rankings overnight.</p>

<p>Performing a structured 10-step audit once a month ensures you identify and fix technical anomalies before search engine crawlers penalize your rankings.</p>

<h2>The 10-Step Practical Audit Checklist</h2>

<h3>1. Check HTTP Status Code and Protocol</h3>
<p>Ensure your website enforces HTTPS sitewide with valid SSL certificates. Check that non-www automatically redirects to www (or vice versa) via a permanent 301 redirect to avoid splitting your link equity.</p>

<h3>2. Audit Title Tags and Meta Descriptions</h3>
<p>Your <code>&lt;title&gt;</code> is your primary search snippet headline. It should be between 50 and 60 characters, include your target keyword near the front, and clearly state your brand. Your meta description should be between 140 and 160 characters with a clear call to action.</p>

<h3>3. Verify Heading Hierarchy (H1, H2, H3)</h3>
<p>Every page should have exactly one <code>&lt;h1&gt;</code> element that defines the topic. Secondary sections should use <code>&lt;h2&gt;</code>, and sub-sections should use <code>&lt;h3&gt;</code>. Never skip heading levels for styling purposes.</p>

<h3>4. Check Canonical URLs</h3>
<p>Every indexable page must contain a self-referencing <code>&lt;link rel="canonical" href="..." /&gt;</code> to prevent duplicate content issues caused by tracking query strings or URL variations.</p>

<h3>5. Review Image Alt Attributes and Compression</h3>
<p>Large uncompressed images are the leading cause of poor Largest Contentful Paint (LCP). Convert images to WebP or AVIF formats and verify that every image has descriptive, contextual alt text for accessibility and image search.</p>

<h3>6. Inspect Robots.txt and Sitemap.xml</h3>
<p>Confirm that your robots.txt file does not inadvertently disallow vital assets (CSS, JS, or main content paths) and that it points directly to your XML sitemap location.</p>

<h3>7. Test Mobile Usability and Viewport Tags</h3>
<p>With Google's 100% mobile-first indexing, test your pages across multiple viewport sizes. Ensure touch targets are at least 48px apart and text remains legible without horizontal pinching.</p>

<h3>8. Measure Core Web Vitals (LCP, INP, CLS)</h3>
<p>Monitor your page speed metrics. Keep Largest Contentful Paint under 2.5s, Interaction to Next Paint under 200ms, and Cumulative Layout Shift under 0.1.</p>

<h3>9. Audit Open Graph and Twitter Card Tags</h3>
<p>When users share your links on LinkedIn, Twitter, Slack, or WhatsApp, having complete <code>og:title</code>, <code>og:description</code>, and <code>og:image</code> tags ensures your links preview professionally with rich cards.</p>

<h3>10. Verify Search Console Indexation Status</h3>
<p>Finally, inspect your live URL directly in Google Search Console to verify there are no coverage warnings or crawl errors.</p>
`
  },
  {
    title: 'Google Search Console Beginner Guide: How to Track Clicks and Rankings',
    slug: 'google-search-console-beginner-guide',
    category: 'Google Search Console',
    excerpt: 'Unlock the goldmine of search performance data in Google Search Console. Learn how to interpret impressions, CTR, queries, and keyword positions.',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: ['Google Search Console', 'Search Analytics', 'CTR', 'Keywords'],
    readingTime: 8,
    isFeatured: false,
    isSponsored: false,
    relatedTool: 'search-console',
    author: {
      name: 'Elena Vance',
      role: 'Head of SEO Strategy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      bio: 'Elena has helped over 200 SaaS products and content creators scale organic search traffic over the last 8 years.'
    },
    seoTitle: 'Google Search Console Beginner Guide: Clicks & Impressions (2026)',
    seoDescription: 'Master Google Search Console. Understand organic clicks, impressions, CTR, average position, and how to spot low-hanging keyword opportunities.',
    canonicalUrl: 'https://seoplusplus.vercel.app/blog/google-search-console-beginner-guide',
    status: 'published',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    content: `
<h2>The Single Source of Truth for Google Organic Search</h2>
<p>Third-party SEO tools provide helpful estimates, but Google Search Console (GSC) is the only tool that delivers verified, first-party data directly from Google's search logs. Through GSC, you can see the exact terms people searched for before clicking through to your website.</p>

<h2>The 4 Core Metrics Explained</h2>

<h3>1. Total Clicks</h3>
<p>Total clicks represent the number of times a user clicked your link in Google search results and landed on your website. This excludes clicks from paid Google Ads.</p>

<h3>2. Total Impressions</h3>
<p>An impression is counted every time a link URL from your site appeared in a search result seen by a user. Even if the user did not scroll all the way down, if your result was rendered on their viewport, an impression is logged.</p>

<h3>3. Average Click-Through Rate (CTR)</h3>
<p>CTR is calculated as <code>(Total Clicks / Total Impressions) * 100</code>. A query with 1,000 impressions and 50 clicks has a 5.0% CTR. If your average position is high (e.g. position 1-3) but your CTR is below 3%, your title tag and meta description are likely failing to compel searchers.</p>

<h3>4. Average Position</h3>
<p>Average position shows where your URL ranked on average across all user queries during the selected timeframe. Position 1 is the topmost organic result, while position 11 is typically the top of page two.</p>

<h2>How to Find "Low-Hanging Fruit" Keywords</h2>
<p>One of the highest-ROI tactics in SEO is optimizing pages that rank between positions 5 and 15:</p>

<ul>
  <li>Filter your Performance report by queries ranking between <strong>position 5.0 and 15.0</strong>.</li>
  <li>Sort by <strong>Impressions descending</strong>.</li>
  <li>These queries already receive massive search demand, and Google already considers your page relevant.</li>
  <li>Update your page content to more directly address the specific sub-topics asked by these queries.</li>
  <li>Improve your title tag to entice clicks. Moving from position 8 to position 3 can frequently quadruple your organic traffic.</li>
</ul>
`
  },
  {
    title: 'Technical SEO Checklist: Crawling, Indexing, and Core Web Vitals',
    slug: 'technical-seo-checklist-crawling-indexing',
    category: 'Technical SEO',
    excerpt: 'Master the technical foundation of your site. Comprehensive checklist covering server response codes, crawl budget, canonicalization, and speed.',
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Technical SEO', 'Crawling', 'Core Web Vitals', 'Indexing'],
    readingTime: 6,
    isFeatured: false,
    isSponsored: false,
    relatedTool: 'seo-checker',
    author: {
      name: 'Marcus Sterling',
      role: 'Technical SEO Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      bio: 'Marcus specializes in web crawler diagnostics, Core Web Vitals, and programmatic SEO architecture.'
    },
    seoTitle: 'Technical SEO Checklist: Crawling, Indexing & Speed (2026)',
    seoDescription: 'A complete technical SEO checklist for developers and webmasters. Optimize crawl budget, canonical headers, and Core Web Vitals.',
    canonicalUrl: 'https://seoplusplus.vercel.app/blog/technical-seo-checklist-crawling-indexing',
    status: 'published',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    content: `
<h2>The Backbone of Search Visibility</h2>
<p>No matter how exceptional your written content is, if search engine crawlers encounter 5xx server errors, redirect loops, infinite pagination traps, or blocked rendering resources, your pages will never achieve their ranking potential.</p>

<h2>Critical Technical Areas to Audit</h2>

<h3>1. Crawl Budget and Indexability Directives</h3>
<p>Make sure your <code>robots.txt</code> file is located at the root domain and correctly structured. Use the <code>noindex</code> meta tag on thin pages (internal search results, admin dashboards, filter permutations) to prevent wasting crawl budget on non-valuable content.</p>

<h3>2. Canonical Tag Hygiene</h3>
<p>Ensure that canonical tags point to absolute URLs, including protocol and exact casing. Never point a canonical tag to a URL that returns a 301 redirect or 404 status.</p>

<h3>3. Structured Data (Schema.org)</h3>
<p>Implement valid JSON-LD schemas for your core entities: <code>Organization</code>, <code>WebSite</code>, <code>Article</code>, and <code>BreadcrumbList</code>. Validate your structured data using Google's Rich Results Test tool.</p>

<h3>4. Internal Linking & Site Architecture</h3>
<p>Keep your most important revenue and conversion pages within 3 clicks of the home page. Avoid orphaned pages that have no incoming internal links from other live pages.</p>
`
  },
  {
    title: 'How to Write High-CTR Meta Titles and Meta Descriptions',
    slug: 'how-to-write-high-ctr-meta-titles-descriptions',
    category: 'On-Page SEO',
    excerpt: 'Your snippet is your digital billboard in the search results. Learn psychology-backed copywriting frameworks to double your click-through rates.',
    featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    tags: ['On-Page SEO', 'Copywriting', 'Meta Tags', 'CTR'],
    readingTime: 5,
    isFeatured: false,
    isSponsored: false,
    relatedTool: 'content-ideas',
    author: {
      name: 'Sofia Chen',
      role: 'Growth & Content Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
      bio: 'Sofia writes about conversion copywriting, organic marketing funnels, and user psychology.'
    },
    seoTitle: 'How to Write High-CTR Meta Titles & Descriptions (2026)',
    seoDescription: 'Proven copywriting formulas for meta titles and descriptions. Increase search snippet CTR without clickbait.',
    canonicalUrl: 'https://seoplusplus.vercel.app/blog/how-to-write-high-ctr-meta-titles-descriptions',
    status: 'published',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    content: `
<h2>The First Impression in Search Engine Results</h2>
<p>When a prospective customer types a query into Google, they scan 10 organic results in less than 4 seconds. Your <code>&lt;title&gt;</code> and <code>&lt;meta name="description"&gt;</code> are the single marketing asset that determines whether they click your link or choose your competitor.</p>

<h2>Proven Headline Formulas for High Organic CTR</h2>

<h3>Formula 1: The Specific Benefit + Bracketed Proof</h3>
<p><em>Example:</em> "10 Ways to Increase Website Speed in 2026 [Real Case Study]"</p>
<p>Bracketed clarifications like <code>[Guide]</code>, <code>[Checklist]</code>, <code>[Template]</code>, or <code>[Free Tool]</code> consistently increase CTR by setting transparent expectations.</p>

<h3>Formula 2: The Direct Problem Solver</h3>
<p><em>Example:</em> "How to Fix Google Search Console Redirect Errors (Step-by-Step)"</p>
<p>Searchers with high intent want clarity, not fluff. Directly stating the problem and promised resolution wins clicks.</p>

<h2>Meta Description Best Practices</h2>
<ul>
  <li>Keep length between 135 and 155 characters to avoid mobile truncation.</li>
  <li>Include the primary keyword naturally so Google highlights it in bold text.</li>
  <li>End with an active verb or compelling call to action: "Read the full checklist", "Audit your URL free", or "Calculate your score today".</li>
</ul>
`
  },
  {
    title: 'Guest Posting in 2026: Quality Guidelines and Outreach Best Practices',
    slug: 'guest-posting-quality-guidelines-outreach',
    category: 'Guest Posting',
    excerpt: 'Why spammy guest post networks fail and how genuine, high-quality editorial collaborations build lasting domain authority and referral traffic.',
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Guest Posting', 'Link Building', 'Outreach', 'Digital PR'],
    readingTime: 6,
    isFeatured: false,
    isSponsored: false,
    relatedTool: 'utm-builder',
    author: {
      name: 'Sofia Chen',
      role: 'Growth & Content Lead',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
      bio: 'Sofia writes about conversion copywriting, organic marketing funnels, and user psychology.'
    },
    seoTitle: 'Guest Posting in 2026: Editorial Standards & Outreach Best Practices',
    seoDescription: 'Learn how to publish guest articles on authoritative industry publications. Guidelines for original writing, editorial review, and sponsored disclosures.',
    canonicalUrl: 'https://seoplusplus.vercel.app/blog/guest-posting-quality-guidelines-outreach',
    status: 'published',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    content: `
<h2>The Evolution of Guest Publishing</h2>
<p>Gone are the days when churning out generic 500-word spun articles with exact-match anchor text worked. Modern search engines possess sophisticated natural language understanding that easily detects low-value guest post exchanges.</p>

<p>Today, guest posting is a premium editorial collaboration. Leading platforms and SaaS publications only accept articles that offer deep original research, actionable tutorials, and genuine expertise.</p>

<h2>What Top Editorial Teams Look For</h2>

<h3>1. Truly Original Analysis and Experience</h3>
<p>Generic definitions of basic concepts are easily written by AI. What readers value is lived operational experience: original benchmark data, real case studies, specific screenshots, and tested workflows.</p>

<h3>2. Strict Plagiarism and AI Hallucination Checks</h3>
<p>Submissions must be 100% original. Re-publishing previously published text or submitting unedited automated output harms both the publisher and the author's brand reputation.</p>

<h3>3. Ethical Linking and Sponsored Disclosures</h3>
<p>When an article includes links to commercial products or sponsored partners, modern search guidelines require appropriate attributes such as <code>rel="sponsored"</code> or <code>rel="nofollow"</code>. Transparency maintains reader trust and search engine compliance.</p>

<h2>Want to Publish on SEO++?</h2>
<p>We welcome guest submissions and editorial partnerships from verified digital marketers, SEO specialists, developers, and agency practitioners. Visit our <a href="/write-for-us">Write for Us page</a> to learn about our guidelines and submit your pitch directly to our editorial team.</p>
`
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('[Seed] Connected to MongoDB Atlas. Seeding articles...');

    for (const articleData of SEED_ARTICLES) {
      const existing = await Article.findOne({ slug: articleData.slug });
      if (existing) {
        console.log(`[Seed] Article "${articleData.slug}" already exists. Skipping.`);
      } else {
        await Article.create(articleData);
        console.log(`[Seed] Created article: "${articleData.title}" (${articleData.slug})`);
      }
    }

    const total = await Article.countDocuments();
    console.log(`[Seed] Complete! Total articles in DB: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed, SEED_ARTICLES };
