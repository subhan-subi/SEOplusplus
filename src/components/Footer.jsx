import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Cookie } from 'lucide-react';
import { BRAND } from '../config/brand';
import { openCookiePreferences } from './common/CookieConsent';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-12 col-lg-3">
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
          <div className="col-6 col-md-3 col-lg-3">
            <div className="footer-nav-label">SEO Tools</div>
            <nav className="footer-nav-col d-flex flex-column gap-2" aria-label="SEO Tools navigation">
              <Link to="/" className="footer-link">SEO Checker</Link>
              <Link to="/tools/search-console" className="footer-link">Search Console</Link>
              <Link to="/tools/dr-checker" className="footer-link">Domain Rating Checker</Link>
              <Link to="/tools/keyword-finder" className="footer-link">Keyword Finder</Link>
              <Link to="/tools" className="footer-link">All 10 Tools Directory</Link>
            </nav>
          </div>

          {/* Social Media & Marketing */}
          <div className="col-6 col-md-3 col-lg-3">
            <div className="footer-nav-label">Social &amp; Marketing</div>
            <nav className="footer-nav-col d-flex flex-column gap-2" aria-label="Social Media Tools navigation">
              <Link to="/tools/hashtags" className="footer-link">Hashtag Generator</Link>
              <Link to="/tools/captions" className="footer-link">Caption Generator</Link>
              <Link to="/tools/hooks" className="footer-link">Hook Generator</Link>
              <Link to="/tools/content-ideas" className="footer-link">Content Ideas</Link>
              <Link to="/tools/character-counter" className="footer-link">Character Counter</Link>
              <Link to="/tools/utm-builder" className="footer-link">UTM Campaign Builder</Link>
            </nav>
          </div>

          {/* Company & Legal */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="footer-nav-label">Company &amp; Legal</div>
            <nav className="footer-nav-col d-flex flex-column gap-2" aria-label="Company navigation">
              <Link to="/blog" className="footer-link">SEO++ Blog</Link>
              <Link to="/write-for-us" className="footer-link">Write for Us</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
              <Link to="/disclaimer" className="footer-link">Disclaimer</Link>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="btn btn-link p-0 text-start footer-link text-decoration-none d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.84rem' }}
              >
                <Cookie size={13} className="text-muted" />
                <span>Cookie Preferences</span>
              </button>
              <Link to="/blog/manage" className="footer-link text-muted mt-1" style={{ fontSize: '0.75rem' }}>Editorial Portal</Link>
            </nav>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-3 border-top border-subtle d-flex flex-column gap-2">
          <p className="small text-muted mb-0">
            {BRAND.footerDisclaimer}
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 small text-muted">
            <span>&copy; {BRAND.year} {BRAND.name}. All rights reserved.</span>
            <div className="d-flex gap-3">
              <Link to="/privacy" className="text-muted text-decoration-none hover-underline">Privacy</Link>
              <span>&bull;</span>
              <Link to="/terms" className="text-muted text-decoration-none hover-underline">Terms</Link>
              <span>&bull;</span>
              <Link to="/disclaimer" className="text-muted text-decoration-none hover-underline">Disclaimer</Link>
              <span>&bull;</span>
              <Link to="/contact" className="text-muted text-decoration-none hover-underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
