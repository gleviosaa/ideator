'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid3x3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SearchBar } from '@/components/SearchBar';
import { SwipeableCards } from '@/components/SwipeableCards';
import { SearchConfirmationModal } from '@/components/SearchConfirmationModal';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { Button } from '@/components/ui/button';
import { Idea } from '@/types';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

type ViewMode = 'search' | 'swiping' | 'results';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [maybeLaterIdeas, setMaybeLaterIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  // Check for generated ideas from category search page
  useEffect(() => {
    const storedIdeas = sessionStorage.getItem('generatedIdeas');
    if (storedIdeas) {
      const parsedIdeas = JSON.parse(storedIdeas);
      setIdeas(parsedIdeas);
      setViewMode('swiping');
      sessionStorage.removeItem('generatedIdeas');
    }
  }, []);


  const handleSearch = (query: string) => {
    setPendingQuery(query);
    setShowConfirmModal(true);
  };

  const handleConfirmSearch = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: pendingQuery, mode: 'free_text' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      setViewMode('swiping');
      toast.success('Ideas generated!');

      // Save to search history
      await saveToHistory(pendingQuery, 'free_text', null, data.ideas);
    } catch (error) {
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async (searchQuery: string | null, searchMode: 'free_text' | 'category_select', filters: any, ideas: Idea[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !ideas || ideas.length === 0) return;

      const ideaIds = ideas.map(idea => idea.id);

      await supabase.from('search_history').insert({
        user_id: user.id,
        search_query: searchQuery,
        search_mode: searchMode,
        filters: filters,
        idea_ids: ideaIds,
      });
    } catch (error) {
      console.error('Error saving to history:', error);
      // Don't show error to user, it's not critical
    }
  };


  const handleSwipeComplete = async (likedIdeas: Idea[], maybeIdeas: Idea[]) => {
    setSavedIdeas(likedIdeas);
    setMaybeLaterIdeas(maybeIdeas);

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
      <div className="max-w-5xl mx-auto mb-4">
        <div className="flex justify-between items-center py-2">
          <HamburgerMenu />
          <h1 className="text-2xl font-bold text-black">Ideator</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {viewMode === 'search' && (
          <div className="space-y-6">
            <div className="text-center space-y-3 py-4">
              <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight">
                What kind of app do you want to build?
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Describe your idea or select categories
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

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push('/category-search')}
            >
              <Grid3x3 className="mr-2 h-5 w-5" />
              Search by Category
            </Button>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-uber-xl p-8 shadow-uber-xl max-w-md mx-4">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-black">Generating Ideas...</h3>
                  <p className="text-gray-600">
                    Our AI is crafting personalized app ideas just for you. This may take a few moments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'swiping' && ideas.length > 0 && !loading && (
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
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black">Saved Ideas</h3>
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
              </div>
            )}

            {maybeLaterIdeas.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-black">Ideas to Review Later</h3>
                  <span className="text-sm text-gray-500">(Not saved - for this session only)</span>
                </div>
                <div className="grid gap-4">
                  {maybeLaterIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-6 bg-yellow-50 border border-yellow-200 rounded-uber-lg hover:shadow-uber-lg transition-all duration-200 cursor-pointer"
                      onClick={() => handleViewDetails(idea)}
                    >
                      <h3 className="font-semibold text-xl mb-2 text-black">{idea.title}</h3>
                      <p className="text-gray-700">{idea.description}</p>
                    </div>
                  ))}
                </div>
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

      {/* Confirmation Modal */}
      <SearchConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSearch}
        searchMode="free_text"
        query={pendingQuery}
      />
    </div>
  );
}
