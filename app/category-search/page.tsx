'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchConfirmationModal } from '@/components/SearchConfirmationModal';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { IdeatorLogo } from '@/components/IdeatorLogo';
import { CATEGORIES, CategoryFilters } from '@/types';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

export default function CategorySearchPage() {
  const [filters, setFilters] = useState<CategoryFilters>({});
  const [additionalComments, setAdditionalComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>('technology');
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({
    technology: '',
    context: '',
    monetization: '',
    targetAudience: '',
  });
  const [showCustomInput, setShowCustomInput] = useState<Record<string, boolean>>({
    technology: false,
    context: false,
    monetization: false,
    targetAudience: false,
  });
  const router = useRouter();
  const supabase = createClient();

  const handleCategorySelect = (category: keyof CategoryFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? undefined : value,
    }));
  };

  const handleToggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleToggleCustomInput = (category: string) => {
    setShowCustomInput(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleCustomInputChange = (category: string, value: string) => {
    setCustomInputs(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleAddCustom = (category: keyof CategoryFilters) => {
    const customValue = customInputs[category].trim();
    if (customValue) {
      setFilters(prev => ({
        ...prev,
        [category]: customValue,
      }));
      setCustomInputs(prev => ({
        ...prev,
        [category]: '',
      }));
      setShowCustomInput(prev => ({
        ...prev,
        [category]: false,
      }));
      toast.success(`Added custom ${category}: ${customValue}`);
    }
  };

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSearch = async () => {
    setShowConfirmModal(false);
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
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-4">
            <HamburgerMenu />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <IdeatorLogo size="md" />
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 py-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight">
            Select your preferences
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Choose at least one option from any category to get personalized app ideas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Select at least one option from any category below to generate ideas
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Technology */}
            <div className="border border-gray-200 rounded-uber-lg overflow-hidden bg-white hover:shadow-uber transition-shadow duration-200">
              <button
                onClick={() => handleToggleCategory('technology')}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-black">Technology/Platform</h3>
                  {filters.technology && (
                    <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                {openCategory === 'technology' ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openCategory === 'technology' && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 mb-2">
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
                    {filters.technology && !CATEGORIES.technology.includes(filters.technology) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCategorySelect('technology', filters.technology!)}
                        disabled={loading}
                      >
                        {filters.technology}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleCustomInput('technology')}
                    className="text-gray-600 hover:text-black mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Custom
                  </Button>
                  {showCustomInput.technology && (
                    <div className="flex gap-2 mt-3">
                      <Input
                        type="text"
                        placeholder="Enter custom technology..."
                        value={customInputs.technology}
                        onChange={(e) => handleCustomInputChange('technology', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustom('technology')}
                        className="flex-1"
                      />
                      <Button onClick={() => handleAddCustom('technology')} size="sm">
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Context */}
            <div className="border border-gray-200 rounded-uber-lg overflow-hidden bg-white hover:shadow-uber transition-shadow duration-200">
              <button
                onClick={() => handleToggleCategory('context')}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-black">Context</h3>
                  {filters.context && (
                    <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                {openCategory === 'context' ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openCategory === 'context' && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 mb-2">
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
                    {filters.context && !CATEGORIES.context.includes(filters.context) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCategorySelect('context', filters.context!)}
                        disabled={loading}
                      >
                        {filters.context}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleCustomInput('context')}
                    className="text-gray-600 hover:text-black mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Custom
                  </Button>
                  {showCustomInput.context && (
                    <div className="flex gap-2 mt-3">
                      <Input
                        type="text"
                        placeholder="Enter custom context..."
                        value={customInputs.context}
                        onChange={(e) => handleCustomInputChange('context', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustom('context')}
                        className="flex-1"
                      />
                      <Button onClick={() => handleAddCustom('context')} size="sm">
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Monetization */}
            <div className="border border-gray-200 rounded-uber-lg overflow-hidden bg-white hover:shadow-uber transition-shadow duration-200">
              <button
                onClick={() => handleToggleCategory('monetization')}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-black">Monetization</h3>
                  {filters.monetization && (
                    <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                {openCategory === 'monetization' ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openCategory === 'monetization' && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 mb-2">
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
                    {filters.monetization && !CATEGORIES.monetization.includes(filters.monetization) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCategorySelect('monetization', filters.monetization!)}
                        disabled={loading}
                      >
                        {filters.monetization}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleCustomInput('monetization')}
                    className="text-gray-600 hover:text-black mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Custom
                  </Button>
                  {showCustomInput.monetization && (
                    <div className="flex gap-2 mt-3">
                      <Input
                        type="text"
                        placeholder="Enter custom monetization..."
                        value={customInputs.monetization}
                        onChange={(e) => handleCustomInputChange('monetization', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustom('monetization')}
                        className="flex-1"
                      />
                      <Button onClick={() => handleAddCustom('monetization')} size="sm">
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Target Audience */}
            <div className="border border-gray-200 rounded-uber-lg overflow-hidden bg-white hover:shadow-uber transition-shadow duration-200">
              <button
                onClick={() => handleToggleCategory('targetAudience')}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-black">Target Audience</h3>
                  {filters.targetAudience && (
                    <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                {openCategory === 'targetAudience' ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openCategory === 'targetAudience' && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2 mb-2">
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
                    {filters.targetAudience && !CATEGORIES.targetAudience.includes(filters.targetAudience) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCategorySelect('targetAudience', filters.targetAudience!)}
                        disabled={loading}
                      >
                        {filters.targetAudience}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleCustomInput('targetAudience')}
                    className="text-gray-600 hover:text-black mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Custom
                  </Button>
                  {showCustomInput.targetAudience && (
                    <div className="flex gap-2 mt-3">
                      <Input
                        type="text"
                        placeholder="Enter custom target audience..."
                        value={customInputs.targetAudience}
                        onChange={(e) => handleCustomInputChange('targetAudience', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustom('targetAudience')}
                        className="flex-1"
                      />
                      <Button onClick={() => handleAddCustom('targetAudience')} size="sm">
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Comments */}
            <div className="pt-3">
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

      {/* Confirmation Modal */}
      <SearchConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSearch}
        searchMode="category_select"
        filters={filters}
        additionalComments={additionalComments.trim() || undefined}
      />
    </div>
  );
}
