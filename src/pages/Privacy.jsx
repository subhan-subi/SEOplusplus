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

        {/* 3. No User Accounts & No Personal Data Collected */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">3. No User Accounts & No Personal Data Collected</h2>
          <p className="text-secondary small mb-0">
            {BRAND.name} is a completely registration-free toolkit. We do not collect names, email addresses, payment information, or user profiles.
          </p>
        </div>

        {/* 4. LocalStorage & SessionStorage */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">4. Cookies and Local Storage</h2>
          <p className="text-secondary small mb-0">
            We do not use advertising tracking cookies or behavioral tracking pixels. Standard browser <code>localStorage</code> is used strictly to remember your preferred visual theme (<code>seoly_theme</code>: light or dark) across visits. In the SEO Checker, recent audit results may be held in temporary <code>sessionStorage</code> to prevent duplicate requests when refreshing.
          </p>
        </div>

        {/* 5. Rate Limiting & Security Logs */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">5. Rate Limiting & Security Logs</h2>
          <p className="text-secondary small mb-0">
            To protect our free server infrastructure against denial of service (DoS), malicious crawling, and SSRF attacks against private internal networks, our backend applies automated rate limiting. Temporary server request logs (IP addresses and timestamps) are kept solely for operational security and attack mitigation.
          </p>
        </div>

        {/* 6. Third-Party Services */}
        <div className="mb-4">
          <h2 className="h5 fw-bold text-main mb-2">6. Third-Party Services</h2>
          <p className="text-secondary small mb-0">
            We do not sell, rent, or trade your data. Web typography (Inter and JetBrains Mono fonts) is served securely via Google Fonts CDN. No third-party AI APIs (such as OpenAI, Anthropic, or Gemini) are integrated into this application.
          </p>
        </div>

        {/* 7. Contact Information */}
        <div className="mb-0">
          <h2 className="h5 fw-bold text-main mb-2">7. User Rights and Contact Information</h2>
          <p className="text-secondary small mb-0">
            Because we do not store personal profiles or track user identities, there is no personal data to delete or export. For technical questions or crawler inquiries, please connect with our project maintainers through our official documentation and code repository.
          </p>
        </div>
      </div>
    </div>
  );
}
