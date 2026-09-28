import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export default function TableOfContents({ contentSelector = '.blog-article-content' }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const headingNodes = container.querySelectorAll('h2, h3');
    const items = [];

    headingNodes.forEach((node, index) => {
      // Ensure heading has an ID
      if (!node.id) {
        const generatedId = node.textContent
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        node.id = generatedId || `heading-${index}`;
      }

      items.push({
        id: node.id,
        text: node.textContent,
        level: node.tagName.toLowerCase() === 'h2' ? 2 : 3
      });
    });

    setHeadings(items);

    // IntersectionObserver to highlight current active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -65% 0px',
        threshold: 0.1
      }
    );

    headingNodes.forEach((node) => observer.observe(node));

    return () => {
      headingNodes.forEach((node) => observer.unobserve(node));
    };
  }, [contentSelector]);

  if (headings.length < 2) {
    return null;
  }

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const topOffset = 90; // header height clearance
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
  };

  return (
    <nav className="blog-toc-card p-4 rounded-4 border mb-4" aria-label="Table of contents">
      <div className="d-flex align-items-center gap-2 mb-3">
        <List size={16} className="text-primary" />
        <h4 className="h6 fw-bold mb-0 text-main">Table of Contents</h4>
      </div>
      <ul className="list-unstyled mb-0 d-flex flex-column gap-2 blog-toc-list">
        {headings.map((item) => (
          <li
            key={item.id}
            className={`blog-toc-item ${item.level === 3 ? 'ps-3' : ''} ${activeId === item.id ? 'active' : ''}`}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleScrollTo(e, item.id)}
              className="blog-toc-link"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
