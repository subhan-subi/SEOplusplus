import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Shield, 
  Sparkles, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { BRAND } from '../config/brand';
import PageSeo from '../components/common/PageSeo';
import { useToast } from '../context/ToastContext';

function GithubIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, and Message).');
      return;
    }

    setSubmitting(true);
    // Simulate submission locally
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast('Your message has been sent successfully!', 'success');
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '880px' }}>
      <PageSeo
        title="Contact Us – Get in Touch with SEO++"
        description="Have questions, feedback, bug reports, or feature requests for SEO++? Reach out to our team through our contact form and official channels."
        canonicalUrl="https://seoplusplus.vercel.app/contact"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' }
        ]}
      />

      {/* Header */}
      <div className="mb-5 text-center">
        <span className="badge-subtle-primary mb-3 d-inline-block">
          Support &amp; Inquiries
        </span>
        <h1 className="h2 fw-bold text-main mb-2">Contact {BRAND.name}</h1>
        <p className="text-secondary max-w-600 mx-auto" style={{ maxWidth: '600px' }}>
          Have feedback on our SEO Checker, suggestions for new marketing tools, or privacy questions? We'd love to hear from you.
        </p>
      </div>

      <div className="row g-4">
        {/* Contact Form */}
        <div className="col-12 col-md-7">
          <div className="p-4 p-md-5 rounded-4 border h-100" style={{ backgroundColor: 'var(--bg-card)' }}>
            <h2 className="h5 fw-bold text-main mb-3">Send Us a Message</h2>

            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle2 size={48} className="text-success mb-3" />
                <h3 className="h5 fw-bold text-main mb-2">Message Received!</h3>
                <p className="text-secondary small mb-4">
                  Thank you for contacting {BRAND.name}. We have received your inquiry from <strong>{formData.email}</strong> and will get back to you as soon as possible.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Question', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 p-2 small" role="alert">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="contact-name" className="form-label small fw-bold text-main">
                    Your Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="contact-email" className="form-label small fw-bold text-main">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="alex@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="contact-subject" className="form-label small fw-bold text-main">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Bug Report">Tool Issue or Bug Report</option>
                    <option value="Feature Request">Feature Request / Tool Suggestion</option>
                    <option value="Privacy Concern">Privacy or Data Handling Inquiry</option>
                    <option value="Editorial / Guest Post">Editorial / Guest Post Pitch</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="contact-message" className="form-label small fw-bold text-main">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="How can we help you? Include any relevant URLs or error messages..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-100 py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                >
                  {submitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="col-12 col-md-5">
          <div className="d-flex flex-column gap-3">
            {/* Direct Channel Box */}
            <div className="p-4 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <GithubIcon size={18} className="text-primary" />
                <h3 className="h6 fw-bold text-main mb-0">Open Source &amp; Code</h3>
              </div>
              <p className="text-secondary small mb-3">
                SEO++ is developed transparently on GitHub. You can file public bug reports, inspect source code, or contribute features directly:
              </p>
              <a
                href="https://github.com/subhan-subi/SEOplusplus"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-2"
              >
                <GithubIcon size={15} />
                <span>GitHub Repository</span>
              </a>
            </div>

            {/* Response Time Box */}
            <div className="p-4 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Clock size={18} className="text-primary" />
                <h3 className="h6 fw-bold text-main mb-0">Response Time</h3>
              </div>
              <p className="text-secondary small mb-0">
                Our team reviews inbound messages regularly. We typically respond within <strong>1 to 2 business days</strong> (Monday through Friday).
              </p>
            </div>

            {/* Quick Links */}
            <div className="p-4 rounded-4 border" style={{ backgroundColor: 'var(--bg-card)' }}>
              <h3 className="h6 fw-bold text-main mb-3">Quick Navigation</h3>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
                <li>
                  <Link to="/write-for-us" className="text-primary text-decoration-none hover-underline">
                    &bull; Submit a Guest Article / Pitch
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-primary text-decoration-none hover-underline">
                    &bull; Review our Privacy Policy &amp; Cookie Notice
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="text-primary text-decoration-none hover-underline">
                    &bull; Read our Disclaimer &amp; Limitations
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-primary text-decoration-none hover-underline">
                    &bull; Learn More About {BRAND.name}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
