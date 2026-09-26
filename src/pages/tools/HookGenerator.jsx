import React, { useState } from 'react';
import { Sparkles, Copy, RotateCw, XCircle, Check, Info } from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import { generateHooks, HOOK_CATEGORIES } from '../../data/hookTemplates';
import { useToast } from '../../context/ToastContext';

const PLATFORMS = ['TikTok', 'Instagram', 'LinkedIn', 'YouTube', 'Facebook'];
const SAMPLE_TOPICS = ['SEO', 'web design', 'remote work', 'content strategy', 'habit building'];

export default function HookGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [variantOffset, setVariantOffset] = useState(0);
  const [hooks, setHooks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { showToast } = useToast();

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!topic || !topic.trim()) {
      setValidationError('Please enter a topic to generate hooks.');
      return;
    }
    setValidationError('');
    const generated = generateHooks({ topic, platform, variantOffset });
    setHooks(generated);
    setHasGenerated(true);
  };

  const handleRegenerate = () => {
    const nextOffset = variantOffset + 1;
    setVariantOffset(nextOffset);
    const generated = generateHooks({ topic, platform, variantOffset: nextOffset });
    setHooks(generated);
    showToast('Loaded alternate hook variations');
  };

  const handleCopySingle = async (hookItem) => {
    try {
      await navigator.clipboard.writeText(hookItem.hook);
      setCopiedId(hookItem.id);
      showToast(`Copied ${hookItem.category} hook!`);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast('Failed to copy hook', 'error');
    }
  };

  const handleCopyAll = async () => {
    if (hooks.length === 0) return;
    const allText = hooks.map((h) => `[${h.category}]\n${h.hook}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(allText);
      showToast(`Copied all ${hooks.length} hooks to clipboard!`);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleClear = () => {
    setTopic('');
    setHooks([]);
    setHasGenerated(false);
    setValidationError('');
  };

  const handleSampleClick = (sample) => {
    setTopic(sample);
    setValidationError('');
    const generated = generateHooks({ topic: sample, platform, variantOffset });
    setHooks(generated);
    setHasGenerated(true);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '920px' }}>
      <ToolHeader
        title="Hook Generator"
        description="Create attention-grabbing opening lines for your content across 7 proven angles."
        category="Social Media"
        icon={Sparkles}
      />

      {/* Input Card */}
      <div className="analyzer-card mb-4">
        <form onSubmit={handleGenerate} noValidate>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-8">
              <label htmlFor="hook-topic-input" className="form-label small fw-bold text-main">
                Content Topic <span className="text-danger">*</span>
              </label>
              <input
                id="hook-topic-input"
                type="text"
                className="form-control"
                placeholder="e.g. SEO, email marketing, personal finance"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (validationError) setValidationError('');
                }}
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="hook-platform-select" className="form-label small fw-bold text-main">
                Primary Platform
              </label>
              <select
                id="hook-platform-select"
                className="form-select"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {validationError && (
            <div className="text-danger small mb-3 fw-medium">
              ⚠ {validationError}
            </div>
          )}

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2">
            <div className="quick-samples my-0">
              <span className="text-muted small">Try:</span>
              {SAMPLE_TOPICS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  className="quick-sample-chip"
                  onClick={() => handleSampleClick(sample)}
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="d-flex align-items-center gap-2">
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
              <button
                type="submit"
                id="generate-hooks-btn"
                className="btn btn-analyze"
              >
                <Sparkles size={16} />
                <span>Generate Hooks</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results List */}
      {hasGenerated && hooks.length > 0 && (
        <div className="report-header-card p-4 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3 border-bottom mb-3">
            <div>
              <h3 className="h6 fw-bold mb-1 text-main">Generated Opening Lines ({hooks.length})</h3>
              <p className="text-muted small mb-0">Platform: <strong>{platform}</strong> • Topic: <strong>{topic}</strong></p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleRegenerate}
              >
                <RotateCw size={14} />
                <span>New Angles</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleCopyAll}
              >
                <Copy size={14} />
                <span>Copy All</span>
              </button>
            </div>
          </div>

          <div className="d-flex flex-column gap-3 mb-3">
            {hooks.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div key={item.id} className="p-3 rounded-3 border d-flex align-items-center justify-content-between gap-3 hover-card-surface" style={{ backgroundColor: 'var(--bg-app)' }}>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="check-category-pill">{item.category}</span>
                    </div>
                    <p className="mb-0 text-main fw-semibold" style={{ fontSize: '0.94rem' }}>
                      "{item.hook}"
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm flex-shrink-0 d-inline-flex align-items-center gap-1"
                    onClick={() => handleCopySingle(item)}
                    title="Copy hook to clipboard"
                  >
                    {isCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="audit-disclaimer-box mt-3 mb-0">
            <Info size={18} className="text-primary flex-shrink-0" />
            <div className="small text-muted">
              Hooks provide structural inspiration for opening lines. Engagement depends on delivery, topic relevance, and content quality. Results do not guarantee reach or view counts.
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasGenerated && (
        <div className="text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="brand-icon mx-auto mb-3">
            <Sparkles size={24} />
          </div>
          <h3 className="h6 fw-bold text-main mb-1">Enter your topic to generate high-impact hooks</h3>
          <p className="text-muted small mb-0" style={{ maxWidth: '440px', margin: '0 auto' }}>
            We'll produce tailored opening lines categorized across Questions, Curiosity, Problems, Benefits, Contrarian takes, and Stories.
          </p>
        </div>
      )}
    </div>
  );
}
