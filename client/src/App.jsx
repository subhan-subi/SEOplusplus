import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/common/CookieConsent';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';

// Company & Policy Pages
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';
import WriteForUs from './pages/WriteForUs';

// Blog & Content Publishing Pages
import BlogList from './pages/blog/BlogList';
import ArticleDetail from './pages/blog/ArticleDetail';
import BlogAdmin from './pages/blog/BlogAdmin';

// Tool Pages
import ToolsDirectory from './pages/tools/ToolsDirectory';
import HashtagGenerator from './pages/tools/HashtagGenerator';
import CaptionGenerator from './pages/tools/CaptionGenerator';
import HookGenerator from './pages/tools/HookGenerator';
import ContentIdeas from './pages/tools/ContentIdeas';
import CharacterCounter from './pages/tools/CharacterCounter';
import UtmBuilder from './pages/tools/UtmBuilder';
import SearchConsole from './pages/tools/SearchConsole';
import DrChecker from './pages/tools/DrChecker';
import KeywordFinder from './pages/tools/KeywordFinder';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* SEO Checker Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/analyze" element={<Analyze />} />

                {/* SEO++ Blog & Knowledge Platform */}
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<ArticleDetail />} />
                <Route path="/blog/manage" element={<BlogAdmin />} />

                {/* Write for Us / Editorial Inquiries */}
                <Route path="/write-for-us" element={<WriteForUs />} />

                {/* Toolkit Directory & Tools */}
                <Route path="/tools" element={<ToolsDirectory />} />
                <Route path="/tools/hashtags" element={<HashtagGenerator />} />
                <Route path="/tools/captions" element={<CaptionGenerator />} />
                <Route path="/tools/hooks" element={<HookGenerator />} />
                <Route path="/tools/content-ideas" element={<ContentIdeas />} />
                <Route path="/tools/character-counter" element={<CharacterCounter />} />
                <Route path="/tools/utm-builder" element={<UtmBuilder />} />
                <Route path="/tools/search-console" element={<SearchConsole />} />
                <Route path="/tools/dr-checker" element={<DrChecker />} />
                <Route path="/tools/keyword-finder" element={<KeywordFinder />} />

                {/* Company & Policy Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/disclaimer" element={<Disclaimer />} />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
