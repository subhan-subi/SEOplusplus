
import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import {
  HelpCircle,
  Cpu,
  CheckCircle,
  Users,
  HeartHandshake,
  AlertTriangle,
  ArrowRight,
  Search,
  Hash,
  MessageSquare,
  Link as LinkIcon,
} from 'lucide-react';

export default function About() {
  return (
    <div className="container py-5" style={{ maxWidth: '840px' }}>
      {/* Hero */}
      <div className="mb-5 text-center">
        <span className="badge-subtle-primary mb-3 d-inline-block">
          About {BRAND.name}
        </span>

        <h1 className="h2 fw-bold text-main mb-3">
          Simple tools for SEO, content, and digital marketing.
        </h1>

        <p
          className="text-secondary max-w-600 mx-auto"
          style={{ maxWidth: '640px' }}
        >
          <strong>{BRAND.name}</strong> is a free collection of practical
          tools for website SEO, content creation, social media, and digital
          marketing. No accounts, subscriptions, or unnecessary complexity.
        </p>
      </div>

      <div className="d-flex flex-column gap-4">

        {/* 1. What is the platform? */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <HelpCircle size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              1. What is {BRAND.name}?
            </h2>
          </div>

          <p className="text-secondary mb-3">
            {BRAND.name} is a free, lightweight toolkit built for developers,
            content creators, marketers, students, and small businesses who
            need useful tools for everyday digital work.
          </p>

          <p className="text-muted small mb-0">
            It brings SEO analysis, social media tools, content helpers,
            text utilities, and campaign link generation together in one
            simple interface.
          </p>
        </section>

        {/* 2. How do the tools work? */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <Cpu size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              2. How do the tools work?
            </h2>
          </div>

          <p className="text-secondary mb-3">
            Different tools use different approaches depending on what they
            need to do:
          </p>

          <ul className="text-secondary small d-flex flex-column gap-2 mb-0 ps-3">
            <li>
              <strong>SEO Website Analysis:</strong> When you submit a public
              URL, the SEO Checker analyzes the target page, examines its
              HTML and technical signals, and calculates a health score based
              on the checks performed.
            </li>

            <li>
              <strong>Browser-Based Marketing Tools:</strong> The Hashtag
              Generator, Caption Generator, Hook Generator, Content Ideas,
              Character Counter, and UTM Builder run directly in your browser
              using predefined rules, templates, datasets, and calculations.
            </li>

            <li>
              <strong>No AI or LLM Dependency:</strong> Our content-generation
              tools do not rely on ChatGPT, Gemini, Claude, or other AI/LLM
              services. Results are generated using predefined templates and
              rule-based logic.
            </li>
          </ul>
        </section>

        {/* 3. Tools */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <CheckCircle size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              3. What tools are included?
            </h2>
          </div>

          <div className="row g-3">

            <div className="col-12 col-sm-6">
              <div
                className="p-3 rounded-3 border h-100"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <Search size={17} className="text-primary" />
                  <span>SEO Checker</span>
                </div>

                <p className="text-muted small mb-0">
                  Analyze a public webpage for technical and on-page SEO
                  signals, including metadata, headings, links, images,
                  canonical tags, and other checks.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div
                className="p-3 rounded-3 border h-100"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <Hash size={17} className="text-primary" />
                  <span>Hashtag Generator</span>
                </div>

                <p className="text-muted small mb-0">
                  Generate relevant hashtag suggestions from curated
                  categories, topic keywords, niches, and platform-specific
                  variations.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div
                className="p-3 rounded-3 border h-100"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <MessageSquare size={17} className="text-primary" />
                  <span>Caption & Hook Generators</span>
                </div>

                <p className="text-muted small mb-0">
                  Create quick caption drafts and opening hooks using
                  predefined templates, tones, topics, and content styles.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div
                className="p-3 rounded-3 border h-100"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-main">
                  <LinkIcon size={17} className="text-primary" />
                  <span>UTM Builder & Character Counter</span>
                </div>

                <p className="text-muted small mb-0">
                  Build campaign tracking URLs with UTM parameters and
                  measure characters, words, sentences, and other text
                  statistics in real time.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. Who can use it? */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <Users size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              4. Who can use it?
            </h2>
          </div>

          <p className="text-secondary mb-0">
            Anyone working with websites, content, or digital marketing.
            Developers can use the SEO Checker before publishing a page,
            marketers can build campaign links, and creators can generate
            hashtag suggestions, captions, hooks, and content ideas.
          </p>
        </section>

        {/* 5. Is it free? */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <HeartHandshake size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              5. Is it really free?
            </h2>
          </div>

          <p className="text-secondary mb-0">
            Yes. The tools are available to use for free without requiring
            an account, credit card, or subscription.
          </p>
        </section>

        {/* 6. Limitations */}
        <section
          className="p-4 rounded-4 border"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="brand-icon" aria-hidden="true">
              <AlertTriangle size={20} />
            </div>

            <h2 className="h5 fw-bold mb-0 text-main">
              6. What are its limitations?
            </h2>
          </div>

          <p className="text-secondary mb-2">
            {BRAND.name} is designed to provide practical automated
            assistance, not to replace professional SEO or marketing
            analysis.
          </p>

          <ul className="text-secondary small d-flex flex-column gap-2 mb-0 ps-3">
            <li>
              <strong>SEO Analysis:</strong> The SEO Checker evaluates the
              signals it can access from the submitted webpage. It does not
              provide a complete off-page SEO analysis, backlink profile,
              keyword ranking data, or search-engine ranking prediction.
            </li>

            <li>
              <strong>Content Tools:</strong> Generated captions, hooks,
              hashtags, and ideas are suggestions based on predefined rules
              and templates. Review and customize them before publishing.
            </li>

            <li>
              <strong>No Guarantees:</strong> Using these tools does not
              guarantee search rankings, social-media reach, engagement,
              followers, or conversions.
            </li>
          </ul>
        </section>

      </div>

      <div className="text-center pt-4 mt-2">
        <Link
          to="/tools"
          className="btn btn-analyze d-inline-flex align-items-center gap-2 px-4 py-2"
        >
          <span>Explore All Free Marketing Tools</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
