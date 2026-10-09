import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import PageSeo from '../components/common/PageSeo';
import {
  HelpCircle,
  Cpu,
  CheckCircle,
  Users,
  HeartHandshake,
  AlertTriangle,
  ArrowRight,
  Search,
  Hash,
  MessageSquare,
  Link as LinkIcon,
  BarChart2,
  TrendingUp,
  Key,
  BookOpen,
  Mail
} from 'lucide-react';

export default function About() {
  return (
    <div className="container py-5" style={{ maxWidth: '840px' }}>
      <PageSeo
        title="About SEO++ – Free Website SEO & Marketing Toolkit"
        description="Learn about SEO++, our mission to provide practical, free search optimization and marketing utilities, our data handling principles, and our open tools."
        canonicalUrl="https://seoplusplus.vercel.app/about"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' }
        ]}
      />

      {/* Hero */}
      <div className="mb-5 text-center">
        <span className="badge-subtle-primary mb-3 d-inline-block">
          About {BRAND.name}
        </span>

        <h1 className="h2 fw-bold text-main mb-3">
          Practical tools for SEO, content, and digital growth.
        </h1>

        <p
          className="text-secondary max-w-600 mx-auto"
          style={{ maxWidth: '640px' }}
        >
          <strong>{BRAND.name}</strong> is a free, transparent collection of practical
          utilities for website SEO audits, Google Search Console performance analytics,
          keyword discovery, content creation, and campaign link building. No accounts,
          credit cards, or artificial paywalls.
        </p>
      </div>

      <div className="d-flex flex-column gap-4">

        {/* 1. What is the platform? */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <HelpCircle size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              1. What is {BRAND.name}?
            </h2>
          </div>

          <p className="text-secondary mb-3">
            {BRAND.name} is an open, lightweight web platform built for developers,
            content creators, marketers, founders, and small business owners who
            need fast, reliable tools for everyday digital work.
          </p>

          <p className="text-muted small mb-0">
            Rather than requiring expensive enterprise subscriptions for basic checks,
            SEO++ brings core technical SEO analysis, social media writing helpers,
            keyword idea generators, and campaign tracking into a clean, modern interface.
          </p>
        </section>

        {/* 2. How do the tools work? */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <Cpu size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              2. How do the tools work?
            </h2>
          </div>

          <p className="text-secondary mb-3">
            Different tools use transparent, specialized approaches depending on their purpose:
          </p>

          <ul className="text-secondary small d-flex flex-column gap-2 mb-0 ps-3">
            <li>
              <strong>SEO Website Checker:</strong> Analyzes submitted public URLs, parses HTML tags, inspects server headers, checks mobile viewports, and evaluates 24 foundational technical and on-page ranking signals.
            </li>

            <li>
              <strong>Google Search Console Tool:</strong> Uses official Google OAuth 2.0 to query your verified property search logs in read-only mode, showing real clicks, impressions, CTR, and keyword rankings directly.
            </li>

            <li>
              <strong>Keyword Finder:</strong> Analyzes seed topics to produce categorized keyword variations, search questions, comparisons, and commercial queries organized by intent.
            </li>

            <li>
              <strong>Client-Side Utilities:</strong> The Hashtag Generator, Caption Generator, Hook Generator, Content Ideas, Character Counter, and UTM Builder run locally in your browser with zero data transmission.
            </li>
          </ul>
        </section>

        {/* 3. Tools Included */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <CheckCircle size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              3. Suite of 10 Free Tools
            </h2>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <Search size={16} className="text-primary" />
                  <span>SEO Checker</span>
                </div>
                <p className="text-muted small mb-0">
                  Comprehensive 24-point crawl of technical headers, canonicals, mobile viewport, metadata, and performance.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <BarChart2 size={16} className="text-primary" />
                  <span>Google Search Console</span>
                </div>
                <p className="text-muted small mb-0">
                  Direct Google OAuth connection to view verified clicks, impressions, average CTR, and top query rankings.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <TrendingUp size={16} className="text-primary" />
                  <span>Domain Rating (DR) Checker</span>
                </div>
                <p className="text-muted small mb-0">
                  Measures relative domain authority and backlink profile strength on a 0-100 logarithmic scale.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <Key size={16} className="text-primary" />
                  <span>Keyword Finder</span>
                </div>
                <p className="text-muted small mb-0">
                  Generate targeted keyword variations, search questions, comparisons, and commercial phrases.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <Hash size={16} className="text-primary" />
                  <span>Hashtag &amp; Caption Generators</span>
                </div>
                <p className="text-muted small mb-0">
                  Hashtag suggestions and template-based captions for Instagram, TikTok, LinkedIn, and YouTube.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <LinkIcon size={16} className="text-primary" />
                  <span>UTM Builder &amp; Text Utilities</span>
                </div>
                <p className="text-muted small mb-0">
                  Fast campaign URL builder, real-time character counter, and opening hook templates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Who can use it? */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <Users size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              4. Who is {BRAND.name} for?
            </h2>
          </div>

          <p className="text-secondary mb-0">
            Anyone managing websites, writing digital content, or running marketing campaigns. Web developers use our SEO Checker before deploying new sites, writers use our word and hook tools, and marketers build campaign tracking links and track Search Console queries.
          </p>
        </section>

        {/* 5. Editorial Knowledge Hub */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <BookOpen size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              5. Editorial Standards &amp; Blog
            </h2>
          </div>

          <p className="text-secondary mb-3">
            In addition to software utilities, {BRAND.name} maintains an educational publication featuring actionable guides on technical SEO, Search Console optimization, crawling and indexing best practices, and organic growth.
          </p>

          <p className="text-muted small mb-0">
            We adhere to strict editorial standards: 100% original writing, data-backed advice, and transparent disclosures for any sponsored partnerships. Interested contributors can review our guidelines on our <Link to="/write-for-us" className="text-primary text-decoration-none">Write for Us page</Link>.
          </p>
        </section>

        {/* 6. Contact and Inquiries */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <Mail size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              6. Have Feedback or Questions?
            </h2>
          </div>

          <p className="text-secondary mb-3">
            We actively improve SEO++ based on user suggestions and bug reports. Reach out to our team anytime via our <Link to="/contact" className="text-primary text-decoration-none">Contact Us page</Link> or visit our public repository on <a href="https://github.com/subhan-subi/SEOplusplus" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">GitHub</a>.
          </p>

          <div className="d-flex gap-2">
            <Link to="/contact" className="btn btn-outline-secondary btn-sm">
              Contact Team
            </Link>
            <Link to="/disclaimer" className="btn btn-outline-secondary btn-sm">
              View Disclaimer
            </Link>
          </div>
        </section>

      </div>

      <div className="text-center pt-4 mt-2">
        <Link
          to="/tools"
          className="btn btn-analyze d-inline-flex align-items-center gap-2 px-4 py-2"
        >
          <span>Explore All Free Tools</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
