import React, { useState, useMemo } from 'react';
import SeoCheckCard from './SeoCheckCard';
import { Search, AlertCircle, AlertTriangle, CheckCircle, ListFilter } from 'lucide-react';

export default function IssuesSection({ checks = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const counts = useMemo(() => {
    let passed = 0;
    let warning = 0;
    let failed = 0;
    let info = 0;

    checks.forEach((c) => {
      if (c.status === 'passed') passed++;
      else if (c.status === 'warning') warning++;
      else if (c.status === 'failed') failed++;
      else if (c.status === 'info') info++;
    });

    return { all: checks.length, passed, warning, failed, info };
  }, [checks]);

  // Filter checks
  const filteredChecks = useMemo(() => {
    return checks.filter((check) => {
      // Status filter
      if (activeFilter !== 'all') {
        if (check.status !== activeFilter) return false;
      }

      // Text query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = check.title?.toLowerCase().includes(query);
        const matchesDesc = check.description?.toLowerCase().includes(query);
        const matchesCategory = check.category?.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCategory;
      }

      return true;
    });
  }, [checks, activeFilter, searchQuery]);

  return (
    <div className="mt-4">
      {/* Filter Chips & Search Bar */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-3">
        <div className="summary-bar my-0">
          <button
            type="button"
            className={`summary-chip all ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <ListFilter size={16} />
            <span>All Checks ({counts.all})</span>
          </button>

          {counts.failed > 0 && (
            <button
              type="button"
              className={`summary-chip fail ${activeFilter === 'failed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('failed')}
            >
              <AlertCircle size={16} />
              <span>Critical Issues ({counts.failed})</span>
            </button>
          )}

          {counts.warning > 0 && (
            <button
              type="button"
              className={`summary-chip warn ${activeFilter === 'warning' ? 'active' : ''}`}
              onClick={() => setActiveFilter('warning')}
            >
              <AlertTriangle size={16} />
              <span>Warnings ({counts.warning})</span>
            </button>
          )}

          <button
            type="button"
            className={`summary-chip pass ${activeFilter === 'passed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('passed')}
          >
            <CheckCircle size={16} />
            <span>Passed ({counts.passed})</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="position-relative" style={{ minWidth: '220px' }}>
          <Search
            size={16}
            className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
          />
          <input
            type="text"
            className="form-control form-control-sm ps-4"
            placeholder="Search checks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Render Filtered Cards */}
      {filteredChecks.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="mb-0">No checks match the current filter or search criteria.</p>
        </div>
      ) : (
        <div className="checks-list">
          {filteredChecks.map((check) => (
            <SeoCheckCard key={check.id} check={check} />
          ))}
        </div>
      )}
    </div>
  );
}
