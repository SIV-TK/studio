'use server';

import {ai, aiWithFallback} from '@/ai/genkit';
import {getLabResultsResearch} from '@/lib/medical-research-scraper';
import {aggregateMedicalData} from '@/lib/medical-data-aggregator';

export interface LabResultsInput {
  labResults: string;
  patientAge: number;
  patientGender: string;
  currentMedications: string;
  existingConditions: string;
  researchData?: string;
}

export interface LabResultsOutput {
  healthStatus: string;
  criticalFindings: string;
  nutritionRecommendations: string;
  lifestyleRecommendations: string;
  supplementRecommendations: string;
  followUpActions: string;
  riskFactors: string;
  positiveFindings: string;
}

export async function analyzeLabResults(input: LabResultsInput): Promise<LabResultsOutput> {
  // Extract key findings for research
  const keyFindings = extractKeyFindings(input.labResults);
  const researchData = await getLabResultsResearch(keyFindings);
  const databaseData = await aggregateMedicalData(keyFindings, 'lab-results');
  const combinedData = researchData + '\n\nVerified Database Sources:\n' + databaseData.map(d => `${d.title}\n${d.content}\nSource: ${d.source} (Reliability: ${(d.reliability * 100).toFixed(0)}%)`).join('\n\n');
  const enhancedInput = { ...input, researchData: combinedData };
  return labResultsAnalyzerFlow(enhancedInput);
}

function extractKeyFindings(labResults: string): string {
  // Extract key lab values and abnormalities for research queries
  const keywords = ['cholesterol', 'glucose', 'hemoglobin', 'creatinine', 'liver', 'kidney', 'thyroid', 'vitamin', 'iron'];
  const findings = keywords.filter(keyword => 
    labResults.toLowerCase().includes(keyword)
  );
  return findings.join(', ') || 'general lab results';
}

const labResultsAnalyzerFlow = async (input: LabResultsInput): Promise<LabResultsOutput> => {
  try {
    const {output} = await ai.generate({
      prompt: `Analyze these lab results comprehensively using current medical knowledge and research data:

LAB RESULTS: ${input.labResults}
PATIENT PROFILE: Age ${input.patientAge}, Gender: ${input.patientGender}
CURRENT MEDICATIONS: ${input.currentMedications}
EXISTING CONDITIONS: ${input.existingConditions}
RESEARCH DATA: ${input.researchData || 'No additional research data available'}

Provide a comprehensive analysis in JSON format with these keys:
- healthStatus: Overall health assessment
- criticalFindings: Any concerning or abnormal values requiring immediate attention
- nutritionRecommendations: Dietary advice based on lab results
- lifestyleRecommendations: Lifestyle modifications suggested
- supplementRecommendations: Vitamin/mineral supplements if indicated
- followUpActions: Recommended next steps and timeline
- riskFactors: Identified risk factors for future health issues
- positiveFindings: Good results and positive health indicators

Ensure all recommendations are evidence-based and appropriate for the patient profile.`
    });
    return JSON.parse(output.text());
  } catch (error) {
    const {output} = await aiWithFallback.generate({
      prompt: `Analyze lab results: ${input.labResults}. Age: ${input.patientAge}. Gender: ${input.patientGender}. Medications: ${input.currentMedications}. Provide JSON with keys: healthStatus, criticalFindings, nutritionRecommendations, lifestyleRecommendations, supplementRecommendations, followUpActions, riskFactors, positiveFindings`
    });
    return JSON.parse(output.text());
  }
};