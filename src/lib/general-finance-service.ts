export interface GeneralBill {
  id: string;
  type: 'consultation' | 'service' | 'subscription' | 'insurance';
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  category: string;
}

export interface PaymentHistory {
  id: string;
  billId: string;
  amount: number;
  method: 'mpesa' | 'card' | 'cash';
  date: string;
  status: 'completed' | 'failed' | 'pending';
  reference: string;
}

export interface FinancialSummary {
  totalPending: number;
  totalPaid: number;
  monthlySpending: number;
  upcomingDue: number;
}

class GeneralFinanceService {
  private bills: GeneralBill[] = [
    {
      id: 'bill-001',
      type: 'consultation',
      description: 'General Health Consultation',
      amount: 2500,
      dueDate: '2024-12-20',
      status: 'pending',
      category: 'Healthcare'
    },
    {
      id: 'bill-002',
      type: 'subscription',
      description: 'Premium Health Plan - Monthly',
      amount: 1500,
      dueDate: '2024-12-25',
      status: 'pending',
      category: 'Subscription'
    },
    {
      id: 'bill-003',
      type: 'service',
      description: 'Nutrition Consultation',
      amount: 1800,
      dueDate: '2024-12-15',
      status: 'overdue',
      category: 'Healthcare'
    }
  ];

  private paymentHistory: PaymentHistory[] = [
    {
      id: 'pay-001',
      billId: 'bill-004',
      amount: 3000,
      method: 'mpesa',
      date: '2024-12-10',
      status: 'completed',
      reference: 'RK12345678'
    },
    {
      id: 'pay-002',
      billId: 'bill-005',
      amount: 1500,
      method: 'mpesa',
      date: '2024-12-08',
      status: 'completed',
      reference: 'RK87654321'
    }
  ];

  async getBills(): Promise<GeneralBill[]> {
    return this.bills;
  }

  async getPaymentHistory(): Promise<PaymentHistory[]> {
    return this.paymentHistory;
  }

  async getFinancialSummary(): Promise<FinancialSummary> {
    const pending = this.bills.filter(b => b.status === 'pending');
    const overdue = this.bills.filter(b => b.status === 'overdue');
    const paid = this.paymentHistory.filter(p => p.status === 'completed');
    
    return {
      totalPending: pending.reduce((sum, bill) => sum + bill.amount, 0),
      totalPaid: paid.reduce((sum, payment) => sum + payment.amount, 0),
      monthlySpending: paid.reduce((sum, payment) => sum + payment.amount, 0),
      upcomingDue: [...pending, ...overdue].reduce((sum, bill) => sum + bill.amount, 0)
    };
  }

  async purchaseInsurancePlan(planName: string, price: number, userId: string): Promise<{ success: boolean; billId?: string; error?: string }> {
    const billId = `bill-ins-${Date.now()}`;
    
    const newBill: GeneralBill = {
      id: billId,
      type: 'insurance',
      description: `${planName} - Monthly Premium`,
      amount: price,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      status: 'pending',
      category: 'Insurance'
    };
    
    this.bills.unshift(newBill);
    return { success: true, billId };
  }

  async payBill(billId: string, method: 'mpesa' | 'card', phoneNumber?: string): Promise<{ success: boolean; reference?: string; error?: string }> {
    const bill = this.bills.find(b => b.id === billId);
    if (!bill) {
      return { success: false, error: 'Bill not found' };
    }

    // Simulate payment processing
    const reference = `RK${Date.now()}`;
    
    // Update bill status
    bill.status = 'paid';
    
    // Add to payment history
    this.paymentHistory.unshift({
      id: `pay-${Date.now()}`,
      billId,
      amount: bill.amount,
      method,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      reference
    });

    return { success: true, reference };
  }
}

export const generalFinanceService = new GeneralFinanceService();