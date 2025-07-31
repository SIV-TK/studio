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
  const researchData = databaseData.map((d: any) => `${d.title}\n${d.content}\nSource: ${d.source} (Reliability: ${(d.reliability * 100).toFixed(0)}%)`).join('\n\n');
  const enhancedInput = { ...input, researchData };
  return healthInsightsFromTrackerFlow(enhancedInput);
}

const healthInsightsFromTrackerFlow = async (input: HealthInsightsFromTrackerInput): Promise<HealthInsightsFromTrackerOutput> => {
  const prompt = `You are a personal health advisor enhanced with verified medical databases. You will generate evidence-based personalized health advice and food recommendations.

Health Data: ${input.healthData}
Dietary Requirements: ${input.userDietaryRequirements}

Latest Health Research:
${input.researchData}

Using the verified research above, provide personalized health advice and food recommendations based on current medical evidence.`;

  try {
    const response = await ai.generate({ prompt });
    const text = response.text;
    return {
      advice: text.split('HEALTH ADVICE:')[1]?.split('FOOD RECOMMENDATIONS:')[0]?.trim() || text.substring(0, text.length / 2),
      foodRecommendations: text.split('FOOD RECOMMENDATIONS:')[1]?.trim() || text.substring(text.length / 2)
    };
  } catch (error) {
    try {
      const fallbackResponse = await aiWithFallback.generate({ prompt });
      const text = fallbackResponse.text;
      return {
        advice: text.split('HEALTH ADVICE:')[1]?.split('FOOD RECOMMENDATIONS:')[0]?.trim() || text.substring(0, text.length / 2),
        foodRecommendations: text.split('FOOD RECOMMENDATIONS:')[1]?.trim() || text.substring(text.length / 2)
      };
    } catch (fallbackError) {
      console.error('Health insights failed:', error, fallbackError);
      return {
        advice: 'Maintain regular exercise, adequate sleep, stress management, and balanced nutrition for optimal health.',
        foodRecommendations: 'Focus on whole foods, lean proteins, fruits, vegetables, and stay hydrated. Limit processed foods and excess sugar.'
      };
    }
  }
};
