'use server';
/**
 * @fileOverview This flow provides personalized health advice based on Google Health Tracker data.
 *
 * - healthInsightsFromTracker - A function that accepts health data and returns personalized advice.
 * - HealthInsightsFromTrackerInput - The input type for the healthInsightsFromTracker function.
 * - HealthInsightsFromTrackerOutput - The return type for the healthInsightsFromTracker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthInsightsFromTrackerInputSchema = z.object({
  healthData: z
    .string()
    .describe('The health data from Google Health Tracker.'),
  userDietaryRequirements: z.string().describe('The dietary requirements of the user'),
});
export type HealthInsightsFromTrackerInput = z.infer<
  typeof HealthInsightsFromTrackerInputSchema
>;

const HealthInsightsFromTrackerOutputSchema = z.object({
  advice: z.string().describe('Personalized health advice based on the health data.'),
  foodRecommendations: z.string().describe('Personalized food recommendations.'),
});
export type HealthInsightsFromTrackerOutput = z.infer<
  typeof HealthInsightsFromTrackerOutputSchema
>;

export async function healthInsightsFromTracker(
  input: HealthInsightsFromTrackerInput
): Promise<HealthInsightsFromTrackerOutput> {
  return healthInsightsFromTrackerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthInsightsFromTrackerPrompt',
  input: {schema: HealthInsightsFromTrackerInputSchema},
  output: {schema: HealthInsightsFromTrackerOutputSchema},
  prompt: `You are a personal health advisor. You will generate personalized health advice and food recommendations for the user based on their health data and dietary requirements.

Health Data: {{{healthData}}}
Dietary Requirements: {{{userDietaryRequirements}}}

Based on this information, provide personalized health advice and food recommendations.`,
});

const healthInsightsFromTrackerFlow = ai.defineFlow(
  {
    name: 'healthInsightsFromTrackerFlow',
    inputSchema: HealthInsightsFromTrackerInputSchema,
    outputSchema: HealthInsightsFromTrackerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
