'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getMentalHealthResearch} from '@/lib/medical-data-aggregator';

const MentalHealthInputSchema = z.object({
  moodData: z.string().describe('Current mood and emotional state'),
  stressLevel: z.number().min(1).max(10).describe('Stress level from 1-10'),
  lifeEvents: z.string().describe('Recent life events or triggers'),
  sleepQuality: z.string().describe('Sleep quality and patterns'),
  socialSupport: z.string().describe('Social support system'),
  researchData: z.string().optional().describe('Latest mental health research'),
});

export type MentalHealthInput = z.infer<typeof MentalHealthInputSchema>;

const MentalHealthOutputSchema = z.object({
  moodAssessment: z.string().describe('Analysis of current mental health state'),
  copingStrategies: z.string().describe('Personalized coping strategies and techniques'),
  mindfulnessExercises: z.string().describe('Specific mindfulness and relaxation exercises'),
  lifestyleRecommendations: z.string().describe('Lifestyle changes to improve mental health'),
  warningSignsToWatch: z.string().describe('Warning signs that require professional help'),
  resourcesAndSupport: z.string().describe('Mental health resources and support options'),
});

export type MentalHealthOutput = z.infer<typeof MentalHealthOutputSchema>;

export async function mentalHealthAnalysis(input: MentalHealthInput): Promise<MentalHealthOutput> {
  const researchData = await getMentalHealthResearch(input.moodData);
  const enhancedInput = { ...input, researchData };
  return mentalHealthCompanionFlow(enhancedInput);
}

const prompt = ai.definePrompt({
  name: 'mentalHealthCompanionPrompt',
  input: {schema: MentalHealthInputSchema},
  output: {schema: MentalHealthOutputSchema},
  prompt: `You are a compassionate AI mental health companion providing evidence-based support and guidance. IMPORTANT: Always emphasize this is not a substitute for professional mental health care.

Current Mood: {{{moodData}}}
Stress Level: {{{stressLevel}}}/10
Life Events: {{{lifeEvents}}}
Sleep Quality: {{{sleepQuality}}}
Social Support: {{{socialSupport}}}

Latest Mental Health Research:
{{{researchData}}}

Using the verified research above, provide supportive, evidence-based guidance covering:
1. Gentle assessment of current mental health state
2. Research-backed coping strategies (CBT techniques, breathing exercises)
3. Evidence-based mindfulness exercises for current situation
4. Lifestyle recommendations supported by recent studies
5. Warning signs that indicate need for professional help
6. Mental health resources and support options

Reference specific research findings when applicable. Use warm, empathetic language. Focus on practical, actionable advice. Always encourage professional help when appropriate.`,
});

const mentalHealthCompanionFlow = ai.defineFlow(
  {
    name: 'mentalHealthCompanionFlow',
    inputSchema: MentalHealthInputSchema,
    outputSchema: MentalHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);