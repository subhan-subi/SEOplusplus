import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, XCircle } from 'lucide-react';
import { sanitizeClientUrl } from '../services/seoService';

const SAMPLE_DOMAINS = [
  'example.com',
  'github.com',
  'wikipedia.org',
  'mozilla.org'
];

export default function UrlAnalyzer({ initialUrl = '', onAnalyze, isLoading = false }) {
  const [url, setUrl] = useState(initialUrl);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleClear = () => {
    setUrl('');
    setValidationError('');
  };

  const validateInput = (input) => {
    if (!input || !input.trim()) {
      return 'Please enter a website URL.';
    }

    const trimmed = input.trim();
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
      const parsed = new URL(withProtocol);
      const host = parsed.hostname.toLowerCase();

      // Check for local addresses on the client before network round-trip
      if (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        host === '::1' ||
        host.endsWith('.localhost') ||
        host.endsWith('.local') ||
        host.endsWith('.internal')
      ) {
        return 'Local and private network addresses cannot be analyzed.';
      }

      if (!host.includes('.')) {
        return 'Please enter a valid domain name (e.g., example.com).';
      }

      return null;
    } catch {
      return 'Please enter a valid website address.';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const error = validateInput(url);
    if (error) {
      setValidationError(error);
      return;
    }

    const clean = sanitizeClientUrl(url);

    if (onAnalyze) {
      onAnalyze(clean);
    } else {
      navigate(`/analyze?url=${encodeURIComponent(clean)}`);
    }
  };

  const handleSelectSample = (domain) => {
    setUrl(domain);
    setValidationError('');
  };

  return (
    <div className="analyzer-card">
      <form onSubmit={handleSubmit} noValidate>
        <div className="url-input-group">
          <Globe className="url-input-icon" size={22} />
          
          <input
            type="text"
            id="website-url-input"
            className="url-input-field"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (validationError) setValidationError('');
            }}
            disabled={isLoading}
            autoComplete="url"
            autoCapitalize="none"
            spellCheck="false"
          />

          {url && !isLoading && (
            <button
              type="button"
              className="btn btn-link p-1 text-muted me-2"
              onClick={handleClear}
              title="Clear input"
              aria-label="Clear input"
            >
              <XCircle size={18} />
            </button>
          )}

          <button
            type="submit"
            id="analyze-submit-button"
            className="btn-analyze"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <span>Analyze Website</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {validationError && (
          <div className="text-danger small mt-2 ps-2 fw-medium d-flex align-items-center gap-1">
            <span>⚠</span> {validationError}
          </div>
        )}

        <div className="quick-samples">
          <span className="text-muted small">Try sample:</span>
          {SAMPLE_DOMAINS.map((domain) => (
            <button
              key={domain}
              type="button"
              className="quick-sample-chip"
              onClick={() => handleSelectSample(domain)}
              disabled={isLoading}
            >
              {domain}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
