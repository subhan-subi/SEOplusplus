import React from 'react';
import { Layers, ShieldCheck, MapPin } from 'lucide-react';

const TIERS = [
  { tier: 'Tier 5', label: 'New / Low', range: '0 - 19', min: 0, max: 19, color: '#ef4444', bg: '#fef2f2' },
  { tier: 'Tier 4', label: 'Emerging', range: '20 - 39', min: 20, max: 39, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { tier: 'Tier 3', label: 'Moderate', range: '40 - 59', min: 40, max: 59, color: '#f59e0b', bg: '#fffbeb' },
  { tier: 'Tier 2', label: 'Established', range: '60 - 79', min: 60, max: 79, color: '#3b82f6', bg: '#eff6ff' },
  { tier: 'Tier 1', label: 'Global Authority', range: '80 - 100', min: 80, max: 100, color: '#10b981', bg: '#ecfdf5' }
];

const BENCHMARKS = [
  { name: 'wikipedia.org', score: 98 },
  { name: 'github.com', score: 96 },
  { name: 'ahrefs.com', score: 91 },
  { name: 'mozilla.org', score: 94 }
];

export default function DrAuthorityChart({ result, tier }) {
  if (!result || typeof result.domainRating !== 'number') return null;

  const score = Math.max(0, Math.min(100, result.domainRating));
  const domain = result.domain || result.target || 'target';

  return (
    <div className="tool-directory-card p-4 rounded-4 border mb-4 dr-authority-spectrum-card" style={{ background: 'var(--bg-card)' }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="brand-icon" style={{ width: '32px', height: '32px' }} aria-hidden="true">
            <Layers size={18} className="text-primary" />
          </div>
          <h3 className="h6 fw-bold mb-0 text-main">Domain Rating Authority Spectrum</h3>
        </div>
        <span className="badge-subtle-primary small d-inline-flex align-items-center gap-1">
          <ShieldCheck size={14} />
          {tier?.label || 'Verified Scale'}
        </span>
      </div>

      <p className="text-secondary small mb-4">
        Visualizing <strong>{domain}</strong> (DR {score}) across the logarithmic Ahrefs backlink authority tiers.
      </p>

      {/* Visual Spectrum Track */}
      <div className="position-relative pt-4 pb-2 mb-4">
        {/* Active Domain Indicator Pin */}
        <div
          className="position-absolute"
          style={{
            left: `${score}%`,
            top: '0',
            transform: 'translateX(-50%)',
            zIndex: 3,
            transition: 'left 0.8s ease'
          }}
        >
          <div className="d-flex flex-column align-items-center">
            <span
              className="badge shadow-sm px-2 py-1 fw-bold text-nowrap"
              style={{
                backgroundColor: tier?.hex || '#2563eb',
                color: '#ffffff',
                fontSize: '0.74rem'
              }}
            >
              ★ {domain} (DR {score})
            </span>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `6px solid ${tier?.hex || '#2563eb'}`,
                marginTop: '1px'
              }}
            />
          </div>
        </div>

        {/* 5-Segment Bar */}
        <div className="d-flex w-100 rounded-pill overflow-hidden shadow-xs mt-3" style={{ height: '14px', backgroundColor: 'var(--bg-subtle-2)' }}>
          {TIERS.map((t) => {
            const isCurrent = score >= t.min && score <= t.max;
            return (
              <div
                key={t.tier}
                style={{
                  width: '20%',
                  backgroundColor: t.color,
                  opacity: isCurrent ? 1 : 0.65,
                  transition: 'opacity 0.3s ease'
                }}
                title={`${t.tier}: ${t.label} (${t.range})`}
              />
            );
          })}
        </div>

        {/* Spectrum Scale Labels */}
        <div className="d-flex justify-content-between text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
          <span>DR 0</span>
          <span>DR 20</span>
          <span>DR 40</span>
          <span>DR 60</span>
          <span>DR 80</span>
          <span>DR 100</span>
        </div>
      </div>

      {/* 5 Tiers Grid */}
      <div className="row g-2">
        {TIERS.map((t) => {
          const isCurrent = score >= t.min && score <= t.max;
          return (
            <div key={t.tier} className="col-12 col-sm-6 col-md">
              <div
                className="p-2 rounded-3 text-center border h-100 d-flex flex-column justify-content-between"
                style={{
                  backgroundColor: isCurrent ? t.bg : 'var(--bg-subtle)',
                  borderColor: isCurrent ? t.color : 'var(--border-main)',
                  boxShadow: isCurrent ? `0 0 0 2px ${t.color}33` : 'none'
                }}
              >
                <div>
                  <span
                    className="badge rounded-pill mb-1 d-inline-block"
                    style={{
                      backgroundColor: `${t.color}20`,
                      color: t.color,
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}
                  >
                    {t.tier}
                  </span>
                  <div className="fw-bold small text-main" style={{ fontSize: '0.78rem' }}>
                    {t.label}
                  </div>
                </div>
                <div className="text-muted small mt-1 font-monospace" style={{ fontSize: '0.7rem' }}>
                  {t.range}
                </div>
                {isCurrent && (
                  <div className="mt-1">
                    <span className="badge rounded-pill text-white px-2 py-0" style={{ backgroundColor: t.color, fontSize: '0.66rem' }}>
                      CURRENT
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reference Benchmarks Pill Row */}
      <div className="mt-3 pt-3 border-top d-flex align-items-center flex-wrap gap-2" style={{ fontSize: '0.78rem' }}>
        <span className="text-muted d-inline-flex align-items-center gap-1">
          <MapPin size={13} />
          Reference Benchmarks:
        </span>
        {BENCHMARKS.map((b) => (
          <span
            key={b.name}
            className="badge rounded-pill px-2 py-1 text-secondary border font-monospace"
            style={{ backgroundColor: 'var(--bg-subtle)', fontWeight: 500 }}
          >
            {b.name}: <strong className="text-main">{b.score}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
