
// Blood Bank Management
export interface BloodBankInput {
  bloodLevels: {
    [bloodGroup: string]: {
      units: number;
      expiryDates: string[]; // ISO date strings for each unit
    };
  };
  hospitalLocation: string;
  recentTransfusions: Array<{
    bloodGroup: string;
    patientType: string;
    date: string;
  }>;
}

export interface BloodBankOutput {
  currentLevels: string;
  mostRequiredBloodGroup: string;
  predictedPatientTypes: string[];
  expiredOrOverkeptUnits: Array<{ bloodGroup: string; count: number; details: string[] }>;
  recommendations: string;
}

export const bloodBankService = async (input: BloodBankInput): Promise<BloodBankOutput> => {
  const researchData = await aggregateMedicalData(`blood transfusion needs ${input.hospitalLocation}`, 'blood bank');
  const bloodLevelsStr = Object.entries(input.bloodLevels)
    .map(([group, data]) => `${group}: ${data.units} units`)
    .join('\n');
  const researchStr = researchData
    .map((d: any) => `${d.title}\n${d.content}\nSource: ${d.source}`)
    .join('\n\n');
  const prompt = `Hospital Blood Bank Management:\n\nBLOOD LEVELS:\n${bloodLevelsStr}\nLOCATION: ${input.hospitalLocation}\nRECENT TRANSFUSIONS: ${input.recentTransfusions.length}\n\nRESEARCH & LOCAL DATA:\n${researchStr}\n\nPlease provide:\n1. A summary of current blood levels by group\n2. The most commonly required blood group in this area (predict using AI and local data)\n3. Predict the types of patients most likely to require transfusion soon (based on recent transfusions and trends)\n4. List any expired or over-kept blood units (older than 42 days or past expiry)\n5. Recommendations for blood bank management and donation drives\n\nFormat as valid JSON with keys: currentLevels, mostRequiredBloodGroup, predictedPatientTypes, expiredOrOverkeptUnits, recommendations`;

  try {
    const { output } = await ai.generate({ prompt });
    if (output && output.text) {
      return JSON.parse(output.text());
    }
    throw new Error('Primary AI failed');
  } catch (error) {
    const { output } = await aiWithFallback.generate({ prompt });
    return JSON.parse(output.text());
  }
};

// Patient Management System
export interface PatientAdmissionInput {
  patientInfo: {
    age: number;
    gender: string;
    medicalHistory: string;
    currentSymptoms: string;
    vitalSigns: string;
    insurance: string;
  };
  admissionType: 'emergency' | 'elective' | 'urgent';
  chiefComplaint: string;
  referringPhysician?: string;
}

export interface PatientAdmissionOutput {
  admissionPlan: string;
  departmentAssignment: string;
  priorityLevel: number;
  estimatedStayDuration: string;
  preliminaryDiagnosis: string;
  immediateOrders: string[];
  resourceRequirements: string;
  riskAssessment: string;
}

// Hospital Resource Management
export interface ResourceManagementInput {
  department: string;
  currentCapacity: number;
  maxCapacity: number;
  staffing: {
    doctors: number;
    nurses: number;
    technicians: number;
  };
  equipment: string[];
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ResourceManagementOutput {
  resourceAllocation: string;
  staffRecommendations: string;
  equipmentNeeds: string[];
  capacityOptimization: string;
  transferRecommendations: string;
  emergencyProtocols: string;
}

// Clinical Decision Support
export interface ClinicalDecisionInput {
  patientData: {
    symptoms: string[];
    labResults: string;
    imagingResults: string;
    vitalSigns: string;
    medicalHistory: string;
  };
  clinicalQuestion: string;
  specialty: string;
  urgency: 'routine' | 'urgent' | 'emergent';
}

export interface ClinicalDecisionOutput {
  differentialDiagnosis: string[];
  recommendedTests: string[];
  treatmentOptions: string[];
  riskFactors: string[];
  prognosis: string;
  followUpPlan: string;
  evidenceLevel: string;
  consultationNeeded: boolean;
}

// Quality Assurance & Safety
export interface QualityAssuranceInput {
  incidentType: 'medication_error' | 'diagnostic_error' | 'procedural_complication' | 'system_failure';
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  involvedPersonnel: string[];
  timeline: string;
  patientImpact: string;
}

export interface QualityAssuranceOutput {
  rootCauseAnalysis: string;
  correctiveActions: string[];
  preventiveMeasures: string[];
  policyRecommendations: string;
  trainingNeeds: string[];
  reportingRequirements: string;
  followUpProtocol: string;
}

// Advanced Hospital Management AI Services
import { ai, aiWithFallback } from '../genkit';
import { aggregateMedicalData } from '../../lib/medical-data-aggregator';


// Patient Admission & Management
export const patientAdmissionSystem = async (input: PatientAdmissionInput): Promise<PatientAdmissionOutput> => {
  const researchData = await aggregateMedicalData(`${input.chiefComplaint} admission protocols`, 'admission');
  const prompt = `Hospital Admission Management for ${input.admissionType} admission:

PATIENT INFORMATION:
Age: ${input.patientInfo.age}, Gender: ${input.patientInfo.gender}
Medical History: ${input.patientInfo.medicalHistory}
Current Symptoms: ${input.patientInfo.currentSymptoms}
Vital Signs: ${input.patientInfo.vitalSigns}
Insurance: ${input.patientInfo.insurance}
Chief Complaint: ${input.chiefComplaint}
Referring Physician: ${input.referringPhysician || 'None'}

LATEST ADMISSION PROTOCOLS:

Based on current hospital protocols and medical guidelines, provide comprehensive admission plan including:
1. Optimal department assignment and room type
2. Priority level (1-5, 1=highest priority)
3. Estimated length of stay
4. Preliminary working diagnosis
5. Immediate medical orders and interventions
6. Resource requirements (staff, equipment, beds)
7. Risk assessment and precautions

Format as valid JSON with keys: admissionPlan, departmentAssignment, priorityLevel, estimatedStayDuration, preliminaryDiagnosis, immediateOrders, resourceRequirements, riskAssessment`;

  try {
    const {output} = await ai.generate({prompt});
    if (output && output.text) {
      return JSON.parse(output.text());
    }
    throw new Error('Primary AI failed');
  } catch (error) {
    const {output} = await aiWithFallback.generate({prompt});
    return JSON.parse(output.text());
  }
};

// Hospital Resource Management
export const hospitalResourceManager = async (input: ResourceManagementInput): Promise<ResourceManagementOutput> => {
  const researchData = await aggregateMedicalData(`hospital resource management ${input.department}`, 'management');
  const prompt = `Hospital Resource Management Analysis:

DEPARTMENT: ${input.department}
CURRENT CAPACITY: ${input.currentCapacity}/${input.maxCapacity}
STAFFING: Doctors: ${input.staffing.doctors}, Nurses: ${input.staffing.nurses}, Technicians: ${input.staffing.technicians}
AVAILABLE EQUIPMENT: ${input.equipment.join(', ')}
EMERGENCY LEVEL: ${input.emergencyLevel}

RESOURCE MANAGEMENT GUIDELINES:
${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}

Based on current resource management best practices, provide:
1. Optimal resource allocation strategy
2. Staffing level recommendations and adjustments
3. Equipment needs and procurement priorities
4. Capacity optimization recommendations
5. Patient transfer recommendations if needed
6. Emergency protocols for current situation

Format as valid JSON with keys: resourceAllocation, staffRecommendations, equipmentNeeds, capacityOptimization, transferRecommendations, emergencyProtocols`;

  try {
    const {output} = await ai.generate({prompt});
    if (output && output.text) {
      return JSON.parse(output.text());
    }
    throw new Error('Primary AI failed');
  } catch (error) {
    const {output} = await aiWithFallback.generate({prompt});
    return JSON.parse(output.text());
  }
};

// Clinical Decision Support System
export const clinicalDecisionSupport = async (input: ClinicalDecisionInput): Promise<ClinicalDecisionOutput> => {
  const researchData = await aggregateMedicalData(`${input.clinicalQuestion} ${input.specialty}`, 'clinical');
  const prompt = `Clinical Decision Support System:

PATIENT DATA:
Symptoms: ${input.patientData.symptoms.join(', ')}
Lab Results: ${input.patientData.labResults}
Imaging Results: ${input.patientData.imagingResults}
Vital Signs: ${input.patientData.vitalSigns}
Medical History: ${input.patientData.medicalHistory}

CLINICAL QUESTION: ${input.clinicalQuestion}
SPECIALTY: ${input.specialty}
URGENCY LEVEL: ${input.urgency}

LATEST CLINICAL EVIDENCE:
${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}

Based on current evidence-based medicine and clinical guidelines, provide:
1. Differential diagnosis ranked by probability
2. Recommended diagnostic tests and imaging
3. Treatment options with evidence levels
4. Risk factors and contraindications
5. Prognosis and expected outcomes
6. Follow-up plan and monitoring requirements
7. Evidence level for recommendations (A, B, C)
8. Whether specialty consultation is needed

Format as valid JSON with keys: differentialDiagnosis, recommendedTests, treatmentOptions, riskFactors, prognosis, followUpPlan, evidenceLevel, consultationNeeded`;

  try {
    const {output} = await ai.generate({prompt});
    if (output && output.text) {
      return JSON.parse(output.text());
    }
    throw new Error('Primary AI failed');
  } catch (error) {
    const {output} = await aiWithFallback.generate({prompt});
    return JSON.parse(output.text());
  }
};

// Quality Assurance & Patient Safety
export const qualityAssuranceSystem = async (input: QualityAssuranceInput): Promise<QualityAssuranceOutput> => {
  const researchData = await aggregateMedicalData(`patient safety ${input.incidentType}`, 'safety');
  const prompt = `Hospital Quality Assurance & Patient Safety Analysis:

INCIDENT TYPE: ${input.incidentType}
DESCRIPTION: ${input.description}
SEVERITY LEVEL: ${input.severity}
INVOLVED PERSONNEL: ${input.involvedPersonnel.join(', ')}
TIMELINE: ${input.timeline}
PATIENT IMPACT: ${input.patientImpact}

QUALITY & SAFETY GUIDELINES:
${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}

Based on Joint Commission standards and patient safety protocols, provide:
1. Root cause analysis of the incident
2. Immediate corrective actions required
3. Long-term preventive measures
4. Policy and procedure recommendations
5. Staff training and education needs
6. Regulatory reporting requirements
7. Follow-up monitoring protocol

Format as valid JSON with keys: rootCauseAnalysis, correctiveActions, preventiveMeasures, policyRecommendations, trainingNeeds, reportingRequirements, followUpProtocol`;

  try {
    const {output} = await ai.generate({prompt});
    if (output && output.text) {
      return JSON.parse(output.text());
    }
    throw new Error('Primary AI failed');
  } catch (error) {
    const {output} = await aiWithFallback.generate({prompt});
    return JSON.parse(output.text());
  }
};
