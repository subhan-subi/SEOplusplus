import React from 'react';
import { BRAND } from '../config/brand';
import { Shield, Cookie, Lock, Eye, ExternalLink } from 'lucide-react';
import PageSeo from '../components/common/PageSeo';
import { openCookiePreferences } from '../components/common/CookieConsent';

export default function Privacy() {
  return (
    <div className="container py-5" style={{ maxWidth: '840px' }}>
      <PageSeo
        title="Privacy Policy – Data & Cookie Practices"
        description="Learn how SEO++ protects your privacy, handles client-side tool calculations, manages Google Search Console data, and complies with advertising cookie standards."
        canonicalUrl="https://seoplusplus.vercel.app/privacy"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' }
        ]}
      />

      <div className="mb-5 text-center">
        <div className="brand-icon mx-auto mb-3" aria-hidden="true">
          <Shield size={22} />
        </div>
        <h1 className="h2 fw-bold text-main mb-2">Privacy Policy</h1>
        <p className="text-muted small">Last updated: October 2026</p>
      </div>

      <div className="p-4 p-md-5 rounded-4 border d-flex flex-column gap-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <p className="text-secondary mb-0">
          This Privacy Policy explains how <strong>{BRAND.name}</strong> ("we", "our", or "the platform", accessible at <a href="https://seoplusplus.vercel.app/" className="text-primary text-decoration-none">https://seoplusplus.vercel.app/</a>) collects, uses, and safeguards information when you visit our website or use any of our free tools. We believe in transparency, user privacy, and strict data minimization.
        </p>

        {/* 1. Client-Side Social & Marketing Tools */}
        <div>
          <h2 className="h5 fw-bold text-main mb-2">1. Client-Side Social Media &amp; Marketing Tools</h2>
          <p className="text-secondary small mb-2">
            The following tools execute <strong>locally in your web browser</strong>:
          </p>
          <ul className="text-secondary small mb-2 ps-3">
            <li><strong>Hashtag Generator:</strong> Computes tags using client-side topic lists without transmitting searches.</li>
            <li><strong>Caption Generator:</strong> Assembles copy locally using built-in JavaScript templates.</li>
            <li><strong>Hook Generator:</strong> Formats opening hooks in local browser memory based on your input.</li>
            <li><strong>Content Ideas:</strong> Selects idea templates directly on your device.</li>
            <li><strong>Character Counter:</strong> Measures characters, words, and platform limits in real time without network requests.</li>
            <li><strong>UTM Builder:</strong> Encodes URL tracking parameters locally without transmitting destination links.</li>
          </ul>
          <p className="text-secondary small mb-0">
            Text entered into these tools is never uploaded, recorded, stored, or sent to external servers or AI providers.
          </p>
        </div>

        {/* 2. SEO Checker URLs Submitted for Analysis */}
        <div>
          <h2 className="h5 fw-bold text-main mb-2">2. SEO Checker URLs Submitted for Analysis</h2>
          <p className="text-secondary small mb-0">
            When you enter a website URL into our SEO Checker, that address is sent to our server to perform an automated HTTP crawl. Our crawler requests only the publicly accessible HTML, meta tags, and server response headers of that single target page. We do not require accounts, passwords, or personal identity details to audit a website.
          </p>
        </div>

        {/* 3. Google Search Console Integration & User Data */}
        <div>
          <h2 className="h5 fw-bold text-main mb-2">3. Google Search Console Integration &amp; Google User Data</h2>
          <p className="text-secondary small mb-2">
            {BRAND.name} offers an optional integration with Google Search Console via Google OAuth 2.0. If you choose to connect your Google account:
          </p>
          <ul className="text-secondary small mb-2 ps-3">
            <li><strong>Data Accessed:</strong> We request read-only access (<code>https://www.googleapis.com/auth/webmasters.readonly</code>) solely to retrieve your verified Search Console property list and aggregated search analytics (clicks, impressions, click-through rates, and average positions).</li>
            <li><strong>Purpose of Use:</strong> Your Search Console data is used exclusively to display your organic performance metrics directly to you within the {BRAND.name} interface, helping you correlate rankings with technical SEO recommendations.</li>
            <li><strong>Storage &amp; Security:</strong> OAuth tokens are held securely on our backend server/database solely to authenticate requests to Google Search Console on your behalf. Sensitive client secrets are never exposed to the client-side browser or public networks.</li>
            <li><strong>No Selling or Sharing:</strong> We do not sell, rent, monetize, or transfer your Google user data to any third parties, data brokers, advertising networks, or AI model training pipelines.</li>
            <li><strong>Google API Limited Use Disclosure:</strong> {BRAND.name}'s use and transfer to any other app of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
            <li><strong>User Control &amp; Disconnection:</strong> You can disconnect your Google Search Console account at any time by clicking "Disconnect" in the dashboard, which clears your session and stored tokens. You can also revoke access anytime from your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">Google Account Security Settings</a>.</li>
          </ul>
        </div>

        {/* 4. Cookies, Local Storage & Advertising Disclosures */}
        <div>
          <h2 className="h5 fw-bold text-main mb-2 d-flex align-items-center gap-2">
            <Cookie size={18} className="text-primary" />
            <span>4. Cookies, Local Storage &amp; Third-Party Advertising</span>
          </h2>
          <p className="text-secondary small mb-2">
            We use browser storage to provide core site functionality and maintain user preferences:
          </p>
          <ul className="text-secondary small mb-3 ps-3">
            <li><strong>Visual Theme Preference:</strong> Browser <code>localStorage</code> saves your chosen appearance (<code>seoly_theme</code>: light or dark) so it persists across visits.</li>
            <li><strong>Audit Caching:</strong> In the SEO Checker, recent audit results may be held in temporary <code>sessionStorage</code> (<code>seoly_last_audit</code>) to prevent duplicate requests when refreshing the page.</li>
            <li><strong>Session Authentication (GSC):</strong> For connected Google Search Console users, an encrypted, <code>httpOnly</code>, <code>SameSite=None</code>, <code>Secure</code> cookie (<code>gsc_session</code>) is used solely to maintain your connection between requests.</li>
            <li><strong>Cookie Consent Preference:</strong> Your cookie banner selection is remembered in <code>localStorage</code> (<code>seoplusplus_cookie_consent</code>).</li>
          </ul>

          <div className="p-3 rounded-3 border mb-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <h3 className="h6 fw-bold text-main mb-2">Third-Party Advertising &amp; Google AdSense</h3>
            <p className="text-secondary small mb-2">
              To keep our tools free without paywalls or subscriptions, {BRAND.name} may partner with third-party advertising providers, including <strong>Google AdSense</strong>. Please note the following regarding third-party advertising cookies:
            </p>
            <ul className="text-secondary small mb-2 ps-3">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites across the Internet.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none fw-medium">Google Ads Settings <ExternalLink size={12} className="ms-1" /></a>.</li>
              <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none fw-medium">www.aboutads.info/choices <ExternalLink size={12} className="ms-1" /></a> or the <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none fw-medium">European Interactive Digital Advertising Alliance (EDAA) <ExternalLink size={12} className="ms-1" /></a>.</li>
            </ul>
            <div className="mt-3">
              <button
                type="button"
                onClick={openCookiePreferences}
                className="btn btn-outline-secondary btn-sm"
              >
                Change My Cookie Preferences
              </button>
            </div>
          </div>
        </div>

        {/* 5. Security & Rate Limiting */}
        <div>
          <h2 className="h5 fw-bold text-main mb-2">5. Security, Rate Limiting &amp; Server Logs</h2>
          <p className="text-secondary small mb-0">
            To prevent abuse, denial-of-service (DoS) attacks, and unauthorized probing of private intranet networks (SSRF prevention), our backend applies automated rate limiting. Temporary server request logs (IP addresses, user agents, and request timestamps) are retained strictly for operational security and attack mitigation, and are regularly purged.
          </p>
        </div>

        {/* 6. External Links & Services */}
        <div>
          <h2 className="h5 fw-bold text-main mb-2">6. External Services &amp; Typography</h2>
          <p className="text-secondary small mb-0">
            Web typography (Inter and JetBrains Mono fonts) is delivered via Google Fonts CDN. {BRAND.name} contains links to external websites (such as Google Search Console, Ahrefs, GitHub, and social platforms). We are not responsible for the privacy practices or content of external sites.
          </p>
        </div>

        {/* 7. User Rights and Inquiries */}
        <div>
          <h2 className="h5 fw-bold text-main mb-2">7. User Rights &amp; Contact Information</h2>
          <p className="text-secondary small mb-2">
            Under applicable data protection regulations (such as GDPR and CCPA), you have the right to request information about any personal data held about you, request deletion of your session data, or ask questions about our data handling.
          </p>
          <p className="text-secondary small mb-0">
            To exercise your rights or contact our privacy lead, please submit an inquiry through our <a href="/contact" className="text-primary text-decoration-none">Contact Us page</a> or open an issue on our official <a href="https://github.com/subhan-subi/SEOplusplus" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">GitHub Repository</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
