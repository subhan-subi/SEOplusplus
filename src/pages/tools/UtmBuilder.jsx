import React, { useState, useMemo } from 'react';
import { Link as LinkIcon, Copy, XCircle, RotateCcw, ExternalLink, Info, Check } from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import PageSeo from '../../components/common/PageSeo';
import { useToast } from '../../context/ToastContext';

export default function UtmBuilder() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');

  const [validationError, setValidationError] = useState('');
  const { showToast } = useToast();

  const generatedUrl = useMemo(() => {
    if (!websiteUrl || !websiteUrl.trim()) return '';

    let cleanBase = websiteUrl.trim();
    if (!/^https?:\/\//i.test(cleanBase)) {
      cleanBase = 'https://' + cleanBase;
    }

    try {
      const urlObj = new URL(cleanBase);

      if (utmSource.trim()) urlObj.searchParams.set('utm_source', utmSource.trim());
      if (utmMedium.trim()) urlObj.searchParams.set('utm_medium', utmMedium.trim());
      if (utmCampaign.trim()) urlObj.searchParams.set('utm_campaign', utmCampaign.trim());
      if (utmTerm.trim()) urlObj.searchParams.set('utm_term', utmTerm.trim());
      if (utmContent.trim()) urlObj.searchParams.set('utm_content', utmContent.trim());

      return urlObj.toString();
    } catch {
      return '';
    }
  }, [websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  const handleCopy = async () => {
    if (!generatedUrl) {
      setValidationError('Please enter a valid website URL and campaign parameters.');
      return;
    }
    setValidationError('');
    try {
      await navigator.clipboard.writeText(generatedUrl);
      showToast('Generated UTM tracking URL copied to clipboard!');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleReset = () => {
    setWebsiteUrl('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    setValidationError('');
  };

  const handleLoadSample = () => {
    setWebsiteUrl('https://example.com/pricing');
    setUtmSource('newsletter');
    setUtmMedium('email');
    setUtmCampaign('spring_launch_2026');
    setUtmTerm('seo_tools');
    setUtmContent('header_cta_button');
    setValidationError('');
  };

  return (
    <div className="container py-5" style={{ maxWidth: '920px' }}>
      <PageSeo
        title="Free UTM Campaign URL Builder"
        description="Build campaign tracking URLs with UTM parameters instantly. Source, medium, campaign, term, and content support. No data leaves your browser."
        canonical="/tools/utm-builder"
      />
      <ToolHeader
        title="UTM Campaign URL Builder"
        description="Create campaign tracking URLs quickly and accurately with client-side URL encoding."
        category="Marketing Tools"
        icon={LinkIcon}
      />

      {/* Input Form Card */}
      <div className="analyzer-card mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h2 className="h6 fw-bold mb-0 text-main">Campaign Parameters</h2>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none"
              onClick={handleLoadSample}
            >
              Fill Sample Data
            </button>
            <span>•</span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
              onClick={handleReset}
            >
              Reset All
            </button>
          </div>
        </div>

        <div className="row g-3 mb-3">
          {/* Website URL */}
          <div className="col-12">
            <label htmlFor="utm-website-input" className="form-label small fw-bold text-main">
              Website URL <span className="text-danger">*</span>
            </label>
            <input
              id="utm-website-input"
              type="text"
              className="form-control"
              placeholder="https://example.com or example.com/landing"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                if (validationError) setValidationError('');
              }}
            />
            <div className="form-text small text-muted">The destination webpage you want to direct users to.</div>
          </div>

          {/* Campaign Source */}
          <div className="col-12 col-md-6">
            <label htmlFor="utm-source-input" className="form-label small fw-bold text-main">
              Campaign Source (utm_source) <span className="text-danger">*</span>
            </label>
            <input
              id="utm-source-input"
              type="text"
              className="form-control"
              placeholder="e.g. google, newsletter, facebook, linkedin"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
            />
            <div className="form-text small text-muted">The referrer or platform (e.g. google, twitter).</div>
          </div>

          {/* Campaign Medium */}
          <div className="col-12 col-md-6">
            <label htmlFor="utm-medium-input" className="form-label small fw-bold text-main">
              Campaign Medium (utm_medium) <span className="text-danger">*</span>
            </label>
            <input
              id="utm-medium-input"
              type="text"
              className="form-control"
              placeholder="e.g. cpc, email, social, banner"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
            />
            <div className="form-text small text-muted">Marketing medium (e.g. cpc, email, social).</div>
          </div>

          {/* Campaign Name */}
          <div className="col-12 col-md-4">
            <label htmlFor="utm-campaign-input" className="form-label small fw-bold text-main">
              Campaign Name (utm_campaign)
            </label>
            <input
              id="utm-campaign-input"
              type="text"
              className="form-control"
              placeholder="e.g. summer_promo, launch_2026"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
            />
            <div className="form-text small text-muted">Product, promo, or slogan.</div>
          </div>

          {/* Campaign Term */}
          <div className="col-12 col-md-4">
            <label htmlFor="utm-term-input" className="form-label small fw-bold text-main">
              Campaign Term (utm_term)
            </label>
            <input
              id="utm-term-input"
              type="text"
              className="form-control"
              placeholder="e.g. seo_audit, web_design"
              value={utmTerm}
              onChange={(e) => setUtmTerm(e.target.value)}
            />
            <div className="form-text small text-muted">Paid search keyword.</div>
          </div>

          {/* Campaign Content */}
          <div className="col-12 col-md-4">
            <label htmlFor="utm-content-input" className="form-label small fw-bold text-main">
              Campaign Content (utm_content)
            </label>
            <input
              id="utm-content-input"
              type="text"
              className="form-control"
              placeholder="e.g. header_cta, textlink_a"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
            />
            <div className="form-text small text-muted">Differentiate ads or links.</div>
          </div>
        </div>

        {validationError && (
          <div className="text-danger small mb-3 fw-medium">
            ⚠ {validationError}
          </div>
        )}
      </div>

      {/* Generated Result Card */}
      {generatedUrl ? (
        <div className="report-header-card p-4 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3 border-bottom mb-3">
            <div>
              <span className="badge-subtle-primary mb-1">Ready to Use</span>
              <h3 className="h6 fw-bold mb-0 text-main">Final Tracking URL</h3>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
              onClick={handleCopy}
            >
              <Copy size={14} />
              <span>Copy Full URL</span>
            </button>
          </div>

          <div className="p-3 rounded-3 border mb-3 font-monospace small text-break" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--primary)' }}>
            {generatedUrl}
          </div>

          {/* Parameter Breakdown */}
          <div className="mb-2">
            <span className="small text-muted fw-bold text-uppercase tracking-wide">Included Parameters:</span>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {utmSource && <span className="check-category-pill">source: {utmSource}</span>}
            {utmMedium && <span className="check-category-pill">medium: {utmMedium}</span>}
            {utmCampaign && <span className="check-category-pill">campaign: {utmCampaign}</span>}
            {utmTerm && <span className="check-category-pill">term: {utmTerm}</span>}
            {utmContent && <span className="check-category-pill">content: {utmContent}</span>}
          </div>
        </div>
      ) : (
        <div className="text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="brand-icon mx-auto mb-3">
            <LinkIcon size={24} />
          </div>
          <h3 className="h6 fw-bold text-main mb-1">Enter your website URL to generate tracking link</h3>
          <p className="text-muted small mb-0" style={{ maxWidth: '440px', margin: '0 auto' }}>
            UTM parameters will be encoded and appended automatically in real time as you fill out the fields above.
          </p>
        </div>
      )}

      <div className="audit-disclaimer-box mt-3 mb-0">
        <Info size={18} className="text-primary flex-shrink-0" />
        <div className="small text-muted">
          All URL formatting and parameter encoding takes place directly in your browser. No URLs or campaign names are sent to any external server or saved in tracking databases.
        </div>
      </div>
    </div>
  );
}
