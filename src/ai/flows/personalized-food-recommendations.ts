'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized food recommendations based on user health data.
 *
 * @fileOverview personalizedFoodRecommendations - A function that provides personalized food recommendations based on user health data.
 * @fileOverview PersonalizedFoodRecommendationsInput - The input type for the personalizedFoodRecommendations function.
 * @fileOverview PersonalizedFoodRecommendationsOutput - The return type for the personalizedFoodRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFoodRecommendationsInputSchema = z.object({
  healthData: z
    .string()
    .describe(
      'User health data, including dietary requirements, preferences, and any known allergies or medical conditions.'
    ),
});
export type PersonalizedFoodRecommendationsInput = z.infer<
  typeof PersonalizedFoodRecommendationsInputSchema
>;

const PersonalizedFoodRecommendationsOutputSchema = z.object({
  recommendations:
    z.string().describe('A list of personalized food recommendations.'),
});
export type PersonalizedFoodRecommendationsOutput = z.infer<
  typeof PersonalizedFoodRecommendationsOutputSchema
>;

export async function personalizedFoodRecommendations(
  input: PersonalizedFoodRecommendationsInput
): Promise<PersonalizedFoodRecommendationsOutput> {
  return personalizedFoodRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFoodRecommendationsPrompt',
  input: {schema: PersonalizedFoodRecommendationsInputSchema},
  output: {schema: PersonalizedFoodRecommendationsOutputSchema},
  prompt: `You are an AI-powered dietician providing personalized food recommendations based on the user's health data.

  Analyze the provided health data, taking into account dietary requirements, preferences, allergies, and medical conditions.
  Provide a list of food recommendations that are tailored to the user's specific needs and goals.

  Health Data: {{{healthData}}}

  Recommendations:
  `, // Ensure 'Recommendations' is at the end
});

const personalizedFoodRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedFoodRecommendationsFlow',
    inputSchema: PersonalizedFoodRecommendationsInputSchema,
    outputSchema: PersonalizedFoodRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
