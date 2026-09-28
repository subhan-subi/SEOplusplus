import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

function XIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.79v-7.6H6.46M7.86 6.3a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
    </svg>
  );
}

function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  );
}

export default function ShareButtons({ title, url }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast('Article link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy link to clipboard', 'error');
    }
  };

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleLinkedinShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  return (
    <div className="blog-share-bar d-flex align-items-center gap-2 flex-wrap" role="group" aria-label="Share article">
      <span className="text-muted small fw-medium d-inline-flex align-items-center gap-1 me-1">
        <Share2 size={14} />
        <span>Share:</span>
      </span>

      <button
        type="button"
        className="btn btn-sm blog-share-btn"
        onClick={handleCopyLink}
        title="Copy article link"
        aria-label="Copy article link"
      >
        {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      <button
        type="button"
        className="btn btn-sm blog-share-btn"
        onClick={handleTwitterShare}
        title="Share on X (Twitter)"
        aria-label="Share on X (Twitter)"
      >
        <XIcon size={13} />
        <span>X</span>
      </button>

      <button
        type="button"
        className="btn btn-sm blog-share-btn"
        onClick={handleLinkedinShare}
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon size={14} />
        <span>LinkedIn</span>
      </button>

      <button
        type="button"
        className="btn btn-sm blog-share-btn"
        onClick={handleFacebookShare}
        title="Share on Facebook"
        aria-label="Share on Facebook"
      >
        <FacebookIcon size={14} />
        <span>Facebook</span>
      </button>
    </div>
  );
}
