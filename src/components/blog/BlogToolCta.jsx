import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart2, Link as LinkIcon, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

const CTA_CONFIGS = {
  'seo-checker': {
    badge: 'Free SEO Audit',
    icon: Search,
    title: 'Analyze Your Website with SEO++',
    description: 'Run an instant on-page and technical SEO audit. Check title tags, headings, canonical links, mobile speed, and meta issues in seconds.',
    buttonText: 'Run Free SEO Audit',
    link: '/'
  },
  'search-console': {
    badge: 'Search Console Analytics',
    icon: BarChart2,
    title: 'Connect Google Search Console with SEO++',
    description: 'Track your real organic clicks, impressions, CTR, and average keyword rankings directly in our streamlined analytics dashboard.',
    buttonText: 'Connect Search Console',
    link: '/tools/search-console'
  },
  'utm-builder': {
    badge: 'Marketing Attribution',
    icon: LinkIcon,
    title: 'Build Campaign Tracking Links with SEO++',
    description: 'Generate clean, reliable UTM parameters for your social posts, guest articles, and newsletters to measure your true traffic source ROI.',
    buttonText: 'Open UTM Builder',
    link: '/tools/utm-builder'
  },
  'content-ideas': {
    badge: 'Content Strategy',
    icon: Lightbulb,
    title: 'Generate Fresh Content Angles with SEO++',
    description: 'Overcome writer’s block with structured content formulas, case study angles, and tutorial templates tailored for search intent.',
    buttonText: 'Get Content Ideas',
    link: '/tools/content-ideas'
  },
  'all-tools': {
    badge: 'Free Toolkit',
    icon: Sparkles,
    title: 'Explore All Free SEO & Growth Tools',
    description: 'From hashtag generators and caption builders to technical website auditing — 100% free with no login required.',
    buttonText: 'Browse All Tools',
    link: '/tools'
  }
};

export default function BlogToolCta({ toolType = 'seo-checker' }) {
  const config = CTA_CONFIGS[toolType] || CTA_CONFIGS['seo-checker'];
  const IconComponent = config.icon;

  return (
    <aside className="blog-tool-cta-card my-5" aria-label="Related SEO++ Tool">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 p-4 p-lg-5">
        <div className="blog-tool-cta-content">
          <div className="d-inline-flex align-items-center gap-2 mb-2 blog-tool-cta-badge">
            <IconComponent size={14} className="text-primary" />
            <span>{config.badge}</span>
          </div>
          <h3 className="h4 fw-bold text-main mb-2">{config.title}</h3>
          <p className="text-secondary mb-0" style={{ maxWidth: '580px', fontSize: '0.95rem' }}>
            {config.description}
          </p>
        </div>
        <div className="blog-tool-cta-action flex-shrink-0">
          <Link to={config.link} className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-semibold">
            <span>{config.buttonText}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
