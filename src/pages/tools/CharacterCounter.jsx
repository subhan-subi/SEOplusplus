import React, { useState } from 'react';
import { AlignLeft, Copy, XCircle, Info, Check } from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import { PLATFORM_LIMITS, calculateTextStats } from '../../data/platformLimits';
import { useToast } from '../../context/ToastContext';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const { showToast } = useToast();

  const stats = calculateTextStats(text);
  const platformConfig = PLATFORM_LIMITS[selectedPlatform] || PLATFORM_LIMITS.Instagram;
  const limit = platformConfig.captionLimit;
  const progressPercent = Math.min(100, Math.round((stats.characters / limit) * 100));
  const isOverLimit = stats.characters > limit;

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Text copied to clipboard!');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="container py-5" style={{ maxWidth: '960px' }}>
      <ToolHeader
        title="Character & Word Counter"
        description="Count characters, words, sentences, and spaces in real-time with platform limit guidance."
        category="Social Media"
        icon={AlignLeft}
      />

      {/* Real-time Metric Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="stat-metric-card p-3 rounded-3 border text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="stat-metric-value">{stats.characters}</div>
            <div className="stat-metric-label">Characters</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="stat-metric-card p-3 rounded-3 border text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="stat-metric-value">{stats.charactersNoSpaces}</div>
            <div className="stat-metric-label">No Spaces</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="stat-metric-card p-3 rounded-3 border text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="stat-metric-value">{stats.words}</div>
            <div className="stat-metric-label">Words</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="stat-metric-card p-3 rounded-3 border text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="stat-metric-value">{stats.sentences}</div>
            <div className="stat-metric-label">Sentences</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="stat-metric-card p-3 rounded-3 border text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="stat-metric-value">{stats.paragraphs}</div>
            <div className="stat-metric-label">Paragraphs</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="stat-metric-card p-3 rounded-3 border text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
            <div className="stat-metric-value">~{stats.readingTimeMinutes}m</div>
            <div className="stat-metric-label">Reading Time</div>
          </div>
        </div>
      </div>

      {/* Editor Box */}
      <div className="analyzer-card mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-2">
          <label htmlFor="text-counter-textarea" className="form-label small fw-bold text-main mb-0">
            Enter or paste your text:
          </label>

          <div className="d-flex align-items-center gap-2">
            {text && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleClear}
              >
                <XCircle size={14} />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
              onClick={handleCopy}
              disabled={!text}
            >
              <Copy size={14} />
              <span>Copy Text</span>
            </button>
          </div>
        </div>

        <textarea
          id="text-counter-textarea"
          className="form-control mb-3"
          rows={10}
          placeholder="Start typing or paste your content here to analyze character count, words, and platform limits..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: '0.94rem', lineHeight: '1.6' }}
        />

        {/* Platform Guidance Selector & Progress Indicator */}
        <div className="p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="small fw-bold text-main">Platform Guidance:</span>
              <div className="btn-group btn-group-sm" role="group">
                {Object.keys(PLATFORM_LIMITS).map((key) => {
                  const isActive = selectedPlatform === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`btn ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setSelectedPlatform(key)}
                    >
                      {PLATFORM_LIMITS[key].name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="small text-muted">
              <strong className={isOverLimit ? 'text-danger' : 'text-main'}>
                {stats.characters}
              </strong> / {limit.toLocaleString()} limit
            </div>
          </div>

          {/* Progress bar */}
          <div className="category-progress-track mb-2" style={{ height: '6px' }}>
            <div
              className="category-progress-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: isOverLimit ? 'var(--fail)' : progressPercent > 80 ? 'var(--warn)' : 'var(--pass)'
              }}
            />
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 small text-muted">
            <span><strong>Optimal range:</strong> {platformConfig.recommendedRange}</span>
            {platformConfig.notes && <span>{platformConfig.notes}</span>}
          </div>
        </div>
      </div>

      <div className="audit-disclaimer-box mt-3 mb-0">
        <Info size={18} className="text-primary flex-shrink-0" />
        <div className="small text-muted">
          Platform limits are compiled from public developer documentation. Character counting calculations occur entirely in your local browser and no text is transmitted over the network.
        </div>
      </div>
    </div>
  );
}
