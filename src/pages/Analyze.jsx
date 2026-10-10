import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { analyzeWebsite, getCachedAudit } from '../services/seoService';
import { BRAND } from '../config/brand';
import LoadingAnalyzer from '../components/LoadingAnalyzer';
import SeoScore from '../components/SeoScore';
import CategoryScores from '../components/CategoryScores';
import Recommendations from '../components/Recommendations';
import IssuesSection from '../components/IssuesSection';
import UrlAnalyzer from '../components/UrlAnalyzer';
import { 
  Globe, 
  Clock, 
  FileCode, 
  Type, 
  ExternalLink, 
  RotateCw, 
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import PageSeo from '../components/common/PageSeo';

export default function Analyze() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParam = searchParams.get('url');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditData, setAuditData] = useState(() => {
    // Check if we have cached audit matching urlParam or recent
    const cached = getCachedAudit();
    if (cached && (!urlParam || cached.url === urlParam || cached.normalizedUrl === urlParam)) {
      return cached;
    }
    return null;
  });

  const performAudit = async (targetUrl) => {
    if (!targetUrl) return;
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeWebsite(targetUrl);
      setAuditData(data);
      // Keep search params in sync
      setSearchParams({ url: data.normalizedUrl || targetUrl });
    } catch (err) {
      setError(err.message || 'We could not analyze this website. Please verify the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlParam) {
      // If we don't have matching audit data yet, perform audit
      if (!auditData || (auditData.url !== urlParam && auditData.normalizedUrl !== urlParam)) {
        performAudit(urlParam);
      }
    }
  }, [urlParam]);

  const handleReanalyze = () => {
    const target = auditData?.url || urlParam;
    if (target) {
      performAudit(target);
    }
  };

  return (
    <div className="analyze-page pb-5">
      <PageSeo
        title={auditData?.url ? `SEO Audit Report for ${auditData.normalizedUrl || auditData.url}` : "Website SEO Audit Report"}
        description="Free website audit report analyzing meta tags, page speed, mobile performance, security, and structured data with actionable recommendations."
        canonical="/analyze"
        noindex={true}
      />
      {/* Search Bar on top of Analyze Page */}
      <section className="py-4 border-bottom" style={{ backgroundColor: 'var(--bg-glass)' }}>
        <div className="container">
          <UrlAnalyzer 
            initialUrl={urlParam || auditData?.url || ''} 
            onAnalyze={performAudit}
            isLoading={loading} 
          />
        </div>
      </section>

      <div className="container pt-4">
        {/* Loading State */}
        {loading && (
          <LoadingAnalyzer targetUrl={urlParam || 'Connecting...'} />
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="analyzer-card text-center my-4 py-5">
            <div className="status-indicator-icon failed mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="h5 fw-bold mb-2">We couldn't analyze this website</h3>
            <p className="text-muted small max-w-600 mx-auto mb-4" style={{ maxWidth: '520px' }}>
              {error}
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleReanalyze}
              >
                <RotateCw size={14} className="me-1" /> Try Again
              </button>
              <Link to="/" className="btn btn-primary btn-sm">
                Back to Homepage
              </Link>
            </div>
          </div>
        )}

        {/* Empty state when no URL is provided */}
        {!loading && !error && !auditData && (
          <div className="text-center py-5">
            <div className="brand-icon mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
              <Globe size={24} />
            </div>
            <h3 className="h5 fw-bold">No Website Analyzed Yet</h3>
            <p className="text-muted small mb-4">
              Enter any URL in the box above to generate an instant, comprehensive SEO audit.
            </p>
          </div>
        )}

        {/* Report Content */}
        {!loading && !error && auditData && (
          <div className="report-content">
            {/* Header URL & Quick Stats Banner */}
            <div className="report-header-card p-3 p-md-4 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 border-bottom">
                <div>
                  <span className="badge-subtle-primary mb-2">
                    {BRAND.auditLabel}
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    <h2 className="audit-target-url mb-0">{auditData.normalizedUrl || auditData.url}</h2>
                    <a
                      href={auditData.normalizedUrl || auditData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover-primary"
                      title="Open website in new tab"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleReanalyze}
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                >
                  <RotateCw size={14} />
                  <span>Re-analyze</span>
                </button>
              </div>

              {/* Meta metrics bar */}
              <div className="audit-meta-row">
                <span className="meta-badge">
                  <Clock size={15} />
                  <span>TTFB: <strong>{auditData.meta?.responseTimeMs || 0}ms</strong></span>
                </span>
                <span>•</span>
                <span className="meta-badge">
                  <FileCode size={15} />
                  <span>HTML Size: <strong>{auditData.meta?.pageSizeKb || 0} KB</strong></span>
                </span>
                <span>•</span>
                <span className="meta-badge">
                  <Type size={15} />
                  <span>Words: <strong>~{auditData.meta?.wordCount || 0}</strong></span>
                </span>
                <span>•</span>
                <span className="meta-badge">
                  <Globe size={15} />
                  <span>Images: <strong>{auditData.meta?.totalImages || 0}</strong> ({auditData.meta?.imagesMissingAlt || 0} missing alt)</span>
                </span>
              </div>
            </div>

            {/* Top Score & Category Breakdown Section */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-lg-5">
                <SeoScore
                  score={auditData.score}
                  grade={auditData.grade}
                  summary={auditData.summary}
                />
              </div>
              <div className="col-12 col-lg-7">
                <CategoryScores categories={auditData.categories} />
              </div>
            </div>

            {/* Prioritized Recommendations */}
            <Recommendations recommendations={auditData.recommendations} />

            {/* Expandable Issues & Passed Checks */}
            <div className="p-3 p-md-4 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="h5 fw-bold mb-1">Detailed Audit Checks</h3>
                  <p className="text-muted small mb-0">
                    Click any check item to expand the technical explanation and recommended fix.
                  </p>
                </div>
              </div>

              <IssuesSection checks={auditData.checks} />
            </div>

            {/* Disclaimer & Trust Note */}
            <div className="audit-disclaimer-box">
              <Info size={22} className="text-primary flex-shrink-0" />
              <div className="small text-muted">
                {BRAND.disclaimer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
