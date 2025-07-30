'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized food recommendations based on user health data.
 *
 * @fileOverview personalizedFoodRecommendations - A function that provides personalized food recommendations based on user health data.
 * @fileOverview PersonalizedFoodRecommendationsInput - The input type for the personalizedFoodRecommendations function.
 * @fileOverview PersonalizedFoodRecommendationsOutput - The return type for the personalizedFoodRecommendations function.
 */

import {ai, aiWithFallback} from '@/ai/genkit';
import {getFoodRecommendationsForCondition, getSymptomBasedNutrition} from '@/lib/nutrition-research-scraper';
import {aggregateMedicalData} from '@/lib/medical-data-aggregator';

export interface PersonalizedFoodRecommendationsInput {
  healthData: string;
  queryType?: string;
  specificCondition?: string;
  symptoms?: string;
  researchData?: string;
}

export interface PersonalizedFoodRecommendationsOutput {
  recommendations: string;
}

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
  const combinedData = researchData + '\n\nVerified Database Sources:\n' + databaseData.map((d: any) => `${d.title}\n${d.content}\nSource: ${d.source} (Reliability: ${(d.reliability * 100).toFixed(0)}%)`).join('\n\n');
  
  const enhancedInput = { ...input, researchData: combinedData };
  return personalizedFoodRecommendationsFlow(enhancedInput);
}

const personalizedFoodRecommendationsFlow = async (input: PersonalizedFoodRecommendationsInput): Promise<PersonalizedFoodRecommendationsOutput> => {
  const prompt = `AI-powered dietician providing evidence-based personalized food recommendations using the latest nutrition research.

Health Data: ${input.healthData}
Query Type: ${input.queryType}
Specific Condition: ${input.specificCondition}
Symptoms: ${input.symptoms}

Latest Nutrition Research:
${input.researchData}

Using the research data above, analyze the health information and provide:
1. Specific food recommendations based on latest scientific evidence
2. Foods to avoid based on the condition/symptoms
3. Meal planning suggestions with therapeutic benefits
4. Nutritional supplements if indicated by research
5. Cooking methods that preserve nutritional benefits

Reference specific research findings when applicable. Tailor recommendations to dietary requirements, preferences, and allergies.`;

  try {
    const response = await ai.generate({ prompt });
    return { recommendations: response.text };
  } catch (error) {
    try {
      const fallbackResponse = await aiWithFallback.generate({ prompt });
      return { recommendations: fallbackResponse.text };
    } catch (fallbackError) {
      console.error('Food recommendations failed:', error, fallbackError);
      return {
        recommendations: 'Based on general nutrition principles: Focus on whole foods, lean proteins, fruits, vegetables, whole grains, and adequate hydration. Limit processed foods, excess sugar, and unhealthy fats. Consult a nutritionist for personalized advice.'
      };
    }
  }
};
