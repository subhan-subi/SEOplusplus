import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BRAND } from '../config/brand';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-12 col-lg-4">
            <Link to="/" className="brand-logo-wrap mb-2 d-inline-flex" aria-label={`${BRAND.name} — Home`}>
              <div className="brand-icon" aria-hidden="true">
                <Search size={16} strokeWidth={2.5} />
              </div>
              <span className="brand-text">{BRAND.name}</span>
            </Link>
            <p className="text-secondary small mb-2">{BRAND.tagline}</p>
            <p className="text-muted small mb-0">{BRAND.footerSubtitle}</p>
          </div>

          {/* SEO Tools */}
          <div className="col-6 col-md-3 col-lg-2">
            <div className="footer-nav-label">SEO Tools</div>
            <nav className="footer-nav-col d-flex flex-column gap-2" aria-label="SEO Tools navigation">
              <Link to="/" className="footer-link">SEO Checker</Link>
              <Link to="/tools" className="footer-link">All Tools Directory</Link>
            </nav>
          </div>

          {/* Social Media */}
          <div className="col-6 col-md-3 col-lg-3">
            <div className="footer-nav-label">Social Media</div>
            <nav className="footer-nav-col d-flex flex-column gap-2" aria-label="Social Media Tools navigation">
              <Link to="/tools/hashtags" className="footer-link">Hashtag Generator</Link>
              <Link to="/tools/captions" className="footer-link">Caption Generator</Link>
              <Link to="/tools/hooks" className="footer-link">Hook Generator</Link>
              <Link to="/tools/content-ideas" className="footer-link">Content Ideas</Link>
              <Link to="/tools/character-counter" className="footer-link">Character Counter</Link>
            </nav>
          </div>

          {/* Marketing & Company */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="row g-3">
              <div className="col-6 col-lg-12 mb-lg-3">
                <div className="footer-nav-label">Marketing</div>
                <nav className="footer-nav-col d-flex flex-column gap-2" aria-label="Marketing Tools navigation">
                  <Link to="/tools/utm-builder" className="footer-link">UTM Builder</Link>
                </nav>
              </div>

              <div className="col-6 col-lg-12">
                <div className="footer-nav-label">Company</div>
                <nav className="footer-nav-col d-flex flex-column gap-2" aria-label="Company navigation">
                  <Link to="/about" className="footer-link">About</Link>
                  <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                  <Link to="/terms" className="footer-link">Terms of Service</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-3 border-top border-subtle d-flex flex-column gap-2">
          <p className="small text-muted mb-0">
            {BRAND.footerDisclaimer}
          </p>
          <p className="small text-muted mb-0">
            &copy; {BRAND.year} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
