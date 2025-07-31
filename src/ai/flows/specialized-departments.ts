// Specialized Medical Department AI Services
import { ai, aiWithFallback } from '../genkit';
import { aggregateMedicalData } from '../../lib/medical-data-aggregator';

// Cardiology Department
export interface CardiologyAssessmentInput {
  patientProfile: {
    age: number;
    gender: string;
    weight: number;
    height: number;
  };
  symptoms: string[];
  riskFactors: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  };
  ecgFindings?: string;
  labResults?: string;
  imagingResults?: string;
}

export interface CardiologyAssessmentOutput {
  cardiovascularRiskScore: number;
  likeDiagnosis: string[];
  recommendedTests: string[];
  treatmentPlan: string;
  lifestyleModifications: string[];
  medicationRecommendations: string;
  followUpSchedule: string;
  emergencyWarnings: string[];
}

// Oncology Department
export interface OncologyConsultationInput {
  patientData: {
    age: number;
    gender: string;
    familyHistory: string;
    exposureHistory: string;
  };
  presentingSymptoms: string[];
  imagingFindings: string;
  biopsyResults?: string;
  labWork: string;
  performanceStatus: number;
  previousTreatments?: string[];
}

export interface OncologyConsultationOutput {
  riskAssessment: string;
  stagingRecommendations: string;
  treatmentOptions: string[];
  prognosisEstimation: string;
  supportiveCare: string[];
  clinicalTrialEligibility: string;
  multidisciplinaryTeam: string[];
  followUpProtocol: string;
}

// Pediatrics Department
export interface PediatricsAssessmentInput {
  childData: {
    age: number;
    weight: number;
    height: number;
    developmentalMilestones: string;
  };
  symptoms: string[];
  parentalConcerns: string;
  vaccinationHistory: string;
  birthHistory: string;
  familyHistory: string;
  schoolPerformance?: string;
}

export interface PediatricsAssessmentOutput {
  developmentalAssessment: string;
  diagnosisRecommendations: string[];
  treatmentPlan: string;
  parentalGuidance: string[];
  vaccinationSchedule: string;
  nutritionalRecommendations: string;
  followUpNeeds: string;
  referralRecommendations: string[];
}

// Geriatrics Department
export interface GeriatricsAssessmentInput {
  patientProfile: {
    age: number;
    cognitiveStatus: string;
    functionalStatus: string;
    socialSupport: string;
  };
  chronicConditions: string[];
  currentMedications: string[];
  fallRisk: string;
  nutritionalStatus: string;
  mentalHealthStatus: string;
  caregiverConcerns: string;
}

export interface GeriatricsAssessmentOutput {
  comprehensiveGeriatricAssessment: string;
  frailtyScore: number;
  medicationReview: string;
  fallPreventionPlan: string;
  cognitiveSupport: string;
  careCoordination: string;
  advanceDirectives: string;
  qualityOfLifeRecommendations: string[];
}

// Cardiology Services
export const cardiologyAssessment = async (input: CardiologyAssessmentInput): Promise<CardiologyAssessmentOutput> => {
  const symptoms = input.symptoms.join(' ');
  const researchData = await aggregateMedicalData(`cardiology ${symptoms} cardiovascular assessment`, 'cardiology');
  
  const prompt = `Advanced Cardiology Assessment:

PATIENT PROFILE:
Age: ${input.patientProfile.age}, Gender: ${input.patientProfile.gender}
Weight: ${input.patientProfile.weight}kg, Height: ${input.patientProfile.height}cm
BMI: ${(input.patientProfile.weight / ((input.patientProfile.height/100) ** 2)).toFixed(1)}

PRESENTING SYMPTOMS: ${input.symptoms.join(', ')}
RISK FACTORS: ${input.riskFactors.join(', ')}

VITAL SIGNS:
Blood Pressure: ${input.vitalSigns.bloodPressure}
Heart Rate: ${input.vitalSigns.heartRate} bpm
Oxygen Saturation: ${input.vitalSigns.oxygenSaturation}%

ECG FINDINGS: ${input.ecgFindings || 'Not available'}
LAB RESULTS: ${input.labResults || 'Not available'}
IMAGING RESULTS: ${input.imagingResults || 'Not available'}

LATEST CARDIOLOGY RESEARCH:
${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}

Based on current cardiology guidelines and evidence-based practice, provide:
1. Cardiovascular risk score (0-100)
2. Most likely diagnoses ranked by probability
3. Recommended diagnostic tests and procedures
4. Comprehensive treatment plan
5. Lifestyle modifications with specific targets
6. Medication recommendations with dosing
7. Follow-up schedule and monitoring
8. Emergency warning signs for patient

Format as valid JSON with keys: cardiovascularRiskScore, likeDiagnosis, recommendedTests, treatmentPlan, lifestyleModifications, medicationRecommendations, followUpSchedule, emergencyWarnings`;

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

// Oncology Services
export const oncologyConsultation = async (input: OncologyConsultationInput): Promise<OncologyConsultationOutput> => {
  const symptoms = input.presentingSymptoms.join(' ');
  const researchData = await aggregateMedicalData(`oncology ${symptoms} cancer treatment`, 'oncology');
  
  const prompt = `Comprehensive Oncology Consultation:

PATIENT DATA:
Age: ${input.patientData.age}, Gender: ${input.patientData.gender}
Family History: ${input.patientData.familyHistory}
Exposure History: ${input.patientData.exposureHistory}
Performance Status: ${input.performanceStatus}/4

PRESENTING SYMPTOMS: ${input.presentingSymptoms.join(', ')}
IMAGING FINDINGS: ${input.imagingFindings}
BIOPSY RESULTS: ${input.biopsyResults || 'Pending'}
LABORATORY WORK: ${input.labWork}
PREVIOUS TREATMENTS: ${input.previousTreatments?.join(', ') || 'None'}

LATEST ONCOLOGY RESEARCH:
${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}

Based on current oncology guidelines, NCCN protocols, and latest research, provide:
1. Risk assessment and stratification
2. Staging recommendations and required tests
3. Treatment options with evidence levels
4. Prognosis estimation with survival data
5. Supportive care recommendations
6. Clinical trial eligibility assessment
7. Multidisciplinary team members needed
8. Follow-up and surveillance protocol

Format as valid JSON with keys: riskAssessment, stagingRecommendations, treatmentOptions, prognosisEstimation, supportiveCare, clinicalTrialEligibility, multidisciplinaryTeam, followUpProtocol`;

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

// Pediatrics Services
export const pediatricsAssessment = async (input: PediatricsAssessmentInput): Promise<PediatricsAssessmentOutput> => {
  const symptoms = input.symptoms.join(' ');
  const researchData = await aggregateMedicalData(`pediatrics ${symptoms} child development`, 'pediatrics');
  
  const prompt = `Comprehensive Pediatric Assessment:

CHILD DATA:
Age: ${input.childData.age} years
Weight: ${input.childData.weight}kg, Height: ${input.childData.height}cm
Developmental Milestones: ${input.childData.developmentalMilestones}

PRESENTING SYMPTOMS: ${input.symptoms.join(', ')}
PARENTAL CONCERNS: ${input.parentalConcerns}
VACCINATION HISTORY: ${input.vaccinationHistory}
BIRTH HISTORY: ${input.birthHistory}
FAMILY HISTORY: ${input.familyHistory}
SCHOOL PERFORMANCE: ${input.schoolPerformance || 'Not applicable'}

LATEST PEDIATRIC RESEARCH:
${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}

Based on current pediatric guidelines, AAP recommendations, and child development research, provide:
1. Developmental assessment with age-appropriate milestones
2. Diagnosis recommendations with pediatric considerations
3. Treatment plan tailored for child's age and development
4. Parental guidance and education points
5. Updated vaccination schedule recommendations
6. Nutritional recommendations for age/development
7. Follow-up needs and timeline
8. Referral recommendations to specialists if needed

Format as valid JSON with keys: developmentalAssessment, diagnosisRecommendations, treatmentPlan, parentalGuidance, vaccinationSchedule, nutritionalRecommendations, followUpNeeds, referralRecommendations`;

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

// Geriatrics Services
export const geriatricsAssessment = async (input: GeriatricsAssessmentInput): Promise<GeriatricsAssessmentOutput> => {
  const conditions = input.chronicConditions.join(' ');
  const researchData = await aggregateMedicalData(`geriatrics elderly care ${conditions}`, 'geriatrics');
  
  const prompt = `Comprehensive Geriatric Assessment:

PATIENT PROFILE:
Age: ${input.patientProfile.age} years
Cognitive Status: ${input.patientProfile.cognitiveStatus}
Functional Status: ${input.patientProfile.functionalStatus}
Social Support: ${input.patientProfile.socialSupport}

CHRONIC CONDITIONS: ${input.chronicConditions.join(', ')}
CURRENT MEDICATIONS: ${input.currentMedications.join(', ')}
FALL RISK: ${input.fallRisk}
NUTRITIONAL STATUS: ${input.nutritionalStatus}
MENTAL HEALTH: ${input.mentalHealthStatus}
CAREGIVER CONCERNS: ${input.caregiverConcerns}

LATEST GERIATRIC RESEARCH:
${researchData.map(d => `${d.title}\n${d.content}\nSource: ${d.source}`).join('\n\n')}

Based on current geriatric medicine guidelines and comprehensive geriatric assessment protocols, provide:
1. Complete geriatric assessment with domains evaluated
2. Frailty score calculation (0-9 scale)
3. Medication review with deprescribing recommendations
4. Fall prevention plan with environmental modifications
5. Cognitive support and intervention strategies
6. Care coordination recommendations
7. Advanced directives discussion points
8. Quality of life improvement recommendations

Format as valid JSON with keys: comprehensiveGeriatricAssessment, frailtyScore, medicationReview, fallPreventionPlan, cognitiveSupport, careCoordination, advanceDirectives, qualityOfLifeRecommendations`;

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
