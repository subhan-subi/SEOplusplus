import React, { useState } from 'react';
import { 
  TrendingUp, 
  Globe, 
  ArrowRight, 
  XCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Info, 
  Award, 
  ShieldCheck, 
  Layers,
  Loader2,
  RefreshCw
} from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import PageSeo from '../../components/common/PageSeo';
import ExportReportControls from '../../components/common/ExportReportControls';
import DrAuthorityChart from '../../components/common/DrAuthorityChart';
import { exportDrReportPdf, exportDrReportCsv, printDrReport } from '../../utils/drReportExporter';
import { sanitizeClientDomain, validateClientDomain, checkDomainRating } from '../../services/drService';

const SAMPLE_DOMAINS = [
  'ahrefs.com',
  'github.com',
  'wikipedia.org',
  'mozilla.org'
];

/**
 * Returns color tokens and status badge for a given DR value (0 - 100).
 */
function getDrTier(score) {
  if (score >= 80) {
    return {
      label: 'Very High Authority',
      tier: 'Tier 1 Global Authority',
      hex: '#10b981',
      bgVar: 'var(--pass-bg)',
      textVar: 'var(--pass-text)',
      description: 'Exceptional backlink profile among the most authoritative domains on the web.'
    };
  }
  if (score >= 60) {
    return {
      label: 'High Authority',
      tier: 'Tier 2 Established Authority',
      hex: '#3b82f6',
      bgVar: 'var(--primary-light)',
      textVar: 'var(--primary)',
      description: 'Strong, established backlink foundation capable of ranking for competitive queries.'
    };
  }
  if (score >= 40) {
    return {
      label: 'Moderate Authority',
      tier: 'Tier 3 Growing Authority',
      hex: '#f59e0b',
      bgVar: 'var(--warn-bg)',
      textVar: 'var(--warn-text)',
      description: 'Healthy organic backlink profile with steady authority development.'
    };
  }
  if (score >= 20) {
    return {
      label: 'Emerging Authority',
      tier: 'Tier 4 Early Authority',
      hex: '#8b5cf6',
      bgVar: 'rgba(139, 92, 246, 0.1)',
      textVar: '#8b5cf6',
      description: 'Developing website actively building initial referring domains.'
    };
  }
  return {
    label: 'Low / New Domain',
    tier: 'Tier 5 New or Niche Domain',
    hex: '#ef4444',
    bgVar: 'var(--fail-bg)',
    textVar: 'var(--fail-text)',
    description: 'Fresh domain or minimal discovered referring domains in the Ahrefs index.'
  };
}

export default function DrChecker() {
  const [domainInput, setDomainInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const [result, setResult] = useState(null);

  const handleClear = () => {
    setDomainInput('');
    setValidationError('');
    setApiError('');
  };

  const handleSelectSample = (domain) => {
    setDomainInput(domain);
    setValidationError('');
    setApiError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');
    setApiError('');

    const error = validateClientDomain(domainInput);
    if (error) {
      setValidationError(error);
      return;
    }

    const cleanDomain = sanitizeClientDomain(domainInput);
    setIsLoading(true);

    try {
      const data = await checkDomainRating(cleanDomain);
      setResult(data);
      setApiError('');
    } catch (err) {
      setApiError(err.message || 'Failed to check Domain Rating. Please try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const tier = result ? getDrTier(result.domainRating) : null;
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = result
    ? circumference - (result.domainRating / 100) * circumference
    : circumference;

  return (
    <div className="container py-5" style={{ maxWidth: '920px' }}>
      <PageSeo
        title="Free Website Domain Rating (DR) Checker"
        description="Check website Domain Rating (DR) and backlink authority tier metrics. Transparent evaluation using Ahrefs metrics and benchmarks."
        canonical="/tools/dr-checker"
      />
      <ToolHeader
        title="Domain Rating (DR) Checker"
        description="Check official Ahrefs Domain Rating (DR) for any website or domain to evaluate backlink authority on a 0-100 scale."
        category="SEO Tools"
        icon={TrendingUp}
        badgeText="Ahrefs Metric"
      />

      {/* Input Card */}
      <div className="analyzer-card mb-4">
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="dr-domain-input" className="form-label fw-bold text-main mb-2">
            Target Website or Domain:
          </label>

          <div className="url-input-group">
            <Globe className="url-input-icon" size={22} />

            <input
              type="text"
              id="dr-domain-input"
              className="url-input-field"
              placeholder="example.com or https://example.com"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value);
                if (validationError) setValidationError('');
                if (apiError) setApiError('');
              }}
              disabled={isLoading}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
            />

            {domainInput && !isLoading && (
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
              id="check-dr-submit-button"
              className="btn-analyze"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Checking DR...</span>
                </>
              ) : (
                <>
                  <span>Check DR</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="text-danger small mt-2 ps-2 fw-medium d-flex align-items-center gap-1" role="alert">
              <span>⚠</span> {validationError}
            </div>
          )}

          {/* Sample Chips */}
          <div className="quick-samples">
            <span className="text-muted small">Try sample domain:</span>
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

      {/* API / Network Error Banner */}
      {apiError && (
        <div className="alert alert-danger d-flex align-items-start gap-3 p-3 rounded-4 mb-4 border" role="alert">
          <AlertTriangle size={22} className="text-danger flex-shrink-0 mt-1" />
          <div className="flex-grow-1">
            <div className="fw-bold mb-1">Could Not Retrieve Domain Rating</div>
            <div className="small text-secondary mb-2">{apiError}</div>
            <div className="small text-muted">
              <strong>Tip:</strong> Ensure your domain is spelled correctly (e.g. <code>example.com</code>). If your Ahrefs API key is newly configured or expired, please check your server environment settings.
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="dr-result-container mb-5">
          {/* Target Header Card */}
          <div className="report-header-card p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <span className="badge-subtle-primary d-inline-flex align-items-center gap-1">
                <ShieldCheck size={14} />
                Verified Metric
              </span>
              <span className="small text-muted">
                Checked: {new Date(result.checkedAt).toLocaleDateString()} at {new Date(result.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 my-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h2 className="audit-target-url m-0 h4">{result.domain || result.target}</h2>
                <a
                  href={`https://${result.domain || result.target}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary small d-inline-flex align-items-center gap-1 ms-1"
                  title="Visit website"
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              <ExportReportControls
                reportType="DR"
                targetName={result.domain || result.target}
                onExportPdf={() => exportDrReportPdf(result, tier)}
                onExportCsv={() => exportDrReportCsv(result, tier)}
                onPrint={() => printDrReport()}
              />
            </div>

            <div className="audit-meta-row mt-2">
              <span className="meta-badge">
                <span className="text-muted">Data Provider:</span>
                <strong>{result.source || 'Ahrefs API v3'}</strong>
              </span>
              <span>•</span>
              <span className="meta-badge">
                <span className="text-muted">Metric Type:</span>
                <strong>Logarithmic Link Authority (0-100)</strong>
              </span>
            </div>
          </div>

          {/* Main DR Showcase Card */}
          <div className="row g-4 mb-4">
            {/* Circular Gauge Card */}
            <div className="col-12 col-md-5">
              <div className="score-card">
                <div className="text-uppercase small fw-bold text-muted mb-2 tracking-wide">
                  Ahrefs Domain Rating (DR)
                </div>

                <div className="score-circle-wrapper position-relative my-2">
                  <svg className="score-circle-svg" viewBox="0 0 180 180" width="180" height="180">
                    <circle
                      className="score-circle-bg"
                      cx="90"
                      cy="90"
                      r={radius}
                      stroke="var(--bg-subtle-2, #e2e8f0)"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <circle
                      className="score-circle-fg"
                      cx="90"
                      cy="90"
                      r={radius}
                      stroke={tier.hex}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div className="score-number-wrapper d-flex flex-column align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
                    <span className="score-number h1 fw-bold mb-0 text-main" style={{ color: tier.hex }}>
                      {result.domainRating}
                    </span>
                    <span className="score-out-of small text-muted">/ 100</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span
                    className="badge rounded-pill px-3 py-2 fw-semibold"
                    style={{ backgroundColor: tier.bgVar, color: tier.textVar }}
                  >
                    {tier.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown & Details */}
            <div className="col-12 col-md-7">
              <div className="tool-directory-card p-4 rounded-4 border h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h3 className="h5 fw-bold text-main m-0">Authority Profile Breakdown</h3>
                    <Award size={20} className="text-primary" />
                  </div>

                  <p className="text-secondary small mb-3">
                    {tier.description}
                  </p>

                  <div className="list-group list-group-flush mb-3">
                    <div className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Target Domain:</span>
                      <strong className="text-main font-monospace">{result.domain || result.target}</strong>
                    </div>

                    <div className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Ahrefs Domain Rating (DR):</span>
                      <strong className="text-main fw-bold" style={{ color: tier.hex }}>
                        {result.domainRating} / 100
                      </strong>
                    </div>

                    {result.ahrefsRank != null && (
                      <div className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Ahrefs Global Rank (AR):</span>
                        <strong className="text-main">
                          #{Number(result.ahrefsRank).toLocaleString()}
                        </strong>
                      </div>
                    )}

                    <div className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Authority Tier:</span>
                      <span className="badge-subtle-primary">{tier.tier}</span>
                    </div>
                  </div>
                </div>

                {/* Re-check Button */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center gap-2 mt-2"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  <span>Refresh Domain Rating</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual DR Authority Spectrum & Benchmarks Chart */}
          <DrAuthorityChart result={result} tier={tier} />

          {/* Official Ahrefs Metric Notice Box */}
          <div className="p-4 rounded-4 border bg-subtle mb-4" style={{ background: 'var(--bg-card)' }}>
            <div className="d-flex align-items-start gap-3">
              <div className="brand-icon flex-shrink-0 mt-1" aria-hidden="true">
                <Info size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="h6 fw-bold text-main mb-1">About Ahrefs Domain Rating (DR)</h4>
                <p className="text-secondary small mb-2">
                  <strong>Domain Rating (DR)</strong> is an estimated authority metric proprietary to Ahrefs. It measures the relative strength of a website's total backlink profile on a logarithmic scale from 0 to 100 based on the quality and quantity of unique root referring domains.
                </p>
                <p className="text-muted small mb-0">
                  <em>Note:</em> SEO++ retrieves this metric securely via the official Ahrefs Site Explorer API v3 and does not invent or calculate Domain Rating locally. Ahrefs updates backlink calculations continuously across their web index.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Guide Section */}
      <div className="row g-4 mt-2">
        <div className="col-12 col-md-4">
          <div className="tool-directory-card p-4 rounded-4 border h-100">
            <div className="brand-icon mb-3" aria-hidden="true">
              <TrendingUp size={20} />
            </div>
            <h3 className="h6 fw-bold text-main mb-2">How DR Works</h3>
            <p className="text-secondary small mb-0">
              Ahrefs calculates DR by examining how many unique websites link to the target domain, the DR of those linking websites, and how many unique outbound domains each referring site links to.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="tool-directory-card p-4 rounded-4 border h-100">
            <div className="brand-icon mb-3" aria-hidden="true">
              <Layers size={20} />
            </div>
            <h3 className="h6 fw-bold text-main mb-2">Logarithmic Scale</h3>
            <p className="text-secondary small mb-0">
              DR is logarithmic: climbing from DR 70 to 80 is significantly harder than climbing from DR 20 to 30. Each incremental jump requires exponentially more high-authority referring domains.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="tool-directory-card p-4 rounded-4 border h-100">
            <div className="brand-icon mb-3" aria-hidden="true">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="h6 fw-bold text-main mb-2">Improving Your DR</h3>
            <p className="text-secondary small mb-0">
              Grow DR organically through high-value editorial link building, original research studies, publishing free tools, reclaiming broken backlinks, and consistent guest outreach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
