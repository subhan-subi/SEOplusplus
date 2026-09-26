import React, { useState } from 'react';
import { Check, AlertTriangle, X, Info, ChevronDown } from 'lucide-react';

export default function SeoCheckCard({ check }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <Check size={15} strokeWidth={2.8} aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={15} strokeWidth={2.5} aria-hidden="true" />;
      case 'failed':
        return <X size={15} strokeWidth={2.8} aria-hidden="true" />;
      case 'info':
      default:
        return <Info size={15} strokeWidth={2.5} aria-hidden="true" />;
    }
  };

  const getSeverityBadge = (severity, status) => {
    if (status === 'passed') return null;
    const sev = severity?.toLowerCase() || 'medium';
    return (
      <span className={`rec-priority-badge ${sev}`}>
        {sev}
      </span>
    );
  };

  return (
    <div className={`check-card ${isExpanded ? 'expanded' : ''}`}>
      <div
        className="check-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
      >
        <div className="check-card-left">
          <div className={`status-indicator-icon ${check.status}`}>
            {getStatusIcon(check.status)}
          </div>
          <div className="min-w-0 flex-grow-1">
            <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
              <span className="check-title-text">{check.title}</span>
              <span className="check-category-pill">{check.category}</span>
              {getSeverityBadge(check.severity, check.status)}
            </div>
            {check.description && !isExpanded && (
              <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '680px', fontSize: '0.82rem' }}>
                {check.description}
              </p>
            )}
          </div>
        </div>

        <div className="ms-2 d-flex align-items-center text-muted flex-shrink-0">
          <ChevronDown
            size={18}
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="check-card-body">
          {check.description && (
            <div className="check-detail-block">
              <div className="check-detail-label">Why it matters</div>
              <div className="check-detail-content">{check.description}</div>
            </div>
          )}

          {check.recommendation && (
            <div className="check-detail-block">
              <div className="check-detail-label text-primary">How to fix</div>
              <div className="check-detail-content fw-medium text-main">
                {check.recommendation}
              </div>
            </div>
          )}

          {check.details?.sampleMissing && check.details.sampleMissing.length > 0 && (
            <div className="check-detail-block">
              <div className="check-detail-label">Sample items without ALT</div>
              <ul className="small font-monospace text-muted ps-3 mb-0">
                {check.details.sampleMissing.map((item, idx) => (
                  <li key={idx} className="text-break">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
