import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { checkoutRequestId: string } }
) {
  try {
    const { checkoutRequestId } = params;

    // Mock payment status - simulate completion after 10 seconds
    const createdTime = parseInt(checkoutRequestId.split('_')[2]) || Date.now();
    const elapsed = Date.now() - createdTime;

    let status: 'pending' | 'completed' | 'failed';
    let message: string;

    if (elapsed < 10000) {
      status = 'pending';
      message = 'Payment is being processed';
    } else if (Math.random() > 0.1) { // 90% success rate
      status = 'completed';
      message = 'Payment completed successfully';
    } else {
      status = 'failed';
      message = 'Payment was cancelled or failed';
    }

    return NextResponse.json({
      status,
      transactionId: status === 'completed' ? `MP${Date.now()}` : undefined,
      message
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'failed', message: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}