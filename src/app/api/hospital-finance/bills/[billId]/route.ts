import { NextRequest, NextResponse } from 'next/server';
import { HospitalFinanceService } from '@/lib/hospital-finance-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { billId: string } }
) {
  try {
    const bill = await HospitalFinanceService.getBillById(params.billId);
    
    if (!bill) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ bill });
  } catch (error) {
    console.error('Error fetching bill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bill' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { billId: string } }
) {
  try {
    const updates = await request.json();
    const success = await HospitalFinanceService.updateBill(params.billId, updates);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { error: 'Failed to update bill' },
      { status: 500 }
    );
  }
}
