import { ai } from '@/ai/genkit';

export interface InsurancePolicyRecommendation {
  patientId: string;
  patientName: string;
  recommendedPlan: {
    name: string;
    type: 'Basic' | 'Standard' | 'Premium' | 'Comprehensive';
    monthlyPremium: number;
    annualPremium: number;
    coverage: {
      medical: number;
      hospital: number;
      prescription: number;
      preventive: number;
      mentalHealth: number;
      dental: number;
      vision: number;
    };
    deductible: number;
    maxOutOfPocket: number;
    maxCoverage: number;
  };
  riskAssessment: {
    overallScore: number;
    level: 'Low' | 'Moderate' | 'High' | 'Critical';
    factors: {
      age: number;
      chronicConditions: number;
      lifestyle: number;
      familyHistory: number;
      claimsHistory: number;
    };
  };
  aiInsights: {
    summary: string;
    keyFindings: string[];
    costPredictions: {
      year1: number;
      year3: number;
      year5: number;
    };
    preventiveRecommendations: string[];
    riskMitigationStrategies: string[];
  };
  policyCustomizations: {
    exclusions: string[];
    waitingPeriods: { condition: string; months: number }[];
    specialConditions: string[];
    discountOpportunities: string[];
  };
  competitiveAnalysis: {
    marketPosition: string;
    pricingStrategy: string;
    differentiators: string[];
  };
}

export const insurancePolicyRecommendationFlow = async (patientData: {
  id: string;
  name: string;
  age: number;
  gender: string;
  chronicConditions: string[];
  allergies: string[];
  lifestyle: {
    smoking: boolean;
    alcohol: boolean;
    exercise: string;
    diet: string;
  };
  familyHistory: string[];
  claimsHistory: {
    totalClaims: number;
    totalAmount: number;
    frequentConditions: string[];
  };
  labResults: any[];
  vitals: any;
}): Promise<InsurancePolicyRecommendation> => {
  const prompt = `
  You are an expert insurance underwriter and AI analyst. Analyze the following patient data and provide a comprehensive insurance policy recommendation:

  PATIENT PROFILE:
  - Name: ${patientData.name}
  - Age: ${patientData.age}
  - Gender: ${patientData.gender}
  - Chronic Conditions: ${patientData.chronicConditions.join(', ') || 'None'}
  - Allergies: ${patientData.allergies.join(', ') || 'None'}
  - Lifestyle Factors:
    * Smoking: ${patientData.lifestyle.smoking ? 'Yes' : 'No'}
    * Alcohol Use: ${patientData.lifestyle.alcohol ? 'Yes' : 'No'}
    * Exercise Level: ${patientData.lifestyle.exercise}
    * Diet Quality: ${patientData.lifestyle.diet}
  - Family History: ${patientData.familyHistory.join(', ') || 'None'}
  - Claims History:
    * Total Claims: ${patientData.claimsHistory.totalClaims}
    * Total Amount: $${patientData.claimsHistory.totalAmount}
    * Common Conditions: ${patientData.claimsHistory.frequentConditions.join(', ')}

  ANALYSIS REQUIREMENTS:
  1. Calculate comprehensive risk score (0-100) with detailed breakdown
  2. Recommend appropriate insurance plan type and coverage levels
  3. Determine fair pricing based on risk assessment
  4. Identify necessary exclusions and waiting periods
  5. Provide cost predictions for 1, 3, and 5 years
  6. Suggest preventive care measures to reduce future costs
  7. Analyze competitive positioning and pricing strategy

  RISK FACTORS TO CONSIDER:
  - Age and gender demographics
  - Pre-existing conditions and their severity
  - Lifestyle risk factors (smoking, alcohol, diet, exercise)
  - Family history and genetic predispositions
  - Historical claims patterns and costs
  - Medication compliance and management
  - Preventive care utilization

  INSURANCE PLAN TYPES:
  - Basic: Lower cost, essential coverage, higher deductibles
  - Standard: Balanced coverage and cost, moderate deductibles
  - Premium: Comprehensive coverage, lower deductibles, additional benefits
  - Comprehensive: Maximum coverage, lowest out-of-pocket costs

  Provide detailed analysis and recommendations in a structured format that can be used for underwriting decisions and customer presentations.
  `;

  try {
    const response = await ai.generate({ prompt });

    const aiAnalysis = response.text;

    // Calculate risk scores using rule-based system as backup
    const riskFactors = calculateRiskFactors(patientData);
    const overallRiskScore = calculateOverallRiskScore(riskFactors);
    const riskLevel = determineRiskLevel(overallRiskScore);
    const recommendedPlan = generateInsurancePlan(overallRiskScore, patientData);

    return {
      patientId: patientData.id,
      patientName: patientData.name,
      recommendedPlan,
      riskAssessment: {
        overallScore: overallRiskScore,
        level: riskLevel,
        factors: riskFactors
      },
      aiInsights: {
        summary: extractSummary(aiAnalysis),
        keyFindings: extractKeyFindings(aiAnalysis, patientData),
        costPredictions: predictCosts(overallRiskScore, patientData),
        preventiveRecommendations: generatePreventiveRecommendations(patientData),
        riskMitigationStrategies: generateRiskMitigationStrategies(patientData)
      },
      policyCustomizations: {
        exclusions: generateExclusions(patientData),
        waitingPeriods: generateWaitingPeriods(patientData),
        specialConditions: generateSpecialConditions(patientData),
        discountOpportunities: generateDiscountOpportunities(patientData)
      },
      competitiveAnalysis: {
        marketPosition: analyzeMarketPosition(overallRiskScore),
        pricingStrategy: determinePricingStrategy(overallRiskScore, patientData),
        differentiators: identifyDifferentiators(patientData)
      }
    };
  } catch (error) {
    console.error('Error in AI insurance analysis:', error);
    // Fallback to rule-based recommendation
    return generateFallbackRecommendation(patientData);
  }
};

// Helper functions for risk calculation and analysis
function calculateRiskFactors(patientData: any) {
  let ageScore = 0;
  if (patientData.age < 25) ageScore = 10;
  else if (patientData.age < 40) ageScore = 15;
  else if (patientData.age < 55) ageScore = 25;
  else if (patientData.age < 65) ageScore = 35;
  else ageScore = 45;

  const chronicConditionsScore = Math.min(patientData.chronicConditions.length * 15, 40);

  let lifestyleScore = 0;
  if (patientData.lifestyle.smoking) lifestyleScore += 25;
  if (patientData.lifestyle.alcohol) lifestyleScore += 5;
  if (patientData.lifestyle.exercise === 'Low') lifestyleScore += 10;
  if (patientData.lifestyle.diet === 'Poor') lifestyleScore += 10;

  const familyHistoryScore = Math.min(patientData.familyHistory.length * 3, 15);

  let claimsHistoryScore = 0;
  if (patientData.claimsHistory.totalClaims > 5) claimsHistoryScore += 15;
  if (patientData.claimsHistory.totalAmount > 50000) claimsHistoryScore += 20;
  if (patientData.claimsHistory.totalAmount > 100000) claimsHistoryScore += 15;

  return {
    age: ageScore,
    chronicConditions: chronicConditionsScore,
    lifestyle: lifestyleScore,
    familyHistory: familyHistoryScore,
    claimsHistory: claimsHistoryScore
  };
}

function calculateOverallRiskScore(factors: any): number {
  return Math.min(
    factors.age + factors.chronicConditions + factors.lifestyle + factors.familyHistory + factors.claimsHistory,
    100
  );
}

function determineRiskLevel(score: number): 'Low' | 'Moderate' | 'High' | 'Critical' {
  if (score < 35) return 'Low';
  if (score < 55) return 'Moderate';
  if (score < 75) return 'High';
  return 'Critical';
}

function generateInsurancePlan(riskScore: number, patientData: any) {
  let planType: 'Basic' | 'Standard' | 'Premium' | 'Comprehensive';
  let basePremium = 200;
  let coverage = {
    medical: 80,
    hospital: 85,
    prescription: 70,
    preventive: 100,
    mentalHealth: 60,
    dental: 50,
    vision: 30
  };

  if (riskScore < 35) {
    planType = 'Basic';
    basePremium = 180;
  } else if (riskScore < 55) {
    planType = 'Standard';
    basePremium = 280;
    coverage = {
      medical: 85,
      hospital: 90,
      prescription: 80,
      preventive: 100,
      mentalHealth: 70,
      dental: 60,
      vision: 40
    };
  } else if (riskScore < 75) {
    planType = 'Premium';
    basePremium = 420;
    coverage = {
      medical: 90,
      hospital: 95,
      prescription: 90,
      preventive: 100,
      mentalHealth: 85,
      dental: 75,
      vision: 60
    };
  } else {
    planType = 'Comprehensive';
    basePremium = 650;
    coverage = {
      medical: 95,
      hospital: 98,
      prescription: 95,
      preventive: 100,
      mentalHealth: 90,
      dental: 80,
      vision: 70
    };
  }

  // Adjust premium based on specific risk factors
  let premiumMultiplier = 1.0;
  if (patientData.lifestyle.smoking) premiumMultiplier += 0.3;
  if (patientData.chronicConditions.length > 2) premiumMultiplier += 0.2;
  if (patientData.age > 60) premiumMultiplier += 0.15;

  const adjustedPremium = Math.round(basePremium * premiumMultiplier);

  return {
    name: `${planType} Health Insurance Plan`,
    type: planType,
    monthlyPremium: adjustedPremium,
    annualPremium: adjustedPremium * 12,
    coverage,
    deductible: planType === 'Basic' ? 3000 : planType === 'Standard' ? 2000 : planType === 'Premium' ? 1000 : 500,
    maxOutOfPocket: planType === 'Basic' ? 8000 : planType === 'Standard' ? 6000 : planType === 'Premium' ? 4000 : 2500,
    maxCoverage: planType === 'Basic' ? 250000 : planType === 'Standard' ? 500000 : planType === 'Premium' ? 1000000 : 2000000
  };
}

function extractSummary(aiAnalysis: string): string {
  // Extract the first few sentences as summary
  const sentences = aiAnalysis.split('.').slice(0, 3);
  return sentences.join('.') + (sentences.length > 0 ? '.' : '');
}

function extractKeyFindings(aiAnalysis: string, patientData: any): string[] {
  const findings = [];
  
  if (patientData.chronicConditions.length > 0) {
    findings.push(`Patient has ${patientData.chronicConditions.length} chronic condition(s) requiring ongoing management`);
  }
  
  if (patientData.lifestyle.smoking) {
    findings.push('Smoking significantly increases health risks and insurance costs');
  }
  
  if (patientData.claimsHistory.totalAmount > 50000) {
    findings.push('High historical claims indicate elevated future risk');
  }
  
  if (patientData.age > 60) {
    findings.push('Advanced age requires comprehensive coverage with lower deductibles');
  }
  
  return findings;
}

function predictCosts(riskScore: number, patientData: any) {
  const baseCost = 3000;
  const riskMultiplier = 1 + (riskScore / 100);
  
  return {
    year1: Math.round(baseCost * riskMultiplier),
    year3: Math.round(baseCost * riskMultiplier * 1.15),
    year5: Math.round(baseCost * riskMultiplier * 1.35)
  };
}

function generatePreventiveRecommendations(patientData: any): string[] {
  const recommendations = [];
  
  if (patientData.age > 40) {
    recommendations.push('Annual comprehensive health screening');
  }
  
  if (patientData.chronicConditions.includes('diabetes')) {
    recommendations.push('Quarterly diabetes monitoring and A1C testing');
  }
  
  if (patientData.chronicConditions.includes('hypertension')) {
    recommendations.push('Regular blood pressure monitoring and medication adherence');
  }
  
  if (patientData.lifestyle.smoking) {
    recommendations.push('Smoking cessation program enrollment');
  }
  
  if (patientData.lifestyle.exercise === 'Low') {
    recommendations.push('Physical therapy and structured exercise program');
  }
  
  return recommendations;
}

function generateRiskMitigationStrategies(patientData: any): string[] {
  const strategies = [];
  
  strategies.push('Implement care coordination for chronic conditions');
  strategies.push('Provide health coaching and lifestyle modification support');
  
  if (patientData.chronicConditions.length > 0) {
    strategies.push('Assign dedicated case manager for chronic disease management');
  }
  
  if (patientData.lifestyle.smoking || patientData.lifestyle.diet === 'Poor') {
    strategies.push('Offer wellness incentives and lifestyle modification programs');
  }
  
  return strategies;
}

function generateExclusions(patientData: any): string[] {
  const exclusions = [];
  
  patientData.chronicConditions.forEach((condition: string) => {
    exclusions.push(`Pre-existing ${condition.replace('_', ' ')} complications (first 12 months)`);
  });
  
  if (patientData.lifestyle.smoking) {
    exclusions.push('Smoking-related illnesses (first 24 months)');
  }
  
  return exclusions;
}

function generateWaitingPeriods(patientData: any): { condition: string; months: number }[] {
  const waitingPeriods = [];
  
  if (patientData.chronicConditions.length > 0) {
    waitingPeriods.push({
      condition: 'Pre-existing conditions',
      months: 12
    });
  }
  
  if (patientData.familyHistory.includes('cancer')) {
    waitingPeriods.push({
      condition: 'Cancer coverage',
      months: 24
    });
  }
  
  return waitingPeriods;
}

function generateSpecialConditions(patientData: any): string[] {
  const conditions = [];
  
  if (patientData.chronicConditions.length > 2) {
    conditions.push('Requires medical examination and physician report');
  }
  
  if (patientData.claimsHistory.totalAmount > 100000) {
    conditions.push('Subject to claims review and medical underwriting');
  }
  
  return conditions;
}

function generateDiscountOpportunities(patientData: any): string[] {
  const discounts = [];
  
  if (!patientData.lifestyle.smoking) {
    discounts.push('Non-smoker discount: 10% premium reduction');
  }
  
  if (patientData.lifestyle.exercise === 'High') {
    discounts.push('Fitness program participation: 5% premium reduction');
  }
  
  if (patientData.age < 30) {
    discounts.push('Young adult discount: 15% premium reduction');
  }
  
  return discounts;
}

function analyzeMarketPosition(riskScore: number): string {
  if (riskScore < 35) {
    return 'Competitive advantage with low-risk profile';
  } else if (riskScore < 55) {
    return 'Standard market positioning with balanced risk';
  } else {
    return 'Specialized market requiring premium pricing';
  }
}

function determinePricingStrategy(riskScore: number, patientData: any): string {
  if (riskScore < 35) {
    return 'Competitive pricing to attract low-risk customers';
  } else if (riskScore < 55) {
    return 'Standard pricing with risk-adjusted premiums';
  } else {
    return 'Premium pricing with comprehensive coverage and risk management';
  }
}

function identifyDifferentiators(patientData: any): string[] {
  const differentiators = [];
  
  differentiators.push('AI-powered risk assessment and personalized pricing');
  differentiators.push('Integrated preventive care and wellness programs');
  
  if (patientData.chronicConditions.length > 0) {
    differentiators.push('Specialized chronic disease management programs');
  }
  
  differentiators.push('Real-time health monitoring and intervention capabilities');
  
  return differentiators;
}

function generateFallbackRecommendation(patientData: any): InsurancePolicyRecommendation {
  const riskFactors = calculateRiskFactors(patientData);
  const overallRiskScore = calculateOverallRiskScore(riskFactors);
  const riskLevel = determineRiskLevel(overallRiskScore);
  const recommendedPlan = generateInsurancePlan(overallRiskScore, patientData);

  return {
    patientId: patientData.id,
    patientName: patientData.name,
    recommendedPlan,
    riskAssessment: {
      overallScore: overallRiskScore,
      level: riskLevel,
      factors: riskFactors
    },
    aiInsights: {
      summary: 'Risk assessment completed using standard underwriting guidelines.',
      keyFindings: extractKeyFindings('', patientData),
      costPredictions: predictCosts(overallRiskScore, patientData),
      preventiveRecommendations: generatePreventiveRecommendations(patientData),
      riskMitigationStrategies: generateRiskMitigationStrategies(patientData)
    },
    policyCustomizations: {
      exclusions: generateExclusions(patientData),
      waitingPeriods: generateWaitingPeriods(patientData),
      specialConditions: generateSpecialConditions(patientData),
      discountOpportunities: generateDiscountOpportunities(patientData)
    },
    competitiveAnalysis: {
      marketPosition: analyzeMarketPosition(overallRiskScore),
      pricingStrategy: determinePricingStrategy(overallRiskScore, patientData),
      differentiators: identifyDifferentiators(patientData)
    }
  };
}
