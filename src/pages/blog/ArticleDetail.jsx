import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  ChevronRight,
  Info
} from 'lucide-react';
import { fetchArticleBySlug } from '../../services/blogService';
import BlogSeo from '../../components/blog/BlogSeo';
import BlogToolCta from '../../components/blog/BlogToolCta';
import ShareButtons from '../../components/blog/ShareButtons';
import TableOfContents from '../../components/blog/TableOfContents';
import BlogCard from '../../components/blog/BlogCard';
import { ArticleDetailSkeleton } from '../../components/blog/BlogSkeleton';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      if (!slug) return;
      setLoading(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'instant' });

      try {
        const data = await fetchArticleBySlug(slug);
        if (data?.article) {
          setArticle(data.article);
          setRelatedArticles(data.relatedArticles || []);
        } else {
          setError('Article not found or is currently private.');
        }
      } catch (err) {
        setError(err.message || 'We could not load this article. Please check the URL.');
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return <ArticleDetailSkeleton />;
  }

  if (error || !article) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '640px' }}>
        <div className="p-5 rounded-4 border blog-state-card my-5">
          <AlertCircle size={48} className="text-danger mb-3" />
          <h1 className="h3 fw-bold text-main mb-2">Article Not Found</h1>
          <p className="text-secondary mb-4">
            {error || 'The article you are looking for does not exist or may have been moved.'}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/blog" className="btn btn-primary d-inline-flex align-items-center gap-2">
              <ArrowLeft size={16} />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    excerpt,
    content,
    featuredImage,
    category,
    readingTime = 5,
    publishedAt,
    updatedAt,
    author,
    tags = [],
    seoTitle,
    seoDescription,
    canonicalUrl,
    isSponsored,
    sponsorName,
    sponsorUrl,
    relatedTool = 'seo-checker'
  } = article;

  const formattedPublished = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  const formattedUpdated = updatedAt && updatedAt !== publishedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  const currentArticleUrl = canonicalUrl || `${window.location.origin}/blog/${slug}`;

  return (
    <article className="blog-article-page pb-5">
      {/* Dynamic SEO Meta & Schema.org JSON-LD */}
      <BlogSeo
        title={seoTitle || title}
        description={seoDescription || excerpt}
        canonicalUrl={currentArticleUrl}
        ogImage={featuredImage}
        ogType="article"
        publishedAt={publishedAt}
        updatedAt={updatedAt}
        author={author}
        category={category}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: category, url: `/blog?category=${encodeURIComponent(category)}` },
          { name: title, url: `/blog/${slug}` }
        ]}
      />

      {/* Article Header & Breadcrumbs */}
      <header className="blog-article-header py-4 border-bottom">
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Breadcrumb Navigation */}
          <nav className="d-flex align-items-center gap-1 text-muted small mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="text-muted text-decoration-none hover-underline">Home</Link>
            <ChevronRight size={13} />
            <Link to="/blog" className="text-muted text-decoration-none hover-underline">Blog</Link>
            <ChevronRight size={13} />
            <Link to={`/blog?category=${encodeURIComponent(category)}`} className="text-primary text-decoration-none hover-underline">
              {category}
            </Link>
          </nav>

          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 mb-3"
          >
            <ArrowLeft size={14} />
            <span>All Articles</span>
          </button>

          {/* Badges */}
          <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
            <span className="blog-category-badge">{category}</span>
            {isSponsored && (
              <span className="blog-sponsored-badge" title={`Sponsored content in partnership with ${sponsorName || 'partner'}`}>
                <Sparkles size={12} className="me-1" />
                Sponsored Content
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="display-6 fw-bold text-main mb-3 blog-article-headline">
            {title}
          </h1>

          {/* Subheading / Excerpt */}
          <p className="lead text-secondary mb-4" style={{ lineHeight: '1.6' }}>
            {excerpt}
          </p>

          {/* Metadata Row: Author, Dates, Reading Time, Share */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pt-3 border-top">
            <div className="d-flex align-items-center gap-3">
              {author?.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="rounded-circle blog-article-author-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="blog-card-author-initials">
                  {(author?.name || 'S').charAt(0)}
                </div>
              )}
              <div>
                <span className="fw-semibold text-main d-block">{author?.name || 'SEO++ Editorial Team'}</span>
                <div className="d-flex align-items-center gap-2 text-muted small flex-wrap">
                  {author?.role && <span>{author.role}</span>}
                  {formattedPublished && (
                    <>
                      <span>&bull;</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <Calendar size={12} />
                        <span>Published {formattedPublished}</span>
                      </span>
                    </>
                  )}
                  {formattedUpdated && (
                    <>
                      <span>&bull;</span>
                      <span>(Updated {formattedUpdated})</span>
                    </>
                  )}
                  <span>&bull;</span>
                  <span className="d-inline-flex align-items-center gap-1">
                    <Clock size={12} />
                    <span>{readingTime} min read</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Bar */}
            <ShareButtons title={title} url={currentArticleUrl} />
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <div className="container py-5" style={{ maxWidth: '960px' }}>
        {/* Featured Image */}
        {featuredImage && (
          <div className="blog-article-featured-img-wrap rounded-4 overflow-hidden mb-5 border">
            <img
              src={featuredImage}
              alt={title}
              className="w-100 h-auto blog-article-featured-img"
              loading="lazy"
            />
          </div>
        )}

        {/* Sponsored Content Disclosure */}
        {isSponsored && (
          <div className="p-3 mb-4 rounded-3 border blog-sponsored-disclosure d-flex align-items-center gap-2">
            <Info size={16} className="text-primary flex-shrink-0" />
            <span className="small text-secondary">
              <strong>Sponsored Editorial:</strong> This article was published in collaboration with{' '}
              {sponsorUrl ? (
                <a href={sponsorUrl} target="_blank" rel="sponsored noopener noreferrer" className="text-primary text-decoration-none fw-medium">
                  {sponsorName || 'our partner'}
                </a>
              ) : (
                <span>{sponsorName || 'our partner'}</span>
              )}. All links to commercial offerings are transparently marked in accordance with Google guidelines.
            </span>
          </div>
        )}

        {/* Article Layout: Main Body + Sidebar */}
        <div className="row g-5">
          {/* Main Body */}
          <div className="col-12 col-lg-8">
            <div
              className="blog-article-content text-secondary"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Tags Strip */}
            {tags && tags.length > 0 && (
              <div className="mt-5 pt-4 border-top">
                <span className="text-muted small fw-semibold me-2">Tags:</span>
                <div className="d-inline-flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?q=${encodeURIComponent(tag)}`}
                      className="badge rounded-pill blog-tag-badge text-decoration-none"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual Internal Tool CTA */}
            <BlogToolCta toolType={relatedTool} />

            {/* Author Bio Box */}
            <div className="p-4 rounded-4 border mt-5 blog-author-bio-card">
              <div className="d-flex align-items-start gap-3">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="rounded-circle blog-author-bio-avatar"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="blog-card-author-initials" style={{ width: '54px', height: '54px', fontSize: '1.25rem' }}>
                    {(author?.name || 'S').charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="h6 fw-bold text-main mb-1">Written by {author?.name || 'SEO++ Editorial Team'}</h4>
                  <p className="small text-muted mb-2">{author?.role || 'SEO & Growth Specialist'}</p>
                  <p className="small text-secondary mb-0">
                    {author?.bio || 'Dedicated to sharing actionable SEO research, performance benchmarks, and marketing frameworks for creators and business owners.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Share Bar */}
            <div className="d-flex align-items-center justify-content-between pt-4 mt-4 border-top flex-wrap gap-3">
              <span className="text-secondary small fw-medium">Found this guide helpful?</span>
              <ShareButtons title={title} url={currentArticleUrl} />
            </div>
          </div>

          {/* Sticky Sidebar with TOC & Quick Tools */}
          <div className="col-12 col-lg-4">
            <aside className="blog-article-sidebar position-sticky" style={{ top: '100px' }}>
              {/* Dynamic Table of Contents */}
              <TableOfContents contentSelector=".blog-article-content" />

              {/* Sidebar Mini Tool CTA */}
              <div className="p-4 rounded-4 border blog-sidebar-cta mb-4">
                <span className="badge bg-primary-subtle text-primary mb-2">Free SEO Audit</span>
                <h4 className="h6 fw-bold text-main mb-2">Test Your Website Right Now</h4>
                <p className="small text-secondary mb-3">
                  Check over 30 technical SEO factors on your site in 10 seconds.
                </p>
                <Link to="/" className="btn btn-sm btn-primary w-100 fw-semibold">
                  Launch SEO Checker
                </Link>
              </div>

              {/* Write For Us link */}
              <div className="p-3 rounded-3 border text-center blog-sidebar-write">
                <p className="small text-muted mb-2">Have insights to share with our audience?</p>
                <Link to="/write-for-us" className="text-primary small fw-semibold text-decoration-none hover-underline">
                  Write for SEO++ &rarr;
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-5 pt-5 border-top" aria-label="Related Articles">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <span className="text-primary small fw-semibold text-uppercase tracking-wider">Keep Learning</span>
                <h3 className="h3 fw-bold text-main mb-0">Related Articles</h3>
              </div>
              <Link to="/blog" className="text-primary text-decoration-none small fw-medium hover-underline">
                View All &rarr;
              </Link>
            </div>

            <div className="row g-4">
              {relatedArticles.slice(0, 3).map((related) => (
                <BlogCard key={related._id || related.slug} article={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
