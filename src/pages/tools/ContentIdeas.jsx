import React, { useState } from 'react';
import { Lightbulb, Copy, RotateCw, XCircle, Check, Info } from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import PageSeo from '../../components/common/PageSeo';
import { generateContentIdeas, CONTENT_TYPES } from '../../data/contentIdeaTemplates';
import { useToast } from '../../context/ToastContext';

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'Facebook'];
const SAMPLE_TOPICS = ['SEO', 'React', 'Freelancing', 'E-commerce', 'Productivity', 'Personal Branding'];

export default function ContentIdeas() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [contentType, setContentType] = useState('All');
  const [cycleOffset, setCycleOffset] = useState(0);
  const [ideas, setIdeas] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { showToast } = useToast();

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!topic || !topic.trim()) {
      setValidationError('Please enter a topic to generate content ideas.');
      return;
    }
    setValidationError('');
    const generated = generateContentIdeas({ topic, platform, contentType, cycleOffset });
    setIdeas(generated);
    setHasGenerated(true);
  };

  const handleRegenerate = () => {
    const nextOffset = cycleOffset + 1;
    setCycleOffset(nextOffset);
    const generated = generateContentIdeas({ topic, platform, contentType, cycleOffset: nextOffset });
    setIdeas(generated);
    showToast('Refreshed content ideas');
  };

  const handleCopySingle = async (idea) => {
    try {
      await navigator.clipboard.writeText(idea.title);
      setCopiedId(idea.id);
      showToast('Copied content idea to clipboard!');
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleCopyAll = async () => {
    if (ideas.length === 0) return;
    const text = ideas.map((i, idx) => `${idx + 1}. [${i.contentType}] ${i.title}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${ideas.length} content ideas to clipboard!`);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleClear = () => {
    setTopic('');
    setIdeas([]);
    setHasGenerated(false);
    setValidationError('');
  };

  const handleSampleClick = (sample) => {
    setTopic(sample);
    setValidationError('');
    const generated = generateContentIdeas({ topic: sample, platform, contentType, cycleOffset });
    setIdeas(generated);
    setHasGenerated(true);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '920px' }}>
      <PageSeo
        title="Free Content Ideas Generator for Social Media & Blog"
        description="Generate content ideas, post formats, and topic angles for Instagram, TikTok, LinkedIn, and YouTube. Free, instant, no account needed."
        canonical="/tools/content-ideas"
      />
      <ToolHeader
        title="Content Ideas Generator"
        description="Generate content ideas from your topic and platform across tutorials, checklists, and case studies."
        category="Social Media"
        icon={Lightbulb}
      />

      {/* Input Card */}
      <div className="analyzer-card mb-4">
        <form onSubmit={handleGenerate} noValidate>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="content-topic-input" className="form-label small fw-bold text-main">
                Content Topic <span className="text-danger">*</span>
              </label>
              <input
                id="content-topic-input"
                type="text"
                className="form-control"
                placeholder="e.g. SEO, web design, small business growth"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (validationError) setValidationError('');
                }}
              />
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="content-platform-select" className="form-label small fw-bold text-main">
                Platform
              </label>
              <select
                id="content-platform-select"
                className="form-select"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="content-type-select" className="form-label small fw-bold text-main">
                Format / Type
              </label>
              <select
                id="content-type-select"
                className="form-select"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="All">All Formats</option>
                {CONTENT_TYPES.map((t) => (
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

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2">
            <div className="quick-samples my-0">
              <span className="text-muted small">Samples:</span>
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
                id="generate-ideas-btn"
                className="btn btn-analyze"
              >
                <Lightbulb size={16} />
                <span>Generate Ideas</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {hasGenerated && ideas.length > 0 && (
        <div className="report-header-card p-4 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3 border-bottom mb-3">
            <div>
              <h3 className="h6 fw-bold mb-1 text-main">Content Ideas ({ideas.length})</h3>
              <p className="text-muted small mb-0">Platform: <strong>{platform}</strong> • Topic: <strong>{topic}</strong></p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleRegenerate}
              >
                <RotateCw size={14} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleCopyAll}
              >
                <Copy size={14} />
                <span>Copy All ({ideas.length})</span>
              </button>
            </div>
          </div>

          <div className="d-flex flex-column gap-3 mb-3">
            {ideas.map((idea) => {
              const isCopied = copiedId === idea.id;
              return (
                <div key={idea.id} className="p-3 rounded-3 border d-flex align-items-center justify-content-between gap-3 hover-card-surface" style={{ backgroundColor: 'var(--bg-app)' }}>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="check-category-pill">{idea.contentType}</span>
                      <span className="small text-muted">{idea.platform}</span>
                    </div>
                    <p className="mb-0 text-main fw-semibold" style={{ fontSize: '0.94rem' }}>
                      {idea.title}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm flex-shrink-0 d-inline-flex align-items-center gap-1"
                    onClick={() => handleCopySingle(idea)}
                    title="Copy idea title"
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
              Ideas are designed to jumpstart brainstorming. Adapt the angle to fit your specific audience, brand voice, and recent industry news.
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasGenerated && (
        <div className="text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="brand-icon mx-auto mb-3">
            <Lightbulb size={24} />
          </div>
          <h3 className="h6 fw-bold text-main mb-1">Enter a topic to generate content ideas</h3>
          <p className="text-muted small mb-0" style={{ maxWidth: '440px', margin: '0 auto' }}>
            Get actionable suggestions across tutorials, checklists, case studies, beginner mistakes, and comparison angles.
          </p>
        </div>
      )}

      {/* Educational Guide: Content Ideation & Pillar-Cluster Method */}
      <div className="card p-4 rounded-4 border mt-4" style={{ background: 'var(--bg-card)' }}>
        <h3 className="h6 fw-bold text-main mb-3">The Content Pillar &amp; Topic Clustering Method</h3>
        <div className="row g-3 small">
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
              <div className="fw-bold text-main mb-1">Repurposing Pillar Topics</div>
              <p className="text-secondary mb-0">
                A single pillar subject can branch into five distinct formats: beginner tutorials, common misconceptions, comparison breakdowns, case studies, and actionable checklists. This multiplies output while reinforcing thematic authority.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
              <div className="fw-bold text-main mb-1">Matching Format to Search Intent</div>
              <p className="text-secondary mb-0">
                Align format with audience motivation: 'How-to' tutorials target search discovery and bookmarking; thought-provoking contrarian pieces spark discussion in social feeds; comparison lists convert high-intent evaluators.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
              <div className="fw-bold text-main mb-1">Testing Content Angles</div>
              <p className="text-secondary mb-0">
                Test the same core premise with contrasting hooks and visual presentations. Tracking which angle generates higher initial retention highlights where your market has unresolved curiosity or pain points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
