import React from 'react';
import { Server, FileText, Sparkles, Zap } from 'lucide-react';

const CATEGORY_ICONS = {
  technical: Server,
  onPage: FileText,
  content: Sparkles,
  performance: Zap
};

export default function CategoryScores({ categories = {} }) {
  const getFillColor = (score) => {
    if (score >= 90) return 'var(--pass)';
    if (score >= 80) return 'var(--primary)';
    if (score >= 65) return 'var(--warn)';
    return 'var(--fail)';
  };

  const categoryEntries = Object.entries(categories);

  return (
    <div className="row g-3">
      {categoryEntries.map(([key, data]) => {
        const Icon = CATEGORY_ICONS[key] || FileText;
        const color = getFillColor(data.score);

        return (
          <div key={key} className="col-12 col-sm-6">
            <div className="category-card">
              <div className="category-card-header">
                <div className="category-title">
                  <Icon size={18} style={{ color }} />
                  <span>{data.label}</span>
                </div>
                <div className="category-score-val" style={{ color }}>
                  {data.score}
                </div>
              </div>

              <div className="category-progress-track">
                <div
                  className="category-progress-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, data.score))}%`,
                    backgroundColor: color
                  }}
                />
              </div>

              <div className="d-flex align-items-center justify-content-between small text-muted mt-2">
                <span>{data.grade}</span>
                <span>
                  {data.passed} / {data.total} passed
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
