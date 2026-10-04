import React, { useState, useMemo, useEffect } from 'react';
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
  Globe, 
  Languages, 
  CheckSquare, 
  Square,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  DollarSign
} from 'lucide-react';
import ToolHeader from '../../components/common/ToolHeader';
import { validateClientSeed, findKeywordIdeas, checkGoogleAdsStatus } from '../../services/keywordService';
import { useToast } from '../../context/ToastContext';

const SAMPLE_KEYWORDS = [
  'seo tools',
  'content marketing',
  'affiliate marketing',
  'email marketing',
  'web development'
];

const COUNTRIES = [
  { code: 'global', name: 'Global (Worldwide)', currency: '$' },
  { code: 'us', name: 'United States ($ USD)', currency: '$' },
  { code: 'uk', name: 'United Kingdom (£ GBP)', currency: '£' },
  { code: 'ca', name: 'Canada ($ CAD)', currency: 'CA$' },
  { code: 'au', name: 'Australia ($ AUD)', currency: 'A$' },
  { code: 'in', name: 'India (₹ INR)', currency: '₹' },
  { code: 'de', name: 'Germany (€ EUR)', currency: '€' },
  { code: 'fr', name: 'France (€ EUR)', currency: '€' }
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' }
];

const COMPETITION_STYLES = {
  LOW: {
    bg: 'var(--pass-bg)',
    color: 'var(--pass-text)',
    border: '1px solid var(--pass-border)',
    label: 'Low'
  },
  MEDIUM: {
    bg: 'var(--warn-bg)',
    color: 'var(--warn-text)',
    border: '1px solid var(--warn-border)',
    label: 'Medium'
  },
  HIGH: {
    bg: 'var(--fail-bg)',
    color: 'var(--fail-text)',
    border: '1px solid var(--fail-border)',
    label: 'High'
  },
  UNSPECIFIED: {
    bg: 'var(--bg-subtle)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-main)',
    label: 'Unspecified'
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
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState(null);
  const [result, setResult] = useState(null);

  // Configuration check state
  const [googleAdsStatus, setGoogleAdsStatus] = useState(null);

  // Table Filters & Sort State
  const [selectedCompetition, setSelectedCompetition] = useState('All');
  const [selectedIntent, setSelectedIntent] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState(new Set());
  const [copiedKeyword, setCopiedKeyword] = useState(null);
  const [sortField, setSortField] = useState('volume'); // 'volume' | 'cpc' | 'comp' | 'keyword'
  const [sortAsc, setSortAsc] = useState(false);

  const { showToast } = useToast();

  // Check Google Ads configuration status on mount
  useEffect(() => {
    checkGoogleAdsStatus().then(status => {
      setGoogleAdsStatus(status);
    }).catch(() => {});
  }, []);

  const handleClear = () => {
    setKeywordInput('');
    setValidationError('');
    setApiError(null);
  };

  const handleSelectSample = (sample) => {
    setKeywordInput(sample);
    setValidationError('');
    setApiError(null);
    executeSearch(sample);
  };

  const executeSearch = async (query, mode = null) => {
    const error = validateClientSeed(query);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsLoading(true);
    setValidationError('');
    setApiError(null);
    setSelectedKeywords(new Set());
    setSearchFilter('');
    setSelectedCompetition('All');
    setSelectedIntent('All');

    try {
      const data = await findKeywordIdeas(query, {
        country: selectedCountry,
        language: selectedLanguage,
        mode: mode || undefined
      });
      setResult(data);
      showToast(`Loaded ${data.total || data.ideas.length} keyword metrics!`);
    } catch (err) {
      setApiError({
        message: err.message || 'Failed to retrieve keyword ideas from Google Ads API.',
        requiresAuth: err.requiresAuth || false,
        authUrl: err.authUrl || '/api/google-ads/auth',
        code: err.code
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    executeSearch(keywordInput);
  };

  // Currency symbol based on selected country
  const currentCurrency = useMemo(() => {
    const found = COUNTRIES.find(c => c.code === selectedCountry);
    return found ? found.currency : '$';
  }, [selectedCountry]);

  // Formatted search volume display helper
  const formatSearchVolume = (num) => {
    if (num == null) return 'N/A';
    return Number(num).toLocaleString();
  };

  // Formatted bid range display helper
  const formatBidRange = (low, high) => {
    if (low == null && high == null) return 'N/A';
    if (low != null && high != null) {
      return `${currentCurrency}${low.toFixed(2)} - ${currentCurrency}${high.toFixed(2)}`;
    }
    if (low != null) return `${currentCurrency}${low.toFixed(2)}`;
    return `${currentCurrency}${high.toFixed(2)}`;
  };

  // Filtered and Sorted Ideas
  const filteredIdeas = useMemo(() => {
    if (!result?.ideas) return [];

    let list = result.ideas.filter((item) => {
      const matchesCompetition = selectedCompetition === 'All' || item.competition === selectedCompetition;
      const matchesIntent = selectedIntent === 'All' || item.intent === selectedIntent;
      const matchesSearch = !searchFilter.trim() || item.keyword.toLowerCase().includes(searchFilter.toLowerCase().trim());
      return matchesCompetition && matchesIntent && matchesSearch;
    });

    list = [...list].sort((a, b) => {
      let valA, valB;
      if (sortField === 'volume') {
        valA = a.averageMonthlySearches != null ? a.averageMonthlySearches : -1;
        valB = b.averageMonthlySearches != null ? b.averageMonthlySearches : -1;
      } else if (sortField === 'cpc') {
        valA = a.lowTopOfPageBid != null ? a.lowTopOfPageBid : (a.highTopOfPageBid != null ? a.highTopOfPageBid : -1);
        valB = b.lowTopOfPageBid != null ? b.lowTopOfPageBid : (b.highTopOfPageBid != null ? b.highTopOfPageBid : -1);
      } else if (sortField === 'comp') {
        valA = a.competitionIndex != null ? a.competitionIndex : -1;
        valB = b.competitionIndex != null ? b.competitionIndex : -1;
      } else {
        valA = a.keyword.toLowerCase();
        valB = b.keyword.toLowerCase();
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (valA === valB) return 0;
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    return list;
  }, [result, selectedCompetition, selectedIntent, searchFilter, sortField, sortAsc]);

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for metrics
    }
  };

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

    const headers = ['Keyword', 'Monthly Searches', 'Competition', 'Competition Index (0-100)', 'Low Top of Page Bid', 'High Top of Page Bid', 'Search Intent'];
    const rows = dataToExport.map((i) => [
      `"${i.keyword.replace(/"/g, '""')}"`,
      i.averageMonthlySearches != null ? i.averageMonthlySearches : 'N/A',
      `"${i.competition || 'UNSPECIFIED'}"`,
      i.competitionIndex != null ? i.competitionIndex : 'N/A',
      i.lowTopOfPageBid != null ? `${currentCurrency}${i.lowTopOfPageBid.toFixed(2)}` : 'N/A',
      i.highTopOfPageBid != null ? `${currentCurrency}${i.highTopOfPageBid.toFixed(2)}` : 'N/A',
      `"${i.intent}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `google-ads-keywords-${(result?.keyword || 'ideas').replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${dataToExport.length} keywords to CSV!`);
  };

  // Statistics counters
  const stats = useMemo(() => {
    if (!result?.ideas || result.ideas.length === 0) return null;
    const volumes = result.ideas.filter(i => i.averageMonthlySearches != null).map(i => i.averageMonthlySearches);
    const avgVolume = volumes.length > 0 ? Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length) : null;
    const lowComp = result.ideas.filter(i => i.competition === 'LOW').length;
    const commercialCount = result.ideas.filter(i => i.intent === 'Commercial' || i.intent === 'Transactional').length;

    return {
      total: result.ideas.length,
      avgVolume,
      lowComp,
      commercialCount
    };
  }, [result]);

  return (
    <div className="container py-5" style={{ maxWidth: '1020px' }}>
      <ToolHeader
        title="Keyword Finder"
        description="Discover real search volume, competition, and top-of-page CPC bids directly from the official Google Ads API."
        category="SEO Tools"
        icon={Key}
        badgeText="Google Ads API"
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
                  if (apiError) setApiError(null);
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
                    <span>Querying Google Ads...</span>
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
                <span>Target Location / Country:</span>
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
                <span>Target Language:</span>
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

      {/* Google Ads Authorization Required Banner */}
      {apiError && apiError.requiresAuth && (
        <div className="alert alert-warning p-4 rounded-4 mb-4 border d-flex align-items-start gap-3 shadow-sm" role="alert">
          <Key size={26} className="text-warning flex-shrink-0 mt-1" />
          <div className="flex-grow-1">
            <div className="fw-bold h6 mb-1 text-main">Google Ads API Authorization Required</div>
            <p className="small text-secondary mb-3">
              To fetch live Google search volumes, competition indices, and top-of-page CPC bids, your Google Ads account needs to be authorized with offline access.
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <a
                href={apiError.authUrl || '/api/google-ads/auth'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold"
              >
                <Key size={14} />
                <span>Authorize Google Ads Account</span>
                <ExternalLink size={13} className="ms-1" />
              </a>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 py-2"
                onClick={() => executeSearch(keywordInput || 'seo tools', 'ideas')}
              >
                <span>View Rule-Based Ideas (No Volume)</span>
              </button>
            </div>
            <div className="small text-muted mt-2">
              <strong>Redirect URI:</strong> <code>{window.location.origin}/api/google-ads/callback</code>
            </div>
          </div>
        </div>
      )}

      {/* General API / Network Error Banner */}
      {apiError && !apiError.requiresAuth && (
        <div className="alert alert-danger d-flex align-items-start gap-3 p-3 rounded-4 mb-4 border" role="alert">
          <AlertTriangle size={22} className="text-danger flex-shrink-0 mt-1" />
          <div className="flex-grow-1">
            <div className="fw-bold mb-1">Could Not Retrieve Keyword Data</div>
            <div className="small text-secondary mb-2">{apiError.message}</div>
            <div className="small text-muted">
              <strong>Tip:</strong> Ensure your seed keyword contains valid words (e.g. <code>seo tools</code>). Please verify server connectivity and Google Ads API credentials.
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
                <ShieldCheck size={18} className="text-primary" />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                  <h2 className="h6 fw-bold text-main m-0">Live Google Ads API Metrics</h2>
                  <span className="badge-subtle-primary" style={{ fontSize: '0.72rem' }}>
                    {result.provider || 'Google Ads API'}
                  </span>
                </div>
                <p className="text-secondary small mb-0">
                  {result.disclaimer || 'Keyword metrics are provided by Google Ads API and may vary by location, language, and time.'}
                </p>
              </div>
            </div>
          </div>

          {/* Overview Stats Cards */}
          {stats && (
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">Total Keywords</div>
                  <div className="h3 fw-bold text-main m-0">{stats.total}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">Avg Search Volume</div>
                  <div className="h3 fw-bold text-primary m-0">
                    {stats.avgVolume != null ? stats.avgVolume.toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">Low Competition</div>
                  <div className="h3 fw-bold text-success m-0">{stats.lowComp}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-4 border text-center" style={{ background: 'var(--bg-card)' }}>
                  <div className="text-muted small mb-1">High Intent</div>
                  <div className="h3 fw-bold m-0" style={{ color: '#8b5cf6' }}>{stats.commercialCount}</div>
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

              {/* Competition Filter Chips */}
              <div className="d-flex align-items-center flex-wrap gap-2 pt-2 border-top">
                <span className="small text-muted fw-semibold me-1">Competition:</span>
                {['All', 'LOW', 'MEDIUM', 'HIGH'].map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    className={`btn btn-sm py-1 px-2 rounded-pill ${selectedCompetition === comp ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => setSelectedCompetition(comp)}
                  >
                    {comp === 'All' ? 'All Competition' : comp}
                  </button>
                ))}
              </div>

              {/* Intent Filter Chips */}
              <div className="d-flex align-items-center flex-wrap gap-2">
                <span className="small text-muted fw-semibold me-1">Intent:</span>
                {['All', 'Informational', 'Commercial', 'Transactional', 'Navigational'].map((intent) => (
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
                    <th scope="col" style={{ width: '45px' }} className="text-muted small">#</th>
                    <th scope="col" className="fw-semibold text-main">
                      <div className="d-flex align-items-center gap-1 cursor-pointer" onClick={() => handleSortToggle('keyword')} style={{ cursor: 'pointer' }}>
                        <span>Keyword</span>
                        <ArrowUpDown size={12} className="text-muted" />
                      </div>
                    </th>
                    <th scope="col" className="fw-semibold text-main" style={{ width: '150px' }}>
                      <div className="d-flex align-items-center gap-1 cursor-pointer" onClick={() => handleSortToggle('volume')} style={{ cursor: 'pointer' }}>
                        <span>Search Volume</span>
                        <ArrowUpDown size={12} className="text-muted" />
                      </div>
                    </th>
                    <th scope="col" className="fw-semibold text-main" style={{ width: '130px' }}>
                      <div className="d-flex align-items-center gap-1 cursor-pointer" onClick={() => handleSortToggle('comp')} style={{ cursor: 'pointer' }}>
                        <span>Competition</span>
                        <ArrowUpDown size={12} className="text-muted" />
                      </div>
                    </th>
                    <th scope="col" className="fw-semibold text-main" style={{ width: '150px' }}>
                      <div className="d-flex align-items-center gap-1 cursor-pointer" onClick={() => handleSortToggle('cpc')} style={{ cursor: 'pointer' }}>
                        <span>Top Bid (CPC)</span>
                        <ArrowUpDown size={12} className="text-muted" />
                      </div>
                    </th>
                    <th scope="col" className="fw-semibold text-main" style={{ width: '130px' }}>Intent</th>
                    <th scope="col" style={{ width: '50px' }} className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdeas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-5 text-muted">
                        No keyword ideas match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredIdeas.map((idea, idx) => {
                      const isSelected = selectedKeywords.has(idea.keyword);
                      const compStyle = COMPETITION_STYLES[idea.competition] || COMPETITION_STYLES.UNSPECIFIED;
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
                            <div className="fw-semibold text-main font-monospace" style={{ fontSize: '0.90rem' }}>
                              {idea.keyword}
                            </div>
                          </td>

                          {/* Search Volume */}
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <span className="fw-bold text-main">
                                {formatSearchVolume(idea.averageMonthlySearches)}
                              </span>
                              {idea.averageMonthlySearches != null && (
                                <span className="small text-muted" style={{ fontSize: '0.72rem' }}>/mo</span>
                              )}
                            </div>
                          </td>

                          {/* Competition */}
                          <td>
                            <div className="d-flex flex-column align-items-start gap-1">
                              <span
                                className="badge rounded-pill fw-semibold px-2 py-1"
                                style={{
                                  backgroundColor: compStyle.bg,
                                  color: compStyle.color,
                                  border: compStyle.border,
                                  fontSize: '0.72rem'
                                }}
                              >
                                {compStyle.label}
                              </span>
                              {idea.competitionIndex != null && (
                                <span className="small text-muted font-monospace" style={{ fontSize: '0.70rem' }}>
                                  Index: {idea.competitionIndex} / 100
                                </span>
                              )}
                            </div>
                          </td>

                          {/* CPC / Top Bid */}
                          <td>
                            <span className="font-monospace small fw-semibold text-main">
                              {formatBidRange(idea.lowTopOfPageBid, idea.highTopOfPageBid)}
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
                                fontSize: '0.72rem'
                              }}
                              title="Intent derived via SEO++ classification"
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
                Showing <strong>{filteredIdeas.length}</strong> of <strong>{result.ideas.length}</strong> keywords
                {selectedKeywords.size > 0 && (
                  <span className="ms-2 badge bg-primary text-white">
                    {selectedKeywords.size} selected
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-3">
                <span>Location: <strong>{result.country || 'Global'}</strong></span>
                <span>•</span>
                <span>Language: <strong>{result.language || 'English'}</strong></span>
              </div>
            </div>
          </div>

          {/* Educational Intent & Keyword Guide */}
          <div className="card p-4 rounded-4 border" style={{ background: 'var(--bg-card)' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <HelpCircle size={18} className="text-primary" />
              <h3 className="h6 fw-bold text-main m-0">Understanding Google Ads Keyword Metrics</h3>
            </div>

            <div className="row g-3 small">
              <div className="col-12 col-md-4">
                <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="fw-bold text-main mb-1 d-flex align-items-center gap-1">
                    <BarChart2 size={14} className="text-primary" />
                    <span>Average Monthly Searches</span>
                  </div>
                  <p className="text-secondary mb-0">
                    The average 12-month search volume for this exact term across Google Search in the selected location and language.
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="fw-bold text-main mb-1 d-flex align-items-center gap-1">
                    <TrendingUp size={14} className="text-warning" />
                    <span>Competition & Index</span>
                  </div>
                  <p className="text-secondary mb-0">
                    Competition measures advertiser bidding density (Low, Medium, High). The index (0-100) indicates precise slot competitiveness.
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="fw-bold text-main mb-1 d-flex align-items-center gap-1">
                    <DollarSign size={14} className="text-success" />
                    <span>Top-of-Page Bid (CPC)</span>
                  </div>
                  <p className="text-secondary mb-0">
                    Estimated cost-per-click range advertisers pay to show ads at the top of the Google Search results page for this keyword.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
