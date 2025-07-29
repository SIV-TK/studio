'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getSymptomResearch} from '@/lib/medical-research-scraper';
import {aggregateMedicalData} from '@/lib/medical-data-aggregator';

const SymptomCheckerInputSchema = z.object({
  symptoms: z.string().describe('Current symptoms described by the user'),
  medicalHistory: z.string().describe('Relevant medical history and current medications'),
  age: z.number().describe('Patient age'),
  severity: z.string().describe('Symptom severity level (mild, moderate, severe)'),
  researchData: z.string().optional().describe('Latest research data on symptoms'),
});

export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  possibleConditions: z.string().describe('List of possible conditions based on symptoms'),
  urgencyLevel: z.string().describe('Urgency level: Low, Medium, High, Emergency'),
  recommendations: z.string().describe('Recommended actions and next steps'),
  whenToSeekHelp: z.string().describe('When to seek immediate medical attention'),
});

export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  // Fetch comprehensive medical data
  const researchData = await getSymptomResearch(input.symptoms);
  const databaseData = await aggregateMedicalData(input.symptoms, 'symptoms');
  const combinedData = researchData + '\n\nVerified Database Sources:\n' + databaseData.map(d => `${d.title}\n${d.content}\nSource: ${d.source} (Reliability: ${(d.reliability * 100).toFixed(0)}%)`).join('\n\n');
  const enhancedInput = { ...input, researchData: combinedData };
  return symptomCheckerFlow(enhancedInput);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are a medical AI assistant providing symptom analysis enhanced with real-time research data. IMPORTANT: Always emphasize this is not a substitute for professional medical advice.

Symptoms: {{{symptoms}}}
Medical History: {{{medicalHistory}}}
Age: {{{age}}}
Severity: {{{severity}}}

Latest Research Data:
{{{researchData}}}

Using the latest research findings above, analyze the symptoms and provide:
1. Possible conditions (list 3-5 most likely, citing recent research when relevant)
2. Urgency level (Low/Medium/High/Emergency) based on current medical guidelines
3. Evidence-based recommendations for care and monitoring
4. Clear guidance on when to seek immediate help

Reference recent research findings in your analysis when applicable. Always include disclaimer about consulting healthcare professionals.`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);