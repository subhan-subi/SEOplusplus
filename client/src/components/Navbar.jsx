import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Sun, 
  Moon, 
  ChevronDown, 
  Menu, 
  X, 
  Hash, 
  MessageSquare, 
  Sparkles, 
  Lightbulb, 
  AlignLeft, 
  Link as LinkIcon,
  Wrench,
  BarChart2,
  BookOpen,
  TrendingUp,
  Key
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSocialDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setSocialDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isSeoActive = location.pathname === '/' || location.pathname === '/analyze';
  const isDrActive = location.pathname === '/tools/dr-checker';
  const isKeywordActive = location.pathname === '/tools/keyword-finder';
  const isSocialActive = location.pathname.startsWith('/tools/') && location.pathname !== '/tools/utm-builder' && location.pathname !== '/tools/search-console' && location.pathname !== '/tools/dr-checker' && location.pathname !== '/tools/keyword-finder';
  const isMarketingActive = location.pathname === '/tools/utm-builder';
  const isBlogActive = location.pathname.startsWith('/blog') || location.pathname === '/write-for-us';
  const isToolsActive = location.pathname === '/tools';
  const isAboutActive = location.pathname === '/about';
  const isGscActive = location.pathname === '/tools/search-console';

  return (
    <header className="site-header" role="banner">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between gap-3">

          {/* Logo / Brand */}
          <Link to="/" className="brand-logo-wrap" aria-label={`${BRAND.name} — Home`}>
            <div className="brand-icon" aria-hidden="true">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <span className="brand-text">{BRAND.name}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            <nav className="nav-links-wrap" aria-label="Main navigation">
              {/* SEO Tools */}
              <Link
                to="/"
                className={`nav-link-item${isSeoActive ? ' active' : ''}`}
                aria-current={isSeoActive ? 'page' : undefined}
              >
                SEO Tools
              </Link>

              {/* DR Checker */}
              <Link
                to="/tools/dr-checker"
                className={`nav-link-item${isDrActive ? ' active' : ''}`}
                aria-current={isDrActive ? 'page' : undefined}
              >
                DR Checker
              </Link>

              {/* Keyword Finder */}
              <Link
                to="/tools/keyword-finder"
                className={`nav-link-item${isKeywordActive ? ' active' : ''}`}
                aria-current={isKeywordActive ? 'page' : undefined}
              >
                Keyword Finder
              </Link>

              {/* Social Media Dropdown */}
              <div className="position-relative" ref={dropdownRef}>
                <button
                  type="button"
                  className={`nav-link-item d-inline-flex align-items-center gap-1 border-0 bg-transparent${isSocialActive ? ' active' : ''}`}
                  onClick={() => setSocialDropdownOpen(!socialDropdownOpen)}
                  aria-expanded={socialDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Social Media</span>
                  <ChevronDown size={14} style={{ transform: socialDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {socialDropdownOpen && (
                  <div className="nav-dropdown-menu" role="menu">
                    <Link to="/tools/hashtags" className="dropdown-tool-item" role="menuitem">
                      <div className="dropdown-tool-icon"><Hash size={16} /></div>
                      <div>
                        <div className="dropdown-tool-title">Hashtag Generator</div>
                        <div className="dropdown-tool-desc">Curated multi-platform tags</div>
                      </div>
                    </Link>

                    <Link to="/tools/captions" className="dropdown-tool-item" role="menuitem">
                      <div className="dropdown-tool-icon"><MessageSquare size={16} /></div>
                      <div>
                        <div className="dropdown-tool-title">Caption Generator</div>
                        <div className="dropdown-tool-desc">Template-based post captions</div>
                      </div>
                    </Link>

                    <Link to="/tools/hooks" className="dropdown-tool-item" role="menuitem">
                      <div className="dropdown-tool-icon"><Sparkles size={16} /></div>
                      <div>
                        <div className="dropdown-tool-title">Hook Generator</div>
                        <div className="dropdown-tool-desc">7 angles of opening lines</div>
                      </div>
                    </Link>

                    <Link to="/tools/content-ideas" className="dropdown-tool-item" role="menuitem">
                      <div className="dropdown-tool-icon"><Lightbulb size={16} /></div>
                      <div>
                        <div className="dropdown-tool-title">Content Ideas</div>
                        <div className="dropdown-tool-desc">Tutorials, lists & case studies</div>
                      </div>
                    </Link>

                    <Link to="/tools/character-counter" className="dropdown-tool-item" role="menuitem">
                      <div className="dropdown-tool-icon"><AlignLeft size={16} /></div>
                      <div>
                        <div className="dropdown-tool-title">Character Counter</div>
                        <div className="dropdown-tool-desc">Word stats & platform limits</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Marketing Tools */}
              <Link
                to="/tools/utm-builder"
                className={`nav-link-item${isMarketingActive ? ' active' : ''}`}
                aria-current={isMarketingActive ? 'page' : undefined}
              >
                Marketing Tools
              </Link>

              {/* SEO++ Blog */}
              <Link
                to="/blog"
                className={`nav-link-item${isBlogActive ? ' active' : ''}`}
                aria-current={isBlogActive ? 'page' : undefined}
              >
                Blog
              </Link>

              {/* All Tools Directory */}
              <Link
                to="/tools"
                className={`nav-link-item${isToolsActive ? ' active' : ''}`}
                aria-current={isToolsActive ? 'page' : undefined}
              >
                All Tools
              </Link>

              {/* About */}
              <Link
                to="/about"
                className={`nav-link-item${isAboutActive ? ' active' : ''}`}
                aria-current={isAboutActive ? 'page' : undefined}
              >
                About
              </Link>

              {/* Google Search Console – highlighted CTA */}
              <Link
                to="/tools/search-console"
                className={`nav-link-item d-inline-flex align-items-center gap-1${isGscActive ? ' active' : ''}`}
                aria-current={isGscActive ? 'page' : undefined}
                style={!isGscActive ? { color: 'var(--primary)', fontWeight: 600 } : {}}
              >
                <BarChart2 size={14} />
                Search Console
              </Link>
            </nav>

            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="theme-toggle-btn ms-2"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <>
                  <Sun size={14} aria-hidden="true" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={14} aria-hidden="true" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Button */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Accordion */}
        {mobileMenuOpen && (
          <div className="mobile-nav-panel pt-3 pb-2 mt-2 border-top d-lg-none">
            <div className="d-flex flex-column gap-1">
              <Link to="/" className={`mobile-nav-link ${isSeoActive ? 'active' : ''}`}>
                <Search size={16} />
                <span>SEO Checker</span>
              </Link>

              <Link to="/tools/dr-checker" className={`mobile-nav-link ${isDrActive ? 'active' : ''}`}>
                <TrendingUp size={16} />
                <span>DR Checker</span>
              </Link>

              <Link to="/tools/keyword-finder" className={`mobile-nav-link ${isKeywordActive ? 'active' : ''}`}>
                <Key size={16} />
                <span>Keyword Finder</span>
              </Link>

              <Link to="/blog" className={`mobile-nav-link ${isBlogActive ? 'active' : ''}`}>
                <BookOpen size={16} />
                <span>SEO++ Blog</span>
              </Link>

              <div className="mobile-nav-group-title">Social Media Tools</div>
              <Link to="/tools/hashtags" className="mobile-nav-sublink">
                <Hash size={15} />
                <span>Hashtag Generator</span>
              </Link>
              <Link to="/tools/captions" className="mobile-nav-sublink">
                <MessageSquare size={15} />
                <span>Caption Generator</span>
              </Link>
              <Link to="/tools/hooks" className="mobile-nav-sublink">
                <Sparkles size={15} />
                <span>Hook Generator</span>
              </Link>
              <Link to="/tools/content-ideas" className="mobile-nav-sublink">
                <Lightbulb size={15} />
                <span>Content Ideas</span>
              </Link>
              <Link to="/tools/character-counter" className="mobile-nav-sublink">
                <AlignLeft size={15} />
                <span>Character Counter</span>
              </Link>

              <div className="mobile-nav-group-title">Marketing Tools</div>
              <Link to="/tools/utm-builder" className="mobile-nav-sublink">
                <LinkIcon size={15} />
                <span>UTM Builder</span>
              </Link>

              <div className="border-top my-2 pt-2">
                <Link to="/tools" className={`mobile-nav-link ${isToolsActive ? 'active' : ''}`}>
                  <Wrench size={16} />
                  <span>All Marketing Tools</span>
                </Link>
                <Link to="/tools/search-console" className={`mobile-nav-link ${isGscActive ? 'active' : ''}`}>
                  <BarChart2 size={16} />
                  <span>Search Console</span>
                </Link>
                <Link to="/write-for-us" className="mobile-nav-link">
                  <span>Write for Us</span>
                </Link>
                <Link to="/about" className={`mobile-nav-link ${isAboutActive ? 'active' : ''}`}>
                  <span>About {BRAND.name}</span>
                </Link>
                <Link to="/contact" className={`mobile-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                  <MessageSquare size={16} />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
