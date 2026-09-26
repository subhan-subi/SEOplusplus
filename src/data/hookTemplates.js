/**
 * Rule-Based Hook Generator Templates
 * 100% Client-Side, Deterministic, No AI
 */

export const HOOK_CATEGORIES = [
  'Question',
  'Curiosity',
  'Problem',
  'Benefit',
  'Contrarian',
  'Educational',
  'Story'
];

export const HOOK_TEMPLATES = {
  Question: [
    (t) => `Are you making this common mistake with your ${t}?`,
    (t) => `What if everything you were taught about ${t} was wrong?`,
    (t) => `Why does nobody talk about this hidden aspect of ${t}?`,
    (t) => `Still struggling to see consistent results with ${t}? Here's why.`
  ],
  Curiosity: [
    (t) => `The one ${t} habit that changed everything for me.`,
    (t) => `This simple ${t} shift sounds almost too easy, but it works.`,
    (t) => `Here's an insider secret about ${t} most people overlook.`,
    (t) => `What actually happens when you prioritize ${t} for 30 days straight.`
  ],
  Problem: [
    (t) => `Your website may have a ${t} problem you haven't noticed yet.`,
    (t) => `3 ${t} mistakes that can quietly hurt your long-term growth.`,
    (t) => `The real reason most people give up on ${t} within their first month.`,
    (t) => `Stop wasting hours on ${t} without this foundational checklist.`
  ],
  Benefit: [
    (t) => `How to double your progress in ${t} using less time each day.`,
    (t) => `A simple, step-by-step approach to mastering ${t} this year.`,
    (t) => `The fastest way to clean up your ${t} workflow without spending money.`,
    (t) => `Unlock better efficiency in ${t} with these 3 immediate adjustments.`
  ],
  Contrarian: [
    (t) => `Unpopular opinion: Most traditional advice on ${t} is outdated.`,
    (t) => `Why you should stop obsessing over complex tools for ${t}.`,
    (t) => `Doing more isn't the solution to ${t}—simplifying is.`,
    (t) => `The biggest myth about ${t} that continues to mislead beginners.`
  ],
  Educational: [
    (t) => `Before publishing your next project, check these essential ${t} basics.`,
    (t) => `A beginner-friendly guide to understanding ${t} in under 2 minutes.`,
    (t) => `3 essential ${t} rules every creator should bookmark immediately.`,
    (t) => `The complete anatomy of a high-performing ${t} system explained.`
  ],
  Story: [
    (t) => `When I first started dealing with ${t}, I made every mistake in the book.`,
    (t) => `Here's what happened when we stripped down our entire ${t} process.`,
    (t) => `A simple conversation that completely transformed how I think about ${t}.`,
    (t) => `From completely stuck to steady results: My honest journey with ${t}.`
  ]
};

export const PLATFORM_HOOK_SUFFIXES = {
  TikTok: '(Watch till the end!)',
  Instagram: '(Save this for later!)',
  LinkedIn: '(Key takeaway inside)',
  YouTube: '(Breakdown below)',
  Facebook: '(Discussion below)'
};

/**
 * Generates an array of hooks categorized by hook style
 */
export function generateHooks({ topic, platform = 'TikTok', variantOffset = 0 }) {
  if (!topic || !topic.trim()) return [];

  const cleanTopic = topic.trim();
  const results = [];

  HOOK_CATEGORIES.forEach((category) => {
    const templates = HOOK_TEMPLATES[category];
    const templateFn = templates[(variantOffset) % templates.length];
    const hookText = templateFn(cleanTopic);

    results.push({
      id: `${category.toLowerCase()}-${variantOffset}`,
      category,
      hook: hookText,
      platform
    });
  });

  return results;
}
