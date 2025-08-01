export interface InsuranceVerificationResult {
  isValid: boolean;
  insuranceProvider: string;
  policyNumber: string;
  coverageType: string;
  coverageLimit: number;
  deductible: number;
  status: 'Active' | 'Expired' | 'Suspended' | 'Not Found';
  expiryDate: string;
  beneficiaryName: string;
  message: string;
}

// Mock insurance database
const mockInsuranceDatabase = [
  {
    policyNumber: 'NHIF001234',
    provider: 'NHIF',
    beneficiaryName: 'John Doe',
    coverageType: 'Comprehensive',
    coverageLimit: 500000,
    deductible: 5000,
    status: 'Active',
    expiryDate: '2025-12-31'
  },
  {
    policyNumber: 'AAR567890',
    provider: 'AAR Insurance',
    beneficiaryName: 'Jane Smith',
    coverageType: 'Premium',
    coverageLimit: 1000000,
    deductible: 10000,
    status: 'Active',
    expiryDate: '2025-06-30'
  },
  {
    policyNumber: 'JUBILEE123456',
    provider: 'Jubilee Insurance',
    beneficiaryName: 'Michael Johnson',
    coverageType: 'Basic',
    coverageLimit: 300000,
    deductible: 3000,
    status: 'Expired',
    expiryDate: '2024-01-15'
  }
];

export const verifyInsurance = async (
  insuranceInfo: string,
  patientName: string
): Promise<InsuranceVerificationResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract policy number from insurance info
  const policyMatch = insuranceInfo.match(/([A-Z]+\d+)/);
  const policyNumber = policyMatch ? policyMatch[1] : insuranceInfo.toUpperCase();

  // Search in mock database
  const insuranceRecord = mockInsuranceDatabase.find(
    record => record.policyNumber === policyNumber ||
              record.beneficiaryName.toLowerCase().includes(patientName.toLowerCase())
  );

  if (!insuranceRecord) {
    return {
      isValid: false,
      insuranceProvider: 'Unknown',
      policyNumber: policyNumber,
      coverageType: 'N/A',
      coverageLimit: 0,
      deductible: 0,
      status: 'Not Found',
      expiryDate: 'N/A',
      beneficiaryName: patientName,
      message: 'Insurance policy not found in our database. Please verify policy details.'
    };
  }

  const isExpired = new Date(insuranceRecord.expiryDate) < new Date();
  const status = isExpired ? 'Expired' : insuranceRecord.status as 'Active' | 'Expired' | 'Suspended';

  return {
    isValid: status === 'Active',
    insuranceProvider: insuranceRecord.provider,
    policyNumber: insuranceRecord.policyNumber,
    coverageType: insuranceRecord.coverageType,
    coverageLimit: insuranceRecord.coverageLimit,
    deductible: insuranceRecord.deductible,
    status,
    expiryDate: insuranceRecord.expiryDate,
    beneficiaryName: insuranceRecord.beneficiaryName,
    message: status === 'Active' 
      ? `Insurance verified successfully. Coverage: ${insuranceRecord.coverageType}`
      : status === 'Expired'
      ? 'Insurance policy has expired. Please renew before admission.'
      : 'Insurance policy is suspended. Please contact your provider.'
  };
};