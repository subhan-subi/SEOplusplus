import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AppContent } from './App';

export function render(url) {
  const html = renderToString(
    <ThemeProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[url]}>
          <AppContent />
        </MemoryRouter>
      </ToastProvider>
    </ThemeProvider>
  );
  return { html };
}
