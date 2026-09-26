import React, { useState } from 'react';
import { MessageSquare, Copy, RotateCw, XCircle, Sparkles, Hash, Edit3 } from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import { generateCaption, TONE_OPTIONS, PLATFORMS } from '../../data/captionTemplates';
import { generateHashtags } from '../../data/hashtagData';
import { useToast } from '../../context/ToastContext';

export default function CaptionGenerator() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [platform, setPlatform] = useState('Instagram');
  const [templateIndex, setTemplateIndex] = useState(0);
  const [captionText, setCaptionText] = useState('');
  const [validationError, setValidationError] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  const { showToast } = useToast();

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!topic || !topic.trim()) {
      setValidationError('Please enter a topic to generate a caption.');
      return;
    }
    setValidationError('');
    const generated = generateCaption({ topic, keywords, tone, platform, templateIndex });
    setCaptionText(generated);
    setHasGenerated(true);
  };

  const handleRegenerate = () => {
    const nextIndex = templateIndex + 1;
    setTemplateIndex(nextIndex);
    const generated = generateCaption({ topic, keywords, tone, platform, templateIndex: nextIndex });
    setCaptionText(generated);
    showToast('Loaded alternate template variation');
  };

  const handleCopyCaptionOnly = async () => {
    if (!captionText) return;
    try {
      await navigator.clipboard.writeText(captionText);
      showToast('Caption copied to clipboard!');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleCopyWithHashtags = async () => {
    if (!captionText) return;
    const tags = generateHashtags({ topic, platform, count: 5 });
    const fullText = `${captionText}\n\n${tags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullText);
      showToast('Caption with 5 relevant hashtags copied!');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleClear = () => {
    setTopic('');
    setKeywords('');
    setCaptionText('');
    setHasGenerated(false);
    setValidationError('');
  };

  return (
    <div className="container py-5" style={{ maxWidth: '920px' }}>
      <ToolHeader
        title="Template-based Caption Generator"
        description="Create ready-to-edit social media captions using customizable templates."
        category="Social Media"
        icon={MessageSquare}
      />

      {/* Input Card */}
      <div className="analyzer-card mb-4">
        <form onSubmit={handleGenerate} noValidate>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="caption-topic-input" className="form-label small fw-bold text-main">
                Topic or Message Focus <span className="text-danger">*</span>
              </label>
              <input
                id="caption-topic-input"
                type="text"
                className="form-control"
                placeholder="e.g. Website redesign, Launching our new product"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (validationError) setValidationError('');
                }}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="caption-keywords-input" className="form-label small fw-bold text-main">
                Optional Keywords or Highlights
              </label>
              <input
                id="caption-keywords-input"
                type="text"
                className="form-control"
                placeholder="e.g. speed optimization, mobile responsive"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <label htmlFor="caption-platform-select" className="form-label small fw-bold text-main">
                Platform
              </label>
              <select
                id="caption-platform-select"
                className="form-select"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6">
              <label htmlFor="caption-tone-select" className="form-label small fw-bold text-main">
                Tone of Voice
              </label>
              <select
                id="caption-tone-select"
                className="form-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {validationError && (
            <div className="text-danger small mb-3 fw-medium">
              ⚠ {validationError}
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between pt-2">
            <div>
              {topic && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleClear}
                >
                  <XCircle size={15} className="me-1" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              id="generate-caption-btn"
              className="btn btn-analyze"
            >
              <Sparkles size={16} />
              <span>Generate Caption</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Section */}
      {hasGenerated && captionText && (
        <div className="report-header-card p-4 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3 border-bottom mb-3">
            <div className="d-flex align-items-center gap-2">
              <Edit3 size={18} className="text-primary" />
              <h3 className="h6 fw-bold mb-0 text-main">Editable Caption ({tone} • {platform})</h3>
            </div>

            <div className="d-flex align-items-center flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleRegenerate}
                title="Cycle to another template variation"
              >
                <RotateCw size={14} />
                <span>Alternate Template</span>
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleCopyWithHashtags}
              >
                <Hash size={14} />
                <span>Copy + Hashtags</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleCopyCaptionOnly}
              >
                <Copy size={14} />
                <span>Copy Caption</span>
              </button>
            </div>
          </div>

          <div className="mb-3">
            <textarea
              className="form-control font-monospace"
              rows={9}
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Edit your generated caption here..."
              style={{ fontSize: '0.92rem', lineHeight: '1.6' }}
            />
          </div>

          <div className="d-flex align-items-center justify-content-between text-muted small">
            <span>Character count: <strong>{captionText.length}</strong></span>
            <span>Word count: <strong>{captionText.trim().split(/\s+/).filter(Boolean).length}</strong></span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasGenerated && (
        <div className="text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="brand-icon mx-auto mb-3">
            <MessageSquare size={24} />
          </div>
          <h3 className="h6 fw-bold text-main mb-1">Enter your topic and tone to build a caption</h3>
          <p className="text-muted small mb-0" style={{ maxWidth: '440px', margin: '0 auto' }}>
            Our template-based generator provides structured hooks, body paragraphs, and calls to action that you can freely edit.
          </p>
        </div>
      )}
    </div>
  );
}
