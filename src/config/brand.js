
/**
 * Centralized Brand Configuration
 * Keep branding, navigation, and reusable product messaging in one place.
 */

export const BRAND = {
  name: 'SEO++',

  tagline: 'Free SEO, Content & Marketing Tools',

  heroHeadline: "Analyze your website's SEO health in seconds.",

  subheading:
    'Find technical and on-page SEO issues, generate content ideas, and use practical marketing tools — all in one place.',

  year: 2026,

  author: 'SEO++ Team',

  badge: 'Free SEO & Marketing Toolkit',

  freeFeatures: [
    'Free to use',
    'No login required',
    'No subscription required',
  ],

  auditLabel: 'SEO Website Audit',

  disclaimer:
    'SEO++ provides automated SEO analysis and rule-based marketing utilities. Results are informational and do not guarantee search engine rankings, social media reach, engagement, or conversions.',

  footerDisclaimer:
    'SEO++ provides automated SEO analysis and practical marketing utilities. Results are informational and should be used as a starting point for further review.',

  footerSubtitle:
    'Free, practical tools for SEO, content creation, social media, and digital marketing.',

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
      ],
    },
  ],

  companyLinks: [
    {
      label: 'All Tools',
      path: '/tools',
    },

    {
      label: 'About',
      path: '/about',
    },

    {
      label: 'Privacy',
      path: '/privacy',
    },

    {
      label: 'Terms',
      path: '/terms',
    },
  ],
};
