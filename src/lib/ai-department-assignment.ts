export interface DepartmentRecommendation {
  primaryDepartment: string;
  confidence: number;
  reasoning: string;
  alternativeDepartments: string[];
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  specialistRequired: boolean;
}

export const getAIDepartmentRecommendation = async (patientData: {
  age: number;
  gender: string;
  bloodPressure: string;
  temperature: number;
  sugarLevel: number;
  heartRate: number;
  oxygenSaturation: number;
  currentSymptoms: string;
  chiefComplaint: string;
  medicalHistory: string;
  admissionType: string;
}): Promise<DepartmentRecommendation> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // AI analysis based on symptoms, vitals, and medical history
  const symptoms = patientData.currentSymptoms.toLowerCase();
  const complaint = patientData.chiefComplaint.toLowerCase();
  const history = patientData.medicalHistory.toLowerCase();
  
  // Critical conditions check
  if (patientData.temperature > 39 || patientData.oxygenSaturation < 90 || 
      patientData.admissionType === 'emergency' ||
      symptoms.includes('chest pain') || symptoms.includes('difficulty breathing')) {
    return {
      primaryDepartment: 'Emergency',
      confidence: 95,
      reasoning: 'Critical vital signs or emergency symptoms detected requiring immediate attention',
      alternativeDepartments: ['ICU'],
      urgencyLevel: 'Critical',
      specialistRequired: true
    };
  }

  // Heart-related conditions
  if (symptoms.includes('chest') || symptoms.includes('heart') || 
      complaint.includes('cardiac') || history.includes('heart') ||
      patientData.heartRate > 120 || patientData.heartRate < 50) {
    return {
      primaryDepartment: 'Cardiology',
      confidence: 88,
      reasoning: 'Cardiac symptoms and abnormal heart rate indicate cardiovascular issues',
      alternativeDepartments: ['Emergency', 'General Medicine'],
      urgencyLevel: 'High',
      specialistRequired: true
    };
  }

  // Surgical conditions
  if (symptoms.includes('abdominal pain') || symptoms.includes('trauma') ||
      complaint.includes('surgery') || complaint.includes('appendix') ||
      symptoms.includes('fracture')) {
    return {
      primaryDepartment: 'Surgery',
      confidence: 85,
      reasoning: 'Symptoms suggest surgical intervention may be required',
      alternativeDepartments: ['Emergency', 'Orthopedics'],
      urgencyLevel: 'High',
      specialistRequired: true
    };
  }

  // Neurological conditions
  if (symptoms.includes('headache') || symptoms.includes('seizure') ||
      symptoms.includes('confusion') || complaint.includes('neurological') ||
      symptoms.includes('stroke')) {
    return {
      primaryDepartment: 'Neurology',
      confidence: 82,
      reasoning: 'Neurological symptoms require specialized neurological assessment',
      alternativeDepartments: ['Emergency', 'General Medicine'],
      urgencyLevel: 'High',
      specialistRequired: true
    };
  }

  // Pediatric conditions
  if (patientData.age < 18) {
    return {
      primaryDepartment: 'Pediatrics',
      confidence: 90,
      reasoning: 'Patient age requires pediatric specialized care',
      alternativeDepartments: ['General Medicine'],
      urgencyLevel: 'Medium',
      specialistRequired: true
    };
  }

  // Orthopedic conditions
  if (symptoms.includes('bone') || symptoms.includes('joint') ||
      symptoms.includes('fracture') || complaint.includes('orthopedic')) {
    return {
      primaryDepartment: 'Orthopedics',
      confidence: 80,
      reasoning: 'Musculoskeletal symptoms indicate orthopedic evaluation needed',
      alternativeDepartments: ['Surgery', 'General Medicine'],
      urgencyLevel: 'Medium',
      specialistRequired: true
    };
  }

  // Diabetes/Endocrine conditions
  if (patientData.sugarLevel > 200 || patientData.sugarLevel < 70 ||
      history.includes('diabetes') || symptoms.includes('diabetes')) {
    return {
      primaryDepartment: 'General Medicine',
      confidence: 75,
      reasoning: 'Abnormal glucose levels and diabetic history require medical management',
      alternativeDepartments: ['Emergency'],
      urgencyLevel: 'Medium',
      specialistRequired: false
    };
  }

  // Respiratory conditions
  if (symptoms.includes('cough') || symptoms.includes('breathing') ||
      patientData.oxygenSaturation < 95) {
    return {
      primaryDepartment: 'General Medicine',
      confidence: 78,
      reasoning: 'Respiratory symptoms and oxygen saturation levels need medical evaluation',
      alternativeDepartments: ['Emergency'],
      urgencyLevel: 'Medium',
      specialistRequired: false
    };
  }

  // Default to General Medicine
  return {
    primaryDepartment: 'General Medicine',
    confidence: 70,
    reasoning: 'General medical evaluation recommended based on presented symptoms',
    alternativeDepartments: ['Emergency'],
    urgencyLevel: 'Low',
    specialistRequired: false
  };
};