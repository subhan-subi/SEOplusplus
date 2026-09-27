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
  BarChart2
} from 'lucide-react';
import { TOOLS_LIST, TOOL_CATEGORIES } from '../../data/toolsRegistry';

const ICON_MAP = {
  Search,
  Hash,
  MessageSquare,
  Sparkles,
  Lightbulb,
  AlignLeft,
  Link: LinkIcon,
  BarChart2
};

export default function ToolsDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = selectedCategory === 'All'
    ? TOOLS_LIST
    : TOOLS_LIST.filter(t => t.category === selectedCategory);

  const categories = ['All', TOOL_CATEGORIES.SEO, TOOL_CATEGORIES.SOCIAL, TOOL_CATEGORIES.MARKETING];

  return (
    <div className="tools-directory-page py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge-subtle-primary mb-3 d-inline-block">
            Free Toolkit
          </span>
          <h1 className="h2 fw-bold text-main mb-2">Free Marketing Tools</h1>
          <p className="text-secondary">
            Simple tools to improve your website, content, and social media presence.
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
        <div className="row g-4">
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
      </div>
    </div>
  );
}
