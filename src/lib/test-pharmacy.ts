import { pharmacyService } from '@/lib/pharmacy-service';

// Test function to create sample prescriptions
export async function createSamplePrescriptions() {
  const samplePrescriptions = [
    {
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
      status: 'pending' as const,
      priority: 'normal' as const,
      prescribedAt: new Date().toISOString(),
      patientInstructions: 'Please take medications as prescribed and monitor blood pressure daily.'
    },
    {
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
      status: 'pending' as const,
      priority: 'high' as const,
      prescribedAt: new Date().toISOString(),
      patientInstructions: 'Start treatment immediately. Return if symptoms worsen.'
    },
    {
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
      status: 'dispensed' as const,
      priority: 'normal' as const,
      prescribedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      patientInstructions: 'Use only as needed for pain. Do not exceed 4 doses in 24 hours.'
    }
  ];

  try {
    for (const prescription of samplePrescriptions) {
      await pharmacyService.submitPrescription(prescription);
    }
    console.log('Sample prescriptions created successfully');
  } catch (error) {
    console.error('Error creating sample prescriptions:', error);
  }
}

// Test AI analysis
export async function testAIAnalysis() {
  try {
    const prescriptions = await pharmacyService.getPrescriptions();
    const pendingPrescription = prescriptions.find(p => p.status === 'pending');
    
    if (pendingPrescription) {
      console.log('Testing AI analysis for prescription:', pendingPrescription.id);
      await pharmacyService.updatePrescriptionStatus(
        pendingPrescription.id!,
        'ai_analyzed',
        'AI analysis completed successfully'
      );
    }
  } catch (error) {
    console.error('Error testing AI analysis:', error);
  }
}

// Test patient portal data generation
export async function testPatientPortalData() {
  try {
    const portalData = await pharmacyService.getPatientPortalData('patient-001');
    console.log('Patient portal data:', portalData);
  } catch (error) {
    console.error('Error testing patient portal data:', error);
  }
}
