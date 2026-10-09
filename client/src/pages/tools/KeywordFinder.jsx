import React, { useState, useMemo } from 'react';
import { 
  Key, 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Filter, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  Info, 
  HelpCircle, 
  Layers, 
  Globe, 
  Languages, 
  CheckSquare, 
  Square,
  ArrowUpDown
} from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import PageSeo from '../../components/common/PageSeo';
import { validateClientSeed, findKeywordIdeas } from '../../services/keywordService';
import { useToast } from '../../context/ToastContext';

const SAMPLE_KEYWORDS = [
  'seo tools',
  'content marketing',
  'affiliate marketing',
  'email marketing',
  'web development'
];

const COUNTRIES = [
  { code: 'global', name: 'Global (Worldwide)' },
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'in', name: 'India' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' }
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' }
];

const TYPE_STYLES = {
  Question: {
    bg: 'var(--info-bg)',
    color: 'var(--info)',
    border: '1px solid var(--info-border)'
  },
  'Long-tail': {
    bg: 'var(--primary-light)',
    color: 'var(--primary)',
    border: '1px solid var(--border-subtle)'
  },
  Comparison: {
    bg: 'var(--warn-bg)',
    color: 'var(--warn-text)',
    border: '1px solid var(--warn-border)'
  },
  Commercial: {
    bg: 'rgba(139, 92, 246, 0.1)',
    color: '#8b5cf6',
    border: '1px solid rgba(139, 92, 246, 0.25)'
  },
  Related: {
    bg: 'var(--pass-bg)',
    color: 'var(--pass-text)',
    border: '1px solid var(--pass-border)'
  },
  Informational: {
    bg: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-main)'
  }
};

const INTENT_STYLES = {
  Informational: {
    bg: 'var(--info-bg)',
    color: 'var(--info)',
    border: '1px solid var(--info-border)'
  },
  Commercial: {
    bg: 'rgba(139, 92, 246, 0.1)',
    color: '#8b5cf6',
    border: '1px solid rgba(139, 92, 246, 0.25)'
  },
  Transactional: {
    bg: 'var(--pass-bg)',
    color: 'var(--pass-text)',
    border: '1px solid var(--pass-border)'
  },
  Navigational: {
    bg: 'var(--warn-bg)',
    color: 'var(--warn-text)',
    border: '1px solid var(--warn-border)'
  }
};

export default function KeywordFinder() {
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('global');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const [result, setResult] = useState(null);

  // Results Filtering & Management State
  const [selectedType, setSelectedType] = useState('All');
  const [selectedIntent, setSelectedIntent] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState(new Set());
  const [copiedKeyword, setCopiedKeyword] = useState(null);
  const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'length-asc' | 'length-desc' | 'alpha'

  const { showToast } = useToast();

  const handleClear = () => {
    setKeywordInput('');
    setValidationError('');
    setApiError('');
  };

  const handleSelectSample = (sample) => {
    setKeywordInput(sample);
    setValidationError('');
    setApiError('');
    executeSearch(sample);
  };

  const executeSearch = async (query) => {
    const error = validateClientSeed(query);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsLoading(true);
    setValidationError('');
    setApiError('');
    setSelectedKeywords(new Set());
    setSearchFilter('');
    setSelectedType('All');
    setSelectedIntent('All');

    try {
      const data = await findKeywordIdeas(query, {
        country: selectedCountry,
        language: selectedLanguage
      });
      setResult(data);
      showToast(`Generated ${data.total || data.ideas.length} keyword ideas!`);
    } catch (err) {
      setApiError(err.message || 'Failed to generate keyword ideas. Please try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    executeSearch(keywordInput);
  };

  // Filtered and Sorted Ideas
  const filteredIdeas = useMemo(() => {
    if (!result?.ideas) return [];

    let list = result.ideas.filter((item) => {
      const matchesType = selectedType === 'All' || item.type === selectedType;
      const matchesIntent = selectedIntent === 'All' || item.intent === selectedIntent;
      const matchesSearch = !searchFilter.trim() || item.keyword.toLowerCase().includes(searchFilter.toLowerCase().trim());
      return matchesType && matchesIntent && matchesSearch;
    });

    if (sortOrder === 'length-asc') {
      list = [...list].sort((a, b) => a.length - b.length || a.keyword.localeCompare(b.keyword));
    } else if (sortOrder === 'length-desc') {
      list = [...list].sort((a, b) => b.length - a.length || a.keyword.localeCompare(b.keyword));
    } else if (sortOrder === 'alpha') {
      list = [...list].sort((a, b) => a.keyword.localeCompare(b.keyword));
    }

    return list;
  }, [result, selectedType, selectedIntent, searchFilter, sortOrder]);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedKeywords.size === filteredIdeas.length && filteredIdeas.length > 0) {
      setSelectedKeywords(new Set());
    } else {
      setSelectedKeywords(new Set(filteredIdeas.map((i) => i.keyword)));
    }
  };

  const handleToggleSelectKeyword = (kw) => {
    const updated = new Set(selectedKeywords);
    if (updated.has(kw)) {
      updated.delete(kw);
    } else {
      updated.add(kw);
    }
    setSelectedKeywords(updated);
  };

  // Clipboard Handlers
  const handleCopySingle = async (kw) => {
    try {
      await navigator.clipboard.writeText(kw);
      setCopiedKeyword(kw);
      showToast('Copied keyword to clipboard!');
      setTimeout(() => setCopiedKeyword(null), 1800);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleCopyAll = async () => {
    if (filteredIdeas.length === 0) return;
    const text = filteredIdeas.map((i) => i.keyword).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${filteredIdeas.length} keywords to clipboard!`);
    } catch {
      showToast('Failed to copy keywords', 'error');
    }
  };

  const handleCopySelected = async () => {
    if (selectedKeywords.size === 0) return;
    const text = Array.from(selectedKeywords).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${selectedKeywords.size} selected keywords to clipboard!`);
    } catch {
      showToast('Failed to copy selected keywords', 'error');
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const dataToExport = selectedKeywords.size > 0
      ? filteredIdeas.filter((i) => selectedKeywords.has(i.keyword))
      : filteredIdeas;

    if (dataToExport.length === 0) return;

    const headers = ['Keyword', 'Type', 'Word Count', 'Intent'];
    const rows = dataToExport.map((i) => [
      `"${i.keyword.replace(/"/g, '""')}"`,
      `"${i.type}"`,
      i.length,
      `"${i.intent}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `keywords-${(result?.keyword || 'ideas').replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${dataToExport.length} keywords to CSV!`);
  };

  // Distinct types and intents in result for filter chips
  const availableTypes = useMemo(() => {
    if (!result?.ideas) return [];
    const set = new Set(result.ideas.map((i) => i.type));
    return ['All', ...Array.from(set)];
  }, [result]);

  const availableIntents = useMemo(() => {
    if (!result?.ideas) return [];
    const set = new Set(result.ideas.map((i) => i.intent));
    return ['All', ...Array.from(set)];
  }, [result]);

  // Statistics counters
  const stats = useMemo(() => {
    if (!result?.ideas) return null;
    return {
      total: result.ideas.length,
      questions: result.ideas.filter((i) => i.type === 'Question').length,
      longTail: result.ideas.filter((i) => i.type === 'Long-tail').length,
      commercial: result.ideas.filter((i) => i.intent === 'Commercial' || i.intent === 'Transactional').length
    };
  }, [result]);

  return (
    <div className="container py-5" style={{ maxWidth: '980px' }}>
      <PageSeo
        title="Free Keyword Ideas & Suggestion Tool"
        description="Generate long-tail keyword ideas, search intent classifications, questions, and commercial variations for SEO content strategy."
        canonical="/tools/keyword-finder"
      />
      <ToolHeader
        title="Keyword Finder"
        description="Discover relevant related, long-tail, and question keyword ideas from any seed topic."
        category="SEO Tools"
        icon={Key}
        badgeText="Keyword Research"
      />

      {/* Input Card */}
      <div className="analyzer-card mb-4">
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="seed-keyword-input" className="form-label fw-bold text-main mb-2">
              Enter a seed keyword:
            </label>

            <div className="url-input-group">
              <Key className="url-input-icon" size={20} />

              <input
                type="text"
                id="seed-keyword-input"
                className="url-input-field"
                placeholder="e.g. seo tools, content marketing, web development"
                value={keywordInput}
                onChange={(e) => {
                  setKeywordInput(e.target.value);
                  if (validationError) setValidationError('');
                  if (apiError) setApiError('');
                }}
                disabled={isLoading}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
              />

              {keywordInput && !isLoading && (
                <button
                  type="button"
                  className="btn btn-link p-1 text-muted me-2"
                  onClick={handleClear}
                  title="Clear input"
                  aria-label="Clear input"
                >
                  <XCircle size={18} />
                </button>
              )}

              <button
                type="submit"
                id="find-keywords-submit-btn"
                className="btn-analyze d-inline-flex align-items-center justify-content-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Find Keywords</span>
                  </>
                )}
              </button>
            </div>

            {validationError && (
              <div className="text-danger small mt-2 d-flex align-items-center gap-1">
                <AlertTriangle size={14} />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Optional Country & Language Selectors */}
          <div className="row g-3 pt-2 border-top">
            <div className="col-12 col-sm-6">
              <label htmlFor="country-selector" className="form-label small text-muted d-flex align-items-center gap-1 mb-1">
                <Globe size={14} />
                <span>Target Country (Optional):</span>
              </label>
              <select
                id="country-selector"
                className="form-select form-select-sm"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                disabled={isLoading}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6">
              <label htmlFor="language-selector" className="form-label small text-muted d-flex align-items-center gap-1 mb-1">
                <Languages size={14} />
                <span>Target Language (Optional):</span>
              </label>
              <select
                id="language-selector"
                className="form-select form-select-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isLoading}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Seed Samples */}
          <div className="d-flex align-items-center flex-wrap gap-2 pt-3 mt-2 border-top">
            <span className="small text-muted fw-semibold">Try examples:</span>
            {SAMPLE_KEYWORDS.map((sample) => (
              <button
                key={sample}
                type="button"
                className="btn btn-outline-secondary btn-sm py-0 px-2 rounded-pill font-monospace"
                style={{ fontSize: '0.78rem' }}
                onClick={() => handleSelectSample(sample)}
                disabled={isLoading}
              >
                {sample}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* API / Network Error Banner */}
      {apiError && (
        <div className="alert alert-danger d-flex align-items-start gap-3 p-3 rounded-4 mb-4 border" role="alert">
          <AlertTriangle size={22} className="text-danger flex-shrink-0 mt-1" />
          <div className="flex-grow-1">
            <div className="fw-bold mb-1">Unable to Generate Keywords</div>
            <div className="small text-secondary mb-2">{apiError}</div>
            <div className="small text-muted">
              <strong>Tip:</strong> Ensure your seed keyword contains valid words (e.g. <code>seo tools</code>). Please verify server connectivity.
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="keyword-results-section mb-5">
          {/* Honest Metric Notice Box */}
          <div className="p-3 p-md-4 rounded-4 border mb-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)' }}>
            <div className="d-flex align-items-start gap-3">
              <div className="brand-icon flex-shrink-0 mt-1" aria-hidden="true" style={{ width: '36px', height: '36px' }}>
                <Info size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="h6 fw-bold text-main mb-1">Honest Keyword Data Notice</h2>
                <p className="text-secondary small mb-0">
                  {result.notice || 'Keyword ideas are generated from your seed keyword. Search volume, CPC, and competition data are not included in this free version.'}
                </p>
              </div>
            </div>
          </div>

          {/* Overview Stats Cards */}
          {stats && (
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">Total Ideas</div>
                  <div className="h3 fw-bold text-main m-0">{stats.total}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">Questions</div>
                  <div className="h3 fw-bold text-info m-0">{stats.questions}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">Long-Tail Phrases</div>
                  <div className="h3 fw-bold text-primary m-0">{stats.longTail}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">High Intent</div>
                  <div className="h3 fw-bold m-0" style={{ color: '#8b5cf6' }}>{stats.commercial}</div>
                </div>
              </div>
            </div>
          )}

          {/* Table Control Bar: Filters, Search, Actions */}
          <div className="card p-3 p-md-4 rounded-4 border mb-3" style={{ background: 'var(--bg-card)' }}>
            <div className="d-flex flex-column gap-3">
              {/* Top row: search & export buttons */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: '220px', maxWidth: '420px' }}>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-transparent border-end-0">
                      <Search size={14} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-sm border-start-0"
                      placeholder="Filter generated keywords..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                    {searchFilter && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSearchFilter('')}
                        title="Clear filter"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
                  {selectedKeywords.size > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                      onClick={handleCopySelected}
                    >
                      <Copy size={14} />
                      <span>Copy Selected ({selectedKeywords.size})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                    onClick={handleCopyAll}
                    disabled={filteredIdeas.length === 0}
                  >
                    <Copy size={14} />
                    <span>Copy All</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                    onClick={handleExportCsv}
                    disabled={filteredIdeas.length === 0}
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Type Filter Chips */}
              <div className="d-flex align-items-center flex-wrap gap-2 pt-2 border-top">
                <span className="small text-muted fw-semibold me-1">Type:</span>
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`btn btn-sm py-1 px-2 rounded-pill ${selectedType === type ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Intent Filter Chips */}
              <div className="d-flex align-items-center flex-wrap gap-2">
                <span className="small text-muted fw-semibold me-1">Intent:</span>
                {availableIntents.map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    className={`btn btn-sm py-1 px-2 rounded-pill ${selectedIntent === intent ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => setSelectedIntent(intent)}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keyword Ideas Table */}
          <div className="card rounded-4 border overflow-hidden mb-4" style={{ background: 'var(--bg-card)' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" id="keyword-ideas-table">
                <thead className="table-light border-bottom">
                  <tr>
                    <th scope="col" style={{ width: '40px' }} className="text-center">
                      <button
                        type="button"
                        className="btn btn-link p-0 text-muted"
                        onClick={handleToggleSelectAll}
                        title={selectedKeywords.size === filteredIdeas.length ? 'Deselect all' : 'Select all'}
                        aria-label="Toggle all selections"
                      >
                        {selectedKeywords.size === filteredIdeas.length && filteredIdeas.length > 0 ? (
                          <CheckSquare size={16} className="text-primary" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th scope="col" style={{ width: '50px' }} className="text-muted small">#</th>
                    <th scope="col" className="fw-semibold text-main">
                      <div className="d-flex align-items-center gap-1 cursor-pointer" onClick={() => setSortOrder(sortOrder === 'alpha' ? 'default' : 'alpha')} style={{ cursor: 'pointer' }}>
                        <span>Keyword</span>
                        <ArrowUpDown size={12} className="text-muted" />
                      </div>
                    </th>
                    <th scope="col" className="fw-semibold text-main" style={{ width: '130px' }}>Type</th>
                    <th scope="col" className="fw-semibold text-main" style={{ width: '110px' }}>
                      <div className="d-flex align-items-center gap-1" onClick={() => setSortOrder(sortOrder === 'length-desc' ? 'length-asc' : 'length-desc')} style={{ cursor: 'pointer' }}>
                        <span>Length</span>
                        <ArrowUpDown size={12} className="text-muted" />
                      </div>
                    </th>
                    <th scope="col" className="fw-semibold text-main" style={{ width: '140px' }}>Intent</th>
                    <th scope="col" style={{ width: '60px' }} className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdeas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-muted">
                        No keyword ideas match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredIdeas.map((idea, idx) => {
                      const isSelected = selectedKeywords.has(idea.keyword);
                      const typeStyle = TYPE_STYLES[idea.type] || TYPE_STYLES.Informational;
                      const intentStyle = INTENT_STYLES[idea.intent] || INTENT_STYLES.Informational;
                      const isCopied = copiedKeyword === idea.keyword;

                      return (
                        <tr key={idea.keyword} className={isSelected ? 'table-active' : ''}>
                          {/* Checkbox */}
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-link p-0 text-muted"
                              onClick={() => handleToggleSelectKeyword(idea.keyword)}
                              aria-label={`Select ${idea.keyword}`}
                            >
                              {isSelected ? (
                                <CheckSquare size={16} className="text-primary" />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                          </td>

                          {/* Index */}
                          <td className="text-muted small font-monospace">{idx + 1}</td>

                          {/* Keyword */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-semibold text-main font-monospace" style={{ fontSize: '0.92rem' }}>
                                {idea.keyword}
                              </span>
                            </div>
                          </td>

                          {/* Type */}
                          <td>
                            <span
                              className="badge rounded-pill fw-semibold px-2 py-1"
                              style={{
                                backgroundColor: typeStyle.bg,
                                color: typeStyle.color,
                                border: typeStyle.border,
                                fontSize: '0.74rem'
                              }}
                            >
                              {idea.type}
                            </span>
                          </td>

                          {/* Length */}
                          <td>
                            <span className="small text-muted font-monospace">
                              {idea.length} {idea.length === 1 ? 'word' : 'words'}
                            </span>
                          </td>

                          {/* Intent */}
                          <td>
                            <span
                              className="badge rounded-pill fw-semibold px-2 py-1"
                              style={{
                                backgroundColor: intentStyle.bg,
                                color: intentStyle.color,
                                border: intentStyle.border,
                                fontSize: '0.74rem'
                              }}
                            >
                              {idea.intent}
                            </span>
                          </td>

                          {/* Copy Action */}
                          <td className="text-end pe-3">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm p-1 rounded"
                              onClick={() => handleCopySingle(idea.keyword)}
                              title="Copy keyword"
                              aria-label={`Copy ${idea.keyword}`}
                            >
                              {isCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-3 border-top d-flex align-items-center justify-content-between flex-wrap gap-2 small text-muted">
              <div>
                Showing <strong>{filteredIdeas.length}</strong> of <strong>{result.ideas.length}</strong> generated ideas
                {selectedKeywords.size > 0 && (
                  <span className="ms-2 badge bg-primary text-white">
                    {selectedKeywords.size} selected
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-3">
                <span>Seed: <strong className="text-main font-monospace">{result.keyword}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Intent & Keyword Guide */}
      <div className="card p-4 rounded-4 border mt-4" style={{ background: 'var(--bg-card)' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <HelpCircle size={18} className="text-primary" />
          <h3 className="h6 fw-bold text-main m-0">Understanding Search Intent & Keyword Types</h3>
        </div>

        <div className="row g-3 small">
          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
              <div className="fw-bold text-main mb-1">Search Intents</div>
              <ul className="mb-0 ps-3 text-secondary">
                <li><strong className="text-info">Informational:</strong> Searchers seeking knowledge, answers, or tutorials (e.g. <em>how to use seo tools</em>).</li>
                <li><strong style={{ color: '#8b5cf6' }}>Commercial:</strong> Searchers comparing solutions or researching options before buying (e.g. <em>best seo tools for small business</em>).</li>
                <li><strong className="text-success">Transactional:</strong> Searchers ready to purchase, hire, or download (e.g. <em>buy seo tools discount</em>).</li>
                <li><strong className="text-warning">Navigational:</strong> Searchers looking for a specific site or login destination (e.g. <em>seo tools login</em>).</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
              <div className="fw-bold text-main mb-1">How to Use Long-Tail Keywords</div>
              <p className="text-secondary mb-2">
                Long-tail phrases contain 3 or more words and represent highly specific user queries. While they may have lower individual search volume than generic head terms, they have:
              </p>
              <ul className="mb-0 ps-3 text-secondary">
                <li>Significantly lower competition and faster ranking potential.</li>
                <li>Higher conversion rates because user intent is crystal clear.</li>
                <li>Ideal foundations for blog posts, FAQs, and product landing pages.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
