import React from 'react';

export function BlogHeroSkeleton() {
  return (
    <div className="blog-hero-skeleton p-4 p-md-5 rounded-4 mb-5 border">
      <div className="row g-4 align-items-center">
        <div className="col-12 col-lg-7">
          <div className="skeleton-bar w-25 mb-3" style={{ height: '22px' }}></div>
          <div className="skeleton-bar w-75 mb-3" style={{ height: '40px' }}></div>
          <div className="skeleton-bar w-100 mb-2" style={{ height: '18px' }}></div>
          <div className="skeleton-bar w-50 mb-4" style={{ height: '18px' }}></div>
          <div className="d-flex gap-3">
            <div className="skeleton-bar rounded-circle" style={{ width: '40px', height: '40px' }}></div>
            <div className="skeleton-bar w-50" style={{ height: '36px' }}></div>
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="skeleton-bar rounded-4 w-100" style={{ height: '260px' }}></div>
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 border rounded-4 overflow-hidden blog-skeleton-card">
        <div className="skeleton-bar w-100" style={{ height: '200px' }}></div>
        <div className="p-4 d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between mb-3">
            <div className="skeleton-bar w-25" style={{ height: '18px' }}></div>
            <div className="skeleton-bar w-20" style={{ height: '18px' }}></div>
          </div>
          <div className="skeleton-bar w-100 mb-2" style={{ height: '26px' }}></div>
          <div className="skeleton-bar w-75 mb-3" style={{ height: '26px' }}></div>
          <div className="skeleton-bar w-100 mb-1" style={{ height: '14px' }}></div>
          <div className="skeleton-bar w-90 mb-4" style={{ height: '14px' }}></div>
          <div className="mt-auto pt-3 border-top d-flex align-items-center gap-3">
            <div className="skeleton-bar rounded-circle" style={{ width: '32px', height: '32px' }}></div>
            <div className="skeleton-bar w-50" style={{ height: '16px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="container py-5" style={{ maxWidth: '880px' }}>
      <div className="skeleton-bar w-25 mb-4" style={{ height: '20px' }}></div>
      <div className="skeleton-bar w-100 mb-3" style={{ height: '48px' }}></div>
      <div className="skeleton-bar w-75 mb-4" style={{ height: '48px' }}></div>
      <div className="d-flex align-items-center gap-3 mb-5">
        <div className="skeleton-bar rounded-circle" style={{ width: '44px', height: '44px' }}></div>
        <div className="skeleton-bar w-50" style={{ height: '20px' }}></div>
      </div>
      <div className="skeleton-bar rounded-4 w-100 mb-5" style={{ height: '420px' }}></div>
      <div className="skeleton-bar w-100 mb-3" style={{ height: '20px' }}></div>
      <div className="skeleton-bar w-100 mb-3" style={{ height: '20px' }}></div>
      <div className="skeleton-bar w-90 mb-3" style={{ height: '20px' }}></div>
      <div className="skeleton-bar w-80 mb-5" style={{ height: '20px' }}></div>
      <div className="skeleton-bar w-50 mb-3" style={{ height: '32px' }}></div>
      <div className="skeleton-bar w-100 mb-3" style={{ height: '20px' }}></div>
      <div className="skeleton-bar w-95 mb-3" style={{ height: '20px' }}></div>
    </div>
  );
}
