import { NextRequest, NextResponse } from 'next/server';
import { InsuranceDataService } from '@/lib/insurance-data-service';
import { InsuranceAIService } from '@/ai/flows/insurance-risk-analyzer';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const riskLevel = url.searchParams.get('riskLevel') as 'Low' | 'Moderate' | 'High' | 'Critical' | null;

    // Get analytics data
    const analytics = await InsuranceDataService.getInsuranceAnalytics();
    
    let cohortData = null;
    if (riskLevel) {
      const patients = await InsuranceDataService.getPatientsByRiskLevel(riskLevel);
      cohortData = await InsuranceAIService.analyzeCohortRisk(patients);
    }

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        cohortData
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { analysisType, filters } = body;

    let results;

    switch (analysisType) {
      case 'risk_distribution':
        const allPatients = await InsuranceDataService.getAllPatientsHealthSummary();
        results = {
          totalPatients: allPatients.length,
          riskDistribution: {
            Low: allPatients.filter(p => p.riskLevel === 'Low').length,
            Moderate: allPatients.filter(p => p.riskLevel === 'Moderate').length,
            High: allPatients.filter(p => p.riskLevel === 'High').length,
            Critical: allPatients.filter(p => p.riskLevel === 'Critical').length,
          },
          averageRiskScore: allPatients.reduce((sum, p) => sum + p.riskScore, 0) / allPatients.length
        };
        break;

      case 'cohort_analysis':
        const cohortPatients = await InsuranceDataService.getAllPatientsHealthSummary();
        results = await InsuranceAIService.analyzeCohortRisk(cohortPatients);
        break;

      case 'profitability_analysis':
        const analytics = await InsuranceDataService.getInsuranceAnalytics();
        const profitabilityData = await InsuranceDataService.getAllPatientsHealthSummary();
        
        results = {
          totalPremiumPotential: profitabilityData.reduce((sum, patient) => {
            const riskMultiplier = patient.riskScore / 50; // Base multiplier
            return sum + (300 * riskMultiplier); // Base premium $300
          }, 0),
          totalClaimsRisk: profitabilityData.reduce((sum, p) => sum + p.claimsHistory.totalAmount, 0),
          profitabilityScore: analytics.totalPatients > 0 ? 
            ((analytics.totalPatients * 3600 - analytics.totalClaimsValue) / (analytics.totalPatients * 3600)) * 100 : 0
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analytics processing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
