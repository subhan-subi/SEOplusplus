import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Shield, 
  Search, 
  Zap, 
  Code2, 
  Sparkles, 
  BarChart2, 
  Hash, 
  MessageSquare, 
  AlignLeft, 
  Link as LinkIcon, 
  ArrowRight,
  TrendingUp,
  Key
} from 'lucide-react';
import { BRAND } from '../config/brand';
import UrlAnalyzer from '../components/UrlAnalyzer';
import PageSeo from '../components/common/PageSeo';

export default function Home() {
  return (
    <div className="home-page">
      <PageSeo
        title="Free Website SEO Health & Performance Audit Tool"
        description="Analyze your website SEO health, meta tags, page speed, mobile performance, and backlink authority in seconds with actionable recommendations."
        canonical="/"
      />

      {/* Hero Section */}
      <section className="hero-section text-center" aria-label="Hero section">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={14} aria-hidden="true" />
            <span>{BRAND.badge}</span>
          </div>

          <h1 className="hero-title">
            Analyze your website's SEO health <br className="d-none d-sm-inline" />
            <span className="gradient-text">in seconds.</span>
          </h1>

          <p className="hero-lead">
            {BRAND.subheading}
          </p>

          {/* Main URL Input Card */}
          <UrlAnalyzer />

          {/* Three Feature Trust Indicators */}
          <div className="hero-features" role="list" aria-label="Key features">
            {BRAND.freeFeatures.map((feat, i) => (
              <div key={i} className="hero-feature-item" role="listitem">
                <Check size={16} strokeWidth={2.8} className="text-success flex-shrink-0" aria-hidden="true" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="py-5 border-top border-bottom feature-section">
        <div className="container py-3">
          <div className="text-center max-w-700 mx-auto mb-5">
            <h2 className="h3 fw-bold mb-2">Comprehensive On-Demand Audit</h2>
            <p className="text-muted">
              Everything you need to identify SEO issues without bloated dashboards or account requirements.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 rounded-4 border">
                <div className="brand-icon mb-3" aria-hidden="true">
                  <Shield size={20} />
                </div>
                <h3 className="h6 fw-bold mb-2">Technical SEO</h3>
                <p className="text-muted small mb-0">
                  Inspect HTTPS encryption, canonical tags, robots.txt directives, XML sitemaps, and HTTP response codes.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 rounded-4 border">
                <div className="brand-icon mb-3" aria-hidden="true">
                  <Code2 size={20} />
                </div>
                <h3 className="h6 fw-bold mb-2">On-Page Signals</h3>
                <p className="text-muted small mb-0">
                  Validate title length, meta description snippet boundaries, H1-H3 heading hierarchies, and mobile viewports.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 rounded-4 border">
                <div className="brand-icon mb-3" aria-hidden="true">
                  <Search size={20} />
                </div>
                <h3 className="h6 fw-bold mb-2">Content & Media</h3>
                <p className="text-muted small mb-0">
                  Detect missing image ALT tags, calculate readable word counts, and check Open Graph & Twitter social preview cards.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 rounded-4 border">
                <div className="brand-icon mb-3" aria-hidden="true">
                  <Zap size={20} />
                </div>
                <h3 className="h6 fw-bold mb-2">Speed & Performance</h3>
                <p className="text-muted small mb-0">
                  Track Time to First Byte (TTFB) server latency, raw HTML page weight, and gzip/brotli compression support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Search Console Integration Banner */}
      <section className="py-5 border-bottom">
        <div className="container py-2">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4 p-4 p-md-5 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-card) 60%)' }}>
            <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '60px', height: '60px', borderRadius: '14px', background: '#fff', border: '1px solid var(--border-main)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <div className="flex-grow-1 text-center text-md-start">
              <span className="badge-subtle-primary mb-2 d-inline-block">New Feature</span>
              <h2 className="h5 fw-bold mb-1 text-main">Google Search Console Integration</h2>
              <p className="text-muted small mb-0">Layer real click, impression, CTR, and ranking data from Google directly into your SEO++ workflow. Secure OAuth — no third-party intermediary.</p>
            </div>
            <Link to="/tools/search-console" className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2 flex-shrink-0">
              <BarChart2 size={15} />
              Connect Now
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Free Tools Grid */}
      <section className="py-5 border-bottom">
        <div className="container py-2">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
            <div>
              <span className="badge-subtle-primary mb-2 d-inline-block">Free Toolkit</span>
              <h2 className="h3 fw-bold mb-1 text-main">SEO & Digital Marketing Tools</h2>
              <p className="text-secondary small mb-0">Practical client-side utilities without AI hype, accounts, or fees.</p>
            </div>
            <Link to="/tools" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1">
              <span>View All 10 Tools</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/keyword-finder" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <Key size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">Keyword Finder</h3>
                  <p className="text-muted small mb-0">Related phrases, questions, and long-tail ideas.</p>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/dr-checker" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <TrendingUp size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">Domain Rating</h3>
                  <p className="text-muted small mb-0">Check Ahrefs Domain Rating authority metrics.</p>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/hashtags" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <Hash size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">Hashtag Generator</h3>
                  <p className="text-muted small mb-0">Curated tags for Instagram, TikTok, LinkedIn, and YouTube.</p>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/captions" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <MessageSquare size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">Caption Generator</h3>
                  <p className="text-muted small mb-0">Ready-to-edit post captions across multiple tones.</p>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/hooks" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">Hook Generator</h3>
                  <p className="text-muted small mb-0">Compelling opening lines for Reels, Shorts, and TikTok.</p>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/character-counter" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <AlignLeft size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">Character Counter</h3>
                  <p className="text-muted small mb-0">Word stats and platform character guidelines.</p>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/utm-builder" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <LinkIcon size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">UTM Builder</h3>
                  <p className="text-muted small mb-0">Clean campaign tracking links with instant encoding.</p>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/tools/search-console" className="text-decoration-none">
                <div className="tool-directory-card p-3 rounded-4 border h-100">
                  <div className="brand-icon mb-2" aria-hidden="true">
                    <BarChart2 size={18} />
                  </div>
                  <h3 className="h6 fw-bold text-main mb-1">Search Console</h3>
                  <p className="text-muted small mb-0">Connect Google OAuth for organic ranking data.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-5">
        <div className="container py-3">
          <div className="text-center mb-5">
            <h2 className="h3 fw-bold mb-2">How It Works</h2>
            <p className="text-muted">Instant insights in 3 effortless steps</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-12 col-md-4">
              <div className="p-3">
                <div className="rec-number mx-auto mb-3" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                  1
                </div>
                <h3 className="h6 fw-bold">Enter URL</h3>
                <p className="text-muted small">
                  Type or paste any publicly accessible website address into the input field above.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3">
                <div className="rec-number mx-auto mb-3" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                  2
                </div>
                <h3 className="h6 fw-bold">Automated Crawl</h3>
                <p className="text-muted small">
                  Our bot fetches your page, verifies technical headers, parses HTML structure, and checks assets.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3">
                <div className="rec-number mx-auto mb-3" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                  3
                </div>
                <h3 className="h6 fw-bold">Fix & Improve</h3>
                <p className="text-muted small">
                  Review your transparent 0–100 score and address the prioritized checklist of recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer / Transparency Callout */}
      <section className="container pb-5">
        <div className="audit-disclaimer-box">
          <BarChart2 size={22} className="text-primary flex-shrink-0" aria-hidden="true" />
          <div>
            <div className="fw-semibold text-main">Transparent & Free Utility</div>
            <div className="small text-muted">{BRAND.disclaimer}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
