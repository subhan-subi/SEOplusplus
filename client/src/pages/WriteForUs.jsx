import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PenTool, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  BookOpen, 
  FileCheck, 
  MessageSquare,
  Users,
  DollarSign,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { submitPublishInquiry } from '../services/blogService';
import BlogSeo from '../components/blog/BlogSeo';
import { useToast } from '../context/ToastContext';

export default function WriteForUs() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    company: '',
    inquiryType: 'guest_post',
    proposedTopic: '',
    message: '',
    samples: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.proposedTopic.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, Proposed Topic, and Message).');
      return;
    }

    setSubmitting(true);
    try {
      await submitPublishInquiry(formData);
      setSubmitted(true);
      showToast('Publishing pitch submitted successfully!', 'success');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
      showToast('Submission error. Please check form details.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="write-for-us-page pb-5">
      <BlogSeo
        title="Write for Us & Publish with SEO++ | Editorial Guidelines & Sponsored Pitches"
        description="Contribute to SEO++. We publish actionable SEO guides, website growth case studies, and sponsored articles. Submit your pitch to our editorial team."
        canonicalUrl="https://seoplusplus.vercel.app/write-for-us"
        ogType="website"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: 'Write for Us', url: '/write-for-us' }
        ]}
      />

      {/* Hero Header */}
      <section className="blog-hero py-5 text-center position-relative">
        <div className="container py-lg-4" style={{ maxWidth: '840px' }}>
          <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill blog-hero-badge">
            <PenTool size={14} className="text-primary" />
            <span className="small fw-semibold">Publish with SEO++</span>
          </div>

          <h1 className="display-5 fw-bold text-main mb-3">
            Share Your Expertise with the <span className="blog-headline-gradient">SEO++ Audience</span>
          </h1>

          <p className="lead text-secondary mb-4 mx-auto" style={{ maxWidth: '640px' }}>
            We collaborate with SEO practitioners, agencies, SaaS founders, and digital marketing writers to publish high-value educational content.
          </p>

          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap small text-muted">
            <span className="d-inline-flex align-items-center gap-1">
              <CheckCircle2 size={14} className="text-success" />
              <span>High Domain Visibility</span>
            </span>
            <span>&bull;</span>
            <span className="d-inline-flex align-items-center gap-1">
              <CheckCircle2 size={14} className="text-success" />
              <span>Targeted Organic Readers</span>
            </span>
            <span>&bull;</span>
            <span className="d-inline-flex align-items-center gap-1">
              <CheckCircle2 size={14} className="text-success" />
              <span>Compliant Editorial Linking</span>
            </span>
          </div>
        </div>
      </section>

      <div className="container py-5" style={{ maxWidth: '1000px' }}>
        {/* Topics We Welcome */}
        <section className="mb-5">
          <div className="text-center mb-5">
            <span className="text-primary small fw-semibold text-uppercase tracking-wider">Content Scope</span>
            <h2 className="h2 fw-bold text-main">What We Publish</h2>
            <p className="text-secondary small">We look for authoritative, practical guides across these core pillars:</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 p-4 rounded-4 border blog-pillar-card">
                <div className="blog-pillar-icon mb-3 text-primary"><BookOpen size={24} /></div>
                <h3 className="h6 fw-bold text-main mb-2">Technical &amp; On-Page SEO</h3>
                <p className="text-secondary small mb-0">
                  Crawlability, Core Web Vitals, site architecture, canonicalization, and structured data.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 p-4 rounded-4 border blog-pillar-card">
                <div className="blog-pillar-icon mb-3 text-primary"><Sparkles size={24} /></div>
                <h3 className="h6 fw-bold text-main mb-2">Website &amp; Traffic Growth</h3>
                <p className="text-secondary small mb-0">
                  Real case studies, conversion optimization, organic ranking turnarounds, and keyword strategy.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 p-4 rounded-4 border blog-pillar-card">
                <div className="blog-pillar-icon mb-3 text-primary"><Users size={24} /></div>
                <h3 className="h6 fw-bold text-main mb-2">Google Search Console</h3>
                <p className="text-secondary small mb-0">
                  Indexing audits, CTR optimization, ranking diagnostics, and query analytics workflows.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 p-4 rounded-4 border blog-pillar-card">
                <div className="blog-pillar-icon mb-3 text-primary"><DollarSign size={24} /></div>
                <h3 className="h6 fw-bold text-main mb-2">Sponsored Content &amp; Tools</h3>
                <p className="text-secondary small mb-0">
                  Transparent commercial partnerships, brand deep-dives, and tool reviews following Google guidelines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Standards & Guidelines */}
        <section className="mb-5 p-4 p-md-5 rounded-4 border blog-guidelines-box">
          <div className="d-flex align-items-center gap-2 mb-3">
            <ShieldCheck size={22} className="text-primary" />
            <h2 className="h4 fw-bold text-main mb-0">Editorial Guidelines &amp; Quality Standards</h2>
          </div>
          <p className="text-secondary mb-4">
            To ensure our readers always receive genuine value, all submissions must satisfy our quality bar:
          </p>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-main d-block">100% Original Content</strong>
                    <span className="small text-secondary">Articles must be unpublished elsewhere and pass strict plagiarism checks. No spun or generic AI output.</span>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-main d-block">Depth &amp; Practical Value</strong>
                    <span className="small text-secondary">Submissions should typically range from 1,200 to 2,500 words with actionable steps, code snippets, or real screenshots.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6">
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-main d-block">Transparent Sponsored Links</strong>
                    <span className="small text-secondary">Paid or commercial links are tagged with <code>rel="sponsored"</code> in compliance with search engine guidelines.</span>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <CheckCircle2 size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-main d-block">Editorial Review &amp; Polish</strong>
                    <span className="small text-secondary">Our editors may refine headlines, formatting, and internal links to ensure maximum readability and SEO resonance.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Workflow Steps */}
        <section className="mb-5">
          <div className="text-center mb-5">
            <span className="text-primary small fw-semibold text-uppercase tracking-wider">How It Works</span>
            <h2 className="h2 fw-bold text-main">Our Publishing Process</h2>
            <p className="text-secondary small">Transparent, manual, and collaborative from pitch to live publication.</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 border h-100">
                <div className="blog-workflow-step-num mx-auto mb-3">1</div>
                <h3 className="h6 fw-bold text-main mb-2">Submit Your Pitch</h3>
                <p className="small text-secondary mb-0">
                  Send your proposed topic, angle, outline, and writing samples using the form below.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 border h-100">
                <div className="blog-workflow-step-num mx-auto mb-3">2</div>
                <h3 className="h6 fw-bold text-main mb-2">Editorial Review &amp; Terms</h3>
                <p className="small text-secondary mb-0">
                  Our team reviews fit within 2–3 business days, agrees on scope, timeline, or sponsorship details.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 rounded-4 border h-100">
                <div className="blog-workflow-step-num mx-auto mb-3">3</div>
                <h3 className="h6 fw-bold text-main mb-2">Publication &amp; Promotion</h3>
                <p className="small text-secondary mb-0">
                  We schedule the approved article, optimize the on-page meta tags, and feature it across SEO++.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Pitch Submission Form */}
        <section id="pitch-form" className="p-4 p-md-5 rounded-4 border blog-form-box">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-2 mb-2 text-primary fw-semibold small">
              <MessageSquare size={16} />
              <span>Get in Touch</span>
            </div>
            <h2 className="h3 fw-bold text-main mb-2">Submit Your Publishing Pitch</h2>
            <p className="text-secondary small mx-auto" style={{ maxWidth: '520px' }}>
              Fill out the form below. Our editorial team will review your pitch and reply via email.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 text-center rounded-4 border blog-success-box my-3">
              <CheckCircle2 size={48} className="text-success mb-3" />
              <h3 className="h4 fw-bold text-main mb-2">Pitch Received!</h3>
              <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '480px' }}>
                Thank you for your interest in publishing with SEO++. Our editors will review your proposal and get in touch with you at <strong>{formData.email}</strong> shortly.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/blog" className="btn btn-primary">
                  Browse Recent Articles
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      website: '',
                      company: '',
                      inquiryType: 'guest_post',
                      proposedTopic: '',
                      message: '',
                      samples: ''
                    });
                  }}
                  className="btn btn-outline-secondary"
                >
                  Submit Another Pitch
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '720px' }}>
              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="inquiry-name" className="form-label fw-semibold small text-main">
                    Your Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="inquiry-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="inquiry-email" className="form-label fw-semibold small text-main">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="inquiry-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="sarah@agency.com"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="inquiry-website" className="form-label fw-semibold small text-main">
                    Your Website or Portfolio URL
                  </label>
                  <input
                    type="url"
                    id="inquiry-website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="inquiry-type" className="form-label fw-semibold small text-main">
                    Inquiry Type <span className="text-danger">*</span>
                  </label>
                  <select
                    id="inquiry-type"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="guest_post">Editorial Guest Article</option>
                    <option value="sponsored_article">Sponsored Post / Commercial Feature</option>
                    <option value="collaboration">Agency / Strategic Collaboration</option>
                    <option value="other">General Publishing Question</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="inquiry-topic" className="form-label fw-semibold small text-main">
                  Proposed Article Title / Topic <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="inquiry-topic"
                  name="proposedTopic"
                  required
                  value={formData.proposedTopic}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. 5 Overlooked Technical Crawl Issues on React Single-Page Apps"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="inquiry-message" className="form-label fw-semibold small text-main">
                  Article Outline &amp; Why It Matters to SEO++ Readers <span className="text-danger">*</span>
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Briefly describe the main headings, data points, or practical takeaways you plan to cover..."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="inquiry-samples" className="form-label fw-semibold small text-main">
                  Writing Samples or Published Links (Optional)
                </label>
                <input
                  type="text"
                  id="inquiry-samples"
                  name="samples"
                  value={formData.samples}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Paste links to 1–2 recent published articles or portfolio"
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary py-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                >
                  {submitting ? (
                    <span>Submitting Pitch...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Pitch to Editorial Team</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-muted small text-center mt-3 mb-0">
                We review submissions within 2 to 3 business days. We never sell your email or spam you.
              </p>
            </form>
          )}
        </section>

        {/* FAQs */}
        <section className="mt-5 pt-4">
          <div className="text-center mb-4">
            <h2 className="h4 fw-bold text-main">Frequently Asked Questions</h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-3 border h-100">
                <h3 className="h6 fw-bold text-main mb-2">Do you charge for standard guest posts?</h3>
                <p className="small text-secondary mb-0">
                  No. Genuine, high-quality educational guest posts from industry experts are published free of charge. Commercial or promotional articles are reviewed under our sponsored partnership terms.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-4 rounded-3 border h-100">
                <h3 className="h6 fw-bold text-main mb-2">Can I include links back to my website?</h3>
                <p className="small text-secondary mb-0">
                  Yes, you may include a contextual link to relevant research or tools, plus an author bio link. Any paid or affiliate placements must carry the <code>rel="sponsored"</code> attribute.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
