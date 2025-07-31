import { PatientRecord, PatientDataService } from './patient-data-service';
import { InsuranceAuthService } from './insurance-auth-service';

export interface PatientHealthSummary {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  chronicConditions: string[];
  allergies: string[];
  recentHospitalizations: number;
  labResultsTrend: 'Improving' | 'Stable' | 'Declining';
  medicationCompliance: number; // percentage
  lifestyleFactors: {
    smoking: boolean;
    alcohol: boolean;
    exercise: 'Low' | 'Moderate' | 'High';
    diet: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  };
  familyHistory: string[];
  claimsHistory: {
    totalClaims: number;
    totalAmount: number;
    frequentConditions: string[];
  };
}

export interface RiskAnalysis {
  patientId: string;
  overallRiskScore: number;
  riskFactors: {
    factor: string;
    weight: number;
    impact: 'Low' | 'Medium' | 'High';
    description: string;
  }[];
  recommendations: {
    planType: string;
    premium: number;
    coverage: string[];
    exclusions: string[];
    waitingPeriods: { condition: string; period: string }[];
  };
  aiInsights: {
    predictedClaims: number;
    costEstimate: number;
    preventiveCareRecommendations: string[];
  };
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: 'Basic' | 'Standard' | 'Premium' | 'Comprehensive';
  basePremium: number;
  coverage: {
    hospitalCare: number;
    outpatientCare: number;
    prescription: number;
    preventiveCare: number;
    mentalHealth: number;
    dental: number;
    vision: number;
  };
  maxCoverage: number;
  deductible: number;
  copay: number;
  riskRange: { min: number; max: number };
}

// Mock patient health data with insurance perspective
const mockPatientHealthData = new Map<string, PatientHealthSummary>([
  ['user_001', {
    patientId: 'user_001',
    name: 'John Doe',
    age: 35,
    gender: 'male',
    riskScore: 75,
    riskLevel: 'High',
    chronicConditions: ['diabetes', 'hypertension'],
    allergies: ['penicillin', 'peanuts'],
    recentHospitalizations: 2,
    labResultsTrend: 'Stable',
    medicationCompliance: 85,
    lifestyleFactors: {
      smoking: false,
      alcohol: true,
      exercise: 'Moderate',
      diet: 'Fair'
    },
    familyHistory: ['heart_disease', 'diabetes', 'cancer'],
    claimsHistory: {
      totalClaims: 8,
      totalAmount: 45000,
      frequentConditions: ['diabetes_management', 'hypertension_treatment']
    }
  }],
  ['user_002', {
    patientId: 'user_002',
    name: 'Mary Smith',
    age: 28,
    gender: 'female',
    riskScore: 35,
    riskLevel: 'Low',
    chronicConditions: [],
    allergies: ['shellfish'],
    recentHospitalizations: 0,
    labResultsTrend: 'Stable',
    medicationCompliance: 95,
    lifestyleFactors: {
      smoking: false,
      alcohol: false,
      exercise: 'High',
      diet: 'Good'
    },
    familyHistory: ['hypertension'],
    claimsHistory: {
      totalClaims: 3,
      totalAmount: 2500,
      frequentConditions: ['routine_checkup', 'prenatal_care']
    }
  }],
  ['user_003', {
    patientId: 'user_003',
    name: 'Bob Johnson',
    age: 67,
    gender: 'male',
    riskScore: 85,
    riskLevel: 'Critical',
    chronicConditions: ['heart_disease', 'arthritis', 'chronic_kidney_disease'],
    allergies: [],
    recentHospitalizations: 4,
    labResultsTrend: 'Declining',
    medicationCompliance: 70,
    lifestyleFactors: {
      smoking: true,
      alcohol: true,
      exercise: 'Low',
      diet: 'Poor'
    },
    familyHistory: ['heart_disease', 'stroke', 'diabetes'],
    claimsHistory: {
      totalClaims: 15,
      totalAmount: 125000,
      frequentConditions: ['heart_disease', 'emergency_care', 'specialist_visits']
    }
  }]
]);

// Insurance plans based on risk levels
const insurancePlans: InsurancePlan[] = [
  {
    id: 'basic_low_risk',
    name: 'Wellness Basic',
    type: 'Basic',
    basePremium: 150,
    coverage: {
      hospitalCare: 80,
      outpatientCare: 60,
      prescription: 50,
      preventiveCare: 100,
      mentalHealth: 50,
      dental: 0,
      vision: 0
    },
    maxCoverage: 100000,
    deductible: 2000,
    copay: 30,
    riskRange: { min: 0, max: 40 }
  },
  {
    id: 'standard_moderate_risk',
    name: 'Health Standard',
    type: 'Standard',
    basePremium: 275,
    coverage: {
      hospitalCare: 85,
      outpatientCare: 70,
      prescription: 70,
      preventiveCare: 100,
      mentalHealth: 70,
      dental: 50,
      vision: 30
    },
    maxCoverage: 250000,
    deductible: 1500,
    copay: 25,
    riskRange: { min: 40, max: 65 }
  },
  {
    id: 'premium_high_risk',
    name: 'Care Premium',
    type: 'Premium',
    basePremium: 450,
    coverage: {
      hospitalCare: 90,
      outpatientCare: 80,
      prescription: 85,
      preventiveCare: 100,
      mentalHealth: 85,
      dental: 70,
      vision: 50
    },
    maxCoverage: 500000,
    deductible: 1000,
    copay: 20,
    riskRange: { min: 65, max: 80 }
  },
  {
    id: 'comprehensive_critical_risk',
    name: 'Total Care Comprehensive',
    type: 'Comprehensive',
    basePremium: 750,
    coverage: {
      hospitalCare: 95,
      outpatientCare: 90,
      prescription: 90,
      preventiveCare: 100,
      mentalHealth: 90,
      dental: 80,
      vision: 70
    },
    maxCoverage: 1000000,
    deductible: 500,
    copay: 15,
    riskRange: { min: 80, max: 100 }
  }
];

export class InsuranceDataService {
  static async getPatientHealthSummary(patientId: string): Promise<PatientHealthSummary | null> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_patient_data')) {
      throw new Error('Insufficient permissions to access patient data');
    }

    return mockPatientHealthData.get(patientId) || null;
  }

  static async getAllPatientsHealthSummary(): Promise<PatientHealthSummary[]> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_patient_data')) {
      throw new Error('Insufficient permissions to access patient data');
    }

    return Array.from(mockPatientHealthData.values());
  }

  static async analyzePatientRisk(patientId: string): Promise<RiskAnalysis | null> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('analyze_risk')) {
      throw new Error('Insufficient permissions to analyze risk');
    }

    const patientData = mockPatientHealthData.get(patientId);
    if (!patientData) return null;

    const riskFactors = this.calculateRiskFactors(patientData);
    const recommendedPlan = this.recommendInsurancePlan(patientData.riskScore);

    return {
      patientId,
      overallRiskScore: patientData.riskScore,
      riskFactors,
      recommendations: {
        planType: recommendedPlan.name,
        premium: this.calculateAdjustedPremium(recommendedPlan.basePremium, patientData),
        coverage: Object.keys(recommendedPlan.coverage),
        exclusions: this.getExclusions(patientData),
        waitingPeriods: this.getWaitingPeriods(patientData)
      },
      aiInsights: {
        predictedClaims: this.predictAnnualClaims(patientData),
        costEstimate: this.estimateAnnualCosts(patientData),
        preventiveCareRecommendations: this.getPreventiveCareRecommendations(patientData)
      }
    };
  }

  private static calculateRiskFactors(patient: PatientHealthSummary) {
    const factors = [];

    // Age factor
    if (patient.age > 60) {
      factors.push({
        factor: 'Advanced Age',
        weight: 0.2,
        impact: 'High' as const,
        description: 'Increased risk due to advanced age'
      });
    } else if (patient.age > 40) {
      factors.push({
        factor: 'Middle Age',
        weight: 0.1,
        impact: 'Medium' as const,
        description: 'Moderate risk increase with age'
      });
    }

    // Chronic conditions
    if (patient.chronicConditions.length > 0) {
      factors.push({
        factor: 'Chronic Conditions',
        weight: 0.3,
        impact: 'High' as const,
        description: `${patient.chronicConditions.length} chronic condition(s) detected`
      });
    }

    // Lifestyle factors
    if (patient.lifestyleFactors.smoking) {
      factors.push({
        factor: 'Smoking',
        weight: 0.25,
        impact: 'High' as const,
        description: 'Significantly increases health risks'
      });
    }

    if (patient.lifestyleFactors.exercise === 'Low') {
      factors.push({
        factor: 'Sedentary Lifestyle',
        weight: 0.15,
        impact: 'Medium' as const,
        description: 'Low physical activity increases health risks'
      });
    }

    // Family history
    if (patient.familyHistory.length > 2) {
      factors.push({
        factor: 'Family History',
        weight: 0.1,
        impact: 'Medium' as const,
        description: 'Strong family history of health conditions'
      });
    }

    return factors;
  }

  private static recommendInsurancePlan(riskScore: number): InsurancePlan {
    return insurancePlans.find(plan => 
      riskScore >= plan.riskRange.min && riskScore <= plan.riskRange.max
    ) || insurancePlans[insurancePlans.length - 1];
  }

  private static calculateAdjustedPremium(basePremium: number, patient: PatientHealthSummary): number {
    let multiplier = 1.0;

    // Adjust based on risk factors
    if (patient.chronicConditions.length > 0) {
      multiplier += 0.2 * patient.chronicConditions.length;
    }

    if (patient.lifestyleFactors.smoking) {
      multiplier += 0.3;
    }

    if (patient.age > 60) {
      multiplier += 0.25;
    }

    if (patient.recentHospitalizations > 1) {
      multiplier += 0.15 * patient.recentHospitalizations;
    }

    return Math.round(basePremium * multiplier);
  }

  private static getExclusions(patient: PatientHealthSummary): string[] {
    const exclusions = [];

    if (patient.chronicConditions.includes('diabetes')) {
      exclusions.push('Pre-existing diabetes complications');
    }

    if (patient.chronicConditions.includes('heart_disease')) {
      exclusions.push('Pre-existing cardiovascular conditions');
    }

    if (patient.lifestyleFactors.smoking) {
      exclusions.push('Smoking-related illnesses (first 2 years)');
    }

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

    if (patient.familyHistory.includes('cancer')) {
      waitingPeriods.push({
        condition: 'Cancer coverage',
        period: '24 months'
      });
    }

    return waitingPeriods;
  }

  private static predictAnnualClaims(patient: PatientHealthSummary): number {
    let baseClaims = 2;

    if (patient.chronicConditions.length > 0) {
      baseClaims += patient.chronicConditions.length * 2;
    }

    if (patient.age > 60) {
      baseClaims += 3;
    }

    if (patient.recentHospitalizations > 0) {
      baseClaims += patient.recentHospitalizations;
    }

    return Math.min(baseClaims, 15); // Cap at 15 claims per year
  }

  private static estimateAnnualCosts(patient: PatientHealthSummary): number {
    let baseCost = 3000;

    if (patient.chronicConditions.length > 0) {
      baseCost += patient.chronicConditions.length * 5000;
    }

    if (patient.age > 60) {
      baseCost += 7000;
    }

    if (patient.riskLevel === 'Critical') {
      baseCost *= 2.5;
    } else if (patient.riskLevel === 'High') {
      baseCost *= 1.8;
    } else if (patient.riskLevel === 'Moderate') {
      baseCost *= 1.3;
    }

    return Math.round(baseCost);
  }

  private static getPreventiveCareRecommendations(patient: PatientHealthSummary): string[] {
    const recommendations = [];

    if (patient.age > 40) {
      recommendations.push('Annual comprehensive health screening');
    }

    if (patient.chronicConditions.includes('diabetes')) {
      recommendations.push('Quarterly diabetes monitoring');
      recommendations.push('Annual eye and foot examinations');
    }

    if (patient.chronicConditions.includes('heart_disease')) {
      recommendations.push('Regular cardiology follow-ups');
      recommendations.push('Stress testing and cardiac imaging');
    }

    if (patient.lifestyleFactors.smoking) {
      recommendations.push('Smoking cessation programs');
      recommendations.push('Lung cancer screening');
    }

    if (patient.lifestyleFactors.exercise === 'Low') {
      recommendations.push('Physical therapy and exercise programs');
    }

    return recommendations;
  }

  static getAvailablePlans(): InsurancePlan[] {
    return insurancePlans;
  }

  static getPlanById(planId: string): InsurancePlan | undefined {
    return insurancePlans.find(plan => plan.id === planId);
  }

  static async getPatientsByRiskLevel(riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical'): Promise<PatientHealthSummary[]> {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_analytics')) {
      throw new Error('Insufficient permissions to view analytics');
    }

    const allPatients = Array.from(mockPatientHealthData.values());
    return allPatients.filter(patient => patient.riskLevel === riskLevel);
  }

  static async getInsuranceAnalytics() {
    // Check permissions
    if (!InsuranceAuthService.hasPermission('view_analytics')) {
      throw new Error('Insufficient permissions to view analytics');
    }

    const allPatients = Array.from(mockPatientHealthData.values());
    
    return {
      totalPatients: allPatients.length,
      riskDistribution: {
        low: allPatients.filter(p => p.riskLevel === 'Low').length,
        moderate: allPatients.filter(p => p.riskLevel === 'Moderate').length,
        high: allPatients.filter(p => p.riskLevel === 'High').length,
        critical: allPatients.filter(p => p.riskLevel === 'Critical').length,
      },
      averageRiskScore: allPatients.reduce((sum, p) => sum + p.riskScore, 0) / allPatients.length,
      totalClaimsValue: allPatients.reduce((sum, p) => sum + p.claimsHistory.totalAmount, 0),
      commonConditions: this.getCommonConditions(allPatients),
      averagePremiumByRisk: this.calculateAveragePremiumsByRisk(allPatients)
    };
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
      .slice(0, 10)
      .map(([condition, count]) => ({ condition, count }));
  }

  private static calculateAveragePremiumsByRisk(patients: PatientHealthSummary[]) {
    const riskGroups = {
      Low: patients.filter(p => p.riskLevel === 'Low'),
      Moderate: patients.filter(p => p.riskLevel === 'Moderate'),
      High: patients.filter(p => p.riskLevel === 'High'),
      Critical: patients.filter(p => p.riskLevel === 'Critical'),
    };

    const averages: { [key: string]: number } = {};

    Object.entries(riskGroups).forEach(([risk, patientsInRisk]) => {
      if (patientsInRisk.length > 0) {
        const recommendedPlan = this.recommendInsurancePlan(
          patientsInRisk.reduce((sum, p) => sum + p.riskScore, 0) / patientsInRisk.length
        );
        
        const totalPremiums = patientsInRisk.reduce((sum, patient) => {
          return sum + this.calculateAdjustedPremium(recommendedPlan.basePremium, patient);
        }, 0);
        
        averages[risk] = Math.round(totalPremiums / patientsInRisk.length);
      } else {
        averages[risk] = 0;
      }
    });

    return averages;
  }
}
