'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getLabResultsResearch} from '@/lib/medical-research-scraper';
import {aggregateMedicalData} from '@/lib/medical-data-aggregator';

const LabResultsInputSchema = z.object({
  labResults: z.string().describe('Laboratory test results data'),
  patientAge: z.number().describe('Patient age'),
  patientGender: z.string().describe('Patient gender'),
  currentMedications: z.string().describe('Current medications and supplements'),
  existingConditions: z.string().describe('Known medical conditions'),
  researchData: z.string().optional().describe('Latest research data on lab findings'),
});

export type LabResultsInput = z.infer<typeof LabResultsInputSchema>;

const LabResultsOutputSchema = z.object({
  healthStatus: z.string().describe('Overall health status assessment'),
  criticalFindings: z.string().describe('Critical or concerning findings that need attention'),
  nutritionRecommendations: z.string().describe('Personalized nutrition and diet recommendations'),
  lifestyleRecommendations: z.string().describe('Exercise, sleep, and lifestyle modifications'),
  supplementRecommendations: z.string().describe('Vitamin and supplement suggestions'),
  followUpActions: z.string().describe('Recommended follow-up tests or doctor visits'),
  riskFactors: z.string().describe('Identified health risk factors'),
  positiveFindings: z.string().describe('Good health indicators and improvements'),
});

export type LabResultsOutput = z.infer<typeof LabResultsOutputSchema>;

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

const prompt = ai.definePrompt({
  name: 'labResultsAnalyzerPrompt',
  input: {schema: LabResultsInputSchema},
  output: {schema: LabResultsOutputSchema},
  prompt: `You are an AI medical analyst specializing in laboratory result interpretation, enhanced with real-time research data. Analyze the provided lab results and create a comprehensive health profile with evidence-based personalized recommendations.

Lab Results: {{{labResults}}}
Patient Age: {{{patientAge}}}
Gender: {{{patientGender}}}
Current Medications: {{{currentMedications}}}
Existing Conditions: {{{existingConditions}}}

Latest Research Data:
{{{researchData}}}

Using the latest research findings above, provide detailed analysis covering:
1. Overall health status and key findings (reference recent studies)
2. Critical findings requiring immediate attention (based on current guidelines)
3. Evidence-based personalized nutrition recommendations
4. Lifestyle modifications supported by recent research
5. Supplement recommendations based on latest deficiency studies
6. Follow-up actions aligned with current medical protocols
7. Risk factors identified using updated risk assessment models
8. Positive health indicators and improvements

Cite relevant research findings when applicable. Always include medical disclaimer about consulting healthcare professionals.`,
});

const labResultsAnalyzerFlow = ai.defineFlow(
  {
    name: 'labResultsAnalyzerFlow',
    inputSchema: LabResultsInputSchema,
    outputSchema: LabResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);