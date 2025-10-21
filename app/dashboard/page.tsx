'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Bookmark } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SearchBar } from '@/components/SearchBar';
import { CategorySelector } from '@/components/CategorySelector';
import { SwipeableCards } from '@/components/SwipeableCards';
import { Button } from '@/components/ui/button';
import { Idea, CategoryFilters } from '@/types';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

type ViewMode = 'search' | 'swiping' | 'results';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode: 'free_text' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      setViewMode('swiping');
      toast.success('Ideas generated!');
    } catch (error) {
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (filters: CategoryFilters) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, mode: 'category_select' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      setViewMode('swiping');
      toast.success('Ideas generated!');
    } catch (error) {
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeComplete = async (likedIdeas: Idea[]) => {
    setSavedIdeas(likedIdeas);

    // Save liked ideas to database
    if (likedIdeas.length > 0) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const savedIdeaRecords = likedIdeas.map(idea => ({
            user_id: user.id,
            idea_id: idea.id,
          }));

          await supabase.from('saved_ideas').insert(savedIdeaRecords);
          toast.success(`Saved ${likedIdeas.length} idea(s)!`);
        }
      } catch (error) {
        console.error('Failed to save ideas:', error);
      }
    }

    setViewMode('results');
  };

  const handleViewDetails = (idea: Idea) => {
    router.push(`/idea/${idea.id}`);
  };

  const handleNewSearch = () => {
    setIdeas([]);
    setSavedIdeas([]);
    setViewMode('search');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-black">Ideator</h1>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/saved')}
              className="rounded-full"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {viewMode === 'search' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                What kind of app do you want to build?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Describe your idea or select categories to get personalized suggestions
              </p>
            </div>

            <SearchBar onSearch={handleSearch} loading={loading} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">or</span>
              </div>
            </div>

            <CategorySelector onSubmit={handleCategorySubmit} loading={loading} />
          </div>
        )}

        {viewMode === 'swiping' && ideas.length > 0 && (
          <div className="py-8">
            <SwipeableCards
              ideas={ideas}
              onSwipeComplete={handleSwipeComplete}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}

        {viewMode === 'results' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
              <h2 className="text-3xl md:text-4xl font-bold text-black">
                {savedIdeas.length > 0
                  ? `You saved ${savedIdeas.length} idea${savedIdeas.length > 1 ? 's' : ''}!`
                  : 'No ideas saved'}
              </h2>
              <p className="text-lg text-gray-600">
                {savedIdeas.length > 0
                  ? 'View your saved ideas or start a new search'
                  : 'Start a new search to discover more ideas'}
              </p>
            </div>

            {savedIdeas.length > 0 && (
              <div className="grid gap-4">
                {savedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-6 bg-white border border-gray-100 rounded-uber-lg hover:shadow-uber-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleViewDetails(idea)}
                  >
                    <h3 className="font-semibold text-xl mb-2 text-black">{idea.title}</h3>
                    <p className="text-gray-600">{idea.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={handleNewSearch} size="lg">New Search</Button>
              {savedIdeas.length > 0 && (
                <Button variant="outline" size="lg" onClick={() => router.push('/saved')}>
                  View All Saved Ideas
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
