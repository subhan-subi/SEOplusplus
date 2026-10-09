import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'seoplusplus_cookie_consent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already set consent
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small timeout so it doesn't jarringly shift initial layout
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom trigger to re-open consent settings from footer
  useEffect(() => {
    const handleOpen = () => setIsVisible(true);
    window.addEventListener('openCookieConsent', handleOpen);
    return () => window.removeEventListener('openCookieConsent', handleOpen);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      choice: 'accepted',
      analytics: true,
      advertising: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      choice: 'essential',
      analytics: false,
      advertising: false,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="position-fixed bottom-0 start-0 end-0 p-3 z-3"
      style={{ zIndex: 9999 }}
      aria-label="Cookie and Privacy Consent Banner"
    >
      <div
        className="container p-4 rounded-4 border shadow-lg"
        style={{
          maxWidth: '780px',
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-main)',
          color: 'var(--text-main)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="d-flex align-items-start gap-3">
          <div className="brand-icon flex-shrink-0 mt-1" aria-hidden="true">
            <Cookie size={20} className="text-primary" />
          </div>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h2 className="h6 fw-bold mb-0 text-main">Privacy &amp; Cookie Choices</h2>
              <button
                type="button"
                className="btn btn-link p-0 text-muted"
                onClick={handleEssentialOnly}
                aria-label="Close cookie consent banner"
              >
                <X size={18} />
              </button>
            </div>

            <p className="small text-secondary mb-3" style={{ lineHeight: '1.5' }}>
              We use essential storage to remember your visual theme and keep tools fast and secure. With your consent, we and third-party advertising partners (such as Google AdSense) may also use cookies to serve relevant advertisements, prevent ad fraud, and measure ad performance.{' '}
              <Link to="/privacy" className="text-primary text-decoration-none fw-medium hover-underline">
                Read our Privacy Policy &rarr;
              </Link>
            </p>

            <div className="d-flex flex-wrap align-items-center justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 py-1"
                onClick={handleEssentialOnly}
              >
                Essential Only
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm px-4 py-1 fw-semibold"
                onClick={handleAcceptAll}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * Global helper to re-open cookie preferences from footer
 */
export function openCookiePreferences() {
  window.dispatchEvent(new Event('openCookieConsent'));
}
