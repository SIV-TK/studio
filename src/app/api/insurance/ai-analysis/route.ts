import { NextRequest, NextResponse } from 'next/server';
import { InsuranceDataService } from '@/lib/insurance-data-service';
import { InsuranceAIService } from '@/ai/flows/insurance-risk-analyzer';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { patientId, analysisType = 'comprehensive' } = body;

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    // Get patient data
    const patient = await InsuranceDataService.getPatientHealthSummary(patientId);
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    let analysis;

    switch (analysisType) {
      case 'risk_assessment':
        analysis = await InsuranceAIService.assessPatientRisk(patient);
        break;
      
      case 'plan_recommendation':
        const availablePlans = InsuranceDataService.getAvailablePlans();
        analysis = await InsuranceAIService.recommendInsurancePlan(patient, availablePlans);
        break;
      
      case 'comprehensive':
      default:
        const [riskAssessment, planRecommendation] = await Promise.all([
          InsuranceAIService.assessPatientRisk(patient),
          InsuranceAIService.recommendInsurancePlan(patient, InsuranceDataService.getAvailablePlans())
        ]);
        analysis = {
          riskAssessment,
          planRecommendation,
          patient
        };
        break;
    }

    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in AI analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
