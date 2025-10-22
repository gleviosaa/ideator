'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Grid3x3, Clock, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdeatorLogo } from '@/components/IdeatorLogo';
import { Idea } from '@/types';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

interface SearchHistoryItem {
  id: string;
  search_query?: string;
  search_mode: 'free_text' | 'category_select';
  filters?: any;
  idea_ids: string[];
  created_at: string;
  ideas?: Idea[];
}

export default function SearchHistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: historyData, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Fetch ideas for each history item
      const historyWithIdeas = await Promise.all(
        (historyData || []).map(async (item) => {
          if (item.idea_ids && item.idea_ids.length > 0) {
            const { data: ideas } = await supabase
              .from('ideas')
              .select('*')
              .in('id', item.idea_ids)
              .limit(10);

            return { ...item, ideas: ideas || [] };
          }
          return { ...item, ideas: [] };
        })
      );

      setHistory(historyWithIdeas);
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast.error('Failed to load search history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSearch = (item: SearchHistoryItem) => {
    // Store ideas in sessionStorage and navigate to dashboard
    if (item.ideas && item.ideas.length > 0) {
      sessionStorage.setItem('generatedIdeas', JSON.stringify(item.ideas));
      router.push('/dashboard');
    }
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Search deleted from history');
    } catch (error) {
      console.error('Error deleting search:', error);
      toast.error('Failed to delete search');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSearchLabel = (item: SearchHistoryItem) => {
    if (item.search_mode === 'free_text') {
      return item.search_query || 'Text search';
    }
    if (item.filters) {
      const filterKeys = Object.keys(item.filters).filter(k => item.filters[k]);
      if (filterKeys.length > 0) {
        const values = filterKeys.map(k => item.filters[k]).join(', ');
        return values.length > 50 ? values.substring(0, 50) + '...' : values;
      }
    }
    return 'Category search';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <IdeatorLogo size="sm" />
          </div>
          <h1 className="text-3xl font-bold text-black">Search History</h1>
          <p className="text-gray-600 mt-2">
            {history.length} {history.length === 1 ? 'search' : 'searches'} in your history
          </p>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No search history yet</p>
            <Button onClick={() => router.push('/dashboard')}>
              Start Searching
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="hover:shadow-uber-lg transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.search_mode === 'free_text' ? (
                          <Search className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Grid3x3 className="h-4 w-4 text-gray-600" />
                        )}
                        <CardTitle className="text-lg">{getSearchLabel(item)}</CardTitle>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatDate(item.created_at)}</span>
                        <span>•</span>
                        <span>{item.ideas?.length || 0} ideas</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSearch(item)}
                        disabled={!item.ideas || item.ideas.length === 0}
                      >
                        View Results
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSearch(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {item.ideas && item.ideas.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {item.ideas.slice(0, 3).map((idea) => (
                        <div
                          key={idea.id}
                          className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-uber cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => router.push(`/idea/${idea.id}`)}
                        >
                          {idea.title.length > 30 ? idea.title.substring(0, 30) + '...' : idea.title}
                        </div>
                      ))}
                      {item.ideas.length > 3 && (
                        <div className="text-sm px-3 py-1.5 text-gray-500">
                          +{item.ideas.length - 3} more
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
