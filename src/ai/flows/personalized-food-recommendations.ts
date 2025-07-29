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
import {getFoodRecommendationsForCondition, getSymptomBasedNutrition} from '@/lib/nutrition-research-scraper';
import {aggregateMedicalData} from '@/lib/medical-data-aggregator';

const PersonalizedFoodRecommendationsInputSchema = z.object({
  healthData: z
    .string()
    .describe(
      'User health data, including dietary requirements, preferences, and any known allergies or medical conditions.'
    ),
  queryType: z.string().optional().describe('Type of query: disease, symptoms, or general'),
  specificCondition: z.string().optional().describe('Specific disease or condition'),
  symptoms: z.string().optional().describe('Current symptoms'),
  researchData: z.string().optional().describe('Latest nutrition research data'),
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
  let researchData = '';
  let query = '';
  
  // Fetch research based on query type
  if (input.specificCondition) {
    researchData = await getFoodRecommendationsForCondition(input.specificCondition);
    query = input.specificCondition;
  } else if (input.symptoms) {
    researchData = await getSymptomBasedNutrition(input.symptoms);
    query = input.symptoms;
  } else {
    researchData = await getFoodRecommendationsForCondition('general health optimization');
    query = 'nutrition optimization';
  }
  
  // Add database research
  const databaseData = await aggregateMedicalData(`${query} nutrition`, 'nutrition');
  const combinedData = researchData + '\n\nVerified Database Sources:\n' + databaseData.map(d => `${d.title}\n${d.content}\nSource: ${d.source} (Reliability: ${(d.reliability * 100).toFixed(0)}%)`).join('\n\n');
  
  const enhancedInput = { ...input, researchData: combinedData };
  return personalizedFoodRecommendationsFlow(enhancedInput);
}

const prompt = ai.definePrompt({
  name: 'personalizedFoodRecommendationsPrompt',
  input: {schema: PersonalizedFoodRecommendationsInputSchema},
  output: {schema: PersonalizedFoodRecommendationsOutputSchema},
  prompt: `You are an AI-powered dietician providing evidence-based personalized food recommendations using the latest nutrition research.

  Health Data: {{{healthData}}}
  Query Type: {{{queryType}}}
  Specific Condition: {{{specificCondition}}}
  Symptoms: {{{symptoms}}}
  
  Latest Nutrition Research:
  {{{researchData}}}
  
  Using the research data above, analyze the health information and provide:
  1. Specific food recommendations based on latest scientific evidence
  2. Foods to avoid based on the condition/symptoms
  3. Meal planning suggestions with therapeutic benefits
  4. Nutritional supplements if indicated by research
  5. Cooking methods that preserve nutritional benefits
  
  Reference specific research findings when applicable. Tailor recommendations to dietary requirements, preferences, and allergies.
  
  Recommendations:`,
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
