import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { query, filters, mode } = body;

    if (!query && !filters) {
      return NextResponse.json({ error: 'Query or filters required' }, { status: 400 });
    }

    // Build the prompt for Gemini
    let prompt = `You are an expert product manager and startup advisor. Generate 10 unique and innovative app ideas based on the following criteria:\n\n`;

    if (mode === 'free_text' && query) {
      prompt += `User's description: ${query}\n\n`;
    }

    if (filters) {
      prompt += `Filters:\n`;
      if (filters.technology) prompt += `- Technology/Platform: ${filters.technology}\n`;
      if (filters.complexity) prompt += `- Complexity Level: ${filters.complexity}\n`;
      if (filters.timeToBuild) prompt += `- Time to Build: ${filters.timeToBuild}\n`;
      if (filters.monetization) prompt += `- Monetization: ${filters.monetization}\n`;
      if (filters.targetAudience) prompt += `- Target Audience: ${filters.targetAudience}\n`;
    }

    prompt += `\nFor each idea, provide:
1. A catchy title (max 60 characters)
2. A brief description (2-3 sentences, max 150 characters)

Return the response as a valid JSON array with exactly 10 objects, each having 'title' and 'description' fields.
Example format:
[
  {
    "title": "Example App Idea",
    "description": "A brief description of the app idea that explains the core concept and value proposition."
  }
]

Make sure the ideas are:
- Practical and implementable
- Innovative but realistic
- Aligned with current market trends
- Valuable to users

Return ONLY the JSON array, no additional text or formatting.`;

    // Call Gemini API
    let text;
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    } catch (apiError: any) {
      console.error('Gemini API error:', apiError);
      return NextResponse.json(
        { error: 'Failed to generate ideas. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the response
    let ideas;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      ideas = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Validate ideas array
    if (!Array.isArray(ideas) || ideas.length === 0) {
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    // Store ideas in database with additional metadata
    const ideasToStore = ideas.slice(0, 10).map((idea: any) => ({
      user_id: user.id,
      title: idea.title,
      description: idea.description,
      technology: filters?.technology || null,
      complexity: filters?.complexity || null,
      time_to_build: filters?.timeToBuild || null,
      monetization: filters?.monetization || null,
      target_audience: filters?.targetAudience || null,
      search_query: query || null,
      search_mode: mode || 'free_text',
    }));

    const { data: storedIdeas, error: dbError } = await supabase
      .from('ideas')
      .insert(ideasToStore)
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store ideas' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ideas: storedIdeas });
  } catch (error: any) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
