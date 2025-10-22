'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Heart, Loader2, FileDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Idea } from '@/types';
import { exportIdeaToPDF } from '@/lib/pdf-export';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

export default function IdeaDetailsPage() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState<{
    implementation_steps?: string[];
    tech_stack?: string[];
    suggestions?: string[];
  }>({});

  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const ideaId = params.id as string;

  useEffect(() => {
    fetchIdea();
    checkIfSaved();
  }, [ideaId]);

  const fetchIdea = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .single();

      if (error) throw error;

      setIdea(data);

      // Check if details already exist
      if (data.implementation_steps && data.tech_stack && data.suggestions) {
        setDetails({
          implementation_steps: data.implementation_steps,
          tech_stack: data.tech_stack,
          suggestions: data.suggestions,
        });
      } else {
        // Fetch details from API
        fetchDetails();
      }
    } catch (error) {
      console.error('Error fetching idea:', error);
      toast.error('Failed to load idea');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async () => {
    setDetailsLoading(true);
    try {
      const response = await fetch('/api/idea-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });

      if (!response.ok) throw new Error('Failed to fetch details');

      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('Failed to load detailed information');
    } finally {
      setDetailsLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_ideas')
        .select('id')
        .eq('user_id', user.id)
        .eq('idea_id', ideaId)
        .single();

      setIsSaved(!!data);
    } catch (error) {
      // Idea not saved
    }
  };

  const handleToggleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isSaved) {
        const { error } = await supabase
          .from('saved_ideas')
          .delete()
          .eq('user_id', user.id)
          .eq('idea_id', ideaId);

        if (error) throw error;
        setIsSaved(false);
        toast.success('Removed from saved ideas');
      } else {
        const { error } = await supabase
          .from('saved_ideas')
          .insert({ user_id: user.id, idea_id: ideaId });

        if (error) throw error;
        setIsSaved(true);
        toast.success('Added to saved ideas');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Failed to update saved status');
    }
  };

  const handleShare = async () => {
    const shareText = `${idea?.title}\n\n${idea?.description}\n\nCheck out this app idea on Ideator!`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleExportPDF = () => {
    if (!idea) return;
    try {
      exportIdeaToPDF(idea);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">{idea.title}</h1>
              {idea.technology && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {idea.technology && (
                    <span className="text-sm px-3 py-1.5 bg-black text-white rounded-uber font-medium">
                      {idea.technology}
                    </span>
                  )}
                  {idea.complexity && (
                    <span className="text-sm px-3 py-1.5 bg-black text-white rounded-uber font-medium">
                      {idea.complexity}
                    </span>
                  )}
                  {idea.time_to_build && (
                    <span className="text-sm px-3 py-1.5 bg-black text-white rounded-uber font-medium">
                      {idea.time_to_build}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExportPDF}
                title="Export to PDF"
              >
                <FileDown className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="icon"
                title={isSaved ? 'Remove from saved' : 'Save idea'}
                onClick={handleToggleSave}
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">{idea.description}</p>

            {(idea.monetization || idea.target_audience) && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                {idea.monetization && (
                  <div className="text-gray-700">
                    <span className="font-medium text-gray-900">Monetization:</span>{' '}
                    <span>{idea.monetization}</span>
                  </div>
                )}
                {idea.target_audience && (
                  <div className="text-gray-700">
                    <span className="font-medium text-gray-900">Target Audience:</span>{' '}
                    <span>{idea.target_audience}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {detailsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        ) : (
          <>
            {/* Implementation Steps */}
            {details.implementation_steps && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Implementation Steps</CardTitle>
                  <CardDescription>
                    Follow these steps to build your app
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {details.implementation_steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Tech Stack */}
            {details.tech_stack && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Recommended Tech Stack</CardTitle>
                  <CardDescription>
                    Technologies and tools to use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {details.tech_stack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-black text-white rounded-uber text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {details.suggestions && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Suggestions</CardTitle>
                  <CardDescription>
                    Tips and considerations for your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {details.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex gap-3 text-gray-700">
                        <span className="text-black font-bold">•</span>
                        <span className="leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
