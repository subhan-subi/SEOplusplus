import React from 'react';
import { CheckSquare, ArrowRight, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function Recommendations({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendations-box">
        <div className="d-flex align-items-center gap-2 mb-2">
          <CheckSquare className="text-success" size={20} aria-hidden="true" />
          <h3 className="h6 fw-bold mb-0 text-main">No Critical Recommendations</h3>
        </div>
        <p className="text-muted small mb-0">
          Outstanding! Your website passed all major SEO checks without critical warnings.
        </p>
      </div>
    );
  }

  const getPriorityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return <span className="rec-priority-badge high">High Priority</span>;
      case 'medium':
        return <span className="rec-priority-badge medium">Medium Priority</span>;
      case 'low':
      default:
        return <span className="rec-priority-badge low">Low Priority</span>;
    }
  };

  return (
    <section className="recommendations-box" aria-label="Prioritized action items">
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <CheckSquare className="text-primary" size={22} aria-hidden="true" />
          <h3 className="h5 fw-bold mb-0 text-main">Prioritized Action Items</h3>
        </div>
        <span className="badge-subtle-primary">
          {recommendations.length} {recommendations.length === 1 ? 'item' : 'items'} to address
        </span>
      </div>

      <p className="text-muted small mb-4">
        Focus on these prioritized improvements to resolve critical issues and optimize technical discoverability.
      </p>

      <div className="recs-list" role="list">
        {recommendations.map((rec, index) => {
          return (
            <div key={rec.id || index} className="rec-item" role="listitem">
              <div className="rec-number" aria-hidden="true">
                {index + 1}
              </div>

              <div className="rec-content-body flex-grow-1">
                {/* Header: Title, Priority, Category */}
                <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                  <h4 className="rec-title mb-0">{rec.title}</h4>
                  {getPriorityBadge(rec.severity)}
                  <span className="check-category-pill">{rec.category}</span>
                </div>

                {/* Subsections: Why this matters & How to fix it */}
                <div className="rec-details-grid">
                  {rec.whyItMatters && (
                    <div className="rec-detail-block">
                      <span className="rec-subhead text-muted">Why this matters:</span>
                      <p className="rec-subtext text-secondary mb-0">{rec.whyItMatters}</p>
                    </div>
                  )}

                  {rec.recommendation && (
                    <div className="rec-detail-block rec-fix-block">
                      <span className="rec-subhead text-primary">How to fix it:</span>
                      <p className="rec-subtext rec-fix-text mb-0">{rec.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
