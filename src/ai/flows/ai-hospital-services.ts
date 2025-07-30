'use server';

import {ai, aiWithFallback} from '@/ai/genkit';
import {getPharmacyResearch, getEmergencyProtocols, getRadiologyStandards, getSurgeryGuidelines, aggregateMedicalData} from '@/lib/medical-data-aggregator';

function getFallbackPharmacyResponse(input: any) {
  return {
    recommendedMedicines: 'AI service temporarily unavailable. Please consult with a pharmacist or healthcare provider for medication recommendations.',
    medicineDescriptions: 'Detailed medication information is not available at this time. Please refer to medication packaging or consult a healthcare professional.',
    medicineRoles: 'Therapeutic information is temporarily unavailable. Please consult your healthcare provider.',
    sideEffects: 'Side effect information is not available. Please read medication labels and consult your pharmacist.',
    treatmentDuration: 'Treatment duration guidance is temporarily unavailable. Follow your doctor\'s instructions.',
    interactions: 'Drug interaction checking is temporarily unavailable. Please consult your pharmacist before taking new medications.',
    specialConsiderations: `For ${input.userProfile} patients, please consult with a healthcare provider for personalized advice.`,
    monitoringRequirements: 'Monitoring requirements are temporarily unavailable. Please follow up with your healthcare provider.'
  };
}

// AI Emergency Department
export interface EmergencyTriageInput {
  symptoms: string;
  vitals: string;
  consciousness: string;
  painLevel: number;
}

export interface EmergencyTriageOutput {
  triageLevel: string;
  immediateActions: string;
  estimatedWaitTime: string;
  requiredTests: string;
}

export const emergencyTriage = async (input: EmergencyTriageInput): Promise<EmergencyTriageOutput> => { async (input) => {
  const researchData = await getEmergencyProtocols(input.symptoms);
  const prompt = `Emergency triage assessment for: ${input.symptoms}. Vitals: ${input.vitals}. Pain: ${input.painLevel}/10. Consciousness: ${input.consciousness}.
  
  Latest Emergency Protocols from verified medical databases:
  ${researchData}
  
  Based on current medical guidelines above, provide comprehensive assessment with:
  - Triage level (1-5 with 1=most urgent)
  - Immediate actions required
  - Estimated wait time based on urgency
  - Required diagnostic tests and procedures
  
  Format as valid JSON with keys: triageLevel, immediateActions, estimatedWaitTime, requiredTests`;
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
});

// AI Radiology
export interface RadiologyAnalysisInput {
  imageType: string;
  patientHistory: string;
  clinicalQuestion: string;
}

export interface RadiologyAnalysisOutput {
  findings: string;
  impression: string;
  recommendations: string;
  followUp: string;
}

export const radiologyAnalysis = async (input: RadiologyAnalysisInput): Promise<RadiologyAnalysisOutput> => { async (input) => {
  const researchData = await getRadiologyStandards(input.imageType, input.clinicalQuestion);
  const prompt = `Analyze ${input.imageType} for patient with ${input.patientHistory}. Clinical question: ${input.clinicalQuestion}.
  
  Current Radiology Standards:
  ${researchData}
  
  Based on latest imaging guidelines above, provide findings, impression, recommendations.`;
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
});

// AI Pharmacy
export interface PharmacyConsultationInput {
  queryType: string;
  userProfile: string;
  medications: string;
  allergies: string;
  conditions: string;
  newPrescription?: string;
  labResults?: string;
  doctorNotes?: string;
  symptoms?: string;
}

export interface PharmacyConsultationOutput {
  recommendedMedicines: string;
  medicineDescriptions: string;
  medicineRoles: string;
  sideEffects: string;
  treatmentDuration: string;
  interactions: string;
  specialConsiderations: string;
  monitoringRequirements: string;
}

export const pharmacyConsultation = async (input: PharmacyConsultationInput): Promise<PharmacyConsultationOutput> => { async (input) => {
  const queryContext = input.newPrescription || input.symptoms || input.conditions;
  const researchData = await getPharmacyResearch(queryContext, input.userProfile);
  const prompt = `Advanced pharmacy consultation for ${input.userProfile} patient.
  Query Type: ${input.queryType}
  Current Medications: ${input.medications}
  Allergies: ${input.allergies}
  Conditions: ${input.conditions}
  New Prescription: ${input.newPrescription}
  Lab Results: ${input.labResults}
  Doctor Notes: ${input.doctorNotes}
  Symptoms: ${input.symptoms}
  
  Latest Pharmaceutical Research:
  ${researchData}
  
  Based on verified medical databases above, provide comprehensive pharmaceutical analysis including:
  1. Specific medicine recommendations with brand names
  2. Detailed medicine descriptions and mechanisms
  3. Therapeutic roles and how medicines work
  4. Complete side effect profiles
  5. Treatment duration and timing
  6. Drug interactions and contraindications
  7. Special considerations for ${input.userProfile} patients
  8. Monitoring requirements and follow-up needs`;
  try {
    const {output} = await ai.generate({prompt});
    if (!output || !output.text) {
      throw new Error('Primary AI failed');
    }
    return JSON.parse(output.text());
  } catch (error) {
    try {
      const {output} = await aiWithFallback.generate({prompt});
      if (output && output.text) {
        return JSON.parse(output.text());
      }
    } catch (fallbackError) {
      console.error('Both AI providers failed:', error, fallbackError);
    }
    return getFallbackPharmacyResponse(input);
  }
});

// AI Surgery Planning
export interface SurgeryPlanningInput {
  procedure: string;
  patientProfile: string;
  medicalHistory: string;
  riskFactors: string;
}

export interface SurgeryPlanningOutput {
  preOpPlan: string;
  riskAssessment: string;
  postOpCare: string;
  complications: string;
}

export const surgeryPlanning = async (input: SurgeryPlanningInput): Promise<SurgeryPlanningOutput> => { async (input) => {
  const researchData = await getSurgeryGuidelines(input.procedure);
  const prompt = `AI-Powered Surgery Planning Analysis:

PROCEDURE: ${input.procedure}
PATIENT PROFILE: ${input.patientProfile}
MEDICAL HISTORY: ${input.medicalHistory}
RISK FACTORS: ${input.riskFactors}

LATEST SURGICAL RESEARCH & EVIDENCE-BASED GUIDELINES:
${researchData}

Based on current evidence-based surgical protocols and verified medical research above, provide comprehensive AI-powered surgery planning with:

1. PRE-OPERATIVE PLAN:
   - Detailed preparation steps based on latest surgical guidelines
   - Required pre-operative tests and evaluations
   - Patient optimization strategies
   - Anesthesia considerations

2. RISK ASSESSMENT:
   - Evidence-based risk stratification
   - Patient-specific risk factors analysis
   - Mitigation strategies for identified risks
   - Contraindications and precautions

3. POST-OPERATIVE CARE:
   - Research-backed recovery protocols
   - Pain management strategies
   - Monitoring requirements
   - Rehabilitation guidelines

4. POTENTIAL COMPLICATIONS:
   - Literature-based complication risks
   - Early warning signs
   - Management protocols for complications
   - Emergency intervention procedures

Use verified surgical research data to provide accurate, evidence-based surgical planning tailored to patient profile.
Format as valid JSON with keys: preOpPlan, riskAssessment, postOpCare, complications`;
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
});

// AI ICU Monitoring
export interface ICUMonitoringInput {
  vitals: string;
  labValues: string;
  medications: string;
  condition: string;
}

export interface ICUMonitoringOutput {
  criticalAlerts: string;
  treatmentAdjustments: string;
  prognosis: string;
  nursingOrders: string;
}

export const icuMonitoring = async (input: ICUMonitoringInput): Promise<ICUMonitoringOutput> => { async (input) => {
  const researchData = await aggregateMedicalData(`${input.condition} ICU management`, 'icu');
  const prompt = `ICU monitoring for ${input.condition}. Vitals: ${input.vitals}. Labs: ${input.labValues}. Current meds: ${input.medications}.
  
  Latest ICU Management Guidelines:
  ${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}
  
  Based on current ICU protocols above, provide:
  - Critical alerts requiring immediate intervention
  - Treatment adjustments based on current data
  - Prognosis assessment with timeline
  - Nursing orders and monitoring requirements
  
  Format as valid JSON with keys: criticalAlerts, treatmentAdjustments, prognosis, nursingOrders`;
  const {output} = await ai.generate({prompt, model: 'googleai/gemini-2.0-flash'});
  return JSON.parse(output.text());
});