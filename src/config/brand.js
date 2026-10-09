/**
 * Centralized Brand Configuration
 * Keep branding, navigation, and reusable product messaging in one place.
 */

export const BRAND = {
  name: 'SEO++',

  tagline: 'Free SEO, Search Console & Marketing Toolkit',

  heroHeadline: "Analyze your website's SEO health in seconds.",

  subheading:
    'Find technical and on-page SEO issues, inspect Google Search Console rankings, uncover keyword ideas, and use practical marketing tools — all in one place.',

  year: 2026,

  author: 'SEO++ Editorial Team',

  badge: 'Free SEO & Marketing Toolkit',

  freeFeatures: [
    '100% Free to use',
    'No login required',
    'No subscription required',
  ],

  auditLabel: 'SEO Website Audit',

  disclaimer:
    'SEO++ provides automated SEO analysis, search performance insights, and rule-based marketing utilities. Results are informational and do not guarantee search engine rankings, indexing, or commercial conversions.',

  footerDisclaimer:
    'SEO++ provides automated technical SEO analysis, keyword brainstorming, and practical marketing utilities. Audit results and metrics are educational and should be used as starting points for further technical review.',

  footerSubtitle:
    'Free, practical tools for SEO audits, search analytics, content creation, social media, and digital marketing.',

  navGroups: [
    {
      label: 'SEO Tools',
      path: '/',
      items: [
        {
          label: 'SEO Checker',
          path: '/',
          description:
            "Analyze a website's technical and on-page SEO signals.",
        },
        {
          label: 'Search Console Tool',
          path: '/tools/search-console',
          description:
            'Connect verified Search Console properties to inspect queries and rankings.',
        },
        {
          label: 'Domain Rating (DR) Checker',
          path: '/tools/dr-checker',
          description:
            'Check domain authority and backlink profile strength on a 0-100 scale.',
        },
        {
          label: 'Keyword Finder',
          path: '/tools/keyword-finder',
          description:
            'Discover relevant related queries, long-tail ideas, and search questions.',
        },
      ],
    },

    {
      label: 'Social Media',
      path: '/tools/hashtags',
      items: [
        {
          label: 'Hashtag Generator',
          path: '/tools/hashtags',
          description:
            'Generate relevant hashtag suggestions from topics and niches.',
        },
        {
          label: 'Caption Generator',
          path: '/tools/captions',
          description:
            'Create quick, template-based captions for social posts.',
        },
        {
          label: 'Hook Generator',
          path: '/tools/hooks',
          description:
            'Generate opening hooks using different content angles.',
        },
        {
          label: 'Content Ideas',
          path: '/tools/content-ideas',
          description:
            'Get practical content ideas across multiple formats and topics.',
        },
        {
          label: 'Character Counter',
          path: '/tools/character-counter',
          description:
            'Check characters, words, sentences, and other text statistics.',
        },
      ],
    },

    {
      label: 'Marketing Tools',
      path: '/tools/utm-builder',
      items: [
        {
          label: 'UTM Builder',
          path: '/tools/utm-builder',
          description:
            'Create campaign tracking URLs with UTM parameters.',
        },
        {
          label: 'All Tools Directory',
          path: '/tools',
          description:
            'Browse our full suite of 10 free search and marketing tools.',
        },
      ],
    },

    {
      label: 'Blog & Insights',
      path: '/blog',
      items: [
        {
          label: 'SEO++ Blog',
          path: '/blog',
          description:
            'In-depth guides on SEO, search analytics, and growth.',
        },
        {
          label: 'Write for Us',
          path: '/write-for-us',
          description:
            'Publish guest and sponsored content with SEO++.',
        },
      ],
    },
  ],

  companyLinks: [
    {
      label: 'SEO++ Blog',
      path: '/blog',
    },
    {
      label: 'Write for Us',
      path: '/write-for-us',
    },
    {
      label: 'All Tools',
      path: '/tools',
    },
    {
      label: 'About',
      path: '/about',
    },
    {
      label: 'Contact',
      path: '/contact',
    },
    {
      label: 'Privacy',
      path: '/privacy',
    },
    {
      label: 'Terms',
      path: '/terms',
    },
    {
      label: 'Disclaimer',
      path: '/disclaimer',
    },
  ],
};
