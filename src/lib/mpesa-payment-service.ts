export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  billId: string;
  patientId: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  transactionId?: string;
  checkoutRequestId?: string;
  message: string;
}

export class MpesaPaymentService {
  
  static async initiatePayment(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    try {
      // Mock Mpesa STK Push implementation
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: request.phoneNumber,
          amount: request.amount,
          billReference: request.billId,
          accountReference: request.patientId
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const data = await response.json();
      
      return {
        success: true,
        transactionId: data.transactionId,
        checkoutRequestId: data.checkoutRequestId,
        message: 'Payment request sent to your phone. Please enter your M-Pesa PIN to complete the transaction.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to initiate M-Pesa payment. Please try again.'
      };
    }
  }

  static async checkPaymentStatus(checkoutRequestId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    message: string;
  }> {
    try {
      const response = await fetch(`/api/mpesa/status/${checkoutRequestId}`);
      const data = await response.json();
      
      return {
        status: data.status,
        transactionId: data.transactionId,
        message: data.message
      };
    } catch (error) {
      return {
        status: 'failed',
        message: 'Failed to check payment status'
      };
    }
  }

  static formatPhoneNumber(phone: string): string {
    // Format phone number for Mpesa (254XXXXXXXXX)
    let formatted = phone.replace(/\D/g, '');
    
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('7') || formatted.startsWith('1')) {
      formatted = '254' + formatted;
    }
    
    return formatted;
  }

  static validatePhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    return /^254[71]\d{8}$/.test(formatted);
  }
}