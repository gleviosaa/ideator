export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  technology?: string;
  complexity?: string;
  time_to_build?: string;
  monetization?: string;
  target_audience?: string;
  implementation_steps?: string[];
  tech_stack?: string[];
  suggestions?: string[];
  search_query?: string;
  search_mode?: 'free_text' | 'category_select';
  created_at: string;
  updated_at: string;
}

export interface SavedIdea {
  id: string;
  user_id: string;
  idea_id: string;
  saved_at: string;
  idea?: Idea;
}

export interface CategoryFilters {
  technology?: string;
  complexity?: string;
  timeToBuild?: string;
  monetization?: string;
  targetAudience?: string;
}

export const CATEGORIES = {
  technology: [
    'Web',
    'Mobile (iOS/Android)',
    'Desktop',
    'AI/ML',
    'Blockchain',
    'IoT',
    'AR/VR',
    'Game Development',
  ],
  complexity: [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
  ],
  timeToBuild: [
    'Weekend (1-2 days)',
    '1 Week',
    '2-4 Weeks',
    '1-3 Months',
    '3+ Months',
  ],
  monetization: [
    'Free/Open Source',
    'Freemium',
    'Subscription',
    'One-time Purchase',
    'Ads',
    'Marketplace/Commission',
  ],
  targetAudience: [
    'Developers',
    'Students',
    'Small Businesses',
    'Enterprises',
    'Content Creators',
    'General Public',
    'Gamers',
    'Professionals',
  ],
};
