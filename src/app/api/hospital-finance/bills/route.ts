import { NextRequest, NextResponse } from 'next/server';
import { HospitalFinanceService } from '@/lib/hospital-finance-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const department = searchParams.get('department') || undefined;
    const billType = searchParams.get('billType') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const bills = await HospitalFinanceService.getAllBills({
      status,
      department,
      billType,
      startDate,
      endDate
    });

    return NextResponse.json({ bills });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const billData = await request.json();
    const billId = await HospitalFinanceService.createBill(billData);
    
    return NextResponse.json({ billId }, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    );
  }
}
