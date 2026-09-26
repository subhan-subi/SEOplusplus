import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function ToolHeader({
  title,
  description,
  category,
  icon: Icon,
  badgeText = 'Free Tool'
}) {
  return (
    <div className="tool-header-section mb-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <Link to="/tools" className="back-to-tools-link">
          <ArrowLeft size={16} />
          <span>All Marketing Tools</span>
        </Link>
        <span className="badge-subtle-primary">
          {category || badgeText}
        </span>
      </div>

      <div className="d-flex align-items-start gap-3">
        {Icon && (
          <div className="tool-header-icon" aria-hidden="true">
            <Icon size={24} />
          </div>
        )}
        <div className="flex-grow-1">
          <h1 className="tool-page-title mb-1">{title}</h1>
          <p className="tool-page-desc text-secondary mb-2">{description}</p>
          <div className="d-flex align-items-center flex-wrap gap-2 text-muted small">
            <span className="trust-indicator-chip">100% Client-Side</span>
            <span>•</span>
            <span className="trust-indicator-chip">Rule-Based / No AI</span>
            <span>•</span>
            <span className="trust-indicator-chip">No Login Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
