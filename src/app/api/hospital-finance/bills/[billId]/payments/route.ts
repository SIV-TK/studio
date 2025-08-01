import { NextRequest, NextResponse } from 'next/server';
import { HospitalFinanceService } from '@/lib/hospital-finance-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { billId: string } }
) {
  try {
    const paymentData = await request.json();
    const success = await HospitalFinanceService.recordPayment(params.billId, paymentData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
