import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowUpRight, Sparkles } from 'lucide-react';

export default function BlogCard({ article }) {
  if (!article) return null;

  const {
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    readingTime = 5,
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
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="col-12 col-md-6 col-lg-4 d-flex">
      <div className="blog-card card border rounded-4 overflow-hidden w-100 d-flex flex-column">
        {/* Card Thumbnail */}
        <Link to={`/blog/${slug}`} className="blog-card-thumb-wrap position-relative text-decoration-none" tabIndex={-1} aria-hidden="true">
          <img
            src={featuredImage || fallbackImage}
            alt={title}
            className="blog-card-img w-100"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
          <div className="blog-card-badges d-flex gap-2 position-absolute top-0 start-0 m-3">
            <span className="blog-category-badge">{category}</span>
            {isSponsored && (
              <span className="blog-sponsored-badge" title={`Sponsored content in partnership with ${sponsorName || 'partner'}`}>
                <Sparkles size={11} className="me-1" />
                Sponsored
              </span>
            )}
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-4 d-flex flex-column flex-grow-1">
          {/* Reading Time & Date */}
          <div className="d-flex align-items-center gap-3 text-muted small mb-2 blog-card-meta">
            <span className="d-inline-flex align-items-center gap-1">
              <Clock size={13} />
              <span>{readingTime} min read</span>
            </span>
            {formattedDate && (
              <span className="d-inline-flex align-items-center gap-1">
                <Calendar size={13} />
                <span>{formattedDate}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="blog-card-title h5 fw-bold mb-2">
            <Link to={`/blog/${slug}`} className="text-main text-decoration-none stretched-link">
              {title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="blog-card-excerpt text-secondary small mb-4 flex-grow-1">
            {excerpt}
          </p>

          {/* Footer: Author & Read Arrow */}
          <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              {author?.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="rounded-circle blog-card-author-avatar"
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
              <div className="small">
                <span className="fw-semibold text-main d-block lh-sm">{author?.name || 'SEO++ Team'}</span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{author?.role || 'Contributor'}</span>
              </div>
            </div>

            <div className="blog-card-arrow text-primary" aria-hidden="true">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
