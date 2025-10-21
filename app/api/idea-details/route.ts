import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ideaId } = body;

    if (!ideaId) {
      return NextResponse.json({ error: 'Idea ID required' }, { status: 400 });
    }

    // Fetch the idea from database
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Check if details already exist
    if (idea.implementation_steps && idea.tech_stack && idea.suggestions) {
      return NextResponse.json({
        implementation_steps: idea.implementation_steps,
        tech_stack: idea.tech_stack,
        suggestions: idea.suggestions,
      });
    }

    // Generate detailed information with Gemini
    const prompt = `You are an expert product manager and software architect. Provide detailed implementation guidance for the following app idea:

Title: ${idea.title}
Description: ${idea.description}
${idea.technology ? `Technology/Platform: ${idea.technology}` : ''}
${idea.complexity ? `Complexity Level: ${idea.complexity}` : ''}
${idea.time_to_build ? `Time to Build: ${idea.time_to_build}` : ''}
${idea.monetization ? `Monetization: ${idea.monetization}` : ''}
${idea.target_audience ? `Target Audience: ${idea.target_audience}` : ''}

Provide the following in JSON format:
1. implementation_steps: Array of 5-8 detailed steps to build this app (each step should be 1-2 sentences)
2. tech_stack: Array of recommended technologies, frameworks, and tools (5-10 items)
3. suggestions: Array of 3-5 additional suggestions or considerations for building this app

Return ONLY a valid JSON object with these three fields. Example format:
{
  "implementation_steps": ["Step 1 description...", "Step 2 description..."],
  "tech_stack": ["Technology 1", "Technology 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let details;
    try {
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      details = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Update the idea with the detailed information
    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        implementation_steps: details.implementation_steps,
        tech_stack: details.tech_stack,
        suggestions: details.suggestions,
      })
      .eq('id', ideaId);

    if (updateError) {
      console.error('Failed to update idea:', updateError);
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error('Error generating idea details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
