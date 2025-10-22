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
  context?: string;
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
  context: [
    'Health & Fitness',
    'Technology',
    'Games',
    'Education',
    'Finance',
    'Social',
    'Productivity',
    'E-commerce',
    'Entertainment',
    'Travel',
    'Food & Beverage',
    'Sports',
    'Music',
    'Art & Design',
    'News & Media',
    'Lifestyle',
    'Real Estate',
    'Automotive',
    'Fashion',
    'Photography',
    'Environment & Sustainability',
    'Mental Health & Wellness',
    'Community & Volunteering',
    'Pet Care',
    'Home & Garden',
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
