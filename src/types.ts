export type CategoryId =
  | 'motivation'
  | 'success'
  | 'life'
  | 'happiness'
  | 'self-confidence'
  | 'love-kindness'
  | 'friendship'
  | 'education'
  | 'hard-work'
  | 'discipline'
  | 'dreams'
  | 'positive-thinking'
  | 'personal-growth'
  | 'leadership'
  | 'wisdom'
  | 'time-management'
  | 'creativity'
  | 'technology-innovation'
  | 'peace-mindfulness'
  | 'never-give-up';

export interface Quote {
  id: number;
  text: string;
  author: string;
  category: CategoryId;
  card: CardTemplate;
}

export type CardTemplate =
  | 'minimal-white'
  | 'purple-gradient'
  | 'pink-aesthetic'
  | 'dark-elegant'
  | 'nature-inspired'
  | 'sunset-gradient'
  | 'ocean-blue'
  | 'pastel-aesthetic'
  | 'black-gold'
  | 'floral'
  | 'abstract-artistic'
  | 'modern-typography'
  | 'vintage-paper'
  | 'soft-cream'
  | 'glass-premium';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  accent: 'lavender' | 'rose' | 'ocean' | 'sunset';
  preferredCategories: CategoryId[];
  remindersEnabled: boolean;
  reminderTime: string;
  notificationsGranted: boolean;
}

export const CATEGORIES: Category[] = [
  { id: 'motivation', name: 'Motivation', description: 'Fuel your fire and push forward.', icon: 'Flame', gradient: 'from-orange-400 to-rose-500' },
  { id: 'success', name: 'Success', description: 'Define and reach your own summit.', icon: 'Trophy', gradient: 'from-amber-400 to-orange-500' },
  { id: 'life', name: 'Life', description: 'Reflections on the human journey.', icon: 'Leaf', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'happiness', name: 'Happiness', description: 'Find joy in the present moment.', icon: 'Smile', gradient: 'from-yellow-400 to-amber-500' },
  { id: 'self-confidence', name: 'Self-Confidence', description: 'Trust in who you are.', icon: 'ShieldCheck', gradient: 'from-violet-400 to-purple-600' },
  { id: 'love-kindness', name: 'Love & Kindness', description: 'Lead with an open heart.', icon: 'Heart', gradient: 'from-pink-400 to-rose-500' },
  { id: 'friendship', name: 'Friendship', description: 'Celebrate the bonds that lift us.', icon: 'Users', gradient: 'from-sky-400 to-blue-500' },
  { id: 'education', name: 'Education', description: 'The lifelong pursuit of knowing.', icon: 'GraduationCap', gradient: 'from-indigo-400 to-blue-600' },
  { id: 'hard-work', name: 'Hard Work', description: 'Effort compounds into results.', icon: 'Hammer', gradient: 'from-stone-400 to-slate-600' },
  { id: 'discipline', name: 'Discipline', description: 'Consistency over convenience.', icon: 'Target', gradient: 'from-cyan-400 to-teal-600' },
  { id: 'dreams', name: 'Dreams', description: 'Hold the vision, trust the process.', icon: 'Sparkles', gradient: 'from-fuchsia-400 to-purple-600' },
  { id: 'positive-thinking', name: 'Positive Thinking', description: 'Choose the lens that serves you.', icon: 'Sun', gradient: 'from-yellow-300 to-orange-400' },
  { id: 'personal-growth', name: 'Personal Growth', description: 'Become a little better each day.', icon: 'TrendingUp', gradient: 'from-green-400 to-emerald-600' },
  { id: 'leadership', name: 'Leadership', description: 'Inspire others by going first.', icon: 'Compass', gradient: 'from-blue-500 to-indigo-700' },
  { id: 'wisdom', name: 'Wisdom', description: 'Timeless truths for thoughtful living.', icon: 'BookOpen', gradient: 'from-amber-500 to-yellow-700' },
  { id: 'time-management', name: 'Time Management', description: 'Spend your hours on purpose.', icon: 'Clock', gradient: 'from-slate-400 to-blue-600' },
  { id: 'creativity', name: 'Creativity', description: 'Make space for the new to emerge.', icon: 'Palette', gradient: 'from-pink-400 to-fuchsia-600' },
  { id: 'technology-innovation', name: 'Technology & Innovation', description: 'Shape the future, thoughtfully.', icon: 'Cpu', gradient: 'from-cyan-400 to-blue-700' },
  { id: 'peace-mindfulness', name: 'Peace & Mindfulness', description: 'Arrive where you already are.', icon: 'Feather', gradient: 'from-teal-300 to-green-500' },
  { id: 'never-give-up', name: 'Never Give Up', description: 'Endurance is the quiet superpower.', icon: 'Mountain', gradient: 'from-red-400 to-rose-700' },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, Category>
);

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  accent: 'lavender',
  preferredCategories: ['motivation', 'wisdom', 'dreams'],
  remindersEnabled: false,
  reminderTime: '08:00',
  notificationsGranted: false,
};
