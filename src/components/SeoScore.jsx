import React, { useEffect, useState } from 'react';
import { BRAND } from '../config/brand';

export default function SeoScore({ score = 0, grade = 'Good', summary = {} }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Smooth number count-up animation
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color mapping
  const getColor = (s) => {
    if (s >= 90) return { hex: '#10b981', bg: 'var(--pass-bg)', text: 'var(--pass-text)' };
    if (s >= 80) return { hex: '#3b82f6', bg: 'var(--primary-light)', text: 'var(--primary)' };
    if (s >= 65) return { hex: '#f59e0b', bg: 'var(--warn-bg)', text: 'var(--warn-text)' };
    return { hex: '#ef4444', bg: 'var(--fail-bg)', text: 'var(--fail-text)' };
  };

  const colorInfo = getColor(score);

  // Circle SVG math
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="score-card">
      <div className="text-uppercase small fw-bold text-muted mb-2 tracking-wide">
        {BRAND.auditLabel}
      </div>

      <div className="score-circle-wrapper">
        <svg className="score-circle-svg" viewBox="0 0 180 180">
          <circle
            className="score-circle-bg"
            cx="90"
            cy="90"
            r={radius}
          />
          <circle
            className="score-circle-fg"
            cx="90"
            cy="90"
            r={radius}
            stroke={colorInfo.hex}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="score-circle-text">
          <div className="score-number">{animatedScore}</div>
          <div className="score-max">/ 100</div>
        </div>
      </div>

      <div
        className="score-grade-badge"
        style={{ backgroundColor: colorInfo.bg, color: colorInfo.text }}
      >
        {grade}
      </div>

      {summary && (
        <div className="d-flex align-items-center justify-content-center gap-3 mt-3 pt-2 small text-muted">
          <span><strong className="text-success">{summary.passed || 0}</strong> passed</span>
          <span>•</span>
          <span><strong className="text-warning">{summary.warnings || 0}</strong> warnings</span>
          <span>•</span>
          <span><strong className="text-danger">{summary.failed || 0}</strong> issues</span>
        </div>
      )}
    </div>
  );
}
