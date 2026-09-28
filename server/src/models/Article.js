'use strict';

const mongoose = require('mongoose');

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

const ARTICLE_STATUSES = ['draft', 'published', 'archived'];

const RELATED_TOOLS = [
  'seo-checker',
  'search-console',
  'utm-builder',
  'content-ideas',
  'hashtag-generator',
  'caption-generator',
  'hook-generator',
  'character-counter',
  'all-tools'
];

/**
 * Article Schema for SEO++ Blog & Content Publishing System
 */
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [400, 'Excerpt cannot exceed 400 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    featuredImage: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: BLOG_CATEGORIES,
      index: true
    },
    author: {
      name: {
        type: String,
        default: 'SEO++ Editorial Team'
      },
      role: {
        type: String,
        default: 'SEO & Growth Specialists'
      },
      avatar: {
        type: String,
        default: ''
      },
      bio: {
        type: String,
        default: 'Dedicated to helping businesses and creators grow their search visibility.'
      }
    },
    status: {
      type: String,
      enum: ARTICLE_STATUSES,
      default: 'draft',
      index: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    readingTime: {
      type: Number,
      default: 5
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'SEO title cannot exceed 100 characters']
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'SEO description cannot exceed 200 characters']
    },
    canonicalUrl: {
      type: String,
      trim: true,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    // Monetization Foundation
    isSponsored: {
      type: Boolean,
      default: false
    },
    sponsorName: {
      type: String,
      default: null,
      trim: true
    },
    sponsorUrl: {
      type: String,
      default: null,
      trim: true
    },
    sponsoredRel: {
      type: String,
      default: 'sponsored noopener'
    },
    // Contextual Internal Linking Tool
    relatedTool: {
      type: String,
      enum: RELATED_TOOLS,
      default: 'seo-checker'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for fast querying of published articles
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ status: 1, category: 1, publishedAt: -1 });
articleSchema.index({ status: 1, isFeatured: 1 });
articleSchema.index({
  title: 'text',
  excerpt: 'text',
  tags: 'text'
});

// Auto-calculate reading time before saving if content is provided
articleSchema.pre('save', function () {
  if (this.isModified('content')) {
    const wordCount = (this.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  // If status is published and publishedAt is not set, set it now
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = {
  Article,
  BLOG_CATEGORIES,
  ARTICLE_STATUSES,
  RELATED_TOOLS
};
