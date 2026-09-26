/**
 * Template-Based Caption Generator Logic & Templates
 * 100% Client-Side, Deterministic, No AI
 */

export const TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Educational',
  'Promotional',
  'Casual',
  'Inspirational'
];

export const PLATFORMS = [
  'Instagram',
  'TikTok',
  'LinkedIn',
  'Facebook'
];

const CAPTION_TEMPLATES = {
  Professional: [
    {
      id: 'prof-1',
      template: (topic, keywords, cta) => 
`When it comes to ${topic}, small strategic adjustments create long-term compounding results.

Here are 3 key principles we consistently observe:
1. Master the fundamentals before adding complexity.
2. Focus on consistency rather than short-term spikes${keywords ? ` (especially around ${keywords})` : ''}.
3. Measure what matters and iterate systematically.

${cta || 'How is your team currently prioritizing this in your workflow? Let\'s discuss below.'}`
    },
    {
      id: 'prof-2',
      template: (topic, keywords, cta) =>
`Navigating ${topic} requires both clarity and discipline.

Too often, organizations overlook the foundational elements${keywords ? `, particularly when handling ${keywords}` : ''}. By establishing clear benchmarks and repeatable processes, you protect both quality and momentum.

Key takeaway: Don't wait for perfection to implement sound practices.

${cta || 'I would welcome your perspective—what has been your experience in this area?'}`
    }
  ],
  Educational: [
    {
      id: 'edu-1',
      template: (topic, keywords, cta) =>
`A quick breakdown on ${topic} that every beginner needs to know:

The biggest misconception is that you need complex tools to make progress. In reality, focusing on these essentials makes all the difference:
• Principle 1: Start with clear objectives.
• Principle 2: Eliminate unnecessary friction${keywords ? ` when dealing with ${keywords}` : ''}.
• Principle 3: Review your progress weekly and adjust.

${cta || 'Save this post for your next project, or share it with someone learning today.'}`
    },
    {
      id: 'edu-2',
      template: (topic, keywords, cta) =>
`Here is a simple 3-step checklist for better ${topic}:

Step 1: Audit your current setup and identify bottlenecks.
Step 2: Streamline your core assets${keywords ? ` (focusing on ${keywords})` : ''}.
Step 3: Document your workflow so it can be repeated reliably.

Understanding the "why" behind the process is just as important as knowing the "how".

${cta || 'Which step do you find most challenging to execute consistently?'}`
    }
  ],
  Friendly: [
    {
      id: 'friend-1',
      template: (topic, keywords, cta) =>
`Quick reminder for anyone working on ${topic} today:

You don't have to get everything 100% right on the first try! Taking steady steps${keywords ? ` with ${keywords}` : ''} will always beat waiting for the "perfect" moment.

Celebrate the small milestones—they add up faster than you think.

${cta || 'Sending encouragement your way today! How is your week going so far?'}`
    },
    {
      id: 'friend-2',
      template: (topic, keywords, cta) =>
`Sharing a quick thought on ${topic} that helped me recently:

Whenever you feel overwhelmed, simplify. Step back, focus on the single next action${keywords ? `, keep ${keywords} top of mind` : ''}, and breathe.

Progress isn't a straight line, and that's completely okay.

${cta || 'Drop a comment if you needed this reminder today!'}`
    }
  ],
  Promotional: [
    {
      id: 'promo-1',
      template: (topic, keywords, cta) =>
`Looking to level up your ${topic}?

Here is what you get when you optimize your approach:
✔ Clearer direction and less guesswork
✔ Faster execution on key tasks${keywords ? ` (especially ${keywords})` : ''}
✔ Better results without wasted time

Don't let avoidable mistakes slow down your momentum.

${cta || 'Check out the link in bio to learn more and get started for free today!'}`
    },
    {
      id: 'promo-2',
      template: (topic, keywords, cta) =>
`Ready to take your ${topic} to the next level?

We created a straightforward, hassle-free way to streamline everything${keywords ? `, including ${keywords}` : ''}. No fluff, no complicated setup—just practical utility that works.

${cta || 'Click the link in bio or drop a message to discover how it works.'}`
    }
  ],
  Casual: [
    {
      id: 'cas-1',
      template: (topic, keywords, cta) =>
`Honestly, ${topic} doesn't need to be as complicated as people make it out to be.

Focus on what works, ignore the noise${keywords ? `, dial in on ${keywords}` : ''}, and keep moving forward. That's pretty much the whole secret.

${cta || 'Agree or disagree? Let me know your thoughts.'}`
    },
    {
      id: 'cas-2',
      template: (topic, keywords, cta) =>
`Today's vibe: making steady progress on ${topic}.

Not every day needs to be a giant breakthrough. Showing up and putting in the reps${keywords ? ` on ${keywords}` : ''} is what really moves the needle.

${cta || 'What are you working on today?'}`
    }
  ],
  Inspirational: [
    {
      id: 'insp-1',
      template: (topic, keywords, cta) =>
`Mastering ${topic} isn't about overnight talent. It is about patience, deliberate practice, and refusing to quit when things get difficult.

Every expert was once a beginner struggling with the basics${keywords ? `, trying to understand ${keywords}` : ''}. The only difference is that they kept showing up.

Keep building. Your future self will thank you.

${cta || 'Double tap if this resonates with your journey!'}`
    },
    {
      id: 'insp-2',
      template: (topic, keywords, cta) =>
`The secret to excelling in ${topic} is simpler than you think:

Do the unglamorous work when nobody is watching. Refine your craft${keywords ? ` with ${keywords}` : ''}. Stay curious, stay humble, and trust the process.

Great things take time, but deliberate effort is never wasted.

${cta || 'Save this reminder whenever you need a boost of perspective.'}`
    }
  ]
};

const PLATFORM_CTAS = {
  Instagram: 'Save this post for reference and tap the link in bio for more free resources!',
  TikTok: 'Hit the like button, drop your thoughts in the comments, and follow for more daily breakdowns!',
  LinkedIn: 'What has been your experience with this? Share your perspective in the comments below to continue the conversation.',
  Facebook: 'Feel free to share this with anyone on your team who could find it helpful!'
};

/**
 * Generates an editable caption using local templates and user inputs.
 */
export function generateCaption({ topic, keywords = '', tone = 'Professional', platform = 'Instagram', templateIndex = 0 }) {
  if (!topic || !topic.trim()) return '';

  const cleanTopic = topic.trim();
  const cleanKeywords = keywords.trim();
  const toneTemplates = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES.Professional;
  const selectedTemplate = toneTemplates[templateIndex % toneTemplates.length];
  const cta = PLATFORM_CTAS[platform] || PLATFORM_CTAS.Instagram;

  return selectedTemplate.template(cleanTopic, cleanKeywords, cta);
}
