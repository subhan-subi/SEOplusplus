import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  X, 
  Sparkles, 
  PenTool, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fetchArticles, fetchCategories } from '../../services/blogService';
import { FALLBACK_ARTICLES, FALLBACK_CATEGORIES } from '../../data/fallbackArticles';
import BlogCard from '../../components/blog/BlogCard';
import FeaturedArticle from '../../components/blog/FeaturedArticle';
import { BlogHeroSkeleton, BlogCardSkeleton } from '../../components/blog/BlogSkeleton';
import BlogSeo from '../../components/blog/BlogSeo';

const ALL_CATEGORIES = [
  'All',
  'SEO Basics',
  'Technical SEO',
  'On-Page SEO',
  'Link Building',
  'Google Search Console',
  'Website Growth',
  'Guest Posting',
  'SEO Tools & Tutorials'
];

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL query params
  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state initialized with fallback data for instant SSR and fast hydration
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [articles, setArticles] = useState(() => FALLBACK_ARTICLES);
  const [featuredArticle, setFeaturedArticle] = useState(() => FALLBACK_ARTICLES.find((a) => a.isFeatured) || FALLBACK_ARTICLES[0]);
  const [categories, setCategories] = useState(() => FALLBACK_CATEGORIES);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalArticles: FALLBACK_ARTICLES.length,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync search input when url changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        if (data?.categories) {
          setCategories(data.categories);
        }
      } catch (e) {
        // Fallback silently if category counts can't be fetched
      }
    }
    loadCategories();
  }, []);

  // Fetch articles whenever filters or page changes
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        category: activeCategory !== 'All' ? activeCategory : undefined,
        search: searchQuery || undefined
      };

      const data = await fetchArticles(params);
      const articleList = data?.articles || [];

      // Determine featured article:
      // If on page 1 with no search, pick first featured or most recent article
      if (currentPage === 1 && !searchQuery) {
        const feat = articleList.find((a) => a.isFeatured) || articleList[0];
        setFeaturedArticle(feat || null);
        // Exclude featured article from grid if showing featured banner
        setArticles(feat ? articleList.filter((a) => a._id !== feat._id) : articleList);
      } else {
        setFeaturedArticle(null);
        setArticles(articleList);
      }

      setPagination(data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalArticles: articleList.length,
        hasNextPage: false,
        hasPrevPage: false
      });
    } catch (err) {
      setError(err.message || 'Failed to load blog articles.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, currentPage]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('q', searchInput.trim());
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle Category Select
  const handleCategorySelect = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle Page Change
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Category count helper
  const getCategoryCount = (name) => {
    const found = categories.find((c) => c.name === name);
    return found ? found.count : null;
  };

  return (
    <div className="blog-page-container pb-5">
      <BlogSeo
        title={
          activeCategory !== 'All'
            ? `${activeCategory} Articles & Guides | SEO++ Blog`
            : 'SEO++ Blog – Proven Search Engine Optimization & Growth Guides'
        }
        description="Master SEO, website growth, Google Search Console, on-page optimization, and digital marketing with actionable, data-backed guides from the SEO++ team."
        canonicalUrl="https://seoplusplus.vercel.app/blog"
        ogType="website"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' }
        ]}
      />

      {/* Hero / Header Section */}
      <section className="blog-hero py-5 text-center position-relative">
        <div className="container py-lg-4" style={{ maxWidth: '880px' }}>
          <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill blog-hero-badge">
            <BookOpen size={14} className="text-primary" />
            <span className="small fw-semibold">SEO++ Knowledge Hub</span>
          </div>

          <h1 className="display-5 fw-bold text-main mb-3">
            SEO &amp; Growth <span className="blog-headline-gradient">Insights</span>
          </h1>

          <p className="lead text-secondary mb-4 mx-auto" style={{ maxWidth: '640px' }}>
            Actionable technical playbooks, search analytics tutorials, and growth frameworks to help you rank higher and build sustainable search traffic.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="blog-search-form mx-auto mb-4" role="search">
            <div className="position-relative">
              <Search size={18} className="blog-search-icon position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control blog-search-input ps-5 pe-5 py-3 rounded-pill"
                placeholder="Search articles on technical SEO, GSC, on-page..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search blog articles"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-1"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>

          {/* Quick links & Write for Us banner */}
          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap small">
            <span className="text-muted d-inline-flex align-items-center gap-1">
              <TrendingUp size={14} className="text-primary" />
              <span>Explore curated topics below</span>
            </span>
            <span className="text-muted">&bull;</span>
            <Link to="/write-for-us" className="text-primary text-decoration-none fw-medium d-inline-flex align-items-center gap-1 hover-underline">
              <PenTool size={13} />
              <span>Write for SEO++ / Pitch an Article</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-4">
        {/* Categories Bar */}
        <div className="blog-categories-wrap mb-4 pb-2">
          <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 blog-categories-scroll" role="tablist">
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const count = cat !== 'All' ? getCategoryCount(cat) : null;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`btn blog-category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  <span>{cat}</span>
                  {count !== null && count !== undefined && count > 0 && (
                    <span className="badge ms-1 blog-category-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div>
            {!searchQuery && activeCategory === 'All' && <BlogHeroSkeleton />}
            <div className="row g-4">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-5 text-center rounded-4 border my-4 blog-state-card">
            <AlertCircle size={40} className="text-danger mb-3" />
            <h3 className="h4 fw-bold text-main mb-2">Could Not Load Articles</h3>
            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '480px' }}>
              {error}
            </p>
            <button type="button" onClick={loadArticles} className="btn btn-primary d-inline-flex align-items-center gap-2">
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && !featuredArticle && (
          <div className="p-5 text-center rounded-4 border my-4 blog-state-card">
            <BookOpen size={40} className="text-muted mb-3" />
            <h3 className="h4 fw-bold text-main mb-2">No Articles Found</h3>
            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '480px' }}>
              {searchQuery
                ? `No articles matched your search query "${searchQuery}". Try different keywords or browse our categories.`
                : `There are currently no articles in the "${activeCategory}" category. Check back soon for new guides!`}
            </p>
            <div className="d-flex justify-content-center gap-2">
              {searchQuery && (
                <button type="button" onClick={handleClearSearch} className="btn btn-outline-secondary">
                  Clear Search
                </button>
              )}
              {activeCategory !== 'All' && (
                <button type="button" onClick={() => handleCategorySelect('All')} className="btn btn-primary">
                  View All Categories
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Listing */}
        {!loading && !error && (
          <>
            {/* Featured Article Banner (on page 1 with no search filter) */}
            {featuredArticle && <FeaturedArticle article={featuredArticle} />}

            {/* Active filter announcement */}
            {(searchQuery || activeCategory !== 'All') && (
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-secondary">
                    Showing results for: <strong>{activeCategory !== 'All' ? activeCategory : ''} {searchQuery ? `"${searchQuery}"` : ''}</strong>
                  </span>
                  <span className="badge bg-secondary-subtle text-secondary">{pagination.totalArticles} articles</span>
                </div>
                <button
                  type="button"
                  className="btn btn-link text-decoration-none btn-sm text-muted"
                  onClick={() => {
                    setSearchInput('');
                    setSearchParams(new URLSearchParams());
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Articles Grid */}
            <div className="row g-4">
              {articles.map((article) => (
                <BlogCard key={article._id || article.slug} article={article} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <nav className="d-flex justify-content-center align-items-center gap-2 mt-5 pt-4 border-top" aria-label="Blog pagination">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 px-3 py-2"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="d-flex align-items-center gap-1 mx-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`btn btn-sm blog-pagination-btn ${p === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(p)}
                      aria-current={p === currentPage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 px-3 py-2"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Write for Us Callout Strip */}
      <section className="container mt-5">
        <div className="p-4 p-md-5 rounded-4 border blog-write-cta-card">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 mb-2 text-primary fw-semibold small">
                <Sparkles size={14} />
                <span>Publish with SEO++</span>
              </div>
              <h3 className="h3 fw-bold text-main mb-2">Want to Publish an Article on SEO++?</h3>
              <p className="text-secondary mb-0" style={{ maxWidth: '650px' }}>
                We accept guest guides, expert case studies, and sponsored content from practitioners and agencies. Join our growing library of search knowledge.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <Link to="/write-for-us" className="btn btn-outline-primary px-4 py-2 fw-semibold">
                View Publishing Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
