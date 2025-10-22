'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CATEGORIES, CategoryFilters } from '@/types';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

export default function CategorySearchPage() {
  const [filters, setFilters] = useState<CategoryFilters>({});
  const [additionalComments, setAdditionalComments] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCategorySelect = (category: keyof CategoryFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? undefined : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters,
          mode: 'category_select',
          additionalComments: additionalComments.trim() || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();

      // Save to search history
      await saveToHistory(filters, data.ideas);

      // Store ideas in sessionStorage to pass to dashboard
      sessionStorage.setItem('generatedIdeas', JSON.stringify(data.ideas));

      toast.success('Ideas generated!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async (filters: CategoryFilters, ideas: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !ideas || ideas.length === 0) return;

      const ideaIds = ideas.map(idea => idea.id);

      await supabase.from('search_history').insert({
        user_id: user.id,
        search_query: null,
        search_mode: 'category_select',
        filters: filters,
        idea_ids: ideaIds,
      });
    } catch (error) {
      console.error('Error saving to history:', error);
      // Don't show error to user, it's not critical
    }
  };

  const hasFilters = Object.values(filters).some(v => v !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-4">
        <div className="flex items-center py-2 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-black">Search by Category</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 py-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight">
            Select your preferences
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Choose categories that interest you to get personalized app ideas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Technology */}
            <div>
              <h3 className="font-medium mb-3">Technology/Platform</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.technology.map((tech) => (
                  <Button
                    key={tech}
                    variant={filters.technology === tech ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategorySelect('technology', tech)}
                    disabled={loading}
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>

            {/* Context */}
            <div>
              <h3 className="font-medium mb-3">Context/Category</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.context.map((ctx) => (
                  <Button
                    key={ctx}
                    variant={filters.context === ctx ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategorySelect('context', ctx)}
                    disabled={loading}
                  >
                    {ctx}
                  </Button>
                ))}
              </div>
            </div>

            {/* Monetization */}
            <div>
              <h3 className="font-medium mb-3">Monetization</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.monetization.map((model) => (
                  <Button
                    key={model}
                    variant={filters.monetization === model ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategorySelect('monetization', model)}
                    disabled={loading}
                  >
                    {model}
                  </Button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="font-medium mb-3">Target Audience</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.targetAudience.map((audience) => (
                  <Button
                    key={audience}
                    variant={filters.targetAudience === audience ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategorySelect('targetAudience', audience)}
                    disabled={loading}
                  >
                    {audience}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Comments */}
            <div>
              <h3 className="font-medium mb-3">Additional Comments <span className="text-gray-500 font-normal text-sm">(Optional)</span></h3>
              <Input
                type="text"
                placeholder="Add any specific requirements, features, or details you'd like to include..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                disabled={loading}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2">
                Provide additional context to refine your app ideas
              </p>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={loading || !hasFilters}
            >
              {loading ? 'Generating Ideas...' : 'Generate Ideas'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlay */}
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
    </div>
  );
}
