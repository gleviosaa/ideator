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
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Ideator</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/saved')}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {viewMode === 'search' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                What kind of app do you want to build?
              </h2>
              <p className="text-gray-400">
                Describe your idea or select categories to get started
              </p>
            </div>

            <SearchBar onSearch={handleSearch} loading={loading} />

            <div className="text-center text-gray-500">or</div>

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
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                {savedIdeas.length > 0
                  ? `You saved ${savedIdeas.length} idea(s)!`
                  : 'No ideas saved'}
              </h2>
              <p className="text-gray-400">
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
                    className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 cursor-pointer"
                    onClick={() => handleViewDetails(idea)}
                  >
                    <h3 className="font-semibold text-lg mb-2">{idea.title}</h3>
                    <p className="text-gray-400 text-sm">{idea.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={handleNewSearch}>New Search</Button>
              {savedIdeas.length > 0 && (
                <Button variant="outline" onClick={() => router.push('/saved')}>
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
