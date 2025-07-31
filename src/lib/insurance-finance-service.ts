import { InsuranceAuthService } from './insurance-auth-service';

export interface PatientAccount {
  patientId: string;
  patientName: string;
  policyNumber: string;
  planType: string;
  totalCoverage: number;
  usedAmount: number;
  remainingAmount: number;
  deductible: number;
  deductibleMet: number;
  copayAmount: number;
  lastClaimDate: string;
  accountStatus: 'Active' | 'Suspended' | 'Pending' | 'Expired';
  monthlyPremium: number;
  yearlyPremiumPaid: number;
  nextPaymentDue: string;
}

export interface HospitalClaim {
  claimId: string;
  patientId: string;
  patientName: string;
  hospitalName: string;
  hospitalId: string;
  claimAmount: number;
  serviceDate: string;
  submissionDate: string;
  claimType: 'Emergency' | 'Routine' | 'Surgery' | 'Diagnostic' | 'Pharmacy' | 'Specialist';
  description: string;
  diagnosis: string;
  treatmentDetails: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Partially Approved';
  reviewedBy?: string;
  reviewDate?: string;
  approvedAmount?: number;
  rejectionReason?: string;
  documents: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  estimatedProcessingTime: string;
}

export interface FinancialSummary {
  totalPremiumsCollected: number;
  totalClaimsPaid: number;
  totalClaimsPending: number;
  totalReserves: number;
  profitMargin: number;
  lossRatio: number;
  expenseRatio: number;
  combinedRatio: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netIncome: number;
  cashFlow: number;
}

export interface BalanceSheetData {
  assets: {
    cash: number;
    investments: number;
    premiumsReceivable: number;
    reinsuranceRecoverables: number;
    totalAssets: number;
  };
  liabilities: {
    claimReserves: number;
    unearmedPremiums: number;
    accountsPayable: number;
    totalLiabilities: number;
  };
  equity: {
    paidInCapital: number;
    retainedEarnings: number;
    totalEquity: number;
  };
  ratios: {
    currentRatio: number;
    debtToEquity: number;
    returnOnEquity: number;
    assetTurnover: number;
  };
}

// Mock patient accounts data
const mockPatientAccounts = new Map<string, PatientAccount>([
  ['user_001', {
    patientId: 'user_001',
    patientName: 'John Doe',
    policyNumber: 'POL-2024-001',
    planType: 'Premium',
    totalCoverage: 500000,
    usedAmount: 45000,
    remainingAmount: 455000,
    deductible: 1000,
    deductibleMet: 800,
    copayAmount: 25,
    lastClaimDate: '2024-07-15',
    accountStatus: 'Active',
    monthlyPremium: 450,
    yearlyPremiumPaid: 5400,
    nextPaymentDue: '2024-08-01'
  }],
  ['user_002', {
    patientId: 'user_002',
    patientName: 'Mary Smith',
    policyNumber: 'POL-2024-002',
    planType: 'Standard',
    totalCoverage: 250000,
    usedAmount: 2500,
    remainingAmount: 247500,
    deductible: 1500,
    deductibleMet: 0,
    copayAmount: 30,
    lastClaimDate: '2024-06-20',
    accountStatus: 'Active',
    monthlyPremium: 275,
    yearlyPremiumPaid: 3300,
    nextPaymentDue: '2024-08-01'
  }],
  ['user_003', {
    patientId: 'user_003',
    patientName: 'Bob Johnson',
    policyNumber: 'POL-2023-045',
    planType: 'Comprehensive',
    totalCoverage: 1000000,
    usedAmount: 125000,
    remainingAmount: 875000,
    deductible: 500,
    deductibleMet: 500,
    copayAmount: 15,
    lastClaimDate: '2024-07-28',
    accountStatus: 'Active',
    monthlyPremium: 750,
    yearlyPremiumPaid: 9000,
    nextPaymentDue: '2024-08-01'
  }]
]);

// Mock hospital claims data
const mockHospitalClaims = new Map<string, HospitalClaim>([
  ['CLM-2024-001', {
    claimId: 'CLM-2024-001',
    patientId: 'user_001',
    patientName: 'John Doe',
    hospitalName: 'City General Hospital',
    hospitalId: 'HOSP-001',
    claimAmount: 8500,
    serviceDate: '2024-07-25',
    submissionDate: '2024-07-28',
    claimType: 'Emergency',
    description: 'Emergency room visit for chest pain',
    diagnosis: 'Acute coronary syndrome',
    treatmentDetails: 'ECG, blood tests, cardiac monitoring, medications',
    status: 'Pending',
    documents: ['medical-report.pdf', 'lab-results.pdf', 'discharge-summary.pdf'],
    priority: 'High',
    estimatedProcessingTime: '2-3 business days'
  }],
  ['CLM-2024-002', {
    claimId: 'CLM-2024-002',
    patientId: 'user_002',
    patientName: 'Mary Smith',
    hospitalName: 'Women\'s Health Center',
    hospitalId: 'HOSP-002',
    claimAmount: 3200,
    serviceDate: '2024-07-20',
    submissionDate: '2024-07-22',
    claimType: 'Routine',
    description: 'Prenatal checkup and ultrasound',
    diagnosis: 'Normal pregnancy - 20 weeks',
    treatmentDetails: 'Routine prenatal exam, ultrasound, blood work',
    status: 'Approved',
    reviewedBy: 'Dr. Sarah Johnson',
    reviewDate: '2024-07-24',
    approvedAmount: 3200,
    documents: ['prenatal-report.pdf', 'ultrasound-images.pdf'],
    priority: 'Medium',
    estimatedProcessingTime: 'Completed'
  }],
  ['CLM-2024-003', {
    claimId: 'CLM-2024-003',
    patientId: 'user_003',
    patientName: 'Bob Johnson',
    hospitalName: 'Heart Specialty Institute',
    hospitalId: 'HOSP-003',
    claimAmount: 25000,
    serviceDate: '2024-07-15',
    submissionDate: '2024-07-18',
    claimType: 'Surgery',
    description: 'Cardiac catheterization and stent placement',
    diagnosis: 'Coronary artery disease with significant stenosis',
    treatmentDetails: 'Cardiac catheterization, angioplasty, drug-eluting stent placement',
    status: 'Under Review',
    documents: ['surgical-report.pdf', 'angiogram-images.pdf', 'post-op-notes.pdf'],
    priority: 'High',
    estimatedProcessingTime: '5-7 business days'
  }],
  ['CLM-2024-004', {
    claimId: 'CLM-2024-004',
    patientId: 'user_001',
    patientName: 'John Doe',
    hospitalName: 'Metro Pharmacy Network',
    hospitalId: 'PHARM-001',
    claimAmount: 450,
    serviceDate: '2024-07-30',
    submissionDate: '2024-07-30',
    claimType: 'Pharmacy',
    description: 'Prescription medications for diabetes management',
    diagnosis: 'Type 2 Diabetes Mellitus',
    treatmentDetails: 'Metformin, Insulin, blood glucose test strips',
    status: 'Rejected',
    reviewedBy: 'PharmD Lisa Chen',
    reviewDate: '2024-07-31',
    rejectionReason: 'Prior authorization required for insulin brand requested',
    documents: ['prescription.pdf', 'pharmacy-receipt.pdf'],
    priority: 'Low',
    estimatedProcessingTime: 'Completed'
  }]
]);

// Mock financial data
const mockFinancialSummary: FinancialSummary = {
  totalPremiumsCollected: 2850000,
  totalClaimsPaid: 1920000,
  totalClaimsPending: 285000,
  totalReserves: 1500000,
  profitMargin: 12.5,
  lossRatio: 67.4,
  expenseRatio: 28.1,
  combinedRatio: 95.5,
  monthlyRevenue: 237500,
  monthlyExpenses: 226750,
  netIncome: 10750,
  cashFlow: 145000
};

const mockBalanceSheet: BalanceSheetData = {
  assets: {
    cash: 850000,
    investments: 2300000,
    premiumsReceivable: 425000,
    reinsuranceRecoverables: 180000,
    totalAssets: 3755000
  },
  liabilities: {
    claimReserves: 1200000,
    unearmedPremiums: 380000,
    accountsPayable: 125000,
    totalLiabilities: 1705000
  },
  equity: {
    paidInCapital: 1500000,
    retainedEarnings: 550000,
    totalEquity: 2050000
  },
  ratios: {
    currentRatio: 2.15,
    debtToEquity: 0.83,
    returnOnEquity: 8.2,
    assetTurnover: 1.12
  }
};

export class InsuranceFinanceService {
  // Patient self-service methods (no permissions required)
  static async getPatientAccountSelf(patientId: string): Promise<PatientAccount | null> {
    return mockPatientAccounts.get(patientId) || null;
  }

  static async getClaimsByPatientSelf(patientId: string): Promise<HospitalClaim[]> {
    const claims = Array.from(mockHospitalClaims.values());
    return claims.filter(claim => claim.patientId === patientId);
  }

  // Insurance staff methods (require permissions)
  static async getPatientAccount(patientId: string): Promise<PatientAccount | null> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_patient_data')) {
      throw new Error('Insufficient permissions to access patient accounts');
    }

    return mockPatientAccounts.get(patientId) || null;
  }

  static async getAllPatientAccounts(): Promise<PatientAccount[]> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_patient_data')) {
      throw new Error('Insufficient permissions to access patient accounts');
    }

    return Array.from(mockPatientAccounts.values());
  }

  static async getHospitalClaim(claimId: string): Promise<HospitalClaim | null> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('process_claims')) {
      throw new Error('Insufficient permissions to access claims');
    }

    return mockHospitalClaims.get(claimId) || null;
  }

  static async getAllHospitalClaims(status?: string): Promise<HospitalClaim[]> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('process_claims')) {
      throw new Error('Insufficient permissions to access claims');
    }

    const claims = Array.from(mockHospitalClaims.values());
    
    if (status) {
      return claims.filter(claim => claim.status === status);
    }
    
    return claims;
  }

  static async approveClaim(
    claimId: string, 
    approvedAmount: number, 
    reviewerName: string,
    notes?: string
  ): Promise<boolean> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('approve_claims')) {
      throw new Error('Insufficient permissions to approve claims');
    }

    const claim = mockHospitalClaims.get(claimId);
    if (!claim) {
      throw new Error('Claim not found');
    }

    // Update claim status
    claim.status = approvedAmount >= claim.claimAmount ? 'Approved' : 'Partially Approved';
    claim.approvedAmount = approvedAmount;
    claim.reviewedBy = reviewerName;
    claim.reviewDate = new Date().toISOString().split('T')[0];
    claim.estimatedProcessingTime = 'Completed';

    // Update patient account
    const patientAccount = mockPatientAccounts.get(claim.patientId);
    if (patientAccount) {
      patientAccount.usedAmount += approvedAmount;
      patientAccount.remainingAmount = patientAccount.totalCoverage - patientAccount.usedAmount;
      patientAccount.lastClaimDate = new Date().toISOString().split('T')[0];
    }

    // Update mock claims data
    mockHospitalClaims.set(claimId, claim);
    
    return true;
  }

  static async rejectClaim(
    claimId: string, 
    rejectionReason: string, 
    reviewerName: string
  ): Promise<boolean> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('approve_claims')) {
      throw new Error('Insufficient permissions to reject claims');
    }

    const claim = mockHospitalClaims.get(claimId);
    if (!claim) {
      throw new Error('Claim not found');
    }

    // Update claim status
    claim.status = 'Rejected';
    claim.rejectionReason = rejectionReason;
    claim.reviewedBy = reviewerName;
    claim.reviewDate = new Date().toISOString().split('T')[0];
    claim.estimatedProcessingTime = 'Completed';

    // Update mock claims data
    mockHospitalClaims.set(claimId, claim);
    
    return true;
  }

  static async getFinancialSummary(): Promise<FinancialSummary> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_analytics')) {
      throw new Error('Insufficient permissions to view financial data');
    }

    return mockFinancialSummary;
  }

  static async getBalanceSheet(): Promise<BalanceSheetData> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_analytics')) {
      throw new Error('Insufficient permissions to view balance sheet');
    }

    return mockBalanceSheet;
  }

  static async getClaimsByPatient(patientId: string): Promise<HospitalClaim[]> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_patient_data')) {
      throw new Error('Insufficient permissions to access patient claims');
    }

    const claims = Array.from(mockHospitalClaims.values());
    return claims.filter(claim => claim.patientId === patientId);
  }

  static async getClaimsByHospital(hospitalId: string): Promise<HospitalClaim[]> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('process_claims')) {
      throw new Error('Insufficient permissions to access hospital claims');
    }

    const claims = Array.from(mockHospitalClaims.values());
    return claims.filter(claim => claim.hospitalId === hospitalId);
  }

  static async getFinancialAnalytics() {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_analytics')) {
      throw new Error('Insufficient permissions to view analytics');
    }

    const claims = Array.from(mockHospitalClaims.values());
    const accounts = Array.from(mockPatientAccounts.values());

    const claimsByStatus = {
      pending: claims.filter(c => c.status === 'Pending').length,
      approved: claims.filter(c => c.status === 'Approved').length,
      rejected: claims.filter(c => c.status === 'Rejected').length,
      underReview: claims.filter(c => c.status === 'Under Review').length,
      partiallyApproved: claims.filter(c => c.status === 'Partially Approved').length
    };

    const claimsByType = {
      emergency: claims.filter(c => c.claimType === 'Emergency').length,
      routine: claims.filter(c => c.claimType === 'Routine').length,
      surgery: claims.filter(c => c.claimType === 'Surgery').length,
      diagnostic: claims.filter(c => c.claimType === 'Diagnostic').length,
      pharmacy: claims.filter(c => c.claimType === 'Pharmacy').length,
      specialist: claims.filter(c => c.claimType === 'Specialist').length
    };

    const totalClaimsAmount = claims.reduce((sum, claim) => sum + claim.claimAmount, 0);
    const approvedClaimsAmount = claims
      .filter(c => c.status === 'Approved' || c.status === 'Partially Approved')
      .reduce((sum, claim) => sum + (claim.approvedAmount || 0), 0);

    const averageClaimAmount = totalClaimsAmount / claims.length;
    const approvalRate = (claimsByStatus.approved + claimsByStatus.partiallyApproved) / claims.length * 100;

    const accountsByStatus = {
      active: accounts.filter(a => a.accountStatus === 'Active').length,
      suspended: accounts.filter(a => a.accountStatus === 'Suspended').length,
      pending: accounts.filter(a => a.accountStatus === 'Pending').length,
      expired: accounts.filter(a => a.accountStatus === 'Expired').length
    };

    const totalCoverageAmount = accounts.reduce((sum, account) => sum + account.totalCoverage, 0);
    const totalUsedAmount = accounts.reduce((sum, account) => sum + account.usedAmount, 0);
    const utilizationRate = (totalUsedAmount / totalCoverageAmount) * 100;

    return {
      claimsByStatus,
      claimsByType,
      totalClaimsAmount,
      approvedClaimsAmount,
      averageClaimAmount,
      approvalRate,
      accountsByStatus,
      totalCoverageAmount,
      totalUsedAmount,
      utilizationRate,
      totalPremiumsCollected: accounts.reduce((sum, account) => sum + account.yearlyPremiumPaid, 0)
    };
  }

  static async updatePatientAccount(
    patientId: string, 
    updates: Partial<PatientAccount>
  ): Promise<boolean> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('manage_accounts')) {
      throw new Error('Insufficient permissions to update patient accounts');
    }

    const account = mockPatientAccounts.get(patientId);
    if (!account) {
      throw new Error('Patient account not found');
    }

    // Update the account
    Object.assign(account, updates);
    mockPatientAccounts.set(patientId, account);
    
    return true;
  }

  static getClaimStatusColor(status: string): string {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Under Review': return 'text-blue-600 bg-blue-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      case 'Partially Approved': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  static getAccountStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Suspended': return 'text-red-600 bg-red-50';
      case 'Expired': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }
}
