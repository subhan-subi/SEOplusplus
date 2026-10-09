import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');

/**
 * Validates a seed keyword on the client before submission.
 *
 * @param {string} input
 * @returns {string|null} Error message or null if valid
 */
export function validateClientSeed(input) {
  if (!input || typeof input !== 'string') {
    return 'Please enter a seed keyword (e.g. "seo tools").';
  }

  const clean = input.trim().replace(/\s+/g, ' ');
  if (!clean) {
    return 'Please enter a seed keyword.';
  }

  if (/<[^>]*>|[<>]|javascript:/i.test(input)) {
    return 'HTML or script tags are not allowed in the seed keyword.';
  }

  if (clean.length < 2) {
    return 'Seed keyword must be at least 2 characters long.';
  }

  if (clean.length > 80) {
    return 'Seed keyword is too long. Please enter a phrase under 80 characters.';
  }

  return null;
}

function isPlural(word) {
  return word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('is') && !word.endsWith('us');
}

/**
 * Client-side keyword generator fallback.
 * Ensures the tool always returns rich results even if the backend API is sleeping or unreachable.
 */
export function generateLocalKeywordIdeas(seed) {
  const cleanSeed = seed.toLowerCase().trim().replace(/\s+/g, ' ');
  const seen = new Set();
  const ideas = [];
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

  // 1. QUESTION KEYWORDS
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

  // 2. LONG-TAIL KEYWORDS
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

  if (!hasTool && !hasSoftware && !hasService) {
    addIdea(`${cleanSeed} tools`, 'Long-tail', 'Commercial');
  }

  // 3. COMPARISON KEYWORDS
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

  // 4. COMMERCIAL / TRANSACTIONAL
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

  // 5. RELATED MODIFIERS
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
 * Requests keyword ideas from the backend API, falling back to local generation.
 *
 * @param {string} keyword
 * @param {Object} options - { country, language }
 * @returns {Promise<Object>} Keyword ideas result { keyword, country, language, total, ideas, notice }
 */
export async function findKeywordIdeas(keyword, options = {}) {
  const clean = (keyword || '').trim().replace(/\s+/g, ' ');

  try {
    const response = await axios.post(`${API_BASE}/keywords/find`, {
      keyword: clean,
      country: options.country || undefined,
      language: options.language || undefined
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    });

    if (response.data && response.data.success && response.data.ideas?.length > 0) {
      return response.data;
    }
  } catch (err) {
    // API is offline or cold — fall back to deterministic client generation
  }

  const ideas = generateLocalKeywordIdeas(clean);
  return {
    success: true,
    keyword: clean,
    country: options.country || 'Global',
    language: options.language || 'English',
    total: ideas.length,
    ideas,
    notice: 'Keyword ideas are generated from your seed keyword. Search volume, CPC, and competition data are not included in this free version.',
    generatedAt: new Date().toISOString()
  };
}
