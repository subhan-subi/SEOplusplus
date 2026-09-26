import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Tool Pages
import ToolsDirectory from './pages/tools/ToolsDirectory';
import HashtagGenerator from './pages/tools/HashtagGenerator';
import CaptionGenerator from './pages/tools/CaptionGenerator';
import HookGenerator from './pages/tools/HookGenerator';
import ContentIdeas from './pages/tools/ContentIdeas';
import CharacterCounter from './pages/tools/CharacterCounter';
import UtmBuilder from './pages/tools/UtmBuilder';
import SearchConsole from './pages/tools/SearchConsole';

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

                {/* Toolkit Directory & Tools */}
                <Route path="/tools" element={<ToolsDirectory />} />
                <Route path="/tools/hashtags" element={<HashtagGenerator />} />
                <Route path="/tools/captions" element={<CaptionGenerator />} />
                <Route path="/tools/hooks" element={<HookGenerator />} />
                <Route path="/tools/content-ideas" element={<ContentIdeas />} />
                <Route path="/tools/character-counter" element={<CharacterCounter />} />
                <Route path="/tools/utm-builder" element={<UtmBuilder />} />
                <Route path="/tools/search-console" element={<SearchConsole />} />

                {/* Company Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
