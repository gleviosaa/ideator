'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES, CategoryFilters } from '@/types';

interface CategorySelectorProps {
  onSubmit: (filters: CategoryFilters) => void;
  loading?: boolean;
}

export function CategorySelector({ onSubmit, loading }: CategorySelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<CategoryFilters>({});

  const handleCategorySelect = (category: keyof CategoryFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? undefined : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(filters);
  };

  const hasFilters = Object.values(filters).some(v => v !== undefined);

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" />
            Hide Category Filters
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-4 w-4" />
            Show Category Filters
          </>
        )}
      </Button>

      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Preferences</CardTitle>
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

            {/* Complexity */}
            <div>
              <h3 className="font-medium mb-3">Complexity Level</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.complexity.map((level) => (
                  <Button
                    key={level}
                    variant={filters.complexity === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategorySelect('complexity', level)}
                    disabled={loading}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time to Build */}
            <div>
              <h3 className="font-medium mb-3">Time to Build</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.timeToBuild.map((time) => (
                  <Button
                    key={time}
                    variant={filters.timeToBuild === time ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategorySelect('timeToBuild', time)}
                    disabled={loading}
                  >
                    {time}
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
      )}
    </div>
  );
}
