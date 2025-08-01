import { NextRequest, NextResponse } from 'next/server';
import { HospitalFinanceService } from '@/lib/hospital-finance-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const profile = await HospitalFinanceService.getPatientFinancialProfile(params.patientId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Patient financial profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient financial profile' },
      { status: 500 }
    );
  }
}
