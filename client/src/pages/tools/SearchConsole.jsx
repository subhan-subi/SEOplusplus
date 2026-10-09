import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart2,
  MousePointerClick,
  Eye,
  TrendingUp,
  Search,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
} from 'lucide-react';
import {
  getGscStatus,
  startGoogleAuth,
  fetchGscProperties,
  selectGscProperty,
  fetchSearchPerformance,
  disconnectGsc,
} from '../../services/gscService';
import PageSeo from '../../components/common/PageSeo';

/* ── Helper utilities ─────────────────────────────────────────────────────── */
function fmt(n) {
  if (n == null) return '—';
  return n.toLocaleString();
}
function fmtPct(n) {
  if (n == null) return '—';
  return `${n}%`;
}
function fmtPos(n) {
  if (n == null) return '—';
  return n.toFixed(1);
}
function shortenUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname === '/' ? u.hostname : u.hostname + u.pathname;
    return path.length > 48 ? path.slice(0, 45) + '…' : path;
  } catch {
    return url;
  }
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function StatCard({ icon: Icon, label, value, colorVar, subtitle }) {
  return (
    <div className="gsc-stat-card">
      <div className="gsc-stat-icon" style={{ '--icon-color': `var(${colorVar})` }}>
        <Icon size={20} />
      </div>
      <div className="gsc-stat-value">{value}</div>
      <div className="gsc-stat-label">{label}</div>
      {subtitle && <div className="gsc-stat-subtitle">{subtitle}</div>}
    </div>
  );
}

function DataTable({ title, icon: Icon, rows, keyLabel, cols }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="gsc-data-table-wrap">
      <div className="gsc-table-header">
        <Icon size={16} />
        <span>{title}</span>
      </div>
      <div className="gsc-table-scroll">
        <table className="gsc-table">
          <thead>
            <tr>
              <th className="gsc-th-key">{keyLabel}</th>
              {cols.map((c) => (
                <th key={c.key} className="gsc-th-num">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="gsc-tr">
                <td className="gsc-td-key" title={row.key}>{shortenUrl(row.key)}</td>
                {cols.map((c) => (
                  <td key={c.key} className="gsc-td-num">{c.fmt(row[c.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── FAQ items ───────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    id: 'add-property',
    question: 'How do I add my website to Google Search Console?',
    answer: (
      <>
        Open Google Search Console, add your website as a property, and complete Google's ownership verification process. Once your property is verified and accessible from the Google account you connect to SEO++, return here and connect your account.{' '}
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noopener noreferrer"
          className="gsc-faq-link"
        >
          Open Google Search Console <ExternalLink size={13} className="ms-1" />
        </a>
      </>
    ),
  },
  {
    id: 'missing-property',
    question: "Why can't I see my website property?",
    answer: "SEO++ can only show Search Console properties that the Google account you connected has access to. Make sure you are using the correct Google account and that the website has been added and verified in Google Search Console. You can also use Refresh after making changes.",
  },
  {
    id: 'connect-gsc',
    question: 'How do I connect Google Search Console to SEO++?',
    answer: 'Click Sign in with Google, choose the Google account that has access to your Search Console property, review the requested read-only permission, and allow access. SEO++ will then load the properties available to that account.',
  },
  {
    id: 'data-access',
    question: 'What data does SEO++ access?',
    answer: 'SEO++ requests read-only Search Console access to retrieve your available properties and search performance metrics such as clicks, impressions, click-through rate, and average position. SEO++ does not request permission to modify your Search Console properties.',
  },
  {
    id: 'change-settings',
    question: 'Can SEO++ change my Search Console website or settings?',
    answer: 'No. SEO++ uses read-only Search Console access. It does not make changes, submissions, or deletions to your Search Console properties or sitemaps.',
  },
  {
    id: 'zero-data',
    question: 'Why does my Search Console dashboard show zero data?',
    answer: 'Search Console data may be unavailable when a property is new, has little or no search traffic, or Google has not accumulated enough data for the selected period. SEO++ currently displays the data returned by Google Search Console.',
  },
  {
    id: 'switch-website',
    question: 'How can I switch to another website?',
    answer: 'Use the Switch button in the dashboard to return to your available Search Console properties and select another property.',
  },
  {
    id: 'disconnect-gsc',
    question: 'How can I disconnect Google Search Console?',
    answer: (
      <>
        Click Disconnect on the Search Console dashboard. SEO++ will clear the active Search Console session from its backend. You can also review or revoke the application's Google account permission from your Google Account settings.{' '}
        <a
          href="https://myaccount.google.com/connections"
          target="_blank"
          rel="noopener noreferrer"
          className="gsc-faq-link"
        >
          Google Account Settings <ExternalLink size={13} className="ms-1" />
        </a>
      </>
    ),
  },
];

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function SearchConsolePage() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState({ connected: false, selectedSite: null });
  const [statusLoading, setStatusLoading] = useState(true);

  // Step: 'connect' | 'properties' | 'dashboard'
  const [step, setStep] = useState('connect');

  const [properties, setProperties] = useState([]);
  const [propLoading, setPropLoading] = useState(false);
  const [propError, setPropError] = useState(null);

  const [performance, setPerformance] = useState(null);
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState(null);

  const [disconnecting, setDisconnecting] = useState(false);
  const [pageError, setPageError] = useState(null);

  const [openFaq, setOpenFaq] = useState(null);

  /* ── Load status on mount / after OAuth callback ─── */
  const loadStatus = useCallback(async () => {
    setStatusLoading(true);
    const s = await getGscStatus();
    setStatus(s);

    if (s.connected && s.selectedSite) {
      setStep('dashboard');
      loadPerformance();
    } else if (s.connected) {
      setStep('properties');
      loadProperties();
    } else {
      setStep('connect');
    }
    setStatusLoading(false);
  }, []);

  useEffect(() => {
    // Handle OAuth callback query params
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');

    if (error) {
      const messages = {
        access_denied: 'You denied access to Google Search Console.',
        state_mismatch: 'Security check failed. Please try connecting again.',
        auth_failed: 'Google authentication failed. Please try again.',
        invalid_callback: 'Invalid OAuth callback. Please try again.',
      };
      setPageError(messages[error] || 'Authentication failed. Please try again.');
    } else if (connected) {
      setPageError(null);
    }

    loadStatus();
  }, [loadStatus]);

  /* ── Load properties ─── */
  const loadProperties = useCallback(async () => {
    setPropLoading(true);
    setPropError(null);
    try {
      const props = await fetchGscProperties();
      setProperties(props);
      if (props.length === 0) {
        setPropError('No Search Console properties found on this Google account. Add a property at search.google.com/search-console.');
      }
    } catch (err) {
      setPropError(err.message || 'Failed to load properties.');
    } finally {
      setPropLoading(false);
    }
  }, []);

  /* ── Load performance ─── */
  const loadPerformance = useCallback(async () => {
    setPerfLoading(true);
    setPerfError(null);
    try {
      const data = await fetchSearchPerformance(28);
      setPerformance(data);
    } catch (err) {
      setPerfError(err.message || 'Failed to load performance data.');
    } finally {
      setPerfLoading(false);
    }
  }, []);

  /* ── Property selection ─── */
  const handleSelectProperty = async (siteUrl) => {
    try {
      await selectGscProperty(siteUrl);
      setStatus((s) => ({ ...s, selectedSite: siteUrl }));
      setStep('dashboard');
      loadPerformance();
    } catch (err) {
      setPropError(err.message || 'Failed to select property.');
    }
  };

  /* ── Disconnect ─── */
  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await disconnectGsc();
      setStatus({ connected: false, selectedSite: null });
      setPerformance(null);
      setProperties([]);
      setStep('connect');
      setPageError(null);
    } catch {
      // Ignore
    } finally {
      setDisconnecting(false);
    }
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="gsc-page">
      <PageSeo
        title="Google Search Console Integration & Performance Analytics"
        description="Connect Google Search Console to monitor real organic clicks, impressions, average CTR, and keyword rankings directly inside SEO++."
        canonical="/tools/search-console"
      />
      <div className="container py-5">
        {/* Page Title */}
        <div className="gsc-page-header mb-4">
          <div className="gsc-title-row">
            <div className="gsc-google-badge">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <div>
              <h1 className="gsc-page-title">Google Search Console</h1>
              <p className="gsc-page-desc">Real search performance data layered on top of your SEO++ audit.</p>
            </div>
          </div>

          {/* Connected indicator */}
          {status.connected && (
            <div className="gsc-connected-badge">
              <CheckCircle2 size={14} />
              <span>Connected</span>
              {status.selectedSite && (
                <>
                  <span className="gsc-badge-sep">·</span>
                  <span className="gsc-badge-site">{shortenUrl(status.selectedSite)}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Global error banner */}
        {pageError && (
          <div className="gsc-alert-error mb-4" role="alert">
            <AlertTriangle size={16} />
            <span>{pageError}</span>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {statusLoading && (
          <div className="gsc-card gsc-center py-5">
            <Loader2 size={32} className="gsc-spinner" />
            <p className="text-muted mt-3 mb-0">Loading connection status…</p>
          </div>
        )}

        {/* ── STEP 1: Connect ── */}
        {!statusLoading && step === 'connect' && (
          <div className="gsc-connect-card">
            <div className="gsc-connect-illustration">
              <BarChart2 size={48} className="gsc-connect-icon" />
            </div>
            <h2 className="gsc-connect-title">Connect Google Search Console</h2>
            <p className="gsc-connect-desc">
              Link your Google account to pull real click, impression, CTR, and ranking data
              directly from Google Search Console — no third-party intermediary.
            </p>
            <ul className="gsc-feature-list">
              <li><CheckCircle2 size={15} /> Total clicks &amp; impressions</li>
              <li><CheckCircle2 size={15} /> Average CTR &amp; position</li>
              <li><CheckCircle2 size={15} /> Top queries &amp; landing pages</li>
              <li><CheckCircle2 size={15} /> Secure OAuth — we never store your Google password</li>
            </ul>
            <button
              id="gsc-connect-btn"
              className="btn gsc-connect-btn"
              onClick={startGoogleAuth}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
            <p className="gsc-auth-note">
              We request read-only access to Search Console data only.<br />
              Your credentials are handled securely by the backend.
            </p>
          </div>
        )}

        {/* ── STEP 2: Property Selection ── */}
        {!statusLoading && step === 'properties' && (
          <div className="gsc-card">
            <div className="gsc-card-header">
              <CheckCircle2 size={18} className="text-success" />
              <h2 className="gsc-card-title">Connected successfully</h2>
            </div>
            <p className="text-muted small mb-4">Select the Search Console property you'd like to view data for.</p>

            {propLoading && (
              <div className="gsc-center py-4">
                <Loader2 size={24} className="gsc-spinner" />
                <p className="text-muted small mt-2 mb-0">Loading properties…</p>
              </div>
            )}

            {propError && !propLoading && (
              <div className="gsc-alert-error mb-3">
                <AlertTriangle size={15} />
                <span>{propError}</span>
              </div>
            )}

            {!propLoading && !propError && properties.length > 0 && (
              <div className="gsc-property-list">
                {properties.map((p) => (
                  <button
                    key={p.siteUrl}
                    className="gsc-property-item"
                    onClick={() => handleSelectProperty(p.siteUrl)}
                  >
                    <Globe size={16} className="gsc-property-icon" />
                    <span className="gsc-property-url">{p.siteUrl}</span>
                    <ChevronRight size={16} className="gsc-property-arrow" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-top d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                onClick={loadProperties}
                disabled={propLoading}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
              <button
                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 ms-auto"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                <LogOut size={13} />
                {disconnecting ? 'Disconnecting…' : 'Disconnect'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Dashboard ── */}
        {!statusLoading && step === 'dashboard' && (
          <div>
            {/* Dashboard header */}
            <div className="gsc-dashboard-header mb-4">
              <div>
                <div className="gsc-site-label">
                  <Globe size={14} />
                  <a
                    href={status.selectedSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gsc-site-link"
                  >
                    {status.selectedSite}
                    <ExternalLink size={12} className="ms-1" />
                  </a>
                </div>
                <p className="gsc-date-range text-muted small">
                  Last 28 days · Data from Google Search Console
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                  onClick={loadPerformance}
                  disabled={perfLoading}
                >
                  <RefreshCw size={13} className={perfLoading ? 'gsc-spin' : ''} />
                  Refresh
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                  onClick={() => { setStep('properties'); loadProperties(); }}
                >
                  <Layers size={13} />
                  Switch
                </button>
                <button
                  className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                >
                  <LogOut size={13} />
                  {disconnecting ? 'Disconnecting…' : 'Disconnect'}
                </button>
              </div>
            </div>

            {/* Loading state */}
            {perfLoading && (
              <div className="gsc-card gsc-center py-5">
                <Loader2 size={28} className="gsc-spinner" />
                <p className="text-muted mt-3 mb-0">Fetching Search Console data…</p>
              </div>
            )}

            {/* Error state */}
            {perfError && !perfLoading && (
              <div className="gsc-card">
                <div className="gsc-alert-error">
                  <AlertTriangle size={16} />
                  <span>{perfError}</span>
                </div>
                <button
                  className="btn btn-outline-secondary btn-sm mt-3 d-inline-flex align-items-center gap-1"
                  onClick={loadPerformance}
                >
                  <RefreshCw size={13} />
                  Try again
                </button>
              </div>
            )}

            {/* Performance data */}
            {!perfLoading && !perfError && performance && (
              <>
                {/* Stat cards */}
                <div className="gsc-stats-grid mb-4">
                  <StatCard
                    icon={MousePointerClick}
                    label="Total Clicks"
                    value={fmt(performance.totals?.clicks)}
                    colorVar="--primary"
                  />
                  <StatCard
                    icon={Eye}
                    label="Impressions"
                    value={fmt(performance.totals?.impressions)}
                    colorVar="--info"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Avg. CTR"
                    value={fmtPct(performance.totals?.ctr)}
                    colorVar="--pass"
                  />
                  <StatCard
                    icon={Search}
                    label="Avg. Position"
                    value={fmtPos(performance.totals?.position)}
                    colorVar="--warn"
                    subtitle="Lower is better"
                  />
                </div>

                {/* Top Queries & Top Pages */}
                <div className="gsc-tables-grid">
                  <DataTable
                    title="Top Queries"
                    icon={Search}
                    rows={(performance.topQueries || []).map((r) => ({ key: r.query, ...r }))}
                    keyLabel="Query"
                    cols={[
                      { key: 'clicks', label: 'Clicks', fmt: fmt },
                      { key: 'impressions', label: 'Impr.', fmt: fmt },
                      { key: 'ctr', label: 'CTR', fmt: fmtPct },
                      { key: 'position', label: 'Pos.', fmt: fmtPos },
                    ]}
                  />
                  <DataTable
                    title="Top Pages"
                    icon={Globe}
                    rows={(performance.topPages || []).map((r) => ({ key: r.page, ...r }))}
                    keyLabel="Page"
                    cols={[
                      { key: 'clicks', label: 'Clicks', fmt: fmt },
                      { key: 'impressions', label: 'Impr.', fmt: fmt },
                      { key: 'ctr', label: 'CTR', fmt: fmtPct },
                      { key: 'position', label: 'Pos.', fmt: fmtPos },
                    ]}
                  />
                </div>

                {/* No data note */}
                {performance.totals?.clicks === 0 && performance.totals?.impressions === 0 && (
                  <div className="gsc-alert-info mt-4">
                    <Search size={16} />
                    <span>No Search Console data found for the last 28 days. This could mean the site has very low traffic, or the property was recently added.</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── FAQ Section ── */}
        <section className="gsc-faq" aria-labelledby="gsc-faq-title">
          <div className="gsc-faq-header">
            <h2 id="gsc-faq-title" className="gsc-faq-title">
              How to Use Google Search Console with SEO++
            </h2>
            <p className="gsc-faq-subtitle">
              New to Search Console? Find quick answers to the most common setup and usage questions.
            </p>
          </div>

          <div className="gsc-faq-list">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.id}
                  className={`gsc-faq-item${isOpen ? ' open' : ''}`}
                >
                  <button
                    type="button"
                    className="gsc-faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`gsc-faq-ans-${item.id}`}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={18} className="gsc-faq-icon" aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div id={`gsc-faq-ans-${item.id}`} className="gsc-faq-answer">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
