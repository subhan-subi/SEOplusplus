'use strict';

const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleBySlug,
  getCategories,
  submitPublishInquiry,
  verifyAdmin,
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateArticle,
  updateArticleStatus,
  deleteArticle,
  getInquiries,
  updateInquiryStatus,
  getSitemapXml
} = require('../controllers/blogController');

const { requireAdminAuth } = require('../middleware/adminAuth');
const { inquiryLimiter, adminLoginLimiter } = require('../middleware/rateLimiter');

// Public Blog Endpoints
router.get('/articles', getArticles);
router.get('/articles/:slug', getArticleBySlug);
router.get('/categories', getCategories);
router.post('/inquiry', inquiryLimiter, submitPublishInquiry);
router.get('/sitemap.xml', getSitemapXml);

// Admin / Content Management Endpoints
router.post('/admin/verify', adminLoginLimiter, requireAdminAuth, verifyAdmin);
router.get('/admin/articles', requireAdminAuth, getAdminArticles);
router.get('/admin/articles/:id', requireAdminAuth, getAdminArticleById);
router.post('/admin/articles', requireAdminAuth, createArticle);
router.put('/admin/articles/:id', requireAdminAuth, updateArticle);
router.patch('/admin/articles/:id/status', requireAdminAuth, updateArticleStatus);
router.delete('/admin/articles/:id', requireAdminAuth, deleteArticle);
router.get('/admin/inquiries', requireAdminAuth, getInquiries);
router.patch('/admin/inquiries/:id', requireAdminAuth, updateInquiryStatus);

module.exports = router;
