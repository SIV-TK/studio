import { NextRequest, NextResponse } from 'next/server';
import { ai, aiWithFallback } from '@/ai/genkit';

async function generateWithRetry(prompt: string, temperature: number, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.generate({
        prompt,
        config: { temperature }
      });
      return response.text;
    } catch (error: any) {
      if (error.message?.includes('overloaded') && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      if (i === maxRetries - 1) {
        try {
          const fallbackResponse = await aiWithFallback.generate({ prompt, config: { temperature } });
          return fallbackResponse.text;
        } catch (fallbackError) {
          return 'AI service temporarily unavailable. Please continue with your description.';
        }
      }
      throw error;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, temperature = 0.3 } = await request.json();
    
    const text = await generateWithRetry(prompt, temperature);
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('AI assist error:', error);
    
    if (error.message?.includes('overloaded')) {
      return NextResponse.json({ 
        error: 'AI service is currently busy. Please try again in a moment.',
        fallback: 'Please describe your concern in detail including symptoms, duration, and severity.'
      }, { status: 503 });
    }
    
    return NextResponse.json({ error: 'AI assistance failed' }, { status: 500 });
  }
}