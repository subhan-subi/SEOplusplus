/**
 * Platform Character Limits and Recommended Guidelines
 * Centralized configuration file for easy updates and audits.
 * 
 * Note: Platform policies may change over time. These limits reflect
 * standard published documentation guidelines as of 2026.
 */

export const PLATFORM_LIMITS = {
  Instagram: {
    name: 'Instagram',
    captionLimit: 2200,
    recommendedRange: '125 – 150 characters for feed visibility before truncation',
    idealMax: 300,
    bioLimit: 150,
    notes: 'Captions truncate after ~125 characters in the main feed on mobile.'
  },
  TikTok: {
    name: 'TikTok',
    captionLimit: 2200,
    recommendedRange: '100 – 150 characters for clear mobile viewing without covering video',
    idealMax: 200,
    bioLimit: 80,
    notes: 'Extended description supports up to 2,200 chars, but concise hooks convert best.'
  },
  LinkedIn: {
    name: 'LinkedIn',
    captionLimit: 3000,
    recommendedRange: '1,000 – 1,800 characters for high-engagement thought leadership posts',
    idealMax: 2500,
    bioLimit: 220,
    notes: 'Posts truncate after ~140-210 characters before the "...see more" button.'
  },
  Facebook: {
    name: 'Facebook',
    captionLimit: 63206,
    recommendedRange: '40 – 80 characters for organic posts to maximize mobile readability',
    idealMax: 250,
    bioLimit: 255,
    notes: 'Technical ceiling is 63,206 chars; short punchy updates drive higher interactions.'
  },
  YouTube: {
    name: 'YouTube',
    captionLimit: 5000,
    titleLimit: 100,
    recommendedRange: '100 – 150 words in video description with primary links in the top 3 lines',
    idealMax: 1000,
    notes: 'First 100–120 characters appear in search snippets before the "Show more" fold.'
  },
  Twitter: {
    name: 'X (Twitter)',
    captionLimit: 280,
    recommendedRange: '70 – 100 characters for optimal repost and quote engagement',
    idealMax: 280,
    notes: 'Standard free accounts have a 280 character limit per post.'
  }
};

/**
 * Calculates real-time text statistics
 */
export function calculateTextStats(text = '') {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMinutes: 0
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // Words: split by whitespace
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  
  // Sentences: match ending punctuation (. ! ?)
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  const sentences = sentenceMatches ? sentenceMatches.length : (words > 0 ? 1 : 0);
  
  // Lines: split by newlines
  const lines = text.split(/\r\n|\r|\n/).length;
  
  // Paragraphs: split by double newlines or non-empty blocks
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (words > 0 ? 1 : 0);

  // Reading time (average 200 words per minute)
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    lines,
    paragraphs,
    readingTimeMinutes
  };
}
