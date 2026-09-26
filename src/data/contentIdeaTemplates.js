/**
 * Rule-Based Content Idea Generator Templates
 * 100% Client-Side, Deterministic, No AI
 */

export const CONTENT_TYPES = [
  'Educational',
  'Tutorial',
  'List',
  'Question',
  'Tips',
  'Mistakes',
  'Comparison',
  'Case Study',
  'Story'
];

export const CONTENT_IDEA_TEMPLATES = {
  Educational: [
    (t) => `How ${t} actually works behind the scenes (explained simply)`,
    (t) => `The foundational vocabulary every beginner in ${t} needs to know`,
    (t) => `Why ${t} matters more today than it did 5 years ago`
  ],
  Tutorial: [
    (t) => `Step-by-step tutorial: How to set up your first ${t} workflow`,
    (t) => `A beginner's walkthrough to auditing your ${t} in under 15 minutes`,
    (t) => `How to optimize your ${t} from start to finish without paid tools`
  ],
  List: [
    (t) => `7 free resources that will accelerate your understanding of ${t}`,
    (t) => `5 essential checkpoints for your next ${t} project checklist`,
    (t) => `Top 4 rules you should never break when planning ${t}`
  ],
  Question: [
    (t) => `What is the single biggest bottleneck holding you back in ${t}?`,
    (t) => `If you could only use one technique for ${t}, what would it be?`,
    (t) => `How often do you review your current ${t} performance metrics?`
  ],
  Tips: [
    (t) => `3 quick tips to immediately improve your daily ${t} output`,
    (t) => `How to avoid burnout while building momentum with ${t}`,
    (t) => `The subtle daily habit that drastically enhances your ${t}`
  ],
  Mistakes: [
    (t) => `5 common ${t} mistakes beginners make (and how to fix them)`,
    (t) => `The costly ${t} mistake I wish I had stopped doing sooner`,
    (t) => `Why copying other people's approach to ${t} usually backfires`
  ],
  Comparison: [
    (t) => `${t} in 2026 vs. 5 years ago: What changed and what stayed the same`,
    (t) => `Simple ${t} setup vs. Complex setup: Which actually wins?`,
    (t) => `Free tools vs. Premium platforms: Is paid software necessary for ${t}?`
  ],
  'Case Study': [
    (t) => `How we restructured our approach to ${t} for cleaner results`,
    (t) => `Analyzing a real-world example of effective ${t} done right`,
    (t) => `What happens when you audit ${t} consistently for 90 days straight`
  ],
  Story: [
    (t) => `The hard lesson I learned about ${t} when everything seemed to go wrong`,
    (t) => `My unexpected turning point with ${t} that changed my perspective`,
    (t) => `Behind the scenes: The unglamorous reality of building with ${t}`
  ]
};

/**
 * Generates an array of content ideas based on topic, platform, and selected content type.
 */
export function generateContentIdeas({ topic, platform = 'Instagram', contentType = 'All', cycleOffset = 0 }) {
  if (!topic || !topic.trim()) return [];

  const cleanTopic = topic.trim();
  const selectedTypes = contentType === 'All' ? CONTENT_TYPES : [contentType];
  const ideas = [];

  selectedTypes.forEach((type) => {
    const templates = CONTENT_IDEA_TEMPLATES[type] || [];
    templates.forEach((templateFn, idx) => {
      ideas.push({
        id: `idea-${type.toLowerCase()}-${idx}-${cycleOffset}`,
        title: templateFn(cleanTopic),
        contentType: type,
        platform
      });
    });
  });

  return ideas;
}
