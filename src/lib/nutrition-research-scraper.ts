'use server';

interface NutritionResearch {
  title: string;
  findings: string;
  foods: string[];
  source: string;
  date: string;
  relevanceScore: number;
}

export async function scrapeNutritionResearch(query: string): Promise<NutritionResearch[]> {
  try {
    // Simulate nutrition research data (replace with actual scraping)
    const mockData: NutritionResearch[] = [
      {
        title: `Nutritional Management of ${query} - Clinical Guidelines 2024`,
        findings: `Recent studies show specific dietary interventions for ${query} can improve outcomes by 40%. Mediterranean diet patterns show particular benefit.`,
        foods: ['leafy greens', 'fatty fish', 'nuts', 'olive oil', 'berries'],
        source: 'American Journal of Clinical Nutrition',
        date: new Date().toISOString().split('T')[0],
        relevanceScore: 0.92,
      },
      {
        title: `Anti-inflammatory Foods for ${query} Treatment`,
        findings: `Meta-analysis reveals anti-inflammatory foods reduce ${query} symptoms by 35%. Omega-3 rich foods show strongest evidence.`,
        foods: ['salmon', 'walnuts', 'chia seeds', 'turmeric', 'ginger'],
        source: 'Nutrition Reviews',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        relevanceScore: 0.88,
      },
      {
        title: `Micronutrient Deficiencies in ${query} Patients`,
        findings: `Research identifies key nutrient gaps in ${query} patients. Targeted supplementation improves quality of life scores.`,
        foods: ['spinach', 'quinoa', 'lean protein', 'citrus fruits', 'yogurt'],
        source: 'Journal of Nutritional Medicine',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        relevanceScore: 0.85,
      },
    ];

    return mockData.filter(data => data.relevanceScore > 0.8);
  } catch (error) {
    console.error('Error scraping nutrition research:', error);
    return [];
  }
}

export async function getFoodRecommendationsForCondition(condition: string): Promise<string> {
  const research = await scrapeNutritionResearch(condition);
  
  return research
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)
    .map(r => `${r.title}\n${r.findings}\nRecommended Foods: ${r.foods.join(', ')}\nSource: ${r.source} (${r.date})`)
    .join('\n\n');
}

export async function getSymptomBasedNutrition(symptoms: string): Promise<string> {
  const symptomList = symptoms.split(',').map(s => s.trim()).slice(0, 2);
  const allResearch: NutritionResearch[] = [];

  for (const symptom of symptomList) {
    const research = await scrapeNutritionResearch(`${symptom} nutrition`);
    allResearch.push(...research);
  }

  return allResearch
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 4)
    .map(r => `${r.title}\n${r.findings}\nBeneficial Foods: ${r.foods.join(', ')}\nSource: ${r.source}`)
    .join('\n\n');
}