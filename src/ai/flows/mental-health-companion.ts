'use server';

import {ai, aiWithFallback} from '@/ai/genkit';
import {getMentalHealthResearch} from '@/lib/medical-data-aggregator';

export interface MentalHealthInput {
  moodData: string;
  stressLevel: number;
  lifeEvents: string;
  sleepQuality: string;
  socialSupport: string;
  researchData?: string;
}

export interface MentalHealthOutput {
  moodAssessment: string;
  copingStrategies: string;
  mindfulnessExercises: string;
  lifestyleRecommendations: string;
  warningSignsToWatch: string;
  resourcesAndSupport: string;
}

export async function mentalHealthAnalysis(input: MentalHealthInput): Promise<MentalHealthOutput> {
  const researchData = await getMentalHealthResearch(input.moodData);
  const enhancedInput = { ...input, researchData };
  return mentalHealthCompanionFlow(enhancedInput);
}

const mentalHealthCompanionFlow = async (input: MentalHealthInput): Promise<MentalHealthOutput> => {
  try {
    const {output} = await ai.generate({
      prompt: `Provide compassionate mental health support and guidance based on this information:

MOOD DATA: ${input.moodData}
STRESS LEVEL: ${input.stressLevel}/10
SLEEP QUALITY: ${input.sleepQuality}
LIFE EVENTS: ${input.lifeEvents || 'None provided'}
SOCIAL SUPPORT: ${input.socialSupport || 'Not specified'}
RESEARCH DATA: ${input.researchData || 'No additional research data available'}

Provide supportive guidance in JSON format with these keys:
- moodAssessment: Professional assessment of current mood patterns
- copingStrategies: Practical coping mechanisms and techniques
- mindfulnessExercises: Specific mindfulness and relaxation exercises
- lifestyleRecommendations: Lifestyle changes to support mental wellness
- warningSignsToWatch: Signs that indicate need for professional help
- resourcesAndSupport: Available resources and support options

Ensure all advice is evidence-based, supportive, and emphasizes professional help when appropriate.`
    });
    return JSON.parse(output.text());
  } catch (error) {
    const {output} = await aiWithFallback.generate({
      prompt: `Mental health support for mood: ${input.moodData}. Stress: ${input.stressLevel}/10. Sleep: ${input.sleepQuality}. Provide JSON with keys: moodAssessment, copingStrategies, mindfulnessExercises, lifestyleRecommendations, warningSignsToWatch, resourcesAndSupport`
    });
    return JSON.parse(output.text());
  }
};