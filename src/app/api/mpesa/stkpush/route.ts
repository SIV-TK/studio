import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, amount, billReference, accountReference } = await request.json();

    const mockResponse = {
      success: true,
      transactionId: `MP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      checkoutRequestId: `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'STK Push sent successfully'
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to initiate M-Pesa payment' },
      { status: 500 }
    );
  }
}