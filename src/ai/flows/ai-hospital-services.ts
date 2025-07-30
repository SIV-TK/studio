'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getPharmacyResearch, getEmergencyProtocols, getRadiologyStandards, getSurgeryGuidelines} from '@/lib/medical-data-aggregator';

// AI Emergency Department
const EmergencyTriageSchema = z.object({
  symptoms: z.string(),
  vitals: z.string(),
  consciousness: z.string(),
  painLevel: z.number().min(1).max(10),
});

export const emergencyTriage = ai.defineFlow({
  name: 'emergencyTriage',
  inputSchema: EmergencyTriageSchema,
  outputSchema: z.object({
    triageLevel: z.string(),
    immediateActions: z.string(),
    estimatedWaitTime: z.string(),
    requiredTests: z.string(),
  }),
}, async (input) => {
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
  const {output} = await ai.generate({prompt, model: 'googleai/gemini-2.0-flash'});
  return JSON.parse(output.text());
});

// AI Radiology
const RadiologyAnalysisSchema = z.object({
  imageType: z.string(),
  patientHistory: z.string(),
  clinicalQuestion: z.string(),
});

export const radiologyAnalysis = ai.defineFlow({
  name: 'radiologyAnalysis',
  inputSchema: RadiologyAnalysisSchema,
  outputSchema: z.object({
    findings: z.string(),
    impression: z.string(),
    recommendations: z.string(),
    followUp: z.string(),
  }),
}, async (input) => {
  const researchData = await getRadiologyStandards(input.imageType, input.clinicalQuestion);
  const prompt = `Analyze ${input.imageType} for patient with ${input.patientHistory}. Clinical question: ${input.clinicalQuestion}.
  
  Current Radiology Standards:
  ${researchData}
  
  Based on latest imaging guidelines above, provide findings, impression, recommendations.`;
  const {output} = await ai.generate({prompt, model: 'googleai/gemini-2.0-flash'});
  return JSON.parse(output.text());
});

// AI Pharmacy
const PharmacyConsultationSchema = z.object({
  queryType: z.string().describe('Type: prescription_check, lab_based, doctor_consultation, general_query'),
  userProfile: z.string().describe('User health profile: pregnant, cancer, HIV, diabetes, etc.'),
  medications: z.string(),
  allergies: z.string(),
  conditions: z.string(),
  newPrescription: z.string().optional(),
  labResults: z.string().optional(),
  doctorNotes: z.string().optional(),
  symptoms: z.string().optional(),
});

export const pharmacyConsultation = ai.defineFlow({
  name: 'pharmacyConsultation',
  inputSchema: PharmacyConsultationSchema,
  outputSchema: z.object({
    recommendedMedicines: z.string().describe('Specific medicine recommendations with names and brands'),
    medicineDescriptions: z.string().describe('Detailed description of each recommended medicine'),
    medicineRoles: z.string().describe('How each medicine works and its therapeutic role'),
    sideEffects: z.string().describe('Comprehensive side effects for each medicine'),
    treatmentDuration: z.string().describe('How long each medicine should be taken'),
    interactions: z.string().describe('Drug interactions and warnings'),
    specialConsiderations: z.string().describe('Special considerations for user profile'),
    monitoringRequirements: z.string().describe('Required monitoring and follow-up'),
  }),
}, async (input) => {
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
  const {output} = await ai.generate({prompt, model: 'googleai/gemini-2.0-flash'});
  return JSON.parse(output.text());
});

// AI Surgery Planning
const SurgeryPlanningSchema = z.object({
  procedure: z.string(),
  patientProfile: z.string(),
  medicalHistory: z.string(),
  riskFactors: z.string(),
});

export const surgeryPlanning = ai.defineFlow({
  name: 'surgeryPlanning',
  inputSchema: SurgeryPlanningSchema,
  outputSchema: z.object({
    preOpPlan: z.string(),
    riskAssessment: z.string(),
    postOpCare: z.string(),
    complications: z.string(),
  }),
}, async (input) => {
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
  const {output} = await ai.generate({prompt, model: 'googleai/gemini-2.0-flash'});
  return JSON.parse(output.text());
});

// AI ICU Monitoring
const ICUMonitoringSchema = z.object({
  vitals: z.string(),
  labValues: z.string(),
  medications: z.string(),
  condition: z.string(),
});

export const icuMonitoring = ai.defineFlow({
  name: 'icuMonitoring',
  inputSchema: ICUMonitoringSchema,
  outputSchema: z.object({
    criticalAlerts: z.string(),
    treatmentAdjustments: z.string(),
    prognosis: z.string(),
    nursingOrders: z.string(),
  }),
}, async (input) => {
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