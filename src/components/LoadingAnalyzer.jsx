import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Connecting to website', delay: 400 },
  { id: 2, label: 'Reading page structure', delay: 1200 },
  { id: 3, label: 'Checking SEO elements', delay: 2200 },
  { id: 4, label: 'Checking images & links', delay: 3200 },
  { id: 5, label: 'Calculating SEO score', delay: 4200 }
];

export default function LoadingAnalyzer({ targetUrl }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    // Step progression timer
    const timeouts = STAGES.map((stage) => {
      return setTimeout(() => {
        setCurrentStep((prev) => Math.max(prev, stage.id));
      }, stage.delay);
    });

    // Elapsed seconds counter
    const interval = setInterval(() => {
      setElapsedSeconds((sec) => sec + 1);
    }, 1000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading-card">
      <div className="loading-spinner-wrap">
        <div className="loading-spinner" />
      </div>

      <h3 className="h5 fw-bold mb-2">Analyzing website...</h3>
      {targetUrl && (
        <p className="font-monospace small text-primary mb-3 text-truncate">
          {targetUrl}
        </p>
      )}
      <p className="text-muted small mb-4">
        Examining technical factors, meta tags, heading structures, images, and response speed.
      </p>

      <ul className="loading-steps">
        {STAGES.map((stage) => {
          const isDone = currentStep > stage.id;
          const isActive = currentStep === stage.id;

          let statusClass = 'loading-step-item';
          if (isDone) statusClass += ' completed';
          else if (isActive) statusClass += ' active';

          return (
            <li key={stage.id} className={statusClass}>
              {isDone ? (
                <CheckCircle2 size={18} className="text-success flex-shrink-0" />
              ) : isActive ? (
                <Loader2 size={18} className="spinner-border-sm flex-shrink-0 text-primary" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Circle size={18} className="text-dim flex-shrink-0" />
              )}
              <span>{stage.label}</span>
            </li>
          );
        })}
      </ul>

      {elapsedSeconds > 15 && (
        <div className="alert alert-warning small mt-4 text-start mb-0" role="alert">
          <strong>Notice:</strong> This website is taking longer than usual to respond. We are still attempting to complete the analysis.
        </div>
      )}
    </div>
  );
}
