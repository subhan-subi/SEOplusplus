import React, { useState } from 'react';
import { Hash, Copy, Check, RotateCw, XCircle, Sparkles, Info } from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import { generateHashtags, HASHTAG_CATEGORIES } from '../../data/hashtagData';
import { useToast } from '../../context/ToastContext';

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'YouTube'];
const SAMPLE_TOPICS = ['web development', 'digital marketing', 'freelancing', 'fitness', 'travel', 'productivity'];

export default function HashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [niche, setNiche] = useState('');
  const [count, setCount] = useState(15);
  const [results, setResults] = useState([]);
  const [copiedTag, setCopiedTag] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { showToast } = useToast();

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!topic || !topic.trim()) {
      setValidationError('Please enter a topic or keyword to generate hashtags.');
      return;
    }
    setValidationError('');
    const tags = generateHashtags({ topic, platform, niche, count });
    setResults(tags);
    setHasGenerated(true);
  };

  const handleCopyAll = async () => {
    if (results.length === 0) return;
    const text = results.join(' ');
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${results.length} hashtags to clipboard!`);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleCopySingle = async (tag) => {
    try {
      await navigator.clipboard.writeText(tag);
      setCopiedTag(tag);
      showToast(`Copied ${tag}!`);
      setTimeout(() => setCopiedTag(null), 1500);
    } catch {
      showToast('Failed to copy tag', 'error');
    }
  };

  const handleClear = () => {
    setTopic('');
    setNiche('');
    setResults([]);
    setHasGenerated(false);
    setValidationError('');
  };

  const handleSampleClick = (sample) => {
    setTopic(sample);
    setValidationError('');
    const tags = generateHashtags({ topic: sample, platform, niche, count });
    setResults(tags);
    setHasGenerated(true);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '920px' }}>
      <ToolHeader
        title="Hashtag Generator"
        description="Generate relevant hashtags from your topic or keywords."
        category="Social Media"
        icon={Hash}
      />

      {/* Input Card */}
      <div className="analyzer-card mb-4">
        <form onSubmit={handleGenerate} noValidate>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="hashtag-topic-input" className="form-label small fw-bold text-main">
                Topic or Keyword <span className="text-danger">*</span>
              </label>
              <input
                id="hashtag-topic-input"
                type="text"
                className="form-control"
                placeholder="e.g. web development, fitness, marketing"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (validationError) setValidationError('');
                }}
              />
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label htmlFor="hashtag-platform-select" className="form-label small fw-bold text-main">
                Target Platform
              </label>
              <select
                id="hashtag-platform-select"
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
              <label htmlFor="hashtag-count-select" className="form-label small fw-bold text-main">
                Number of Tags
              </label>
              <select
                id="hashtag-count-select"
                className="form-select"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                <option value={5}>5 hashtags</option>
                <option value={10}>10 hashtags</option>
                <option value={15}>15 hashtags</option>
                <option value={20}>20 hashtags</option>
                <option value={30}>30 hashtags</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="hashtag-niche-input" className="form-label small fw-bold text-main">
              Optional Niche or Focus Area
            </label>
            <input
              id="hashtag-niche-input"
              type="text"
              className="form-control"
              placeholder="e.g. beginners, ReactJS, solopreneurs"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
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
                id="generate-hashtags-btn"
                className="btn btn-analyze"
              >
                <Sparkles size={16} />
                <span>Generate Hashtags</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {hasGenerated && results.length > 0 && (
        <div className="report-header-card p-4 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3 border-bottom mb-3">
            <div>
              <h3 className="h6 fw-bold mb-1 text-main">Generated Hashtags ({results.length})</h3>
              <p className="text-muted small mb-0">Platform: <strong>{platform}</strong> • Topic: <strong>{topic}</strong></p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleGenerate}
                title="Regenerate variations"
              >
                <RotateCw size={14} />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                id="copy-all-hashtags-btn"
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleCopyAll}
              >
                <Copy size={14} />
                <span>Copy All ({results.length})</span>
              </button>
            </div>
          </div>

          {/* Hashtag Badges Container */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {results.map((tag) => {
              const isCopied = copiedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  className={`hashtag-pill ${isCopied ? 'copied' : ''}`}
                  onClick={() => handleCopySingle(tag)}
                  title="Click to copy individual hashtag"
                >
                  <span>{tag}</span>
                  {isCopied ? <Check size={12} className="text-success" /> : <Copy size={12} className="opacity-50" />}
                </button>
              );
            })}
          </div>

          <div className="audit-disclaimer-box mt-3 mb-0">
            <Info size={18} className="text-primary flex-shrink-0" />
            <div className="small text-muted">
              Hashtags are generated deterministically based on topic keywords and platform style guidelines. Reach and discovery vary by audience and content quality; hashtags do not guarantee viral distribution or engagement.
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasGenerated && (
        <div className="text-center py-5 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="brand-icon mx-auto mb-3">
            <Hash size={24} />
          </div>
          <h3 className="h6 fw-bold text-main mb-1">Enter a topic to generate relevant hashtags</h3>
          <p className="text-muted small mb-0" style={{ maxWidth: '420px', margin: '0 auto' }}>
            Choose your target social platform and enter any topic to produce clean, curated hashtags ready for your post.
          </p>
        </div>
      )}
    </div>
  );
}
