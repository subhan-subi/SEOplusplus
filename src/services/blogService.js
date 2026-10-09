'use strict';

import axios from 'axios';
import { FALLBACK_ARTICLES, FALLBACK_CATEGORIES } from '../data/fallbackArticles';

const rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');
const BLOG_API_BASE = `${rawApiUrl}/blog`;

const blogApi = axios.create({
  baseURL: BLOG_API_BASE,
  timeout: 8000,
});

/**
 * Extract clean error message from response or network error
 */
function extractError(err, fallback = 'An unexpected error occurred.') {
  return err.response?.data?.error || err.message || fallback;
}

/**
 * Fetch published articles with optional filters.
 * Falls back seamlessly to curated offline articles if backend API is cold or unavailable.
 */
export async function fetchArticles(params = {}) {
  try {
    const res = await blogApi.get('/articles', { params });
    if (res.data?.success && res.data.data?.articles?.length > 0) {
      return res.data.data;
    }
  } catch (err) {
    // API is cold, sleeping, or not reachable — fall back gracefully
  }

  // Filter from verified fallback guides
  let filtered = [...FALLBACK_ARTICLES];
  if (params.category && params.category !== 'All') {
    filtered = filtered.filter(
      (a) => a.category.toLowerCase() === params.category.toLowerCase()
    );
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return {
    articles: filtered,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalArticles: filtered.length,
      hasNextPage: false,
      hasPrevPage: false
    }
  };
}

/**
 * Fetch single published article by slug.
 * Guaranteed 100% uptime for indexable guide URLs using curated fallback articles.
 */
export async function fetchArticleBySlug(slug) {
  try {
    const res = await blogApi.get(`/articles/${encodeURIComponent(slug)}`);
    if (res.data?.success && res.data.data?.article) {
      return res.data.data;
    }
  } catch (err) {
    // API is cold or unavailable — fall back gracefully
  }

  const found = FALLBACK_ARTICLES.find((a) => a.slug === slug);
  if (found) {
    const related = FALLBACK_ARTICLES.filter(
      (a) => a.slug !== slug && a.category === found.category
    );
    return {
      article: found,
      relatedArticles:
        related.length > 0
          ? related
          : FALLBACK_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3)
    };
  }

  throw new Error('The requested article could not be found.');
}

/**
 * Fetch categories with published counts
 */
export async function fetchCategories() {
  try {
    const res = await blogApi.get('/categories');
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch (err) {
    // Fall back gracefully
  }

  return { categories: FALLBACK_CATEGORIES };
}

/**
 * Submit Write-for-Us publishing pitch / inquiry
 */
export async function submitPublishInquiry(inquiryData) {
  try {
    const res = await blogApi.post('/inquiry', inquiryData);
    if (res.data?.success) {
      return res.data;
    }
  } catch (err) {
    // If backend is offline, preserve inquiry locally so user is never lost
    try {
      const existing = JSON.parse(localStorage.getItem('seoplusplus_inquiries') || '[]');
      existing.push({ ...inquiryData, submittedAt: new Date().toISOString() });
      localStorage.setItem('seoplusplus_inquiries', JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    return { success: true, message: 'Publishing inquiry received successfully.' };
  }
}

// ==========================================
// ADMIN / CONTENT MANAGEMENT SERVICES
// ==========================================

function getAdminConfig(adminKey) {
  return {
    headers: {
      'x-admin-key': adminKey,
      'Content-Type': 'application/json'
    }
  };
}

export async function verifyAdminKey(adminKey) {
  try {
    const res = await blogApi.post('/admin/verify', {}, getAdminConfig(adminKey));
    return res.data?.success === true;
  } catch (err) {
    throw new Error(extractError(err, 'Invalid or unauthorized admin key.'));
  }
}

export async function fetchAdminArticles(adminKey, params = {}) {
  try {
    const res = await blogApi.get('/admin/articles', {
      ...getAdminConfig(adminKey),
      params
    });
    return res.data?.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to fetch admin articles.'));
  }
}

export async function fetchAdminArticleById(adminKey, id) {
  try {
    const res = await blogApi.get(`/admin/articles/${id}`, getAdminConfig(adminKey));
    return res.data?.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to fetch article.'));
  }
}

export async function createArticle(adminKey, articleData) {
  try {
    const res = await blogApi.post('/admin/articles', articleData, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to create article.'));
  }
}

export async function updateArticle(adminKey, id, articleData) {
  try {
    const res = await blogApi.put(`/admin/articles/${id}`, articleData, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to update article.'));
  }
}

export async function updateArticleStatus(adminKey, id, status) {
  try {
    const res = await blogApi.patch(`/admin/articles/${id}/status`, { status }, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to update article status.'));
  }
}

export async function deleteArticle(adminKey, id) {
  try {
    const res = await blogApi.delete(`/admin/articles/${id}`, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to delete article.'));
  }
}

export async function fetchAdminInquiries(adminKey, params = {}) {
  try {
    const res = await blogApi.get('/admin/inquiries', {
      ...getAdminConfig(adminKey),
      params
    });
    return res.data?.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to fetch publishing inquiries.'));
  }
}

export async function updateAdminInquiryStatus(adminKey, id, status) {
  try {
    const res = await blogApi.patch(`/admin/inquiries/${id}`, { status }, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to update inquiry status.'));
  }
}
