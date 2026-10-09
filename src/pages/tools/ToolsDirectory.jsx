import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Hash, 
  MessageSquare, 
  Sparkles, 
  Lightbulb, 
  AlignLeft, 
  Link as LinkIcon, 
  ArrowRight,
  ListFilter,
  BarChart2,
  TrendingUp,
  Key,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { TOOLS_LIST, TOOL_CATEGORIES } from '../../data/toolsRegistry';
import PageSeo from '../../components/common/PageSeo';

const ICON_MAP = {
  Search,
  Hash,
  MessageSquare,
  Sparkles,
  Lightbulb,
  AlignLeft,
  Link: LinkIcon,
  BarChart2,
  TrendingUp,
  Key
};

export default function ToolsDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = selectedCategory === 'All'
    ? TOOLS_LIST
    : TOOLS_LIST.filter(t => t.category === selectedCategory);

  const categories = ['All', TOOL_CATEGORIES.SEO, TOOL_CATEGORIES.SOCIAL, TOOL_CATEGORIES.MARKETING];

  return (
    <div className="tools-directory-page py-5">
      <PageSeo
        title="Free SEO & Digital Marketing Tools Directory"
        description="Explore the SEO++ suite of 10 free search engine optimization and digital marketing utilities. Fast, privacy-first, client-side tools."
        canonical="/tools"
      />

      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge-subtle-primary mb-3 d-inline-block">
            Free Toolkit
          </span>
          <h1 className="h2 fw-bold text-main mb-2">Free SEO & Marketing Tools</h1>
          <p className="text-secondary">
            Practical, client-side utilities to audit websites, discover keywords, craft social copy, and build campaign links.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="d-flex justify-content-center mb-4 pb-2">
          <div className="summary-bar my-0 flex-wrap justify-content-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`summary-chip all ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                {cat === 'All' && <span className="small text-muted">({TOOLS_LIST.length})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="row g-4 mb-5">
          {filteredTools.map((tool) => {
            const Icon = ICON_MAP[tool.icon] || Sparkles;

            return (
              <div key={tool.id} className="col-12 col-md-6 col-lg-4">
                <div className="tool-directory-card h-100 d-flex flex-column justify-content-between p-4 rounded-4 border">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="brand-icon" aria-hidden="true">
                        <Icon size={20} />
                      </div>
                      <span className="check-category-pill">{tool.category}</span>
                    </div>

                    <h2 className="h5 fw-bold text-main mb-2">{tool.name}</h2>
                    <p className="text-secondary small mb-3">{tool.description}</p>
                    <p className="text-muted small mb-4">{tool.longDescription}</p>
                  </div>

                  <Link to={tool.path} className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 mt-auto">
                    <span>Open Tool</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Educational Guide & FAQs */}
        <div className="mt-5 pt-4 border-top">
          <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 border h-100" style={{ background: 'var(--bg-card)' }}>
                <div className="brand-icon mb-3" aria-hidden="true">
                  <ShieldCheck size={20} className="text-primary" />
                </div>
                <h3 className="h6 fw-bold text-main mb-2">Privacy & Client-Side Execution</h3>
                <p className="text-secondary small mb-0">
                  Most SEO++ tools run directly inside your browser. Your marketing copy, character drafts, and UTM campaign parameters never leave your device or enter external databases.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 border h-100" style={{ background: 'var(--bg-card)' }}>
                <div className="brand-icon mb-3" aria-hidden="true">
                  <Zap size={20} className="text-primary" />
                </div>
                <h3 className="h6 fw-bold text-main mb-2">Deterministic & Reliable</h3>
                <p className="text-secondary small mb-0">
                  We prioritize reliable, rule-based algorithms, standard web APIs, and official integrations over unpredictable AI generation. Get consistent results every single time.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 border h-100" style={{ background: 'var(--bg-card)' }}>
                <div className="brand-icon mb-3" aria-hidden="true">
                  <HelpCircle size={20} className="text-primary" />
                </div>
                <h3 className="h6 fw-bold text-main mb-2">Actionable Recommendations</h3>
                <p className="text-secondary small mb-0">
                  Each tool provides clear context, limitation notes, and best-practice benchmarks so you understand not just the numbers, but what steps to take next.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4 rounded-4 border" style={{ background: 'var(--bg-card)' }}>
            <h3 className="h5 fw-bold text-main mb-3">Frequently Asked Questions</h3>
            <div className="row g-3 small">
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="fw-bold text-main mb-1">Are all SEO++ tools completely free?</div>
                  <p className="text-secondary mb-0">
                    Yes. All 10 tools are free to use without requiring an account, credit card, or recurring subscription.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="fw-bold text-main mb-1">How often should I audit my website?</div>
                  <p className="text-secondary mb-0">
                    We recommend running a technical audit whenever you launch substantial code updates, publish new page templates, or make major changes to canonical URLs and meta tags.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="fw-bold text-main mb-1">Does SEO++ store my analyzed URLs?</div>
                  <p className="text-secondary mb-0">
                    Audit results are temporarily stored in your browser session storage for quick tab navigation. We do not maintain a permanent search log or sell client audit records.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border h-100" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="fw-bold text-main mb-1">Can I connect my Google Search Console safely?</div>
                  <p className="text-secondary mb-0">
                    Yes. Authentication uses official Google OAuth with read-only permissions for Search Console data. SEO++ never requests write access or manages your domain settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
