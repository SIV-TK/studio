'use server';

import {ai, aiWithFallback} from '@/ai/genkit';
import {getSymptomResearch} from '@/lib/medical-research-scraper';
import {aggregateMedicalData} from '@/lib/medical-data-aggregator';

export interface SymptomCheckerInput {
  symptoms: string;
  medicalHistory: string;
  age: number;
  severity: string;
  researchData?: string;
}

export interface SymptomCheckerOutput {
  possibleConditions: string;
  urgencyLevel: string;
  recommendations: string;
  whenToSeekHelp: string;
}

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  // Fetch comprehensive medical data
  const researchData = await getSymptomResearch(input.symptoms);
  const databaseData = await aggregateMedicalData(input.symptoms, 'symptoms');
  const combinedData = researchData + '\n\nVerified Database Sources:\n' + databaseData.map((d: any) => `${d.title}\n${d.content}\nSource: ${d.source} (Reliability: ${(d.reliability * 100).toFixed(0)}%)`).join('\n\n');
  const enhancedInput = { ...input, researchData: combinedData };
  return symptomCheckerFlow(enhancedInput);
}

const symptomCheckerFlow = async (input: SymptomCheckerInput): Promise<SymptomCheckerOutput> => {
  const detailedPrompt = `COMPREHENSIVE MEDICAL SYMPTOM ANALYSIS

PATIENT DATA:
- Symptoms: ${input.symptoms}
- Age: ${input.age} years
- Severity: ${input.severity}
- Medical History: ${input.medicalHistory}

LATEST MEDICAL RESEARCH DATA:
${input.researchData}

Using the verified medical research above, provide detailed analysis:

1. POSSIBLE CONDITIONS (list 5-7 specific conditions with medical explanations)
2. URGENCY LEVEL (Emergency/High/Medium/Low with detailed reasoning)
3. RECOMMENDATIONS (specific evidence-based actions, tests, treatments)
4. WHEN TO SEEK HELP (specific warning signs and timeframes)

Provide comprehensive, research-backed medical analysis. Reference specific studies when applicable.`;

  try {
    const response = await fetch('/api/ai-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: detailedPrompt, temperature: 0.2 })
    });
    
    const data = await response.json();
    if (data.text) {
      const text = data.text;
      return {
        possibleConditions: text.split('POSSIBLE CONDITIONS')[1]?.split('URGENCY LEVEL')[0]?.trim() || text.substring(0, 500),
        urgencyLevel: text.split('URGENCY LEVEL')[1]?.split('RECOMMENDATIONS')[0]?.trim() || 'Medium - Consult healthcare provider',
        recommendations: text.split('RECOMMENDATIONS')[1]?.split('WHEN TO SEEK HELP')[0]?.trim() || text.substring(500, 1000),
        whenToSeekHelp: text.split('WHEN TO SEEK HELP')[1]?.trim() || text.substring(1000, 1500)
      };
    }
    throw new Error('No AI response');
  } catch (error) {
    console.error('Detailed symptom analysis failed:', error);
    throw error;
  }
};