import { LabOrder, LabResult, LabTest } from './lab-results-service';

export const mockLabOrders: LabOrder[] = [
  {
    id: 'lab_order_001',
    patientId: 'patient_001',
    patientName: 'John Smith',
    doctorId: 'doctor_001',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Internal Medicine',
    orderedTests: [
      {
        testName: 'Complete Blood Count (CBC)',
        testCode: 'CBC',
        category: 'blood',
        normalRange: { unit: 'cells/μL', description: 'White Blood Cell Count: 4,000-11,000' },
        description: 'Measures different components of blood',
        preparationInstructions: ['No special preparation required'],
        sampleType: 'Whole blood',
        processingTime: '2-4 hours',
        cost: 25.00
      },
      {
        testName: 'Basic Metabolic Panel (BMP)',
        testCode: 'BMP',
        category: 'biochemistry',
        normalRange: { unit: 'mg/dL', description: 'Glucose: 70-100 mg/dL (fasting)' },
        description: 'Tests kidney function and blood sugar',
        preparationInstructions: ['Fast for 8-12 hours'],
        sampleType: 'Serum',
        processingTime: '1-2 hours',
        cost: 35.00
      }
    ],
    clinicalHistory: 'Routine annual physical examination. Patient reports fatigue and occasional dizziness.',
    urgency: 'routine',
    status: 'completed',
    orderDate: '2024-07-25T08:00:00Z',
    collectionDate: '2024-07-25T10:30:00Z',
    completionDate: '2024-07-25T14:00:00Z',
    aiRecommendations: {
      recommendedTests: ['Consider CBC with differential', 'BMP for comprehensive metabolic assessment'],
      priorityLevel: 'medium',
      clinicalCorrelation: 'Fatigue and dizziness may indicate anemia or metabolic issues',
      additionalConsiderations: ['Check iron levels if CBC shows low hemoglobin'],
      followUpRecommendations: ['Repeat in 3 months if abnormal'],
      confidence: 88
    }
  },
  {
    id: 'lab_order_002',
    patientId: 'patient_002',
    patientName: 'Maria Rodriguez',
    doctorId: 'doctor_002',
    doctorName: 'Dr. Michael Chen',
    department: 'Endocrinology',
    orderedTests: [
      {
        testName: 'Hemoglobin A1C',
        testCode: 'HBA1C',
        category: 'biochemistry',
        normalRange: { unit: '%', description: 'Normal: <5.7%' },
        description: 'Measures average blood sugar over 2-3 months',
        preparationInstructions: ['No fasting required'],
        sampleType: 'Whole blood',
        processingTime: '1-2 hours',
        cost: 30.00
      },
      {
        testName: 'Lipid Panel',
        testCode: 'LIPID',
        category: 'biochemistry',
        normalRange: { unit: 'mg/dL', description: 'Total Cholesterol: <200 mg/dL' },
        description: 'Measures cholesterol levels',
        preparationInstructions: ['Fast for 9-12 hours'],
        sampleType: 'Serum',
        processingTime: '2-3 hours',
        cost: 40.00
      }
    ],
    clinicalHistory: 'Diabetes follow-up. Patient has type 2 diabetes diagnosed 2 years ago.',
    urgency: 'routine',
    status: 'processing',
    orderDate: '2024-07-30T09:15:00Z',
    collectionDate: '2024-07-30T11:00:00Z'
  },
  {
    id: 'lab_order_003',
    patientId: 'patient_003',
    patientName: 'Robert Johnson',
    doctorId: 'doctor_003',
    doctorName: 'Dr. Emily Davis',
    department: 'Cardiology',
    orderedTests: [
      {
        testName: 'C-Reactive Protein (CRP)',
        testCode: 'CRP',
        category: 'biochemistry',
        normalRange: { unit: 'mg/L', description: 'Normal: <3.0 mg/L' },
        description: 'Measures inflammation',
        preparationInstructions: ['No special preparation required'],
        sampleType: 'Serum',
        processingTime: '2 hours',
        cost: 25.00
      }
    ],
    clinicalHistory: 'Chest pain evaluation. Patient has history of hypertension.',
    urgency: 'urgent',
    status: 'sample_collected',
    orderDate: '2024-07-31T07:30:00Z',
    collectionDate: '2024-07-31T08:15:00Z'
  }
];

export const mockLabResults: LabResult[] = [
  {
    id: 'lab_result_001',
    orderId: 'lab_order_001',
    patientId: 'patient_001',
    patientName: 'John Smith',
    testName: 'Complete Blood Count (CBC)',
    testCode: 'CBC',
    value: 6800,
    unit: 'cells/μL',
    normalRange: { min: 4000, max: 11000, unit: 'cells/μL' },
    status: 'normal',
    flag: 'normal',
    resultDate: '2024-07-25T14:00:00Z',
    technicianId: 'tech_001',
    technicianName: 'Lisa Thompson',
    verified: true,
    verifiedBy: 'Dr. Alex Park',
    verificationDate: '2024-07-25T14:30:00Z',
    aiAnalysis: {
      interpretation: 'White blood cell count is within normal limits at 6,800 cells/μL',
      clinicalSignificance: 'Normal CBC suggests healthy blood cell production and immune function',
      possibleCauses: ['Normal physiological variation'],
      recommendations: [
        'Continue routine monitoring',
        'No immediate action required',
        'Results support overall good health'
      ],
      followUpTests: [],
      riskLevel: 'low',
      patientEducation: [
        'Your blood count is normal, indicating healthy blood cell production',
        'This test measures white blood cells that fight infection',
        'Normal results suggest your immune system is functioning well'
      ],
      lifestyleRecommendations: [
        'Maintain a balanced diet rich in nutrients',
        'Continue regular exercise',
        'Get adequate sleep to support immune function'
      ],
      accuracy: 96,
      confidence: 94,
      correlatedFindings: ['No concerning patterns identified']
    }
  },
  {
    id: 'lab_result_002',
    orderId: 'lab_order_001',
    patientId: 'patient_001',
    patientName: 'John Smith',
    testName: 'Basic Metabolic Panel (BMP)',
    testCode: 'BMP',
    value: 110,
    unit: 'mg/dL',
    normalRange: { min: 70, max: 100, unit: 'mg/dL' },
    status: 'abnormal',
    flag: 'high',
    resultDate: '2024-07-25T14:00:00Z',
    technicianId: 'tech_001',
    technicianName: 'Lisa Thompson',
    verified: true,
    verifiedBy: 'Dr. Alex Park',
    verificationDate: '2024-07-25T14:30:00Z',
    aiAnalysis: {
      interpretation: 'Glucose level is 110 mg/dL, which is slightly elevated above normal fasting range',
      clinicalSignificance: 'Elevated glucose may indicate impaired fasting glucose or early diabetes risk',
      possibleCauses: [
        'Prediabetes',
        'Stress-related glucose elevation',
        'Dietary factors',
        'Medication effects'
      ],
      recommendations: [
        'Consider HbA1c test for long-term glucose assessment',
        'Lifestyle modifications recommended',
        'Follow-up testing in 3-6 months',
        'Discuss with healthcare provider'
      ],
      followUpTests: ['HbA1c', 'Oral glucose tolerance test'],
      riskLevel: 'moderate',
      patientEducation: [
        'Your blood sugar is slightly higher than normal',
        'This may indicate increased risk for diabetes',
        'Diet and exercise can help improve blood sugar control'
      ],
      lifestyleRecommendations: [
        'Follow a balanced, low-sugar diet',
        'Increase physical activity to 150 minutes per week',
        'Lose weight if overweight',
        'Monitor blood sugar as recommended'
      ],
      accuracy: 94,
      confidence: 91,
      correlatedFindings: ['Consider correlation with BMI and family diabetes history']
    }
  },
  {
    id: 'lab_result_003',
    orderId: 'lab_order_002',
    patientId: 'patient_002',
    patientName: 'Maria Rodriguez',
    testName: 'Hemoglobin A1C',
    testCode: 'HBA1C',
    value: 8.2,
    unit: '%',
    normalRange: { max: 5.7, unit: '%' },
    status: 'critical',
    flag: 'critical',
    resultDate: '2024-07-30T15:30:00Z',
    technicianId: 'tech_002',
    technicianName: 'Mark Wilson',
    verified: true,
    verifiedBy: 'Dr. Jennifer Lee',
    verificationDate: '2024-07-30T16:00:00Z',
    aiAnalysis: {
      interpretation: 'HbA1c of 8.2% indicates poor glycemic control in diabetes management',
      clinicalSignificance: 'This level significantly increases risk of diabetic complications',
      possibleCauses: [
        'Inadequate diabetes management',
        'Medication non-compliance',
        'Dietary indiscretion',
        'Stress or illness'
      ],
      recommendations: [
        'Immediate medication review and adjustment needed',
        'Intensive diabetes education',
        'More frequent monitoring required',
        'Consider insulin therapy if not already prescribed'
      ],
      followUpTests: [
        'Repeat HbA1c in 3 months',
        'Kidney function tests',
        'Eye examination',
        'Lipid panel'
      ],
      riskLevel: 'critical',
      patientEducation: [
        'Your diabetes control needs immediate improvement',
        'High blood sugar over time damages blood vessels and organs',
        'Better control can prevent serious complications'
      ],
      lifestyleRecommendations: [
        'Strictly follow diabetic diet plan',
        'Take medications exactly as prescribed',
        'Monitor blood sugar daily',
        'Regular exercise as approved by doctor'
      ],
      accuracy: 98,
      confidence: 96,
      correlatedFindings: ['Urgent need for comprehensive diabetes care review']
    }
  }
];

export const mockPatientQueue = [
  {
    patientId: 'patient_004',
    id: 'patient_004',
    patientName: 'David Wilson',
    age: 52,
    gender: 'Male',
    department: 'Nephrology',
    doctorName: 'Dr. Emily Chen',
    orderDate: '2025-07-31',
    testsOrdered: ['Comprehensive Metabolic Panel', 'Urinalysis'],
    priority: 'high',
    expectedTime: '30 minutes',
    status: 'waiting'
  },
  {
    patientId: 'patient_005',
    id: 'patient_005',
    patientName: 'Sarah Brown',
    age: 34,
    gender: 'Female',
    department: 'Oncology',
    doctorName: 'Dr. Michael Rodriguez',
    orderDate: '2025-07-31',
    testsOrdered: ['CBC with Differential', 'Tumor Markers'],
    priority: 'urgent',
    expectedTime: '15 minutes',
    status: 'in_progress'
  },
  {
    patientId: 'patient_006',
    id: 'patient_006',
    patientName: 'Michael Davis',
    age: 45,
    gender: 'Male',
    department: 'Cardiology',
    doctorName: 'Dr. Lisa Anderson',
    orderDate: '2025-07-31',
    testsOrdered: ['Cardiac Enzymes', 'Lipid Panel'],
    priority: 'routine',
    expectedTime: '45 minutes',
    status: 'waiting'
  }
];

// Mock data functions
export function getMockLabOrdersByStatus(status: string) {
  return mockLabOrders.filter(order => order.status === status);
}

export function getMockLabResultsByPatient(patientId: string) {
  return mockLabResults.filter(result => result.patientId === patientId);
}

export function getMockCriticalResults() {
  return mockLabResults.filter(result => result.status === 'critical');
}
