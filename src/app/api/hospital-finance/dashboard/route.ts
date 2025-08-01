import { NextRequest, NextResponse } from 'next/server';
import { HospitalFinanceService } from '@/lib/hospital-finance-service';

export async function GET() {
  try {
    const dashboardData = await HospitalFinanceService.getFinancialDashboard();
    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
