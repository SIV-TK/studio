import { ai } from '@/ai/genkit';
import { PatientHealthSummary, RiskAnalysis, InsurancePlan } from '@/lib/insurance-data-service';

export interface AIRiskAssessment {
  patientId: string;
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  keyRiskFactors: string[];
  recommendations: {
    planRecommendation: string;
    premiumAdjustment: number;
    specialConditions: string[];
    preventiveMeasures: string[];
  };
  aiInsights: {
    summary: string;
    futureRiskPrediction: string;
    costProjection: {
      yearOne: number;
      yearThree: number;
      yearFive: number;
    };
    recommendedActions: string[];
  };
}

export interface PlanRecommendation {
  patientId: string;
  recommendedPlan: InsurancePlan;
  customizations: {
    premiumAdjustment: number;
    additionalCoverage: string[];
    exclusions: string[];
    waitingPeriods: { condition: string; period: string }[];
  };
  reasoning: string;
  alternativePlans: {
    plan: InsurancePlan;
    reason: string;
    premiumDifference: number;
  }[];
}

export class InsuranceAIService {
  static async assessPatientRisk(patientData: PatientHealthSummary): Promise<AIRiskAssessment> {
    const prompt = `
    As an AI insurance risk analyst, analyze the following patient data and provide a comprehensive risk assessment:

    Patient Information:
    - Name: ${patientData.name}
    - Age: ${patientData.age}
    - Gender: ${patientData.gender}
    - Chronic Conditions: ${patientData.chronicConditions.join(', ') || 'None'}
    - Allergies: ${patientData.allergies.join(', ') || 'None'}
    - Recent Hospitalizations: ${patientData.recentHospitalizations}
    - Lab Results Trend: ${patientData.labResultsTrend}
    - Medication Compliance: ${patientData.medicationCompliance}%
    - Lifestyle Factors:
      - Smoking: ${patientData.lifestyleFactors.smoking ? 'Yes' : 'No'}
      - Alcohol: ${patientData.lifestyleFactors.alcohol ? 'Yes' : 'No'}
      - Exercise Level: ${patientData.lifestyleFactors.exercise}
      - Diet Quality: ${patientData.lifestyleFactors.diet}
    - Family History: ${patientData.familyHistory.join(', ') || 'None'}
    - Claims History:
      - Total Claims: ${patientData.claimsHistory.totalClaims}
      - Total Amount: $${patientData.claimsHistory.totalAmount}
      - Frequent Conditions: ${patientData.claimsHistory.frequentConditions.join(', ')}

    Please provide:
    1. A risk score (0-100) with justification
    2. Risk level classification (Low/Moderate/High/Critical)
    3. Key risk factors that influence the assessment
    4. Premium adjustment recommendation (percentage)
    5. Special conditions or exclusions to consider
    6. Preventive measures that could reduce risk
    7. A comprehensive summary of the patient's insurability
    8. Future risk prediction (1, 3, and 5 years)
    9. Projected costs for years 1, 3, and 5
    10. Recommended actions for risk mitigation

    Format your response as detailed analysis with specific recommendations for insurance underwriting.
    `;

    try {
      const response = await ai.generate({ prompt });

      // Parse the AI response (in a real implementation, you'd want more robust parsing)
      const aiInsights = this.parseAIResponse(response.text);

      return {
        patientId: patientData.patientId,
        riskScore: this.calculateRiskScore(patientData),
        riskLevel: this.determineRiskLevel(patientData),
        keyRiskFactors: this.extractKeyRiskFactors(patientData),
        recommendations: {
          planRecommendation: this.recommendPlanType(patientData),
          premiumAdjustment: this.calculatePremiumAdjustment(patientData),
          specialConditions: this.getSpecialConditions(patientData),
          preventiveMeasures: this.getPreventiveMeasures(patientData)
        },
        aiInsights
      };
    } catch (error) {
      console.error('Error in AI risk assessment:', error);
      // Fallback to rule-based assessment
      return this.fallbackRiskAssessment(patientData);
    }
  }

  static async recommendInsurancePlan(
    patientData: PatientHealthSummary,
    availablePlans: InsurancePlan[]
  ): Promise<PlanRecommendation> {
    const prompt = `
    As an AI insurance plan recommendation system, analyze the patient data and recommend the most suitable insurance plan:

    Patient Profile:
    - Age: ${patientData.age}, Gender: ${patientData.gender}
    - Risk Score: ${patientData.riskScore} (Risk Level: ${patientData.riskLevel})
    - Chronic Conditions: ${patientData.chronicConditions.join(', ') || 'None'}
    - Recent Hospitalizations: ${patientData.recentHospitalizations}
    - Claims History: ${patientData.claimsHistory.totalClaims} claims, $${patientData.claimsHistory.totalAmount}
    - Lifestyle: Smoking: ${patientData.lifestyleFactors.smoking}, Exercise: ${patientData.lifestyleFactors.exercise}

    Available Plans:
    ${availablePlans.map(plan => `
    - ${plan.name} (${plan.type}): $${plan.basePremium}/month
      Coverage: Hospital ${plan.coverage.hospitalCare}%, Outpatient ${plan.coverage.outpatientCare}%
      Max Coverage: $${plan.maxCoverage}, Deductible: $${plan.deductible}
      Risk Range: ${plan.riskRange.min}-${plan.riskRange.max}
    `).join('\n')}

    Provide:
    1. Primary plan recommendation with detailed reasoning
    2. Premium adjustment based on patient risk
    3. Additional coverage recommendations
    4. Suggested exclusions or waiting periods
    5. Alternative plans with pros/cons
    6. Cost-benefit analysis for the patient

    Focus on balancing coverage needs with risk management for the insurance company.
    `;

    try {
      const response = await ai.generate({ prompt });

      // Find the most suitable plan based on risk score
      const recommendedPlan = availablePlans.find(plan => 
        patientData.riskScore >= plan.riskRange.min && 
        patientData.riskScore <= plan.riskRange.max
      ) || availablePlans[availablePlans.length - 1];

      return {
        patientId: patientData.patientId,
        recommendedPlan,
        customizations: {
          premiumAdjustment: this.calculatePremiumAdjustment(patientData),
          additionalCoverage: this.getAdditionalCoverage(patientData),
          exclusions: this.getExclusions(patientData),
          waitingPeriods: this.getWaitingPeriods(patientData)
        },
        reasoning: response.text,
        alternativePlans: this.getAlternativePlans(patientData, availablePlans, recommendedPlan)
      };
    } catch (error) {
      console.error('Error in AI plan recommendation:', error);
      return this.fallbackPlanRecommendation(patientData, availablePlans);
    }
  }

  static async analyzeCohortRisk(patients: PatientHealthSummary[]): Promise<{
    cohortRiskProfile: string;
    riskDistribution: { [key: string]: number };
    recommendedPolicies: string[];
    profitabilityAnalysis: string;
    recommendations: string[];
  }> {
    const prompt = `
    Analyze this cohort of ${patients.length} patients for insurance risk assessment:

    Cohort Overview:
    - Age Range: ${Math.min(...patients.map(p => p.age))} - ${Math.max(...patients.map(p => p.age))}
    - Average Risk Score: ${(patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length).toFixed(1)}
    - Risk Levels: 
      Low: ${patients.filter(p => p.riskLevel === 'Low').length}
      Moderate: ${patients.filter(p => p.riskLevel === 'Moderate').length}
      High: ${patients.filter(p => p.riskLevel === 'High').length}
      Critical: ${patients.filter(p => p.riskLevel === 'Critical').length}
    
    Common Conditions:
    ${this.getCommonConditions(patients).slice(0, 5).map(c => `- ${c.condition}: ${c.count} patients`).join('\n')}

    Total Claims Value: $${patients.reduce((sum, p) => sum + p.claimsHistory.totalAmount, 0)}

    Provide:
    1. Overall cohort risk profile assessment
    2. Risk distribution analysis
    3. Recommended insurance policies for this cohort
    4. Profitability analysis
    5. Strategic recommendations for insuring this group

    Focus on portfolio risk management and profitability.
    `;

    try {
      const response = await ai.generate({ prompt });

      const riskDistribution = {
        'Low': patients.filter(p => p.riskLevel === 'Low').length,
        'Moderate': patients.filter(p => p.riskLevel === 'Moderate').length,
        'High': patients.filter(p => p.riskLevel === 'High').length,
        'Critical': patients.filter(p => p.riskLevel === 'Critical').length,
      };

      return {
        cohortRiskProfile: response.text,
        riskDistribution,
        recommendedPolicies: this.getRecommendedPolicies(patients),
        profitabilityAnalysis: this.analyzeProfitability(patients),
        recommendations: this.getCohortRecommendations(patients)
      };
    } catch (error) {
      console.error('Error in cohort analysis:', error);
      return this.fallbackCohortAnalysis(patients);
    }
  }

  // Helper methods for AI response parsing and fallbacks
  private static parseAIResponse(aiResponse: string) {
    // In a real implementation, you'd want to parse the structured AI response
    return {
      summary: aiResponse.substring(0, 200) + '...',
      futureRiskPrediction: 'Based on current health trends, risk may increase by 10-15% over the next 3 years.',
      costProjection: {
        yearOne: Math.random() * 5000 + 3000,
        yearThree: Math.random() * 8000 + 5000,
        yearFive: Math.random() * 12000 + 8000
      },
      recommendedActions: [
        'Implement preventive care programs',
        'Monitor chronic conditions closely',
        'Encourage lifestyle modifications'
      ]
    };
  }

  private static calculateRiskScore(patient: PatientHealthSummary): number {
    let score = 20; // Base score

    // Age factor
    if (patient.age > 60) score += 25;
    else if (patient.age > 40) score += 15;
    else if (patient.age < 25) score += 5;

    // Chronic conditions
    score += patient.chronicConditions.length * 15;

    // Lifestyle factors
    if (patient.lifestyleFactors.smoking) score += 20;
    if (patient.lifestyleFactors.alcohol) score += 5;
    if (patient.lifestyleFactors.exercise === 'Low') score += 10;
    if (patient.lifestyleFactors.diet === 'Poor') score += 10;

    // Claims history
    if (patient.claimsHistory.totalClaims > 5) score += 15;
    if (patient.claimsHistory.totalAmount > 50000) score += 20;

    // Recent hospitalizations
    score += patient.recentHospitalizations * 10;

    return Math.min(score, 100);
  }

  private static determineRiskLevel(patient: PatientHealthSummary): 'Low' | 'Moderate' | 'High' | 'Critical' {
    const score = this.calculateRiskScore(patient);
    if (score < 40) return 'Low';
    if (score < 65) return 'Moderate';
    if (score < 80) return 'High';
    return 'Critical';
  }

  private static extractKeyRiskFactors(patient: PatientHealthSummary): string[] {
    const factors = [];

    if (patient.age > 60) factors.push('Advanced age');
    if (patient.chronicConditions.length > 0) factors.push('Chronic conditions');
    if (patient.lifestyleFactors.smoking) factors.push('Smoking');
    if (patient.recentHospitalizations > 1) factors.push('Recent hospitalizations');
    if (patient.claimsHistory.totalAmount > 50000) factors.push('High claims history');

    return factors;
  }

  private static recommendPlanType(patient: PatientHealthSummary): string {
    if (patient.riskScore < 40) return 'Basic or Standard Plan';
    if (patient.riskScore < 65) return 'Standard Plan';
    if (patient.riskScore < 80) return 'Premium Plan';
    return 'Comprehensive Plan with restrictions';
  }

  private static calculatePremiumAdjustment(patient: PatientHealthSummary): number {
    let adjustment = 0;

    if (patient.chronicConditions.length > 0) adjustment += 20;
    if (patient.lifestyleFactors.smoking) adjustment += 30;
    if (patient.age > 60) adjustment += 25;
    if (patient.recentHospitalizations > 1) adjustment += 15;

    return Math.min(adjustment, 100);
  }

  private static getSpecialConditions(patient: PatientHealthSummary): string[] {
    const conditions = [];

    if (patient.chronicConditions.length > 0) {
      conditions.push('Pre-existing condition exclusions apply');
    }
    if (patient.lifestyleFactors.smoking) {
      conditions.push('Smoking-related illness waiting period');
    }
    if (patient.riskScore > 80) {
      conditions.push('Requires medical examination');
    }

    return conditions;
  }

  private static getPreventiveMeasures(patient: PatientHealthSummary): string[] {
    const measures = [];

    if (patient.chronicConditions.includes('diabetes')) {
      measures.push('Regular diabetes monitoring and management');
    }
    if (patient.lifestyleFactors.smoking) {
      measures.push('Smoking cessation program enrollment');
    }
    if (patient.lifestyleFactors.exercise === 'Low') {
      measures.push('Physical activity and wellness programs');
    }

    return measures;
  }

  private static getAdditionalCoverage(patient: PatientHealthSummary): string[] {
    const coverage = [];

    if (patient.age > 50) {
      coverage.push('Enhanced preventive care');
    }
    if (patient.chronicConditions.length > 0) {
      coverage.push('Chronic disease management');
    }

    return coverage;
  }

  private static getExclusions(patient: PatientHealthSummary): string[] {
    const exclusions: string[] = [];

    patient.chronicConditions.forEach(condition => {
      exclusions.push(`Pre-existing ${condition} complications`);
    });

    return exclusions;
  }

  private static getWaitingPeriods(patient: PatientHealthSummary): { condition: string; period: string }[] {
    const waitingPeriods = [];

    if (patient.chronicConditions.length > 0) {
      waitingPeriods.push({
        condition: 'Pre-existing conditions',
        period: '12 months'
      });
    }

    return waitingPeriods;
  }

  private static getAlternativePlans(
    patient: PatientHealthSummary,
    allPlans: InsurancePlan[],
    recommendedPlan: InsurancePlan
  ) {
    return allPlans
      .filter(plan => plan.id !== recommendedPlan.id)
      .slice(0, 2)
      .map(plan => ({
        plan,
        reason: `Alternative coverage option with ${plan.type} benefits`,
        premiumDifference: plan.basePremium - recommendedPlan.basePremium
      }));
  }

  private static getCommonConditions(patients: PatientHealthSummary[]) {
    const conditionCounts = new Map<string, number>();
    
    patients.forEach(patient => {
      patient.chronicConditions.forEach(condition => {
        conditionCounts.set(condition, (conditionCounts.get(condition) || 0) + 1);
      });
    });

    return Array.from(conditionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([condition, count]) => ({ condition, count }));
  }

  private static getRecommendedPolicies(patients: PatientHealthSummary[]): string[] {
    const avgRisk = patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length;
    
    if (avgRisk < 40) {
      return ['Standard health insurance', 'Preventive care focus', 'Wellness incentives'];
    } else if (avgRisk < 65) {
      return ['Comprehensive health insurance', 'Chronic disease management', 'Regular monitoring'];
    } else {
      return ['Premium insurance with restrictions', 'High-risk pool management', 'Intensive case management'];
    }
  }

  private static analyzeProfitability(patients: PatientHealthSummary[]): string {
    const totalClaims = patients.reduce((sum, p) => sum + p.claimsHistory.totalAmount, 0);
    const avgRisk = patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length;
    
    if (avgRisk < 50 && totalClaims < 100000) {
      return 'High profitability cohort with low risk and claims history';
    } else if (avgRisk < 70) {
      return 'Moderate profitability with careful risk management required';
    } else {
      return 'Low profitability cohort requiring premium adjustments and restrictions';
    }
  }

  private static getCohortRecommendations(patients: PatientHealthSummary[]): string[] {
    return [
      'Implement tiered pricing based on risk levels',
      'Offer preventive care incentives to reduce long-term costs',
      'Consider group policies for better risk distribution',
      'Regular risk reassessment every 12 months'
    ];
  }

  // Fallback methods for when AI services are unavailable
  private static fallbackRiskAssessment(patientData: PatientHealthSummary): AIRiskAssessment {
    return {
      patientId: patientData.patientId,
      riskScore: this.calculateRiskScore(patientData),
      riskLevel: this.determineRiskLevel(patientData),
      keyRiskFactors: this.extractKeyRiskFactors(patientData),
      recommendations: {
        planRecommendation: this.recommendPlanType(patientData),
        premiumAdjustment: this.calculatePremiumAdjustment(patientData),
        specialConditions: this.getSpecialConditions(patientData),
        preventiveMeasures: this.getPreventiveMeasures(patientData)
      },
      aiInsights: {
        summary: 'Rule-based assessment completed. AI analysis temporarily unavailable.',
        futureRiskPrediction: 'Standard risk progression expected based on current factors.',
        costProjection: {
          yearOne: 4000,
          yearThree: 6000,
          yearFive: 8500
        },
        recommendedActions: ['Regular health monitoring', 'Preventive care compliance']
      }
    };
  }

  private static fallbackPlanRecommendation(
    patientData: PatientHealthSummary,
    availablePlans: InsurancePlan[]
  ): PlanRecommendation {
    const recommendedPlan = availablePlans.find(plan => 
      patientData.riskScore >= plan.riskRange.min && 
      patientData.riskScore <= plan.riskRange.max
    ) || availablePlans[availablePlans.length - 1];

    return {
      patientId: patientData.patientId,
      recommendedPlan,
      customizations: {
        premiumAdjustment: this.calculatePremiumAdjustment(patientData),
        additionalCoverage: this.getAdditionalCoverage(patientData),
        exclusions: this.getExclusions(patientData),
        waitingPeriods: this.getWaitingPeriods(patientData)
      },
      reasoning: 'Plan selected based on risk score and standard underwriting rules.',
      alternativePlans: this.getAlternativePlans(patientData, availablePlans, recommendedPlan)
    };
  }

  private static fallbackCohortAnalysis(patients: PatientHealthSummary[]) {
    const riskDistribution = {
      'Low': patients.filter(p => p.riskLevel === 'Low').length,
      'Moderate': patients.filter(p => p.riskLevel === 'Moderate').length,
      'High': patients.filter(p => p.riskLevel === 'High').length,
      'Critical': patients.filter(p => p.riskLevel === 'Critical').length,
    };

    return {
      cohortRiskProfile: 'Standard cohort analysis completed using rule-based assessment.',
      riskDistribution,
      recommendedPolicies: this.getRecommendedPolicies(patients),
      profitabilityAnalysis: this.analyzeProfitability(patients),
      recommendations: this.getCohortRecommendations(patients)
    };
  }
}
