import { NextRequest, NextResponse } from 'next/server';
import { InsuranceAuthService } from '@/lib/insurance-auth-service';
import { InsuranceDataService } from '@/lib/insurance-data-service';

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

    // In a real implementation, you'd validate the token
    // For demo purposes, we'll check if it's a valid format
    const token = authHeader.split(' ')[1];
    if (!token || token.length < 10) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get all patients health summary
    const patients = await InsuranceDataService.getAllPatientsHealthSummary();
    
    return NextResponse.json({
      success: true,
      data: patients,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching patient data:', error);
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
    const { patientIds, analysisType } = body;

    if (!patientIds || !Array.isArray(patientIds)) {
      return NextResponse.json(
        { error: 'Patient IDs array is required' },
        { status: 400 }
      );
    }

    const results = [];

    for (const patientId of patientIds) {
      try {
        const patient = await InsuranceDataService.getPatientHealthSummary(patientId);
        if (patient) {
          if (analysisType === 'risk_analysis') {
            const analysis = await InsuranceDataService.analyzePatientRisk(patientId);
            results.push({
              patientId,
              patient,
              analysis
            });
          } else {
            results.push({
              patientId,
              patient
            });
          }
        }
      } catch (error) {
        results.push({
          patientId,
          error: 'Failed to analyze patient'
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing patient analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
