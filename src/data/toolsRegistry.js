/**
 * Master Registry of all SEOly Toolkit tools
 */
export const TOOL_CATEGORIES = {
  SEO: 'SEO Tools',
  SOCIAL: 'Social Media',
  MARKETING: 'Marketing Tools'
};

export const TOOLS_LIST = [
  {
    id: 'seo-checker',
    name: 'SEO Checker',
    path: '/',
    category: TOOL_CATEGORIES.SEO,
    badge: 'Core Utility',
    description: "Analyze your website's technical and on-page SEO.",
    icon: 'Search',
    longDescription: 'Comprehensive live crawling and 24-point audit of technical headers, canonicals, mobile viewport, metadata, and performance.'
  },
  {
    id: 'search-console',
    name: 'Google Search Console',
    path: '/tools/search-console',
    category: TOOL_CATEGORIES.SEO,
    badge: 'Integration',
    description: 'Connect your verified Google Search Console property.',
    icon: 'BarChart2',
    longDescription: 'Direct Google OAuth connection to view total clicks, impressions, average CTR, average keyword position, and top landing pages.'
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    path: '/tools/hashtags',
    category: TOOL_CATEGORIES.SOCIAL,
    badge: 'Social Media',
    description: 'Generate relevant hashtags from your topic or keywords.',
    icon: 'Hash',
    longDescription: 'Deterministic, rule-based hashtag generation tailored across Instagram, TikTok, LinkedIn, Facebook, and YouTube.'
  },
  {
    id: 'caption-generator',
    name: 'Caption Generator',
    path: '/tools/captions',
    category: TOOL_CATEGORIES.SOCIAL,
    badge: 'Social Media',
    description: 'Create ready-to-edit social media captions using customizable templates.',
    icon: 'MessageSquare',
    longDescription: 'Select your platform, tone, and topic to produce structured, editable captions with hook, value points, and call-to-action.'
  },
  {
    id: 'hook-generator',
    name: 'Hook Generator',
    path: '/tools/hooks',
    category: TOOL_CATEGORIES.SOCIAL,
    badge: 'Social Media',
    description: 'Create attention-grabbing opening lines for your content.',
    icon: 'Sparkles',
    longDescription: 'Generate high-performing opening hooks categorized by questions, curiosity, problems, benefits, contrarian angles, and stories.'
  },
  {
    id: 'content-ideas',
    name: 'Content Ideas',
    path: '/tools/content-ideas',
    category: TOOL_CATEGORIES.SOCIAL,
    badge: 'Social Media',
    description: 'Generate content ideas from your topic and platform.',
    icon: 'Lightbulb',
    longDescription: 'Rule-based inspiration across tutorials, checklists, case studies, beginner mistakes, and comparison angles.'
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    path: '/tools/character-counter',
    category: TOOL_CATEGORIES.SOCIAL,
    badge: 'Social Media',
    description: 'Count characters, words, sentences, and spaces.',
    icon: 'AlignLeft',
    longDescription: 'Real-time text statistics and platform character guidance for Instagram, TikTok, LinkedIn, YouTube, Facebook, and X.'
  },
  {
    id: 'utm-builder',
    name: 'UTM Builder',
    path: '/tools/utm-builder',
    category: TOOL_CATEGORIES.MARKETING,
    badge: 'Marketing',
    description: 'Create campaign tracking URLs quickly and accurately.',
    icon: 'Link',
    longDescription: 'Fast, client-side URL builder to assemble standardized UTM campaign tracking links with instant encoding.'
  }
];
