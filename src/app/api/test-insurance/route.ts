import { NextRequest, NextResponse } from 'next/server';
import { InsuranceFinanceService } from '@/lib/insurance-finance-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_001';
    
    // Test getting patient account
    const account = await InsuranceFinanceService.getPatientAccountSelf(userId);
    
    if (!account) {
      return NextResponse.json(
        { error: 'No insurance account found for user ID: ' + userId },
        { status: 404 }
      );
    }
    
    // Test getting claims for this patient
    const claims = await InsuranceFinanceService.getClaimsByPatientSelf(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        account,
        claims,
        claimsCount: claims.length
      }
    });
    
  } catch (error) {
    console.error('Insurance test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test insurance system',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
