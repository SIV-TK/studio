import { FirestoreService } from './firestore-service';

export interface HospitalBill {
  billId: string;
  patientId: string;
  patientName: string;
  patientContact: string;
  admissionDate: string;
  dischargeDate?: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'Pending' | 'Partially Paid' | 'Fully Paid' | 'Overdue' | 'Cancelled';
  billType: 'Inpatient' | 'Outpatient' | 'Emergency' | 'Surgery' | 'Diagnostic' | 'Pharmacy';
  department: string;
  doctorName: string;
  services: BillService[];
  paymentHistory: PaymentRecord[];
  insuranceDetails?: InsuranceInfo;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  updatedAt: string;
}

export interface BillService {
  serviceId: string;
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  department: string;
  serviceDate: string;
  category: 'Consultation' | 'Procedure' | 'Medication' | 'Test' | 'Room' | 'Equipment';
}

export interface PaymentRecord {
  paymentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'Insurance' | 'Check' | 'Online';
  transactionId?: string;
  receivedBy: string;
  notes?: string;
}

export interface InsuranceInfo {
  insuranceProvider: string;
  policyNumber: string;
  coveragePercentage: number;
  claimedAmount: number;
  approvedAmount: number;
  claimStatus: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Partially Approved';
}

export interface FinancialDashboardData {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  totalBills: number;
  paidBills: number;
  pendingBills: number;
  overdueBills: number;
  departmentRevenue: DepartmentRevenue[];
  paymentMethodStats: PaymentMethodStats[];
  monthlyTrends: MonthlyTrend[];
  topServices: ServiceRevenue[];
}

export interface DepartmentRevenue {
  department: string;
  revenue: number;
  billCount: number;
  averageBillAmount: number;
  pendingAmount: number;
}

export interface PaymentMethodStats {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  bills: number;
  averageAmount: number;
}

export interface ServiceRevenue {
  serviceName: string;
  revenue: number;
  count: number;
  averagePrice: number;
  department: string;
}

export interface PatientFinancialProfile {
  patientId: string;
  patientName: string;
  totalBills: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  lastPaymentDate?: string;
  paymentHistory: PaymentRecord[];
  activeBills: HospitalBill[];
  creditLimit?: number;
  paymentPlan?: PaymentPlan;
}

export interface PaymentPlan {
  planId: string;
  totalAmount: number;
  monthlyAmount: number;
  remainingPayments: number;
  nextDueDate: string;
  status: 'Active' | 'Completed' | 'Defaulted';
}

// Mock data for demonstration
const mockHospitalBills = new Map<string, HospitalBill>([
  ['BILL-2024-001', {
    billId: 'BILL-2024-001',
    patientId: 'user_001',
    patientName: 'John Doe',
    patientContact: '+1-555-0123',
    admissionDate: '2024-07-15',
    dischargeDate: '2024-07-18',
    totalAmount: 15750,
    paidAmount: 10000,
    pendingAmount: 5750,
    dueDate: '2024-08-15',
    status: 'Partially Paid',
    billType: 'Inpatient',
    department: 'Cardiology',
    doctorName: 'Dr. Sarah Wilson',
    services: [
      {
        serviceId: 'SRV-001',
        serviceName: 'Cardiac Consultation',
        description: 'Initial cardiac assessment and evaluation',
        quantity: 1,
        unitPrice: 250,
        totalPrice: 250,
        department: 'Cardiology',
        serviceDate: '2024-07-15',
        category: 'Consultation'
      },
      {
        serviceId: 'SRV-002',
        serviceName: 'ECG Test',
        description: 'Electrocardiogram test',
        quantity: 2,
        unitPrice: 150,
        totalPrice: 300,
        department: 'Cardiology',
        serviceDate: '2024-07-15',
        category: 'Test'
      },
      {
        serviceId: 'SRV-003',
        serviceName: 'Private Room',
        description: 'Private room accommodation',
        quantity: 3,
        unitPrice: 500,
        totalPrice: 1500,
        department: 'Administration',
        serviceDate: '2024-07-15',
        category: 'Room'
      },
      {
        serviceId: 'SRV-004',
        serviceName: 'Cardiac Catheterization',
        description: 'Diagnostic cardiac catheterization procedure',
        quantity: 1,
        unitPrice: 13700,
        totalPrice: 13700,
        department: 'Cardiology',
        serviceDate: '2024-07-16',
        category: 'Procedure'
      }
    ],
    paymentHistory: [
      {
        paymentId: 'PAY-001-001',
        amount: 5000,
        paymentDate: '2024-07-20',
        paymentMethod: 'Card',
        transactionId: 'TXN-123456',
        receivedBy: 'Finance Desk A',
        notes: 'Initial payment'
      },
      {
        paymentId: 'PAY-001-002',
        amount: 5000,
        paymentDate: '2024-07-25',
        paymentMethod: 'Insurance',
        receivedBy: 'Insurance Desk',
        notes: 'Insurance claim payment'
      }
    ],
    insuranceDetails: {
      insuranceProvider: 'HealthFirst Insurance',
      policyNumber: 'POL-2024-001',
      coveragePercentage: 80,
      claimedAmount: 12600,
      approvedAmount: 10000,
      claimStatus: 'Approved'
    },
    priority: 'Medium',
    createdAt: '2024-07-18T10:30:00Z',
    updatedAt: '2024-07-25T14:20:00Z'
  }],
  ['BILL-2024-002', {
    billId: 'BILL-2024-002',
    patientId: 'user_002',
    patientName: 'Mary Smith',
    patientContact: '+1-555-0124',
    admissionDate: '2024-07-20',
    totalAmount: 850,
    paidAmount: 850,
    pendingAmount: 0,
    dueDate: '2024-07-20',
    status: 'Fully Paid',
    billType: 'Outpatient',
    department: 'General Medicine',
    doctorName: 'Dr. James Brown',
    services: [
      {
        serviceId: 'SRV-005',
        serviceName: 'General Consultation',
        description: 'Routine checkup and consultation',
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
        department: 'General Medicine',
        serviceDate: '2024-07-20',
        category: 'Consultation'
      },
      {
        serviceId: 'SRV-006',
        serviceName: 'Blood Test Panel',
        description: 'Complete blood work analysis',
        quantity: 1,
        unitPrice: 200,
        totalPrice: 200,
        department: 'Laboratory',
        serviceDate: '2024-07-20',
        category: 'Test'
      },
      {
        serviceId: 'SRV-007',
        serviceName: 'Prescription Medications',
        description: 'Prescribed medications dispensed',
        quantity: 1,
        unitPrice: 500,
        totalPrice: 500,
        department: 'Pharmacy',
        serviceDate: '2024-07-20',
        category: 'Medication'
      }
    ],
    paymentHistory: [
      {
        paymentId: 'PAY-002-001',
        amount: 850,
        paymentDate: '2024-07-20',
        paymentMethod: 'Cash',
        receivedBy: 'Finance Desk B',
        notes: 'Full payment at discharge'
      }
    ],
    priority: 'Low',
    createdAt: '2024-07-20T16:45:00Z',
    updatedAt: '2024-07-20T17:00:00Z'
  }],
  ['BILL-2024-003', {
    billId: 'BILL-2024-003',
    patientId: 'user_003',
    patientName: 'Bob Johnson',
    patientContact: '+1-555-0125',
    admissionDate: '2024-07-25',
    totalAmount: 32500,
    paidAmount: 0,
    pendingAmount: 32500,
    dueDate: '2024-08-01',
    status: 'Overdue',
    billType: 'Surgery',
    department: 'Surgery',
    doctorName: 'Dr. Michael Lee',
    services: [
      {
        serviceId: 'SRV-008',
        serviceName: 'Pre-surgery Consultation',
        description: 'Pre-operative assessment and planning',
        quantity: 1,
        unitPrice: 300,
        totalPrice: 300,
        department: 'Surgery',
        serviceDate: '2024-07-25',
        category: 'Consultation'
      },
      {
        serviceId: 'SRV-009',
        serviceName: 'Appendectomy',
        description: 'Laparoscopic appendectomy procedure',
        quantity: 1,
        unitPrice: 25000,
        totalPrice: 25000,
        department: 'Surgery',
        serviceDate: '2024-07-26',
        category: 'Procedure'
      },
      {
        serviceId: 'SRV-010',
        serviceName: 'Anesthesia',
        description: 'General anesthesia for surgery',
        quantity: 1,
        unitPrice: 2500,
        totalPrice: 2500,
        department: 'Anesthesiology',
        serviceDate: '2024-07-26',
        category: 'Procedure'
      },
      {
        serviceId: 'SRV-011',
        serviceName: 'Recovery Room',
        description: 'Post-operative recovery room',
        quantity: 2,
        unitPrice: 400,
        totalPrice: 800,
        department: 'Recovery',
        serviceDate: '2024-07-26',
        category: 'Room'
      },
      {
        serviceId: 'SRV-012',
        serviceName: 'Post-op Medications',
        description: 'Pain management and antibiotics',
        quantity: 1,
        unitPrice: 3900,
        totalPrice: 3900,
        department: 'Pharmacy',
        serviceDate: '2024-07-27',
        category: 'Medication'
      }
    ],
    paymentHistory: [],
    insuranceDetails: {
      insuranceProvider: 'LifeCare Global Insurance',
      policyNumber: 'POL-2023-045',
      coveragePercentage: 90,
      claimedAmount: 29250,
      approvedAmount: 0,
      claimStatus: 'Under Review'
    },
    priority: 'High',
    createdAt: '2024-07-28T09:15:00Z',
    updatedAt: '2024-07-28T09:15:00Z'
  }]
]);

export class HospitalFinanceService {
  
  // Get all hospital bills
  static async getAllBills(filters?: {
    status?: string;
    department?: string;
    billType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<HospitalBill[]> {
    let bills = Array.from(mockHospitalBills.values());
    
    if (filters) {
      if (filters.status) {
        bills = bills.filter(bill => bill.status === filters.status);
      }
      if (filters.department) {
        bills = bills.filter(bill => bill.department === filters.department);
      }
      if (filters.billType) {
        bills = bills.filter(bill => bill.billType === filters.billType);
      }
      if (filters.startDate) {
        bills = bills.filter(bill => bill.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        bills = bills.filter(bill => bill.createdAt <= filters.endDate!);
      }
    }
    
    return bills.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get bill by ID
  static async getBillById(billId: string): Promise<HospitalBill | null> {
    return mockHospitalBills.get(billId) || null;
  }

  // Get bills by patient ID
  static async getBillsByPatient(patientId: string): Promise<HospitalBill[]> {
    const bills = Array.from(mockHospitalBills.values());
    return bills.filter(bill => bill.patientId === patientId);
  }

  // Get patient financial profile
  static async getPatientFinancialProfile(patientId: string): Promise<PatientFinancialProfile | null> {
    const bills = await this.getBillsByPatient(patientId);
    
    if (bills.length === 0) {
      return null;
    }

    const totalBills = bills.length;
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const paidAmount = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const pendingAmount = bills.reduce((sum, bill) => sum + bill.pendingAmount, 0);
    const overdueAmount = bills
      .filter(bill => bill.status === 'Overdue')
      .reduce((sum, bill) => sum + bill.pendingAmount, 0);

    const activeBills = bills.filter(bill => bill.status !== 'Fully Paid' && bill.status !== 'Cancelled');
    
    // Get all payment records
    const allPayments = bills.flatMap(bill => bill.paymentHistory);
    const lastPayment = allPayments.sort((a, b) => 
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    )[0];

    return {
      patientId,
      patientName: bills[0].patientName,
      totalBills,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      lastPaymentDate: lastPayment?.paymentDate,
      paymentHistory: allPayments,
      activeBills
    };
  }

  // Create new bill
  static async createBill(billData: Omit<HospitalBill, 'billId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const billId = `BILL-${new Date().getFullYear()}-${String(mockHospitalBills.size + 1).padStart(3, '0')}`;
    
    const newBill: HospitalBill = {
      ...billData,
      billId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockHospitalBills.set(billId, newBill);
    return billId;
  }

  // Update bill
  static async updateBill(billId: string, updates: Partial<HospitalBill>): Promise<boolean> {
    const bill = mockHospitalBills.get(billId);
    if (!bill) {
      throw new Error('Bill not found');
    }

    const updatedBill = {
      ...bill,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    mockHospitalBills.set(billId, updatedBill);
    return true;
  }

  // Record payment
  static async recordPayment(billId: string, paymentData: Omit<PaymentRecord, 'paymentId'>): Promise<boolean> {
    const bill = mockHospitalBills.get(billId);
    if (!bill) {
      throw new Error('Bill not found');
    }

    const paymentId = `PAY-${billId.split('-')[2]}-${String(bill.paymentHistory.length + 1).padStart(3, '0')}`;
    
    const newPayment: PaymentRecord = {
      ...paymentData,
      paymentId
    };

    bill.paymentHistory.push(newPayment);
    bill.paidAmount += paymentData.amount;
    bill.pendingAmount = Math.max(0, bill.totalAmount - bill.paidAmount);
    
    // Update status based on payment
    if (bill.pendingAmount === 0) {
      bill.status = 'Fully Paid';
    } else if (bill.paidAmount > 0) {
      bill.status = 'Partially Paid';
    }

    bill.updatedAt = new Date().toISOString();
    mockHospitalBills.set(billId, bill);
    
    return true;
  }

  // Get financial dashboard data
  static async getFinancialDashboard(): Promise<FinancialDashboardData> {
    const bills = Array.from(mockHospitalBills.values());
    
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const monthlyRevenue = bills
      .filter(bill => {
        const billDate = new Date(bill.createdAt);
        const currentMonth = new Date();
        return billDate.getMonth() === currentMonth.getMonth() && 
               billDate.getFullYear() === currentMonth.getFullYear();
      })
      .reduce((sum, bill) => sum + bill.paidAmount, 0);

    const pendingAmount = bills.reduce((sum, bill) => sum + bill.pendingAmount, 0);
    const overdueAmount = bills
      .filter(bill => bill.status === 'Overdue')
      .reduce((sum, bill) => sum + bill.pendingAmount, 0);

    const totalBills = bills.length;
    const paidBills = bills.filter(bill => bill.status === 'Fully Paid').length;
    const pendingBills = bills.filter(bill => bill.status === 'Pending' || bill.status === 'Partially Paid').length;
    const overdueBills = bills.filter(bill => bill.status === 'Overdue').length;

    // Department revenue
    const departmentMap = new Map<string, {
      revenue: number;
      billCount: number;
      totalAmount: number;
      pendingAmount: number;
    }>();

    bills.forEach(bill => {
      const dept = departmentMap.get(bill.department) || {
        revenue: 0,
        billCount: 0,
        totalAmount: 0,
        pendingAmount: 0
      };
      dept.revenue += bill.paidAmount;
      dept.billCount += 1;
      dept.totalAmount += bill.totalAmount;
      dept.pendingAmount += bill.pendingAmount;
      departmentMap.set(bill.department, dept);
    });

    const departmentRevenue: DepartmentRevenue[] = Array.from(departmentMap.entries()).map(([department, data]) => ({
      department,
      revenue: data.revenue,
      billCount: data.billCount,
      averageBillAmount: data.totalAmount / data.billCount,
      pendingAmount: data.pendingAmount
    }));

    // Payment method stats
    const paymentMethodMap = new Map<string, { amount: number; count: number }>();
    bills.forEach(bill => {
      bill.paymentHistory.forEach(payment => {
        const method = paymentMethodMap.get(payment.paymentMethod) || { amount: 0, count: 0 };
        method.amount += payment.amount;
        method.count += 1;
        paymentMethodMap.set(payment.paymentMethod, method);
      });
    });

    const totalPaymentAmount = Array.from(paymentMethodMap.values()).reduce((sum, method) => sum + method.amount, 0);
    const paymentMethodStats: PaymentMethodStats[] = Array.from(paymentMethodMap.entries()).map(([method, data]) => ({
      method,
      amount: data.amount,
      count: data.count,
      percentage: (data.amount / totalPaymentAmount) * 100
    }));

    // Monthly trends (simplified)
    const monthlyTrends: MonthlyTrend[] = [
      { month: 'Jan', revenue: 45000, bills: 23, averageAmount: 1956 },
      { month: 'Feb', revenue: 52000, bills: 28, averageAmount: 1857 },
      { month: 'Mar', revenue: 48000, bills: 25, averageAmount: 1920 },
      { month: 'Apr', revenue: 55000, bills: 30, averageAmount: 1833 },
      { month: 'May', revenue: 61000, bills: 32, averageAmount: 1906 },
      { month: 'Jun', revenue: 58000, bills: 29, averageAmount: 2000 },
      { month: 'Jul', revenue: monthlyRevenue, bills: bills.filter(b => new Date(b.createdAt).getMonth() === 6).length, averageAmount: 0 }
    ];

    // Top services by revenue
    const serviceMap = new Map<string, { revenue: number; count: number; department: string }>();
    bills.forEach(bill => {
      bill.services.forEach(service => {
        const key = service.serviceName;
        const existing = serviceMap.get(key) || { revenue: 0, count: 0, department: service.department };
        existing.revenue += service.totalPrice;
        existing.count += 1;
        serviceMap.set(key, existing);
      });
    });

    const topServices: ServiceRevenue[] = Array.from(serviceMap.entries())
      .map(([serviceName, data]) => ({
        serviceName,
        revenue: data.revenue,
        count: data.count,
        averagePrice: data.revenue / data.count,
        department: data.department
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalRevenue,
      monthlyRevenue,
      pendingAmount,
      overdueAmount,
      totalBills,
      paidBills,
      pendingBills,
      overdueBills,
      departmentRevenue,
      paymentMethodStats,
      monthlyTrends,
      topServices
    };
  }

  // Get overdue bills
  static async getOverdueBills(): Promise<HospitalBill[]> {
    const bills = Array.from(mockHospitalBills.values());
    return bills.filter(bill => bill.status === 'Overdue');
  }

  // Update bill status
  static async updateBillStatus(billId: string, status: HospitalBill['status']): Promise<boolean> {
    const bill = mockHospitalBills.get(billId);
    if (!bill) {
      throw new Error('Bill not found');
    }

    bill.status = status;
    bill.updatedAt = new Date().toISOString();
    mockHospitalBills.set(billId, bill);
    
    return true;
  }

  // Utility functions
  static getBillStatusColor(status: string): string {
    switch (status) {
      case 'Fully Paid': return 'bg-green-100 text-green-800';
      case 'Partially Paid': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  static getBillTypeColor(type: string): string {
    switch (type) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Surgery': return 'bg-purple-100 text-purple-800';
      case 'Inpatient': return 'bg-blue-100 text-blue-800';
      case 'Outpatient': return 'bg-green-100 text-green-800';
      case 'Diagnostic': return 'bg-orange-100 text-orange-800';
      case 'Pharmacy': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
