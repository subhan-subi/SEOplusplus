import React from 'react';
import { BRAND } from '../config/brand';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="container py-5" style={{ maxWidth: '840px' }}>
      <div className="mb-5 text-center">
        <div className="brand-icon mx-auto mb-3" aria-hidden="true">
          <Shield size={22} />
        </div>
        <h1 className="h2 fw-bold text-main mb-2">Privacy Policy</h1>
        <p className="text-muted small">Last updated: September 2026</p>
      </div>

      <div className="p-4 p-md-5 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
        <p className="text-secondary mb-4">
          This Privacy Policy explains how <strong>{BRAND.name}</strong> handles information when you visit our website or use any of our free tools. We believe in complete transparency and strict data minimization.
        </p>

        {/* 1. Client-Side Social & Marketing Tools */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">1. Client-Side Social Media & Marketing Tools</h2>
          <p className="text-secondary small mb-2">
            The following tools run <strong>100% locally inside your web browser</strong>:
          </p>
          <ul className="text-secondary small mb-2 ps-3">
            <li><strong>Hashtag Generator</strong>: Computes tags locally using in-memory datasets.</li>
            <li><strong>Caption Generator</strong>: Assembles text using client-side JavaScript templates.</li>
            <li><strong>Hook Generator</strong>: Formats opening hooks locally based on your entered topic.</li>
            <li><strong>Content Ideas</strong>: Selects template ideas directly in browser memory.</li>
            <li><strong>Character Counter</strong>: Calculates text metrics locally on your device in real time.</li>
            <li><strong>UTM Builder</strong>: Encodes URL parameters completely on the client side without transmitting destination links.</li>
          </ul>
          <p className="text-secondary small mb-0">
            Text entered into these tools is never uploaded, stored, logged, or sent to external servers or AI providers.
          </p>
        </div>

        {/* 2. SEO Checker URLs Submitted for Analysis */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">2. SEO Checker URLs Submitted for Analysis</h2>
          <p className="text-secondary small mb-0">
            When you enter a website URL into our SEO Checker, that address is sent to our server to perform the automated crawl. Our server requests the publicly accessible HTML, meta tags, and HTTP headers of that single targeted page. We do not require account credentials, passwords, or personal identity details to run an analysis.
          </p>
        </div>

        {/* 3. Google Search Console Integration & User Data */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">3. Google Search Console Integration &amp; Google User Data</h2>
          <p className="text-secondary small mb-2">
            {BRAND.name} offers an optional integration with Google Search Console via Google OAuth 2.0. If you choose to connect your Google account, here is how your data is handled:
          </p>
          <ul className="text-secondary small mb-2 ps-3">
            <li><strong>Data Accessed:</strong> We request read-only access (<code>https://www.googleapis.com/auth/webmasters.readonly</code>) to retrieve your verified Search Console property list and aggregated search analytics (clicks, impressions, click-through rates, and average keyword positions).</li>
            <li><strong>Purpose of Use:</strong> Your Search Console data is accessed exclusively to display real organic search performance metrics directly to you within the {BRAND.name} dashboard, enabling you to correlate real search rankings with our technical SEO audit recommendations.</li>
            <li><strong>Storage &amp; Security:</strong> OAuth access and refresh tokens are securely stored on our backend server/database solely to authenticate requests to Google Search Console on your behalf. Sensitive credentials and client secrets are never exposed to the client-side browser or public networks.</li>
            <li><strong>No Selling or Sharing:</strong> We do not sell, rent, monetize, or transfer your Google user data to any third parties, advertising networks, data brokers, or AI model providers.</li>
            <li><strong>Google API Limited Use Disclosure:</strong> {BRAND.name}'s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
            <li><strong>User Control &amp; Disconnection:</strong> You can disconnect your Google Search Console account at any time by clicking the "Disconnect" button in the {BRAND.name} dashboard, which deletes your session data and stored tokens from our database. You can also revoke access anytime from your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">Google Account Security Settings</a>.</li>
          </ul>
        </div>

        {/* 4. No User Accounts & No Personal Data Collected */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">4. User Accounts and Personal Data</h2>
          <p className="text-secondary small mb-0">
            Aside from the optional Google Search Console connection described above, {BRAND.name} does not require registration or collect personal profile data such as names, passwords, or payment cards.
          </p>
        </div>

        {/* 5. LocalStorage & Session Cookies */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">5. Cookies and Local Storage</h2>
          <p className="text-secondary small mb-0">
            We do not use advertising or behavioral tracking cookies. Standard browser <code>localStorage</code> is used strictly to remember your preferred visual theme (<code>seoly_theme</code>: light or dark). In the SEO Checker, recent audit results may be held in temporary <code>sessionStorage</code> to prevent duplicate requests when refreshing. For Google Search Console users, an encrypted, <code>httpOnly</code>, <code>SameSite=None</code>, <code>Secure</code> session cookie (<code>gsc_session</code>) is used solely to maintain your authenticated connection between requests.
          </p>
        </div>

        {/* 6. Rate Limiting & Security Logs */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">6. Rate Limiting &amp; Security Logs</h2>
          <p className="text-secondary small mb-0">
            To protect our server infrastructure against denial of service (DoS), malicious crawling, and SSRF attacks against private internal networks, our backend applies automated rate limiting. Temporary server request logs (IP addresses and timestamps) are kept solely for operational security and attack mitigation.
          </p>
        </div>

        {/* 7. Third-Party Services */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">7. Third-Party Services</h2>
          <p className="text-secondary small mb-0">
            We do not sell, rent, or trade your data. Web typography (Inter and JetBrains Mono fonts) is served securely via Google Fonts CDN. No third-party AI APIs (such as OpenAI, Anthropic, or Gemini) are integrated into this application.
          </p>
        </div>

        {/* 8. Contact Information */}
        <div className="mb-0">
          <h2 className="h5 fw-bold text-main mb-2">8. User Rights and Contact Information</h2>
          <p className="text-secondary small mb-0">
            You maintain full ownership and control over your data. For inquiries regarding our privacy practices, Google Search Console data handling, or technical questions, please reach out via our official project repository and contact channels.
          </p>
        </div>
      </div>
    </div>
  );
}
