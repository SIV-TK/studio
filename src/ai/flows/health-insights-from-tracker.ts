'use server';
/**
 * @fileOverview This flow provides personalized health advice based on Google Health Tracker data.
 *
 * - healthInsightsFromTracker - A function that accepts health data and returns personalized advice.
 * - HealthInsightsFromTrackerInput - The input type for the healthInsightsFromTracker function.
 * - HealthInsightsFromTrackerOutput - The return type for the healthInsightsFromTracker function.
 */

import {ai, aiWithFallback} from '@/ai/genkit';
import {aggregateMedicalData} from '@/lib/medical-data-aggregator';

export interface HealthInsightsFromTrackerInput {
  healthData: string;
  userDietaryRequirements: string;
  researchData?: string;
}

export interface HealthInsightsFromTrackerOutput {
  advice: string;
  foodRecommendations: string;
}

export async function healthInsightsFromTracker(
  input: HealthInsightsFromTrackerInput
): Promise<HealthInsightsFromTrackerOutput> {
  // Fetch comprehensive health data
  const databaseData = await aggregateMedicalData('health tracking insights', 'health-tracker');
  const researchData = databaseData.map(d => `${d.title}\n${d.content}\nSource: ${d.source} (Reliability: ${(d.reliability * 100).toFixed(0)}%)`).join('\n\n');
  const enhancedInput = { ...input, researchData };
  return healthInsightsFromTrackerFlow(enhancedInput);
}

const healthInsightsFromTrackerFlow = async (input: HealthInsightsFromTrackerInput): Promise<HealthInsightsFromTrackerOutput> => {
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      const {output} = await aiWithFallback.generate({
        prompt: `Health insights for data: ${input.healthData}. Dietary requirements: ${input.userDietaryRequirements}. Provide JSON with keys: advice, foodRecommendations`
      });
      return JSON.parse(output.text());
    }
  }
);
