import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const urls = [
  { path: '', canonical: 'https://seoplusplus.vercel.app/' },
  { path: 'tools', canonical: 'https://seoplusplus.vercel.app/tools' },
  { path: 'tools/search-console', canonical: 'https://seoplusplus.vercel.app/tools/search-console' },
  { path: 'tools/dr-checker', canonical: 'https://seoplusplus.vercel.app/tools/dr-checker' },
  { path: 'tools/keyword-finder', canonical: 'https://seoplusplus.vercel.app/tools/keyword-finder' },
  { path: 'tools/hashtags', canonical: 'https://seoplusplus.vercel.app/tools/hashtags' },
  { path: 'tools/captions', canonical: 'https://seoplusplus.vercel.app/tools/captions' },
  { path: 'tools/hooks', canonical: 'https://seoplusplus.vercel.app/tools/hooks' },
  { path: 'tools/content-ideas', canonical: 'https://seoplusplus.vercel.app/tools/content-ideas' },
  { path: 'tools/character-counter', canonical: 'https://seoplusplus.vercel.app/tools/character-counter' },
  { path: 'tools/utm-builder', canonical: 'https://seoplusplus.vercel.app/tools/utm-builder' },
  { path: 'blog', canonical: 'https://seoplusplus.vercel.app/blog' },
  { path: 'write-for-us', canonical: 'https://seoplusplus.vercel.app/write-for-us' },
  { path: 'blog/what-is-seo-beginners-guide', canonical: 'https://seoplusplus.vercel.app/blog/what-is-seo-beginners-guide' },
  { path: 'blog/how-to-check-website-seo-audit-guide', canonical: 'https://seoplusplus.vercel.app/blog/how-to-check-website-seo-audit-guide' },
  { path: 'blog/google-search-console-beginner-guide', canonical: 'https://seoplusplus.vercel.app/blog/google-search-console-beginner-guide' },
  { path: 'blog/technical-seo-checklist-crawling-indexing', canonical: 'https://seoplusplus.vercel.app/blog/technical-seo-checklist-crawling-indexing' },
  { path: 'blog/how-to-write-high-ctr-meta-titles-descriptions', canonical: 'https://seoplusplus.vercel.app/blog/how-to-write-high-ctr-meta-titles-descriptions' },
  { path: 'blog/guest-posting-quality-guidelines-outreach', canonical: 'https://seoplusplus.vercel.app/blog/guest-posting-quality-guidelines-outreach' },
  { path: 'about', canonical: 'https://seoplusplus.vercel.app/about' },
  { path: 'contact', canonical: 'https://seoplusplus.vercel.app/contact' },
  { path: 'privacy', canonical: 'https://seoplusplus.vercel.app/privacy' },
  { path: 'terms', canonical: 'https://seoplusplus.vercel.app/terms' },
  { path: 'disclaimer', canonical: 'https://seoplusplus.vercel.app/disclaimer' }
];

let passCount = 0;
let failCount = 0;

console.log('=== AUDITING 24 STATIC HTML BUILD FILES ===\n');

for (const item of urls) {
  const filePath = item.path === '' 
    ? path.resolve(distDir, 'index.html') 
    : path.resolve(distDir, item.path, 'index.html');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ MISSING FILE: ${filePath}`);
    failCount++;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const hasRootContent = !content.includes('<div id="root"></div>');

  const actualCanonical = canonicalMatch ? canonicalMatch[1] : 'NONE';
  const actualTitle = titleMatch ? titleMatch[1] : 'NONE';
  const hasH1 = !!h1Match;

  const canonicalCorrect = actualCanonical === item.canonical;

  if (canonicalCorrect && hasH1 && hasRootContent) {
    console.log(`✅ [OK] ${item.canonical}`);
    console.log(`   Title: ${actualTitle}`);
    console.log(`   Canonical: ${actualCanonical}`);
    console.log(`   H1: Found | Pre-rendered Body: ${content.length} bytes\n`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${item.canonical}`);
    console.error(`   Expected Canonical: ${item.canonical}, Got: ${actualCanonical}`);
    console.error(`   Has H1: ${hasH1}, Has Root Content: ${hasRootContent}\n`);
    failCount++;
  }
}

console.log(`\nAudit Summary: ${passCount} PASSED, ${failCount} FAILED.`);
if (failCount > 0) {
  process.exit(1);
}
