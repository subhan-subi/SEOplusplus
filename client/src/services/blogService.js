'use strict';

import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');
const BLOG_API_BASE = `${rawApiUrl}/blog`;

const blogApi = axios.create({
  baseURL: BLOG_API_BASE,
  timeout: 25000,
});

/**
 * Extract clean error message from response or network error
 */
function extractError(err, fallback = 'An unexpected error occurred.') {
  return err.response?.data?.error || err.message || fallback;
}

/**
 * Fetch published articles with optional filters
 */
export async function fetchArticles(params = {}) {
  try {
    const res = await blogApi.get('/articles', { params });
    if (!res.data?.success) {
      throw new Error(res.data?.error || 'Failed to load articles');
    }
    return res.data.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to fetch articles.'));
  }
}

/**
 * Fetch single published article by slug
 */
export async function fetchArticleBySlug(slug) {
  try {
    const res = await blogApi.get(`/articles/${encodeURIComponent(slug)}`);
    if (!res.data?.success) {
      throw new Error(res.data?.error || 'Article not found');
    }
    return res.data.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to fetch article.'));
  }
}

/**
 * Fetch categories with published counts
 */
export async function fetchCategories() {
  try {
    const res = await blogApi.get('/categories');
    if (!res.data?.success) {
      throw new Error(res.data?.error || 'Failed to load categories');
    }
    return res.data.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to fetch categories.'));
  }
}

/**
 * Submit Write-for-Us publishing pitch / inquiry
 */
export async function submitPublishInquiry(inquiryData) {
  try {
    const res = await blogApi.post('/inquiry', inquiryData);
    if (!res.data?.success) {
      throw new Error(res.data?.error || 'Failed to submit inquiry');
    }
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to submit publishing inquiry.'));
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

/**
 * Verify admin authorization key
 */
export async function verifyAdminKey(adminKey) {
  try {
    const res = await blogApi.post('/admin/verify', {}, getAdminConfig(adminKey));
    return res.data?.success === true;
  } catch (err) {
    throw new Error(extractError(err, 'Invalid or unauthorized admin key.'));
  }
}

/**
 * Fetch admin article list
 */
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

/**
 * Fetch single article for editing/previewing by ID
 */
export async function fetchAdminArticleById(adminKey, id) {
  try {
    const res = await blogApi.get(`/admin/articles/${id}`, getAdminConfig(adminKey));
    return res.data?.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to fetch article.'));
  }
}

/**
 * Create article
 */
export async function createArticle(adminKey, articleData) {
  try {
    const res = await blogApi.post('/admin/articles', articleData, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to create article.'));
  }
}

/**
 * Update article
 */
export async function updateArticle(adminKey, id, articleData) {
  try {
    const res = await blogApi.put(`/admin/articles/${id}`, articleData, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to update article.'));
  }
}

/**
 * Update article status (draft / published / archived)
 */
export async function updateArticleStatus(adminKey, id, status) {
  try {
    const res = await blogApi.patch(`/admin/articles/${id}/status`, { status }, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to update article status.'));
  }
}

/**
 * Delete article permanently
 */
export async function deleteArticle(adminKey, id) {
  try {
    const res = await blogApi.delete(`/admin/articles/${id}`, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to delete article.'));
  }
}

/**
 * Fetch publishing inquiries (Write for Us pitches)
 */
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

/**
 * Update inquiry status
 */
export async function updateAdminInquiryStatus(adminKey, id, status) {
  try {
    const res = await blogApi.patch(`/admin/inquiries/${id}`, { status }, getAdminConfig(adminKey));
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Failed to update inquiry status.'));
  }
}
