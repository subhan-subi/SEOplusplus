import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  Key, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Archive, 
  Search, 
  Sparkles, 
  ArrowLeft,
  RefreshCw,
  LogOut,
  Mail,
  ExternalLink,
  Layers,
  Settings,
  HelpCircle,
  Clock
} from 'lucide-react';
import { 
  verifyAdminKey, 
  fetchAdminArticles, 
  fetchAdminArticleById, 
  createArticle, 
  updateArticle, 
  updateArticleStatus, 
  deleteArticle, 
  fetchAdminInquiries, 
  updateAdminInquiryStatus 
} from '../../services/blogService';
import { useToast } from '../../context/ToastContext';

const BLOG_CATEGORIES = [
  'SEO Basics',
  'Technical SEO',
  'On-Page SEO',
  'Link Building',
  'Google Search Console',
  'Website Growth',
  'Guest Posting',
  'SEO Tools & Tutorials'
];

const INITIAL_ARTICLE_STATE = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: 'SEO Basics',
  author: {
    name: 'SEO++ Editorial Team',
    role: 'SEO & Growth Specialist',
    avatar: '',
    bio: 'Dedicated to helping businesses and creators grow their search visibility.'
  },
  status: 'draft',
  tags: '',
  readingTime: 5,
  seoTitle: '',
  seoDescription: '',
  canonicalUrl: '',
  isFeatured: false,
  isSponsored: false,
  sponsorName: '',
  sponsorUrl: '',
  relatedTool: 'seo-checker'
};

export default function BlogAdmin() {
  const { showToast } = useToast();

  // Authentication State
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('seoly_blog_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Management State
  const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'editor', 'inquiries'
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, archived: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Editor State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_ARTICLE_STATE);
  const [editorTab, setEditorTab] = useState('write'); // 'write' or 'preview'
  const [saving, setSaving] = useState(false);

  // Preview Modal / View State
  const [previewArticle, setPreviewArticle] = useState(null);

  // Verify stored key on mount
  useEffect(() => {
    if (adminKey) {
      verifyAdminKey(adminKey)
        .then((valid) => {
          if (valid) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem('seoly_blog_admin_key');
            setAdminKey('');
          }
        })
        .catch(() => {
          sessionStorage.removeItem('seoly_blog_admin_key');
          setAdminKey('');
        });
    }
  }, [adminKey]);

  // Load Admin Articles
  const loadArticles = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const data = await fetchAdminArticles(adminKey, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchFilter || undefined
      });
      if (data) {
        setArticles(data.articles || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load articles', 'error');
    } finally {
      setLoading(false);
    }
  }, [adminKey, statusFilter, searchFilter, showToast]);

  // Load Inquiries
  const loadInquiries = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const data = await fetchAdminInquiries(adminKey);
      if (data?.inquiries) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  }, [adminKey, showToast]);

  // Trigger data loads when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'articles') loadArticles();
      if (activeTab === 'inquiries') loadInquiries();
    }
  }, [isAuthenticated, activeTab, loadArticles, loadInquiries]);

  // Handle Login
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const valid = await verifyAdminKey(keyInput.trim());
      if (valid) {
        sessionStorage.setItem('seoly_blog_admin_key', keyInput.trim());
        setAdminKey(keyInput.trim());
        setIsAuthenticated(true);
        showToast('Authorized for content management', 'success');
      } else {
        setAuthError('Invalid admin secret key.');
      }
    } catch (err) {
      setAuthError(err.message || 'Authorization failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('seoly_blog_admin_key');
    setAdminKey('');
    setIsAuthenticated(false);
    setKeyInput('');
    showToast('Logged out of content management', 'info');
  };

  // Start Create New Article
  const handleNewArticle = () => {
    setEditingId(null);
    setFormData(INITIAL_ARTICLE_STATE);
    setEditorTab('write');
    setActiveTab('editor');
  };

  // Start Edit Article
  const handleEditArticle = async (id) => {
    setLoading(true);
    try {
      const art = await fetchAdminArticleById(adminKey, id);
      if (art) {
        setEditingId(art._id);
        setFormData({
          title: art.title || '',
          slug: art.slug || '',
          excerpt: art.excerpt || '',
          content: art.content || '',
          featuredImage: art.featuredImage || '',
          category: art.category || 'SEO Basics',
          author: {
            name: art.author?.name || 'SEO++ Editorial Team',
            role: art.author?.role || 'SEO & Growth Specialist',
            avatar: art.author?.avatar || '',
            bio: art.author?.bio || ''
          },
          status: art.status || 'draft',
          tags: Array.isArray(art.tags) ? art.tags.join(', ') : '',
          readingTime: art.readingTime || 5,
          seoTitle: art.seoTitle || '',
          seoDescription: art.seoDescription || '',
          canonicalUrl: art.canonicalUrl || '',
          isFeatured: Boolean(art.isFeatured),
          isSponsored: Boolean(art.isSponsored),
          sponsorName: art.sponsorName || '',
          sponsorUrl: art.sponsorUrl || '',
          relatedTool: art.relatedTool || 'seo-checker'
        });
        setEditorTab('write');
        setActiveTab('editor');
      }
    } catch (err) {
      showToast(err.message || 'Could not load article for editing', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('author.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        author: { ...prev.author, [field]: value }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Auto-slug generator
  const handleAutoSlug = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    setFormData((prev) => ({ ...prev, slug: generated }));
  };

  // Save Article (Create or Update)
  const handleSaveArticle = async (overrideStatus) => {
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    if (!formData.content.trim()) {
      showToast('Content is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        status: overrideStatus || formData.status,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      };

      if (editingId) {
        await updateArticle(adminKey, editingId, payload);
        showToast('Article updated successfully!', 'success');
      } else {
        await createArticle(adminKey, payload);
        showToast('Article created successfully!', 'success');
      }

      setActiveTab('articles');
      loadArticles();
    } catch (err) {
      showToast(err.message || 'Failed to save article', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Quick Status Toggle
  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await updateArticleStatus(adminKey, id, nextStatus);
      showToast(`Article marked as ${nextStatus}`, 'success');
      loadArticles();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteArticle(adminKey, id);
      showToast('Article deleted permanently', 'info');
      loadArticles();
    } catch (err) {
      showToast(err.message || 'Failed to delete article', 'error');
    }
  };

  // Update Inquiry Status
  const handleInquiryStatusChange = async (id, newStatus) => {
    try {
      await updateAdminInquiryStatus(adminKey, id, newStatus);
      showToast(`Inquiry marked as ${newStatus}`, 'success');
      loadInquiries();
    } catch (err) {
      showToast(err.message || 'Failed to update inquiry status', 'error');
    }
  };

  // -------------------------------------------------------------
  // Render Login Gate if Not Authenticated
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="container py-5" style={{ maxWidth: '480px' }}>
        <div className="p-4 p-md-5 rounded-4 border blog-admin-card my-5 text-center">
          <div className="brand-icon mx-auto mb-3" aria-hidden="true">
            <Lock size={22} />
          </div>
          <h1 className="h3 fw-bold text-main mb-2">Content Management</h1>
          <p className="text-secondary small mb-4">
            Enter your authorized admin secret key to publish, edit, or manage SEO++ articles.
          </p>

          {authError && (
            <div className="alert alert-danger small py-2 mb-3 text-start" role="alert">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="admin-key" className="form-label small fw-semibold text-main">
                Admin Secret Key
              </label>
              <div className="input-group">
                <span className="input-group-text bg-subtle border-end-0">
                  <Key size={16} className="text-muted" />
                </span>
                <input
                  type="password"
                  id="admin-key"
                  className="form-control border-start-0"
                  placeholder="Enter BLOG_ADMIN_KEY"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading || !keyInput.trim()}
              className="btn btn-primary w-100 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
            >
              {authLoading ? <span>Verifying...</span> : <span>Unlock Content Manager</span>}
            </button>
          </form>

          <div className="mt-4 pt-3 border-top">
            <Link to="/blog" className="text-muted small text-decoration-none hover-underline">
              &larr; Back to Public Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render Authorized Admin Portal
  // -------------------------------------------------------------
  return (
    <div className="blog-admin-portal pb-5">
      {/* Admin Top Header */}
      <header className="blog-admin-header py-3 border-bottom bg-card">
        <div className="container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <Link to="/blog" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1">
              <ArrowLeft size={14} />
              <span>Public Blog</span>
            </Link>
            <div>
              <h1 className="h5 fw-bold text-main mb-0">SEO++ Content Management</h1>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Production Publishing Engine</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={handleNewArticle}
              className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
            >
              <Plus size={15} />
              <span>New Article</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
              title="Lock & Log Out"
            >
              <LogOut size={14} />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="container py-4">
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 border bg-card text-center">
              <span className="text-muted small d-block">Total Articles</span>
              <span className="h4 fw-bold text-main mb-0">{stats.total}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 border bg-card text-center">
              <span className="text-muted small d-block">Published Live</span>
              <span className="h4 fw-bold text-success mb-0">{stats.published}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 border bg-card text-center">
              <span className="text-muted small d-block">Drafts</span>
              <span className="h4 fw-bold text-warn mb-0">{stats.draft}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3 border bg-card text-center">
              <span className="text-muted small d-block">Archived</span>
              <span className="h4 fw-bold text-muted mb-0">{stats.archived}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="d-flex align-items-center gap-2 border-bottom mb-4">
          <button
            type="button"
            className={`btn pb-2 rounded-0 border-bottom border-2 ${activeTab === 'articles' ? 'border-primary text-primary fw-bold' : 'border-transparent text-secondary'}`}
            onClick={() => setActiveTab('articles')}
          >
            <span className="d-inline-flex align-items-center gap-1">
              <FileText size={16} />
              <span>Articles ({articles.length})</span>
            </span>
          </button>

          <button
            type="button"
            className={`btn pb-2 rounded-0 border-bottom border-2 ${activeTab === 'editor' ? 'border-primary text-primary fw-bold' : 'border-transparent text-secondary'}`}
            onClick={() => {
              if (!editingId) handleNewArticle();
              else setActiveTab('editor');
            }}
          >
            <span className="d-inline-flex align-items-center gap-1">
              <Edit3 size={16} />
              <span>{editingId ? 'Edit Article' : 'Write Article'}</span>
            </span>
          </button>

          <button
            type="button"
            className={`btn pb-2 rounded-0 border-bottom border-2 ${activeTab === 'inquiries' ? 'border-primary text-primary fw-bold' : 'border-transparent text-secondary'}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <span className="d-inline-flex align-items-center gap-1">
              <Mail size={16} />
              <span>Publishing Pitches</span>
            </span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: ARTICLES LIST */}
        {/* ============================================================== */}
        {activeTab === 'articles' && (
          <div>
            {/* Filter / Search Bar */}
            <div className="row g-3 mb-4 align-items-center">
              <div className="col-12 col-md-6">
                <div className="position-relative">
                  <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search by title, slug, or excerpt..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="col-6 col-md-3 text-md-end">
                <button
                  type="button"
                  onClick={loadArticles}
                  className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                >
                  <RefreshCw size={14} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="card rounded-4 border overflow-hidden">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ minWidth: '260px' }}>Article</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Published</th>
                      <th scope="col">Views</th>
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          Loading articles...
                        </td>
                      </tr>
                    )}

                    {!loading && articles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-5 text-muted">
                          No articles found matching criteria.
                        </td>
                      </tr>
                    )}

                    {!loading && articles.map((art) => {
                      const isPub = art.status === 'published';
                      const isDraft = art.status === 'draft';
                      return (
                        <tr key={art._id}>
                          <td>
                            <div className="fw-semibold text-main mb-1">{art.title}</div>
                            <div className="small text-muted d-flex align-items-center gap-2">
                              <code>/{art.slug}</code>
                              {art.isFeatured && (
                                <span className="badge bg-warning-subtle text-warning">Featured</span>
                              )}
                              {art.isSponsored && (
                                <span className="badge bg-info-subtle text-info">Sponsored</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">{art.category}</span>
                          </td>
                          <td>
                            <span
                              className={`badge ${isPub ? 'bg-success-subtle text-success' : isDraft ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-muted'}`}
                            >
                              {art.status}
                            </span>
                          </td>
                          <td className="small text-secondary">
                            {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="small text-secondary">{art.views || 0}</td>
                          <td className="text-end">
                            <div className="d-inline-flex align-items-center gap-1">
                              {/* Quick Status Toggle */}
                              <button
                                type="button"
                                className={`btn btn-sm ${isPub ? 'btn-outline-warning' : 'btn-outline-success'} p-1 px-2`}
                                title={isPub ? 'Unpublish to draft' : 'Publish live'}
                                onClick={() => handleStatusToggle(art._id, art.status)}
                              >
                                {isPub ? <Archive size={14} /> : <CheckCircle size={14} />}
                              </button>

                              {/* View / Preview */}
                              {isPub ? (
                                <Link
                                  to={`/blog/${art.slug}`}
                                  target="_blank"
                                  className="btn btn-sm btn-outline-secondary p-1 px-2"
                                  title="View Live Article"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary p-1 px-2"
                                  title="Preview Draft"
                                  onClick={() => handleEditArticle(art._id)}
                                >
                                  <Eye size={14} />
                                </button>
                              )}

                              {/* Edit */}
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary p-1 px-2"
                                title="Edit Article"
                                onClick={() => handleEditArticle(art._id)}
                              >
                                <Edit3 size={14} />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger p-1 px-2"
                                title="Delete Article"
                                onClick={() => handleDeleteArticle(art._id, art.title)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WRITE / EDIT ARTICLE */}
        {/* ============================================================== */}
        {activeTab === 'editor' && (
          <div className="card rounded-4 border p-4 p-lg-5 blog-editor-card">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h2 className="h4 fw-bold text-main mb-1">
                  {editingId ? 'Edit Article' : 'Create New Article'}
                </h2>
                <span className="small text-muted">
                  Write markdown/HTML content, configure SEO parameters, and assign tool CTAs.
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorTab(editorTab === 'write' ? 'preview' : 'write')}
                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                >
                  <Eye size={14} />
                  <span>{editorTab === 'write' ? 'Live Preview' : 'Back to Editor'}</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveArticle('draft')}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveArticle('published')}
                  className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
                >
                  <CheckCircle size={14} />
                  <span>Publish Article</span>
                </button>
              </div>
            </div>

            {editorTab === 'preview' ? (
              /* Live Content Preview */
              <div className="p-4 rounded-4 border bg-app mb-4">
                <span className="badge bg-secondary-subtle text-secondary mb-2">{formData.category}</span>
                <h1 className="h2 fw-bold text-main mb-3">{formData.title || 'Untitled Article'}</h1>
                <p className="lead text-secondary mb-4">{formData.excerpt}</p>
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt="Preview"
                    className="w-100 rounded-4 mb-4"
                    style={{ maxHeight: '380px', objectFit: 'cover' }}
                  />
                )}
                <div
                  className="blog-article-content text-secondary"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<em>No content written yet.</em>' }}
                />
              </div>
            ) : (
              /* Write Form */
              <div className="row g-4">
                {/* Title */}
                <div className="col-12 col-lg-8">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-main">Article Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control form-control-lg"
                      placeholder="e.g. 10 Technical SEO Checks for Faster Google Indexing"
                      value={formData.title}
                      onChange={handleFormChange}
                      onBlur={handleAutoSlug}
                    />
                  </div>

                  {/* Slug */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label fw-semibold small text-main">URL Slug *</label>
                      <button
                        type="button"
                        onClick={handleAutoSlug}
                        className="btn btn-link btn-sm text-decoration-none p-0"
                      >
                        Auto-generate from title
                      </button>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text small bg-subtle text-muted">/blog/</span>
                      <input
                        type="text"
                        name="slug"
                        className="form-control"
                        placeholder="article-url-slug"
                        value={formData.slug}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-main">Short Summary / Excerpt *</label>
                    <textarea
                      name="excerpt"
                      rows={2}
                      className="form-control"
                      placeholder="Concise 1–2 sentence overview for social cards and listings..."
                      value={formData.excerpt}
                      onChange={handleFormChange}
                    />
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <label className="form-label fw-semibold small text-main">Article Body (HTML / Markdown supported) *</label>
                      <span className="small text-muted">Estimated reading time: {formData.readingTime} min</span>
                    </div>
                    <textarea
                      name="content"
                      rows={14}
                      className="form-control font-monospace"
                      placeholder="<h2>Heading 2</h2><p>Write your detailed guide here...</p>"
                      value={formData.content}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                {/* Right Settings Sidebar */}
                <div className="col-12 col-lg-4">
                  {/* Publishing Status & Category */}
                  <div className="p-3 rounded-3 border bg-card mb-3">
                    <h3 className="h6 fw-bold text-main mb-3">Publication Settings</h3>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">Status</label>
                      <select
                        name="status"
                        className="form-select form-select-sm"
                        value={formData.status}
                        onChange={handleFormChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">Category</label>
                      <select
                        name="category"
                        className="form-select form-select-sm"
                        value={formData.category}
                        onChange={handleFormChange}
                      >
                        {BLOG_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">Related Tool CTA</label>
                      <select
                        name="relatedTool"
                        className="form-select form-select-sm"
                        value={formData.relatedTool}
                        onChange={handleFormChange}
                      >
                        <option value="seo-checker">SEO Checker Audit</option>
                        <option value="search-console">Google Search Console</option>
                        <option value="utm-builder">UTM Campaign Builder</option>
                        <option value="content-ideas">Content Ideas Generator</option>
                        <option value="all-tools">All Tools Directory</option>
                      </select>
                    </div>

                    <div className="form-check form-switch mb-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        className="form-check-input"
                        checked={formData.isFeatured}
                        onChange={handleFormChange}
                      />
                      <label htmlFor="isFeatured" className="form-check-label small text-secondary">
                        Highlight as Featured Article
                      </label>
                    </div>
                  </div>

                  {/* Media & Tags */}
                  <div className="p-3 rounded-3 border bg-card mb-3">
                    <h3 className="h6 fw-bold text-main mb-3">Media &amp; Tags</h3>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">Featured Image URL</label>
                      <input
                        type="url"
                        name="featuredImage"
                        className="form-control form-control-sm"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.featuredImage}
                        onChange={handleFormChange}
                      />
                      {formData.featuredImage && (
                        <img
                          src={formData.featuredImage}
                          alt="Thumbnail preview"
                          className="mt-2 rounded w-100"
                          style={{ height: '100px', objectFit: 'cover' }}
                        />
                      )}
                    </div>

                    <div className="mb-0">
                      <label className="form-label small fw-semibold text-secondary">Tags (comma-separated)</label>
                      <input
                        type="text"
                        name="tags"
                        className="form-control form-control-sm"
                        placeholder="SEO, Google, Indexing"
                        value={formData.tags}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  {/* Author Information */}
                  <div className="p-3 rounded-3 border bg-card mb-3">
                    <h3 className="h6 fw-bold text-main mb-3">Author</h3>
                    <div className="mb-2">
                      <label className="form-label small text-muted">Author Name</label>
                      <input
                        type="text"
                        name="author.name"
                        className="form-control form-control-sm"
                        value={formData.author.name}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small text-muted">Role</label>
                      <input
                        type="text"
                        name="author.role"
                        className="form-control form-control-sm"
                        value={formData.author.role}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label small text-muted">Avatar Image URL</label>
                      <input
                        type="url"
                        name="author.avatar"
                        className="form-control form-control-sm"
                        placeholder="https://..."
                        value={formData.author.avatar}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  {/* SEO Metadata Override */}
                  <div className="p-3 rounded-3 border bg-card mb-3">
                    <h3 className="h6 fw-bold text-main mb-3">SEO &amp; Meta Tags</h3>
                    <div className="mb-2">
                      <label className="form-label small text-muted">Custom SEO Title</label>
                      <input
                        type="text"
                        name="seoTitle"
                        className="form-control form-control-sm"
                        placeholder="Defaults to article title"
                        value={formData.seoTitle}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small text-muted">Custom SEO Description</label>
                      <textarea
                        name="seoDescription"
                        rows={2}
                        className="form-control form-control-sm"
                        placeholder="Defaults to excerpt"
                        value={formData.seoDescription}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label small text-muted">Canonical URL (Optional)</label>
                      <input
                        type="url"
                        name="canonicalUrl"
                        className="form-control form-control-sm"
                        placeholder="https://..."
                        value={formData.canonicalUrl}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  {/* Monetization / Sponsored Settings */}
                  <div className="p-3 rounded-3 border bg-card mb-3">
                    <h3 className="h6 fw-bold text-main mb-2">Monetization &amp; Sponsorship</h3>
                    <div className="form-check form-switch mb-2">
                      <input
                        type="checkbox"
                        id="isSponsored"
                        name="isSponsored"
                        className="form-check-input"
                        checked={formData.isSponsored}
                        onChange={handleFormChange}
                      />
                      <label htmlFor="isSponsored" className="form-check-label small text-secondary">
                        Mark as Sponsored / Paid Article
                      </label>
                    </div>

                    {formData.isSponsored && (
                      <>
                        <div className="mb-2">
                          <label className="form-label small text-muted">Sponsor Name</label>
                          <input
                            type="text"
                            name="sponsorName"
                            className="form-control form-control-sm"
                            placeholder="e.g. Acme SEO Tools"
                            value={formData.sponsorName}
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="mb-0">
                          <label className="form-label small text-muted">Sponsor URL</label>
                          <input
                            type="url"
                            name="sponsorUrl"
                            className="form-control form-control-sm"
                            placeholder="https://partner.com"
                            value={formData.sponsorUrl}
                            onChange={handleFormChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PUBLISHING INQUIRIES */}
        {/* ============================================================== */}
        {activeTab === 'inquiries' && (
          <div className="card rounded-4 border overflow-hidden">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div>
                <h2 className="h5 fw-bold text-main mb-1">Incoming Publishing Pitches</h2>
                <span className="small text-muted">
                  Pitches and sponsored requests submitted from the /write-for-us portal.
                </span>
              </div>
              <button
                type="button"
                onClick={loadInquiries}
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Sender</th>
                    <th scope="col">Type</th>
                    <th scope="col" style={{ minWidth: '280px' }}>Topic &amp; Pitch</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        Loading pitches...
                      </td>
                    </tr>
                  )}

                  {!loading && inquiries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">
                        No publishing inquiries received yet.
                      </td>
                    </tr>
                  )}

                  {!loading && inquiries.map((inq) => (
                    <tr key={inq._id}>
                      <td>
                        <strong className="text-main d-block">{inq.name}</strong>
                        <a href={`mailto:${inq.email}`} className="small text-primary text-decoration-none">
                          {inq.email}
                        </a>
                        {inq.website && (
                          <div className="small text-muted">
                            <a href={inq.website} target="_blank" rel="noopener noreferrer" className="text-muted">
                              {inq.website}
                            </a>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary">
                          {inq.inquiryType?.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <strong className="text-main d-block mb-1">{inq.proposedTopic}</strong>
                        <p className="small text-secondary mb-0" style={{ maxWidth: '420px', whiteSpace: 'pre-wrap' }}>
                          {inq.message}
                        </p>
                        {inq.samples && (
                          <div className="mt-1 small text-muted">
                            <strong>Samples:</strong> {inq.samples}
                          </div>
                        )}
                      </td>
                      <td className="small text-secondary">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            inq.status === 'reviewed'
                              ? 'bg-info-subtle text-info'
                              : inq.status === 'contacted'
                              ? 'bg-success-subtle text-success'
                              : inq.status === 'declined'
                              ? 'bg-danger-subtle text-danger'
                              : 'bg-warning-subtle text-warning'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <select
                          className="form-select form-select-sm d-inline-block w-auto"
                          value={inq.status}
                          onChange={(e) => handleInquiryStatusChange(inq._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="contacted">Contacted</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
