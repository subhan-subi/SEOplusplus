import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, Search, BookOpen, Mail, ArrowRight } from 'lucide-react';
import PageSeo from '../components/common/PageSeo';
import { BRAND } from '../config/brand';

export default function NotFound() {
  return (
    <div className="container py-5 text-center" style={{ maxWidth: '720px' }}>
      <PageSeo
        title="404 – Page Not Found"
        description="The page you requested could not be found on SEO++. Browse our free SEO checker, marketing tools, or guides."
        noindex={true}
      />

      <div className="py-5">
        <div className="status-indicator-icon failed mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
          <AlertCircle size={32} />
        </div>

        <span className="badge-subtle-primary mb-3 d-inline-block">
          Error 404
        </span>

        <h1 className="display-6 fw-bold text-main mb-3">Page Not Found</h1>

        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '520px' }}>
          The link you followed may be broken, outdated, or the page may have been moved. You can return home or explore our popular free tools below.
        </p>

        {/* Primary CTA buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <Link to="/" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2">
            <Home size={16} />
            <span>Go to Homepage</span>
          </Link>
          <Link to="/tools" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-4 py-2">
            <Search size={16} />
            <span>All Tools Directory</span>
          </Link>
          <Link to="/blog" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-4 py-2">
            <BookOpen size={16} />
            <span>SEO Guides</span>
          </Link>
        </div>

        {/* Popular Quick Links */}
        <div className="p-4 rounded-4 border text-start" style={{ backgroundColor: 'var(--bg-card)' }}>
          <h2 className="h6 fw-bold text-main mb-3">Popular Free SEO &amp; Marketing Tools</h2>
          <div className="row g-2 small">
            <div className="col-12 col-sm-6">
              <Link to="/" className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-secondary hover-card-surface">
                <span>Free SEO Checker</span>
                <ArrowRight size={14} className="text-primary" />
              </Link>
            </div>
            <div className="col-12 col-sm-6">
              <Link to="/tools/keyword-finder" className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-secondary hover-card-surface">
                <span>Keyword Finder</span>
                <ArrowRight size={14} className="text-primary" />
              </Link>
            </div>
            <div className="col-12 col-sm-6">
              <Link to="/tools/dr-checker" className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-secondary hover-card-surface">
                <span>Domain Rating (DR) Checker</span>
                <ArrowRight size={14} className="text-primary" />
              </Link>
            </div>
            <div className="col-12 col-sm-6">
              <Link to="/tools/search-console" className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-secondary hover-card-surface">
                <span>Google Search Console Tool</span>
                <ArrowRight size={14} className="text-primary" />
              </Link>
            </div>
            <div className="col-12 col-sm-6">
              <Link to="/tools/utm-builder" className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-secondary hover-card-surface">
                <span>UTM Campaign Builder</span>
                <ArrowRight size={14} className="text-primary" />
              </Link>
            </div>
            <div className="col-12 col-sm-6">
              <Link to="/contact" className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-secondary hover-card-surface">
                <span>Contact Support</span>
                <ArrowRight size={14} className="text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
