'use strict';

const mongoose = require('mongoose');

const INQUIRY_TYPES = [
  'guest_post',
  'sponsored_article',
  'collaboration',
  'agency_pitch',
  'other'
];

const INQUIRY_STATUSES = ['pending', 'reviewed', 'contacted', 'declined'];

const publishInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Your name is required'],
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Valid email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    inquiryType: {
      type: String,
      enum: INQUIRY_TYPES,
      default: 'guest_post'
    },
    proposedTopic: {
      type: String,
      required: [true, 'Proposed topic or headline is required'],
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: [true, 'Article outline / pitch message is required'],
      trim: true,
      maxlength: 3000
    },
    samples: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: INQUIRY_STATUSES,
      default: 'pending',
      index: true
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const PublishInquiry = mongoose.model('PublishInquiry', publishInquirySchema);

module.exports = {
  PublishInquiry,
  INQUIRY_TYPES,
  INQUIRY_STATUSES
};
