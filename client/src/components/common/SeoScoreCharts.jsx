import React from 'react';
import { BarChart3, PieChart, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

/**
 * Visual Charts for SEO Audit Results
 * 1. Category Score Breakdown Chart
 * 2. Passed vs Warnings vs Errors Status Distribution Chart
 */
export default function SeoScoreCharts({ categories = {}, summary = {} }) {
  const catEntries = Object.entries(categories);

  const passed = summary.passed || 0;
  const warnings = summary.warnings || 0;
  const failed = summary.failed || 0;
  const info = summary.info || 0;
  const total = summary.total || (passed + warnings + failed + info) || 1;

  const passedPct = Math.round((passed / total) * 100);
  const warnPct = Math.round((warnings / total) * 100);
  const failedPct = Math.round((failed / total) * 100);
  const infoPct = Math.max(0, 100 - passedPct - warnPct - failedPct);

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--pass)';
    if (score >= 80) return 'var(--primary)';
    if (score >= 65) return 'var(--warn)';
    return 'var(--fail)';
  };

  return (
    <div className="row g-4 mb-4 seo-audit-charts-row">
      {/* Chart 1: Category Score Breakdown */}
      <div className="col-12 col-lg-7">
        <div className="tool-directory-card p-4 rounded-4 border h-100" style={{ background: 'var(--bg-card)' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <div className="brand-icon" style={{ width: '32px', height: '32px' }} aria-hidden="true">
                <BarChart3 size={18} className="text-primary" />
              </div>
              <h3 className="h6 fw-bold mb-0 text-main">SEO Category Performance Breakdown</h3>
            </div>
            <span className="small text-muted">Benchmark: 100 max</span>
          </div>

          <p className="text-secondary small mb-3">
            Comparison of technical readiness, on-page optimization, content depth, and response performance.
          </p>

          <div className="category-bars-chart d-flex flex-column gap-3">
            {catEntries.map(([key, data]) => {
              const color = getScoreColor(data.score);
              return (
                <div key={key} className="category-bar-item">
                  <div className="d-flex align-items-center justify-content-between small mb-1">
                    <span className="fw-semibold text-main">{data.label}</span>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge rounded-pill px-2 py-0" style={{ backgroundColor: `${color}18`, color, fontSize: '0.75rem', fontWeight: 600 }}>
                        {data.grade}
                      </span>
                      <strong className="font-monospace" style={{ color }}>
                        {data.score} / 100
                      </strong>
                    </div>
                  </div>

                  <div className="progress" style={{ height: '10px', backgroundColor: 'var(--bg-subtle-2)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${Math.min(100, Math.max(0, data.score))}%`,
                        backgroundColor: color,
                        borderRadius: '999px',
                        transition: 'width 0.8s ease'
                      }}
                      aria-valuenow={data.score}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>

                  <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '0.76rem' }}>
                    <span>{data.passed} checks passed</span>
                    <span>{data.warnings + data.failed} checks need review</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart 2: Status Distribution (Passed / Warnings / Errors) */}
      <div className="col-12 col-lg-5">
        <div className="tool-directory-card p-4 rounded-4 border h-100" style={{ background: 'var(--bg-card)' }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <div className="brand-icon" style={{ width: '32px', height: '32px' }} aria-hidden="true">
                <PieChart size={18} className="text-primary" />
              </div>
              <h3 className="h6 fw-bold mb-0 text-main">Audit Checks Status</h3>
            </div>
            <span className="badge-subtle-primary small">{total} Total Checks</span>
          </div>

          <p className="text-secondary small mb-3">
            Distribution of passed verification criteria versus actionable warnings and critical failures.
          </p>

          {/* Segmented Progress Distribution Bar */}
          <div className="mb-3">
            <div className="d-flex w-100 rounded-pill overflow-hidden" style={{ height: '16px', backgroundColor: 'var(--bg-subtle-2)' }}>
              {passedPct > 0 && (
                <div
                  style={{ width: `${passedPct}%`, backgroundColor: 'var(--pass)' }}
                  title={`Passed: ${passed} (${passedPct}%)`}
                />
              )}
              {warnPct > 0 && (
                <div
                  style={{ width: `${warnPct}%`, backgroundColor: 'var(--warn)' }}
                  title={`Warnings: ${warnings} (${warnPct}%)`}
                />
              )}
              {failedPct > 0 && (
                <div
                  style={{ width: `${failedPct}%`, backgroundColor: 'var(--fail)' }}
                  title={`Errors: ${failed} (${failedPct}%)`}
                />
              )}
              {infoPct > 0 && (
                <div
                  style={{ width: `${infoPct}%`, backgroundColor: 'var(--info)' }}
                  title={`Info: ${info} (${infoPct}%)`}
                />
              )}
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: 'var(--pass-bg)' }}>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                <span className="small fw-semibold" style={{ color: 'var(--pass-text)' }}>Passed Checks</span>
              </div>
              <span className="badge bg-success rounded-pill px-2">
                {passed} ({passedPct}%)
              </span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: 'var(--warn-bg)' }}>
              <div className="d-flex align-items-center gap-2">
                <AlertTriangle size={16} className="text-warning" />
                <span className="small fw-semibold" style={{ color: 'var(--warn-text)' }}>Warnings Found</span>
              </div>
              <span className="badge bg-warning text-dark rounded-pill px-2">
                {warnings} ({warnPct}%)
              </span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: 'var(--fail-bg)' }}>
              <div className="d-flex align-items-center gap-2">
                <XCircle size={16} className="text-danger" />
                <span className="small fw-semibold" style={{ color: 'var(--fail-text)' }}>Critical Errors / Failures</span>
              </div>
              <span className="badge bg-danger rounded-pill px-2">
                {failed} ({failedPct}%)
              </span>
            </div>

            {info > 0 && (
              <div className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: 'var(--info-bg)' }}>
                <div className="d-flex align-items-center gap-2">
                  <Info size={16} className="text-info" />
                  <span className="small fw-semibold" style={{ color: 'var(--info-text)' }}>Informational Checks</span>
                </div>
                <span className="badge bg-info text-dark rounded-pill px-2">
                  {info} ({infoPct}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
