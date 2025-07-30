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
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      const {output} = await aiWithFallback.generate({
        prompt: `Mental health support for mood: ${input.moodData}. Stress: ${input.stressLevel}/10. Sleep: ${input.sleepQuality}. Provide JSON with keys: moodAssessment, copingStrategies, mindfulnessExercises, lifestyleRecommendations, warningSignsToWatch, resourcesAndSupport`
      });
      return JSON.parse(output.text());
    }
  }
);