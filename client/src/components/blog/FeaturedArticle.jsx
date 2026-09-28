import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedArticle({ article }) {
  if (!article) return null;

  const {
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    readingTime = 6,
    publishedAt,
    author,
    isSponsored,
    sponsorName
  } = article;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  const fallbackImage =
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="blog-featured-card card border rounded-4 overflow-hidden mb-5">
      <div className="row g-0 align-items-stretch">
        <div className="col-12 col-lg-7 d-flex flex-column justify-content-between p-4 p-md-5">
          <div>
            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
              <span className="blog-category-badge">{category}</span>
              <span className="blog-badge-featured">
                <Sparkles size={12} className="me-1" />
                Featured Guide
              </span>
              {isSponsored && (
                <span className="blog-sponsored-badge" title={`Sponsored by ${sponsorName || 'partner'}`}>
                  Sponsored
                </span>
              )}
            </div>

            <h2 className="blog-featured-title h2 fw-bold mb-3">
              <Link to={`/blog/${slug}`} className="text-main text-decoration-none">
                {title}
              </Link>
            </h2>

            <p className="blog-featured-excerpt text-secondary mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
              {excerpt}
            </p>
          </div>

          <div className="d-flex flex-column flex-sm-row sm-align-items-center justify-content-between gap-3 pt-4 border-top">
            <div className="d-flex align-items-center gap-3">
              {author?.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="rounded-circle blog-featured-author-img"
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
                <span className="fw-semibold text-main d-block">{author?.name || 'SEO++ Team'}</span>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  {formattedDate && <span>{formattedDate}</span>}
                  <span>&bull;</span>
                  <span className="d-inline-flex align-items-center gap-1">
                    <Clock size={12} />
                    <span>{readingTime} min read</span>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Link to={`/blog/${slug}`} className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 fw-semibold">
                <span>Read Full Article</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5 blog-featured-img-col">
          <Link to={`/blog/${slug}`} className="d-block h-100" tabIndex={-1} aria-hidden="true">
            <img
              src={featuredImage || fallbackImage}
              alt={title}
              className="blog-featured-img w-100 h-100"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
