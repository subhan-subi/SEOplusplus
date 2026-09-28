'use strict';

const { Article, BLOG_CATEGORIES } = require('../models/Article');
const { PublishInquiry } = require('../models/PublishInquiry');

/**
 * Helper to slugify a string safely
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * Get published articles with pagination, category filter, and search
 */
async function getArticles(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };

    // Filter by Category
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    // Filter by Tag
    if (req.query.tag) {
      filter.tags = req.query.tag.trim();
    }

    // Filter by Featured
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    // Search query across title, excerpt, and tags
    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { excerpt: { $regex: escaped, $options: 'i' } },
        { tags: { $regex: escaped, $options: 'i' } }
      ];
    }

    // Projection: Omit full content for listing queries to ensure fast responses
    const projection = {
      content: 0
    };

    const [articles, totalCount] = await Promise.all([
      Article.find(filter, projection)
        .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return res.json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: page,
          totalPages,
          totalArticles: totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get single published article by slug
 */
async function getArticleBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ success: false, error: 'Slug parameter is required' });
    }

    const article = await Article.findOne({
      slug: slug.toLowerCase().trim(),
      status: 'published'
    }).lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found or is currently not published.'
      });
    }

    // Asynchronously increment views without delaying the response
    Article.updateOne({ _id: article._id }, { $inc: { views: 1 } }).exec().catch(() => {});

    // Fetch related articles (same category, excluding current article)
    const relatedArticles = await Article.find(
      {
        status: 'published',
        category: article.category,
        _id: { $ne: article._id }
      },
      { content: 0 }
    )
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    // If fewer than 3 in same category, backfill with recent articles
    let backfilledRelated = relatedArticles;
    if (relatedArticles.length < 3) {
      const existingIds = [article._id, ...relatedArticles.map((a) => a._id)];
      const backfill = await Article.find(
        {
          status: 'published',
          _id: { $nin: existingIds }
        },
        { content: 0 }
      )
        .sort({ publishedAt: -1 })
        .limit(3 - relatedArticles.length)
        .lean();
      backfilledRelated = [...relatedArticles, ...backfill];
    }

    return res.json({
      success: true,
      data: {
        article,
        relatedArticles: backfilledRelated
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get category metadata with published article counts
 */
async function getCategories(req, res, next) {
  try {
    // Count articles per category
    const counts = await Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach((item) => {
      countMap[item._id] = item.count;
    });

    const categories = BLOG_CATEGORIES.map((cat) => ({
      name: cat,
      count: countMap[cat] || 0
    }));

    const totalPublished = await Article.countDocuments({ status: 'published' });

    return res.json({
      success: true,
      data: {
        categories,
        totalPublished
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Submit Write-For-Us publishing inquiry
 */
async function submitPublishInquiry(req, res, next) {
  try {
    const { name, email, website, company, inquiryType, proposedTopic, message, samples } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }
    if (!proposedTopic || !proposedTopic.trim()) {
      return res.status(400).json({ success: false, error: 'Proposed topic is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Outline or message description is required' });
    }

    const inquiry = new PublishInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      website: (website || '').trim(),
      company: (company || '').trim(),
      inquiryType: inquiryType || 'guest_post',
      proposedTopic: proposedTopic.trim(),
      message: message.trim(),
      samples: (samples || '').trim(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || ''
    });

    await inquiry.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting SEO++. Your publishing inquiry has been received. Our editorial team will review your pitch and reach out via email.'
    });
  } catch (err) {
    next(err);
  }
}

// ==========================================
// ADMIN / CONTENT MANAGEMENT ENDPOINTS
// ==========================================

/**
 * Verify admin credentials
 */
async function verifyAdmin(req, res) {
  return res.json({
    success: true,
    message: 'Admin access authorized'
  });
}

/**
 * Get all articles for admin management (including draft & archived)
 */
async function getAdminArticles(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { slug: { $regex: escaped, $options: 'i' } },
        { excerpt: { $regex: escaped, $options: 'i' } }
      ];
    }

    const [articles, totalCount, countsByStatus] = await Promise.all([
      Article.find(filter, { content: 0 })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter),
      Article.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const stats = {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0
    };

    countsByStatus.forEach((item) => {
      stats[item._id] = item.count;
      stats.total += item.count;
    });

    return res.json({
      success: true,
      data: {
        articles,
        stats,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit) || 1,
          totalArticles: totalCount,
          limit
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get full article by ID (Admin preview or edit)
 */
async function getAdminArticleById(req, res, next) {
  try {
    const { id } = req.params;
    const article = await Article.findById(id).lean();
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    return res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new article
 */
async function createArticle(req, res, next) {
  try {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      featuredImage,
      category,
      author,
      status,
      tags,
      readingTime,
      seoTitle,
      seoDescription,
      canonicalUrl,
      isFeatured,
      isSponsored,
      sponsorName,
      sponsorUrl,
      relatedTool
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Article title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Article content is required' });
    }
    if (!category || !BLOG_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Valid category is required. Options: ${BLOG_CATEGORIES.join(', ')}`
      });
    }

    const slug = slugify(customSlug || title);
    if (!slug) {
      return res.status(400).json({ success: false, error: 'A valid slug could not be generated' });
    }

    // Check slug uniqueness
    const existing = await Article.findOne({ slug });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `An article with the slug "${slug}" already exists. Please choose a unique slug.`
      });
    }

    // Auto-calculate reading time if not provided
    const computedReadingTime =
      readingTime ||
      Math.max(1, Math.ceil((content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length || 1) / 200));

    const articleData = {
      title: title.trim(),
      slug,
      excerpt: (excerpt || '').trim() || title.trim(),
      content: content.trim(),
      featuredImage: (featuredImage || '').trim(),
      category,
      author: author || undefined,
      status: status || 'draft',
      tags: Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [],
      readingTime: computedReadingTime,
      seoTitle: (seoTitle || title).trim(),
      seoDescription: (seoDescription || excerpt || '').trim(),
      canonicalUrl: (canonicalUrl || '').trim(),
      isFeatured: Boolean(isFeatured),
      isSponsored: Boolean(isSponsored),
      sponsorName: sponsorName ? sponsorName.trim() : null,
      sponsorUrl: sponsorUrl ? sponsorUrl.trim() : null,
      relatedTool: relatedTool || 'seo-checker'
    };

    if (articleData.status === 'published') {
      articleData.publishedAt = new Date();
    }

    const article = new Article(articleData);
    await article.save();

    return res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing article
 */
async function updateArticle(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await Article.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      featuredImage,
      category,
      author,
      status,
      tags,
      readingTime,
      seoTitle,
      seoDescription,
      canonicalUrl,
      isFeatured,
      isSponsored,
      sponsorName,
      sponsorUrl,
      relatedTool
    } = req.body;

    if (title) existing.title = title.trim();
    if (excerpt !== undefined) existing.excerpt = excerpt.trim();
    if (content !== undefined) existing.content = content.trim();
    if (featuredImage !== undefined) existing.featuredImage = featuredImage.trim();
    if (category && BLOG_CATEGORIES.includes(category)) existing.category = category;
    if (author) existing.author = { ...existing.author, ...author };
    if (tags !== undefined) {
      existing.tags = Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [];
    }
    if (readingTime) existing.readingTime = readingTime;
    if (seoTitle !== undefined) existing.seoTitle = seoTitle.trim();
    if (seoDescription !== undefined) existing.seoDescription = seoDescription.trim();
    if (canonicalUrl !== undefined) existing.canonicalUrl = canonicalUrl.trim();
    if (isFeatured !== undefined) existing.isFeatured = Boolean(isFeatured);
    if (isSponsored !== undefined) existing.isSponsored = Boolean(isSponsored);
    if (sponsorName !== undefined) existing.sponsorName = sponsorName ? sponsorName.trim() : null;
    if (sponsorUrl !== undefined) existing.sponsorUrl = sponsorUrl ? sponsorUrl.trim() : null;
    if (relatedTool !== undefined) existing.relatedTool = relatedTool;

    // Slug update with uniqueness check
    if (customSlug) {
      const newSlug = slugify(customSlug);
      if (newSlug !== existing.slug) {
        const conflict = await Article.findOne({ slug: newSlug, _id: { $ne: existing._id } });
        if (conflict) {
          return res.status(409).json({
            success: false,
            error: `An article with slug "${newSlug}" already exists.`
          });
        }
        existing.slug = newSlug;
      }
    }

    // Status transition
    if (status && status !== existing.status) {
      existing.status = status;
      if (status === 'published' && !existing.publishedAt) {
        existing.publishedAt = new Date();
      }
    }

    await existing.save();

    return res.json({
      success: true,
      message: 'Article updated successfully',
      data: existing
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Quick status change (draft/published/archived)
 */
async function updateArticleStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    article.status = status;
    if (status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();

    return res.json({
      success: true,
      message: `Article status updated to ${status}`,
      data: {
        _id: article._id,
        status: article.status,
        publishedAt: article.publishedAt
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete article
 */
async function deleteArticle(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    return res.json({
      success: true,
      message: 'Article deleted permanently'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get publishing inquiries for admin review
 */
async function getInquiries(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const [inquiries, totalCount] = await Promise.all([
      PublishInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      PublishInquiry.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit) || 1,
          totalInquiries: totalCount,
          limit
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update publishing inquiry status
 */
async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewed', 'contacted', 'declined'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid inquiry status' });
    }

    const inquiry = await PublishInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    return res.json({
      success: true,
      message: `Inquiry status changed to ${status}`,
      data: inquiry
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Dynamic XML sitemap generator
 * Serves clean XML with all published articles and core pages
 */
async function getSitemapXml(req, res, next) {
  try {
    const baseUrl = (process.env.FRONTEND_URL || 'https://seoplusplus.vercel.app').replace(/\/+$/, '');

    const publishedArticles = await Article.find(
      { status: 'published' },
      { slug: 1, updatedAt: 1, publishedAt: 1 }
    )
      .sort({ publishedAt: -1 })
      .lean();

    const staticPages = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/tools`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/write-for-us`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/tools/search-console`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/tools/hashtags`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/tools/captions`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/tools/hooks`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/tools/content-ideas`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/tools/character-counter`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/tools/utm-builder`, priority: '0.7', changefreq: 'weekly' },
      { loc: `${baseUrl}/about`, priority: '0.6', changefreq: 'monthly' },
      { loc: `${baseUrl}/privacy`, priority: '0.3', changefreq: 'yearly' },
      { loc: `${baseUrl}/terms`, priority: '0.3', changefreq: 'yearly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    staticPages.forEach((p) => {
      xml += `  <url>\n`;
      xml += `    <loc>${p.loc}</loc>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    publishedArticles.forEach((art) => {
      const lastmod = (art.updatedAt || art.publishedAt || new Date()).toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${art.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (err) {
    next(err);
  }
}

module.exports = {
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
};
