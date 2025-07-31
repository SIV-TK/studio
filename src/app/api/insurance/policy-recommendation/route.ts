import { NextRequest, NextResponse } from 'next/server';
import { insurancePolicyRecommendationFlow } from '@/ai/flows/insurance-policy-recommendation';

export async function POST(request: NextRequest) {
  try {
    const patientData = await request.json();
    
    // Validate request data
    if (!patientData || !patientData.id) {
      return NextResponse.json(
        { error: 'Invalid patient data provided' },
        { status: 400 }
      );
    }

    // Call the AI flow
    const recommendation = await insurancePolicyRecommendationFlow(patientData);

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('Error in insurance policy recommendation API:', error);
    return NextResponse.json(
      { error: 'Failed to generate policy recommendation' },
      { status: 500 }
    );
  }
}
