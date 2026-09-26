/**
 * Curated Rule-Based Hashtag Dataset and Generator
 * 100% Client-Side, No External APIs, No AI
 */

export const HASHTAG_CATEGORIES = {
  technology: [
    'Tech', 'Technology', 'TechNews', 'TechTrends', 'Innovation', 'FutureTech',
    'TechCommunity', 'Gadgets', 'Software', 'DigitalTransformation', 'TechLife',
    'TechWorld', 'SmartTech', 'TechInspiration', 'EmergingTech'
  ],
  programming: [
    'Programming', 'Coding', 'Developer', 'CodeNewbie', 'ProgrammerLife',
    'SoftwareEngineer', 'DevCommunity', 'CodeLife', 'LearnToCode', 'CleanCode',
    'BackendDeveloper', 'FrontendDeveloper', 'FullStack', 'SoftwareDevelopment', 'CodingBootcamp'
  ],
  'web development': [
    'WebDevelopment', 'WebDev', 'FrontendDev', 'BackendDev', 'JavaScript',
    'ReactJS', 'HTML5', 'CSS3', 'WebDesign', 'WebDesigner', 'FullStackDeveloper',
    'ResponsiveDesign', 'UIUXDesign', 'NodeJS', 'TypeScript'
  ],
  business: [
    'Business', 'Entrepreneur', 'SmallBusiness', 'Startups', 'BusinessOwner',
    'Leadership', 'BusinessGrowth', 'BusinessStrategy', 'SuccessMindset', 'Entrepreneurship',
    'CompanyCulture', 'Management', 'BusinessTips', 'StartupLife', 'ScaleUp'
  ],
  marketing: [
    'Marketing', 'DigitalMarketing', 'ContentMarketing', 'SEO', 'SocialMediaMarketing',
    'GrowthHacking', 'InboundMarketing', 'BrandStrategy', 'MarketingStrategy',
    'MarketingTips', 'EmailMarketing', 'SocialMediaStrategy', 'LeadGeneration', 'B2BMarketing'
  ],
  education: [
    'Education', 'Learning', 'EdTech', 'SkillBuilding', 'OnlineLearning',
    'LifelongLearning', 'StudyTips', 'KnowledgeIsPower', 'SelfImprovement', 'EducationMatters',
    'StudentLife', 'LearningEveryday', 'SkillDevelopment', 'EdCommunity'
  ],
  fitness: [
    'Fitness', 'FitnessMotivation', 'Workout', 'HealthAndWellness', 'GymLife',
    'FitLife', 'HealthyHabits', 'Training', 'StrengthTraining', 'FitnessJourney',
    'Cardio', 'FitnessGoals', 'ActiveLiving', 'Wellness'
  ],
  fashion: [
    'Fashion', 'OOTD', 'StyleInspo', 'FashionStyle', 'StreetStyle',
    'WardrobeEssentials', 'SustainableFashion', 'DailyLook', 'FashionTrends',
    'StyleGuide', 'OutfitInspiration', 'FashionLovers', 'LookBook'
  ],
  food: [
    'Foodie', 'FoodLover', 'HomeCooking', 'Recipes', 'FoodPhotography',
    'HealthyEating', 'Delicious', 'FoodBlogger', 'EasyRecipes', 'Culinary',
    'CookingAtHome', 'MealPrep', 'Yummy', 'FoodGasm'
  ],
  travel: [
    'Travel', 'Wanderlust', 'TravelGram', 'TravelPhotography', 'ExploreMore',
    'TravelLife', 'AdventureTime', 'TravelGuide', 'BeautifulDestinations',
    'TravelInspiration', 'VacationVibes', 'GlobeTrotter', 'DiscoverEarth'
  ],
  photography: [
    'Photography', 'PhotoOfTheDay', 'Photographer', 'Shutterbug', 'VisualStorytelling',
    'PortraitPhotography', 'LandscapePhotography', 'StreetPhotography', 'PhotographyLovers',
    'CameraGear', 'LensCulture', 'Composition', 'VisualArts'
  ],
  freelancing: [
    'Freelancer', 'FreelanceLife', 'RemoteWork', 'Solopreneur', 'DigitalNomad',
    'WorkFromHome', 'FreelancingTips', 'ClientWork', 'IndependentWorker', 'SideHustle',
    'WorkFromAnywhere', 'SelfEmployed', 'FreelanceBusiness'
  ],
  ecommerce: [
    'Ecommerce', 'OnlineStore', 'RetailTech', 'ShopifyStore', 'D2C',
    'EcommerceTips', 'OnlineSelling', 'Dropshipping', 'Commerce', 'DigitalStore',
    'ProductMarketing', 'CustomerExperience', 'EcommerceBusiness'
  ],
  'personal branding': [
    'PersonalBrand', 'PersonalBranding', 'ThoughtLeadership', 'CareerGrowth',
    'BrandIdentity', 'PublicSpeaking', 'Networking', 'ProfessionalDevelopment',
    'CareerSuccess', 'Authenticity', 'OnlinePresence', 'Influence'
  ],
  productivity: [
    'Productivity', 'TimeManagement', 'ProductivityHacks', 'WorkSmart', 'Focus',
    'GoalSetting', 'HabitBuilding', 'Organization', 'DeepWork', 'ProductiveDay',
    'MindsetMatters', 'DailyRoutine', 'Efficiency'
  ],
  design: [
    'Design', 'GraphicDesign', 'UIUX', 'DesignerLife', 'VisualDesign',
    'ProductDesign', 'CreativeDirection', 'BrandingDesign', 'Typography',
    'DesignInspiration', 'DesignSystem', 'Illustration', 'LogoDesign'
  ]
};

export const PLATFORM_HASHTAG_MODIFIERS = {
  Instagram: ['ExplorePage', 'IGDaily', 'InstaGood', 'ContentCreator'],
  TikTok: ['TikTokMadeMeWatch', 'LearnOnTikTok', 'FYP', 'Trending'],
  LinkedIn: ['ProfessionalNetworking', 'CareerInsights', 'BusinessCommunity', 'Workforce'],
  Facebook: ['CommunityShare', 'Discussion', 'PageHighlight'],
  YouTube: ['YouTubeCreator', 'VideoContent', 'Subscribe', 'YouTubers']
};

/**
 * Deterministically generates hashtags based on user input, category matching, and platform.
 */
export function generateHashtags({ topic, platform = 'Instagram', niche = '', count = 15 }) {
  if (!topic || !topic.trim()) return [];

  const cleanTopic = topic.trim();
  const lowerTopic = cleanTopic.toLowerCase();
  const words = cleanTopic.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  
  const toPascal = (str) => {
    return str
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  };

  const topicPascal = toPascal(cleanTopic);
  const resultTags = new Set();

  // 1. Direct topic variants
  resultTags.add(`#${topicPascal}`);
  if (words.length > 1) {
    words.forEach(w => {
      if (w.length > 2) resultTags.add(`#${w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()}`);
    });
  }

  // 2. Add algorithmic suffix/prefix variations for the topic
  const suffixes = ['Tips', 'Daily', 'Hub', 'Life', 'Community', 'Guide', 'Inspo', 'World', 'Hacks', 'Pro', 'Trends'];
  const prefixes = ['Learn', 'Love', 'Best', 'Daily', 'Real'];

  suffixes.forEach(s => resultTags.add(`#${topicPascal}${s}`));
  prefixes.forEach(p => resultTags.add(`#${p}${topicPascal}`));

  // 3. Match against curated categories
  let matchedCategories = [];
  for (const [catName, tags] of Object.entries(HASHTAG_CATEGORIES)) {
    if (lowerTopic.includes(catName) || catName.includes(lowerTopic)) {
      matchedCategories.push(...tags);
    } else {
      // Check individual words
      for (const word of words) {
        if (word.length >= 3 && (catName.includes(word) || word.includes(catName))) {
          matchedCategories.push(...tags);
        }
      }
    }
  }

  // If no category matched directly, check if niche matches or default to related
  if (niche && niche.trim()) {
    const nichePascal = toPascal(niche);
    resultTags.add(`#${nichePascal}`);
    resultTags.add(`#${topicPascal}${nichePascal}`);
    
    for (const [catName, tags] of Object.entries(HASHTAG_CATEGORIES)) {
      if (niche.toLowerCase().includes(catName)) {
        matchedCategories.push(...tags);
      }
    }
  }

  // If still empty or low, blend from general technology/business/marketing/productivity
  if (matchedCategories.length === 0) {
    matchedCategories = [
      ...HASHTAG_CATEGORIES.marketing,
      ...HASHTAG_CATEGORIES.productivity,
      ...HASHTAG_CATEGORIES.business
    ];
  }

  // Shuffle matched categories pseudo-deterministically using topic length
  matchedCategories.forEach(tag => resultTags.add(`#${tag}`));

  // 4. Add platform-tailored modifiers
  const platformModifiers = PLATFORM_HASHTAG_MODIFIERS[platform] || [];
  platformModifiers.forEach(mod => {
    resultTags.add(`#${mod}`);
  });

  // Convert Set to Array and slice to desired count
  const allGenerated = Array.from(resultTags);
  return allGenerated.slice(0, Math.min(count, allGenerated.length));
}
