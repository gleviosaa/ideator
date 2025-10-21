'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Idea } from '@/types';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

export default function SavedIdeasPage() {
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchSavedIdeas();
  }, []);

  const fetchSavedIdeas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: savedIdeasData, error } = await supabase
        .from('saved_ideas')
        .select(`
          id,
          idea_id,
          ideas (*)
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      // Extract ideas from the nested structure
      const ideas = savedIdeasData?.map((item: any) => ({
        ...item.ideas,
        saved_idea_id: item.id,
      })) || [];

      setSavedIdeas(ideas);
    } catch (error) {
      console.error('Error fetching saved ideas:', error);
      toast.error('Failed to load saved ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedIdeaId: string, ideaId: string) => {
    try {
      const { error } = await supabase
        .from('saved_ideas')
        .delete()
        .eq('id', savedIdeaId);

      if (error) throw error;

      setSavedIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      toast.success('Idea removed from saved');
    } catch (error) {
      console.error('Error removing idea:', error);
      toast.error('Failed to remove idea');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Saved Ideas</h1>
          <p className="text-gray-400 mt-2">
            {savedIdeas.length} {savedIdeas.length === 1 ? 'idea' : 'ideas'} saved
          </p>
        </div>

        {/* Ideas Grid */}
        {savedIdeas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No saved ideas yet</p>
            <Button onClick={() => router.push('/dashboard')}>
              Discover Ideas
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedIdeas.map((idea: any) => (
              <Card
                key={idea.id}
                className="cursor-pointer hover:border-gray-700 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div
                      className="flex-1"
                      onClick={() => router.push(`/idea/${idea.id}`)}
                    >
                      <CardTitle className="text-xl mb-2">{idea.title}</CardTitle>
                      {idea.technology && (
                        <div className="flex gap-2 flex-wrap">
                          {idea.technology && (
                            <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                              {idea.technology}
                            </span>
                          )}
                          {idea.complexity && (
                            <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                              {idea.complexity}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnsave(idea.saved_idea_id, idea.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent onClick={() => router.push(`/idea/${idea.id}`)}>
                  <CardDescription className="text-base">
                    {idea.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
