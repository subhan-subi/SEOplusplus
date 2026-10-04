'use strict';

/**
 * Keyword Generation Service
 *
 * Deterministically generates high-relevance keyword ideas, search questions,
 * comparison phrases, commercial terms, and long-tail variations from a seed keyword.
 *
 * Architecture is future-ready: can be extended to integrate Google Ads Keyword Planner,
 * Ahrefs Keywords Explorer, or DataForSEO without frontend rewrites.
 */

// Common stop words or prefixes to handle naturally
const QUESTION_STARTERS = ['what is', 'what are', 'how to', 'how does', 'how do', 'why is', 'why do'];

/**
 * Validates and normalizes user input for seed keyword.
 *
 * @param {string} rawInput
 * @returns {string} Normalized seed keyword
 */
function validateSeedKeyword(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    const err = new Error('Please enter a seed keyword (e.g. "seo tools").');
    err.statusCode = 400;
    throw err;
  }

  // Reject HTML tags, script injection, and special code patterns
  if (/<[^>]*>|[<>]|javascript:/i.test(rawInput)) {
    const err = new Error('HTML or script tags are not allowed in the seed keyword.');
    err.statusCode = 400;
    throw err;
  }

  // Normalize whitespace: trim and collapse multiple spaces
  const clean = rawInput.trim().replace(/\s+/g, ' ');

  if (!clean) {
    const err = new Error('Please enter a seed keyword.');
    err.statusCode = 400;
    throw err;
  }

  if (clean.length < 2) {
    const err = new Error('Seed keyword must be at least 2 characters long.');
    err.statusCode = 400;
    throw err;
  }

  if (clean.length > 80) {
    const err = new Error('Seed keyword is too long. Please enter a phrase under 80 characters.');
    err.statusCode = 400;
    throw err;
  }

  const wordCount = clean.split(' ').length;
  if (wordCount > 8) {
    const err = new Error('Seed keyword has too many words. Please enter a concise phrase with 8 or fewer words.');
    err.statusCode = 400;
    throw err;
  }

  return clean;
}

/**
 * Helper to determine if a seed noun is plural-like
 */
function isPlural(word) {
  return word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('is') && !word.endsWith('us');
}

/**
 * Generates keyword ideas from a validated seed keyword.
 *
 * @param {string} seed
 * @param {Object} options - Optional country, language
 * @returns {Array<Object>} Generated keyword idea objects
 */
function generateKeywordIdeas(seed, options = {}) {
  const cleanSeed = seed.toLowerCase().trim();
  const seen = new Set();
  const ideas = [];

  // Exclude the exact seed keyword itself from suggestions
  seen.add(cleanSeed);

  function addIdea(phrase, type, intent) {
    const normalized = phrase.toLowerCase().trim().replace(/\s+/g, ' ');
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);

    const length = normalized.split(' ').length;
    ideas.push({
      keyword: normalized,
      type,
      length,
      intent
    });
  }

  const words = cleanSeed.split(' ');
  const lastWord = words[words.length - 1];
  const firstWord = words[0];
  const hasTool = cleanSeed.includes('tool');
  const hasSoftware = cleanSeed.includes('software');
  const hasService = cleanSeed.includes('service');
  const startsWithBest = firstWord === 'best';
  const startsWithFree = firstWord === 'free';
  const startsWithHow = cleanSeed.startsWith('how to') || cleanSeed.startsWith('how ');
  const startsWithWhat = cleanSeed.startsWith('what is') || cleanSeed.startsWith('what are') || cleanSeed.startsWith('what ');
  const isSeedPlural = isPlural(lastWord);

  // ==========================================
  // 1. QUESTION KEYWORDS (Intent: Informational)
  // ==========================================
  if (!startsWithWhat && !startsWithHow) {
    if (isSeedPlural) {
      addIdea(`what are ${cleanSeed}`, 'Question', 'Informational');
    } else {
      addIdea(`what is ${cleanSeed}`, 'Question', 'Informational');
    }
    addIdea(`how to use ${cleanSeed}`, 'Question', 'Informational');
    addIdea(`how does ${cleanSeed} work`, 'Question', 'Informational');
    addIdea(`why is ${cleanSeed} important`, 'Question', 'Informational');
    addIdea(`how to improve ${cleanSeed}`, 'Question', 'Informational');
    addIdea(`how to choose the right ${cleanSeed}`, 'Question', 'Informational');
    addIdea(`when to use ${cleanSeed}`, 'Question', 'Informational');
    addIdea(`how to get started with ${cleanSeed}`, 'Question', 'Informational');
    addIdea(`how much does ${cleanSeed} cost`, 'Question', 'Commercial');
    addIdea(`is ${cleanSeed} worth it`, 'Question', 'Commercial');
  } else if (startsWithHow) {
    addIdea(`${cleanSeed} step by step`, 'Question', 'Informational');
    addIdea(`${cleanSeed} for beginners`, 'Question', 'Informational');
    addIdea(`${cleanSeed} easily`, 'Question', 'Informational');
  }

  // ==========================================
  // 2. LONG-TAIL KEYWORDS
  // ==========================================
  if (!startsWithBest) {
    addIdea(`best ${cleanSeed} for beginners`, 'Long-tail', 'Commercial');
  }
  if (!startsWithFree) {
    addIdea(`free ${cleanSeed}`, 'Long-tail', 'Commercial');
  }
  addIdea(`${cleanSeed} for beginners`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} for small business`, 'Long-tail', 'Commercial');
  addIdea(`${cleanSeed} for website`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} checklist`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} guide`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} strategy`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} examples`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} for wordpress`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} for developers`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} for bloggers`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} for ecommerce`, 'Long-tail', 'Commercial');
  addIdea(`${cleanSeed} best practices`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} tips and tricks`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} tutorial for beginners`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} template`, 'Long-tail', 'Transactional');
  addIdea(`${cleanSeed} roadmap`, 'Long-tail', 'Informational');
  addIdea(`${cleanSeed} case study`, 'Long-tail', 'Informational');

  // If seed doesn't already contain tool/tools, suggest it
  if (!hasTool && !hasSoftware && !hasService) {
    addIdea(`${cleanSeed} tools`, 'Long-tail', 'Commercial');
  }

  // ==========================================
  // 3. COMPARISON KEYWORDS
  // ==========================================
  if (!startsWithBest) {
    addIdea(`best ${cleanSeed}`, 'Comparison', 'Commercial');
  }
  addIdea(`${cleanSeed} vs alternatives`, 'Comparison', 'Commercial');
  addIdea(`${cleanSeed} comparison`, 'Comparison', 'Commercial');
  addIdea(`free vs paid ${cleanSeed}`, 'Comparison', 'Commercial');
  addIdea(`${cleanSeed} alternatives`, 'Comparison', 'Commercial');
  addIdea(`${cleanSeed} pros and cons`, 'Comparison', 'Informational');
  addIdea(`top 10 ${cleanSeed}`, 'Comparison', 'Commercial');
  addIdea(`${cleanSeed} reviews`, 'Comparison', 'Commercial');
  addIdea(`${cleanSeed} ratings and reviews`, 'Comparison', 'Commercial');

  // ==========================================
  // 4. COMMERCIAL / TRANSACTIONAL KEYWORDS
  // ==========================================
  addIdea(`affordable ${cleanSeed}`, 'Commercial', 'Commercial');
  if (!hasTool) {
    addIdea(`best ${cleanSeed} tool`, 'Commercial', 'Commercial');
  }
  if (!hasSoftware) {
    addIdea(`${cleanSeed} software`, 'Commercial', 'Commercial');
  }
  if (!hasService) {
    addIdea(`${cleanSeed} service`, 'Commercial', 'Transactional');
    addIdea(`${cleanSeed} agency`, 'Commercial', 'Transactional');
  }
  addIdea(`${cleanSeed} pricing`, 'Commercial', 'Commercial');
  addIdea(`${cleanSeed} platform`, 'Commercial', 'Commercial');
  addIdea(`hire ${cleanSeed} expert`, 'Commercial', 'Transactional');
  addIdea(`buy ${cleanSeed}`, 'Commercial', 'Transactional');
  addIdea(`${cleanSeed} discount`, 'Commercial', 'Transactional');
  addIdea(`enterprise ${cleanSeed}`, 'Commercial', 'Commercial');

  // ==========================================
  // 5. RELATED & NICHE MODIFIERS
  // ==========================================
  // Seed-specific enhancements for SEO and Marketing queries
  if (cleanSeed.includes('seo') || cleanSeed.includes('search engine')) {
    addIdea(`seo audit tools`, 'Related', 'Commercial');
    addIdea(`technical seo tools`, 'Related', 'Informational');
    addIdea(`on page ${cleanSeed}`, 'Related', 'Informational');
    addIdea(`off page ${cleanSeed}`, 'Related', 'Informational');
    addIdea(`local ${cleanSeed}`, 'Related', 'Commercial');
    addIdea(`automated ${cleanSeed}`, 'Related', 'Commercial');
  } else if (cleanSeed.includes('content') || cleanSeed.includes('copywriting')) {
    addIdea(`b2b ${cleanSeed}`, 'Related', 'Commercial');
    addIdea(`automated ${cleanSeed}`, 'Related', 'Commercial');
    addIdea(`digital ${cleanSeed}`, 'Related', 'Informational');
  } else {
    addIdea(`online ${cleanSeed}`, 'Related', 'Informational');
    addIdea(`automated ${cleanSeed}`, 'Related', 'Commercial');
    addIdea(`simple ${cleanSeed}`, 'Related', 'Informational');
    addIdea(`modern ${cleanSeed}`, 'Related', 'Informational');
  }

  addIdea(`${cleanSeed} near me`, 'Related', 'Navigational');
  addIdea(`${cleanSeed} online`, 'Related', 'Informational');
  addIdea(`${cleanSeed} login`, 'Related', 'Navigational');
  addIdea(`${cleanSeed} portal`, 'Related', 'Navigational');
  addIdea(`${cleanSeed} certification`, 'Related', 'Informational');
  addIdea(`${cleanSeed} training course`, 'Related', 'Commercial');

  return ideas;
}

/**
 * Main service entrypoint for finding keywords.
 *
 * @param {string} rawKeyword
 * @param {Object} options - Optional filters { country, language }
 * @returns {Promise<Object>} Formatted keyword search result
 */
async function findKeywords(rawKeyword, options = {}) {
  const cleanKeyword = validateSeedKeyword(rawKeyword);
  const ideas = generateKeywordIdeas(cleanKeyword, options);

  return {
    success: true,
    keyword: cleanKeyword,
    country: options.country || 'Global',
    language: options.language || 'English',
    total: ideas.length,
    ideas,
    notice: 'Keyword ideas are generated from your seed keyword. Search volume, CPC, and competition data are not included in this free version.',
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  validateSeedKeyword,
  generateKeywordIdeas,
  findKeywords
};
