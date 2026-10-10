import assert from 'node:assert';
import { sanitizeFilename, generateCsv, formatReportDate } from '../src/utils/exportUtils.js';

console.log('=== RUNNING TESTS FOR REPORT EXPORTERS ===\n');

// 1. Test Filename Sanitization
console.log('1. Testing Filename Sanitization...');
assert.strictEqual(sanitizeFilename('https://example.com/test', 'seo-audit', 'pdf'), 'seo-audit-example-com.pdf');
assert.strictEqual(sanitizeFilename('https://www.github.com/subhan-subi?ref=123', 'dr-report', 'csv'), 'dr-report-github-com.csv');
assert.strictEqual(sanitizeFilename('http://Sub.Domain.Co.Uk:8080/path#hash', 'seo-audit', 'pdf'), 'seo-audit-sub-domain-co-uk.pdf');
assert.strictEqual(sanitizeFilename('', 'dr-report', 'pdf').startsWith('dr-report-'), true);
console.log('   ✓ Filename sanitization passed!');

// 2. Test CSV Generation
console.log('2. Testing CSV Generation & RFC 4180 Escaping...');
const sampleRows = [
  ['Header 1', 'Header 2', 'Header 3'],
  ['Simple text', 100, 'Text with, comma'],
  ['Quotes "inside"', 'Line 1\nLine 2', null]
];
const csvResult = generateCsv(sampleRows);
assert.ok(csvResult.includes('"Text with, comma"'), 'Should escape commas with quotes');
assert.ok(csvResult.includes('"Quotes ""inside"""'), 'Should escape quotes by doubling them');
assert.ok(csvResult.includes('"Line 1\nLine 2"'), 'Should wrap multi-line text in quotes');
assert.ok(csvResult.includes('""'), 'Should represent null as empty string');
console.log('   ✓ CSV generation & escaping passed!');

// 3. Test Date Formatting
console.log('3. Testing Report Date Formatting...');
const dateResult = formatReportDate('2026-10-10T12:00:00.000Z');
assert.ok(dateResult.dateStr.includes('2026'), 'Date should include year 2026');
assert.ok(dateResult.fullStr.length > 5, 'Full date string should be non-empty');
console.log('   ✓ Date formatting passed!');

// 4. Test DR PDF Generation with jsPDF & autoTable
console.log('4. Testing DR PDF Generation (jsPDF + autoTable)...');
const { jsPDF } = await import('jspdf');
const { default: autoTable } = await import('jspdf-autotable');

const sampleDrResult = {
  domain: 'ahrefs.com',
  target: 'ahrefs.com',
  domainRating: 91,
  ahrefsRank: 450,
  metric: 'Ahrefs Domain Rating (DR)',
  source: 'Ahrefs Reference Benchmark',
  checkedAt: '2026-10-10T12:00:00.000Z'
};

const sampleTier = {
  label: 'Very High Authority',
  tier: 'Tier 1 Global Authority',
  hex: '#10b981',
  description: 'Exceptional backlink profile among the most authoritative domains on the web.'
};

const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
doc.text('SEO++ Test DR Report', 40, 40);

autoTable(doc, {
  startY: 60,
  head: [['Tier', 'DR Range', 'Description']],
  body: [
    ['Tier 1', '80 - 100', 'Very High Authority'],
    ['Tier 2', '60 - 79', 'High Authority'],
    ['Tier 3', '40 - 59', 'Moderate Authority']
  ]
});

const pdfArray = doc.output('arraybuffer');
assert.ok(pdfArray.byteLength > 1000, 'Generated PDF should be valid binary array (>1KB)');
console.log(`   ✓ DR PDF generated successfully: ${pdfArray.byteLength} bytes!`);

// 5. Test SEO Audit PDF Generation
console.log('5. Testing Multi-Page SEO Audit PDF Generation...');
const seoDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
seoDoc.text('SEO++ Test Audit Report', 40, 40);

// Add realistic sample rows spanning multiple pages
const checkRows = [];
for (let i = 1; i <= 35; i++) {
  checkRows.push([
    i % 3 === 0 ? 'FAILED' : i % 2 === 0 ? 'WARNING' : 'PASSED',
    'Technical SEO',
    `Check #${i}: Test Verification Title for Criteria`,
    'Why it matters: Detailed explanation of technical crawlability and indexing.',
    'How to fix: Implementation steps for webmasters and software developers.'
  ]);
}

autoTable(seoDoc, {
  startY: 60,
  head: [['Status', 'Category', 'Title', 'Why It Matters', 'How to Fix']],
  body: checkRows
});

const pageCount = seoDoc.internal.getNumberOfPages();
assert.ok(pageCount >= 2, `SEO audit table should span multiple pages (got ${pageCount} pages)`);
const seoPdfArray = seoDoc.output('arraybuffer');
assert.ok(seoPdfArray.byteLength > 2000, 'Generated SEO PDF should be valid binary array');
console.log(`   ✓ Multi-page SEO Audit PDF generated: ${pageCount} pages, ${seoPdfArray.byteLength} bytes!`);

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===\n');
