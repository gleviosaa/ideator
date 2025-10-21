import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const result = {
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
    test: {
      success: false,
      error: null as string | null,
      response: null as string | null,
    },
  };

  if (!process.env.GEMINI_API_KEY) {
    result.test.error = 'GEMINI_API_KEY not configured';
    return NextResponse.json(result, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const testPrompt = 'Say "Hello World" in JSON format: {"message": "Hello World"}';
    const genResult = await model.generateContent(testPrompt);
    const response = await genResult.response;
    const text = response.text();

    result.test.success = true;
    result.test.response = text;
  } catch (error: any) {
    result.test.error = error.message || String(error);
  }

  return NextResponse.json(result, {
    status: result.test.success ? 200 : 500,
  });
}
