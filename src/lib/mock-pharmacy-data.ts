import { PrescriptionRequest, Medication, AIPharmacyAnalysis } from './pharmacy-service';

// Mock prescription data for demonstration
export const mockPrescriptions: PrescriptionRequest[] = [
  {
    id: 'rx-001',
    patientId: 'patient-001',
    patientName: 'John Doe',
    doctorId: 'doctor-001',
    doctorName: 'Dr. Sarah Wilson',
    department: 'Cardiology',
    diagnosis: 'Hypertension, Type 2 Diabetes',
    medications: [
      {
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: '10mg',
        strength: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        route: 'oral',
        instructions: 'Take in the morning with or without food',
        quantity: 30,
        refills: 5
      },
      {
        name: 'Metformin',
        genericName: 'Metformin HCI',
        dosage: '500mg',
        strength: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        route: 'oral',
        instructions: 'Take with meals to reduce stomach upset',
        quantity: 60,
        refills: 5
      }
    ],
    status: 'ai_analyzed',
    priority: 'normal',
    prescribedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    patientInstructions: 'Please take medications as prescribed and monitor blood pressure daily.',
    aiAnalysis: {
      medicationEffects: [
        {
          medication: 'Lisinopril',
          primaryEffect: 'Lowers blood pressure by inhibiting ACE enzyme',
          secondaryEffects: ['Reduces strain on heart', 'Improves kidney function'],
          onsetTime: '1-2 hours',
          duration: '24 hours',
          mechanismOfAction: 'ACE inhibitor that blocks conversion of angiotensin I to angiotensin II'
        },
        {
          medication: 'Metformin',
          primaryEffect: 'Lowers blood glucose by reducing hepatic glucose production',
          secondaryEffects: ['Improves insulin sensitivity', 'May aid in weight management'],
          onsetTime: '2-3 hours',
          duration: '8-12 hours',
          mechanismOfAction: 'Decreases hepatic glucose production and increases insulin sensitivity'
        }
      ],
      drugInteractions: [
        {
          medications: ['Lisinopril', 'Metformin'],
          interactionType: 'minor',
          description: 'No significant interaction between these medications',
          clinicalSignificance: 'Safe combination for diabetes with hypertension',
          recommendation: 'Continue as prescribed, monitor kidney function'
        }
      ],
      dosageRecommendations: [
        {
          medication: 'Lisinopril',
          recommendedDose: '10mg once daily',
          adjustmentReason: 'Standard starting dose for hypertension',
          patientFactors: ['Age: 45', 'No kidney disease', 'First-time ACE inhibitor use'],
          alternatives: ['Enalapril 5mg twice daily', 'Captopril 25mg three times daily']
        }
      ],
      foodAdvice: [
        {
          medication: 'Metformin',
          foodsToAvoid: ['Excessive alcohol'],
          foodsToTakeWith: ['Take with meals'],
          timingWithMeals: 'With breakfast and dinner',
          nutritionalConsiderations: ['High fiber foods may reduce absorption slightly']
        }
      ],
      activityRestrictions: [],
      sideEffects: [
        {
          medication: 'Lisinopril',
          commonSideEffects: ['Dry cough (10-15%)', 'Dizziness', 'Fatigue'],
          seriousSideEffects: ['Angioedema', 'Severe hypotension'],
          whenToSeekHelp: ['Swelling of face/lips/tongue', 'Difficulty breathing'],
          managementTips: ['Take at bedtime if dizziness occurs']
        }
      ],
      monitoringRequirements: [],
      patientEducation: [],
      contraindications: ['Pregnancy', 'History of angioedema'],
      warnings: ['May cause fetal harm during pregnancy'],
      confidence: 92
    }
  },
  {
    id: 'rx-002',
    patientId: 'patient-002',
    patientName: 'Maria Garcia',
    doctorId: 'doctor-002',
    doctorName: 'Dr. Michael Chen',
    department: 'Emergency',
    diagnosis: 'Acute bacterial pneumonia',
    medications: [
      {
        name: 'Azithromycin',
        genericName: 'Azithromycin',
        dosage: '500mg',
        strength: '500mg',
        frequency: 'Once daily',
        duration: '5 days',
        route: 'oral',
        instructions: 'Take on empty stomach, 1 hour before or 2 hours after meals',
        quantity: 6,
        refills: 0
      }
    ],
    status: 'ready',
    priority: 'high',
    prescribedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    patientInstructions: 'Start treatment immediately. Return if symptoms worsen.',
    aiAnalysis: {
      medicationEffects: [
        {
          medication: 'Azithromycin',
          primaryEffect: 'Broad-spectrum antibiotic that inhibits bacterial protein synthesis',
          secondaryEffects: ['Anti-inflammatory properties'],
          onsetTime: '1-2 hours',
          duration: '5-7 days (tissue concentrations)',
          mechanismOfAction: 'Binds to 50S ribosomal subunit, inhibiting protein synthesis'
        }
      ],
      drugInteractions: [],
      dosageRecommendations: [],
      foodAdvice: [
        {
          medication: 'Azithromycin',
          foodsToAvoid: ['Antacids within 2 hours'],
          foodsToTakeWith: ['Take on empty stomach for best absorption'],
          timingWithMeals: '1 hour before or 2 hours after meals',
          nutritionalConsiderations: ['Maintain adequate hydration']
        }
      ],
      activityRestrictions: [],
      sideEffects: [
        {
          medication: 'Azithromycin',
          commonSideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain'],
          seriousSideEffects: ['C. diff colitis', 'QT prolongation'],
          whenToSeekHelp: ['Severe diarrhea', 'Chest pain', 'Irregular heartbeat'],
          managementTips: ['Take with small amount of food if nausea occurs']
        }
      ],
      monitoringRequirements: [],
      patientEducation: [],
      contraindications: ['Hypersensitivity to macrolides'],
      warnings: ['May prolong QT interval'],
      confidence: 88
    }
  },
  {
    id: 'rx-003',
    patientId: 'patient-003',
    patientName: 'Robert Johnson',
    doctorId: 'doctor-003',
    doctorName: 'Dr. Emily Davis',
    department: 'Orthopedics',
    diagnosis: 'Post-surgical pain management',
    medications: [
      {
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        dosage: '400mg',
        strength: '400mg',
        frequency: 'Every 6 hours as needed',
        duration: '7 days',
        route: 'oral',
        instructions: 'Take with food to prevent stomach irritation',
        quantity: 28,
        refills: 1
      }
    ],
    status: 'dispensed',
    priority: 'normal',
    prescribedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    dispensedAt: new Date(Date.now() - 3600000).toISOString(),
    dispensedBy: 'Pharmacist Johnson',
    patientInstructions: 'Use only as needed for pain. Do not exceed 4 doses in 24 hours.'
  },
  {
    id: 'rx-004',
    patientId: 'patient-004',
    patientName: 'Linda Smith',
    doctorId: 'doctor-004',
    doctorName: 'Dr. James Wilson',
    department: 'Endocrinology',
    diagnosis: 'Type 1 Diabetes',
    medications: [
      {
        name: 'Insulin Lispro',
        genericName: 'Insulin Lispro',
        dosage: '10 units',
        strength: '100 units/mL',
        frequency: 'Before meals',
        duration: '30 days',
        route: 'subcutaneous',
        instructions: 'Inject 15 minutes before eating',
        quantity: 3,
        refills: 5
      }
    ],
    status: 'pending',
    priority: 'urgent',
    prescribedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    patientInstructions: 'Critical medication - patient needs immediate access for blood sugar control.'
  },
  {
    id: 'rx-005',
    patientId: 'patient-005',
    patientName: 'David Brown',
    doctorId: 'doctor-005',
    doctorName: 'Dr. Lisa Anderson',
    department: 'Psychiatry',
    diagnosis: 'Major Depressive Disorder',
    medications: [
      {
        name: 'Sertraline',
        genericName: 'Sertraline HCl',
        dosage: '50mg',
        strength: '50mg',
        frequency: 'Once daily',
        duration: '90 days',
        route: 'oral',
        instructions: 'Take in the morning with or without food',
        quantity: 90,
        refills: 3
      }
    ],
    status: 'pharmacist_reviewed',
    priority: 'normal',
    prescribedAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    patientInstructions: 'May take 4-6 weeks to see full effect. Do not stop suddenly.',
    pharmacistNotes: 'Reviewed for drug interactions. Patient counseling required for first-time SSRI use.'
  },
  {
    id: 'rx-006',
    patientId: 'patient-006',
    patientName: 'Sarah Wilson',
    doctorId: 'doctor-006',
    doctorName: 'Dr. Mark Thompson',
    department: 'Gynecology',
    diagnosis: 'Urinary Tract Infection',
    medications: [
      {
        name: 'Trimethoprim-Sulfamethoxazole',
        genericName: 'TMP-SMX',
        dosage: '160/800mg',
        strength: '160/800mg',
        frequency: 'Twice daily',
        duration: '3 days',
        route: 'oral',
        instructions: 'Take with plenty of water',
        quantity: 6,
        refills: 0
      }
    ],
    status: 'prepared',
    priority: 'normal',
    prescribedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
    patientInstructions: 'Complete full course even if symptoms improve. Drink plenty of fluids.'
  }
];

// Function to get mock data based on status
export const getMockPrescriptionsByStatus = (status?: PrescriptionRequest['status']) => {
  if (!status) return mockPrescriptions;
  return mockPrescriptions.filter(rx => rx.status === status);
};

// Function to get mock data by priority
export const getMockPrescriptionsByPriority = (priority: PrescriptionRequest['priority']) => {
  return mockPrescriptions.filter(rx => rx.priority === priority);
};

// Function to simulate real-time updates
export const simulateStatusUpdate = (prescriptionId: string, newStatus: PrescriptionRequest['status']) => {
  const prescription = mockPrescriptions.find(rx => rx.id === prescriptionId);
  if (prescription) {
    prescription.status = newStatus;
    prescription.updatedAt = new Date().toISOString();
    
    if (newStatus === 'dispensed') {
      prescription.dispensedAt = new Date().toISOString();
      prescription.dispensedBy = 'Pharmacist Johnson';
    }
  }
  return prescription;
};
