'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InsuranceAuthService } from '@/lib/insurance-auth-service';
import { InsuranceDataService, PatientHealthSummary } from '@/lib/insurance-data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Type definition for the policy recommendation
interface InsurancePolicyRecommendation {
  patientId: string;
  patientName: string;
  recommendedPlan: {
    name: string;
    type: 'Basic' | 'Standard' | 'Premium' | 'Comprehensive';
    monthlyPremium: number;
    annualPremium: number;
    deductible: number;
    maxOutOfPocket: number;
    maxCoverage: number;
    coverage: {
      medical: number;
      hospital: number;
      prescription: number;
      preventive: number;
      mentalHealth: number;
      dental: number;
      vision: number;
    };
  };
  riskAssessment: {
    overallScore: number;
    level: string;
    factors: any[];
  };
  aiInsights: {
    summary: string;
    keyFindings: string[];
    costPredictions: any;
    preventiveRecommendations: string[];
    riskMitigationStrategies: string[];
  };
  policyCustomizations: {
    exclusions: string[];
    discountOpportunities: string[];
  };
  competitiveAnalysis: {
    differentiators: string[];
    marketPosition: string;
    pricingStrategy: string;
  };
}

export default function InsuranceManagementPage() {
  const [session, setSession] = useState<any>(null);
  const [patients, setPatients] = useState<PatientHealthSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientHealthSummary | null>(null);
  const [policyRecommendation, setPolicyRecommendation] = useState<InsurancePolicyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const currentSession = InsuranceAuthService.getSession();
    if (!currentSession) {
      router.push('/insurance-login');
      return;
    }

    setSession(currentSession);
    loadPatients();
  }, [router]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patientsData = await InsuranceDataService.getAllPatientsHealthSummary();
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientAnalysis = async (patient: PatientHealthSummary) => {
    setSelectedPatient(patient);
    setAnalysisLoading(true);
    setPolicyRecommendation(null);

    try {
      const patientData = {
        id: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        chronicConditions: patient.chronicConditions,
        allergies: patient.allergies,
        lifestyle: {
          smoking: patient.lifestyleFactors.smoking,
          alcohol: patient.lifestyleFactors.alcohol,
          exercise: patient.lifestyleFactors.exercise,
          diet: patient.lifestyleFactors.diet
        },
        familyHistory: patient.familyHistory,
        claimsHistory: patient.claimsHistory,
        labResults: [], // Would be populated from actual lab data
        vitals: {} // Would be populated from actual vitals
      };

      // Call the API route instead of direct import
      const response = await fetch('/api/insurance/policy-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error('Failed to get policy recommendation');
      }

      const recommendation = await response.json();
      setPolicyRecommendation(recommendation);
    } catch (error) {
      console.error('Error analyzing patient:', error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.chronicConditions.some(condition => 
                           condition.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insurance management system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/insurance-dashboard')}
                className="mr-4"
              >
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Insurance Management</h1>
                <p className="text-sm text-gray-600">Patient Analysis & Policy Recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session?.name}</p>
                <p className="text-xs text-gray-600">{session?.companyName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Patient Database</CardTitle>
                <CardDescription>
                  Select a patient for detailed insurance analysis
                </CardDescription>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search Patients</Label>
                    <Input
                      id="search"
                      placeholder="Search by name or condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="risk-filter">Filter by Risk Level</Label>
                    <select
                      id="risk-filter"
                      className="w-full p-2 border rounded-md"
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                    >
                      <option value="all">All Risk Levels</option>
                      <option value="Low">Low Risk</option>
                      <option value="Moderate">Moderate Risk</option>
                      <option value="High">High Risk</option>
                      <option value="Critical">Critical Risk</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.patientId}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatient?.patientId === patient.patientId
                          ? 'bg-indigo-50 border-indigo-300'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handlePatientAnalysis(patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{patient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {patient.age}y • {patient.chronicConditions.length} conditions
                          </p>
                        </div>
                        <Badge className={getRiskBadgeColor(patient.riskLevel)}>
                          {patient.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              analysisLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Analyzing patient data with AI...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : policyRecommendation ? (
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="policy">Policy</TabsTrigger>
                    <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                    <TabsTrigger value="insights">AI Insights</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedPatient.name} - Insurance Profile</CardTitle>
                          <CardDescription>
                            Comprehensive analysis for {session?.companyName}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Patient Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Age:</span>
                                  <span>{selectedPatient.age} years</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Gender:</span>
                                  <span className="capitalize">{selectedPatient.gender}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Risk Level:</span>
                                  <Badge className={getRiskBadgeColor(selectedPatient.riskLevel)}>
                                    {selectedPatient.riskLevel}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Risk Score:</span>
                                  <span>{policyRecommendation.riskAssessment.overallScore}/100</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Health Summary</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Conditions:</span>
                                  <div className="mt-1">
                                    {selectedPatient.chronicConditions.length > 0 ? (
                                      selectedPatient.chronicConditions.map((condition, index) => (
                                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                                          {condition.replace('_', ' ')}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">None</span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Claims History:</span>
                                  <p className="text-gray-600">
                                    {selectedPatient.claimsHistory.totalClaims} claims • 
                                    ${selectedPatient.claimsHistory.totalAmount.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Policy Tab */}
                  <TabsContent value="policy">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommended Insurance Policy</CardTitle>
                        <CardDescription>AI-generated policy recommendation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                            <h3 className="text-xl font-bold text-indigo-900">
                              {policyRecommendation.recommendedPlan.name}
                            </h3>
                            <p className="text-indigo-700">
                              {policyRecommendation.recommendedPlan.type} Coverage Plan
                            </p>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-2xl font-bold text-indigo-900">
                                  ${policyRecommendation.recommendedPlan.monthlyPremium}
                                </div>
                                <div className="text-sm text-indigo-600">Monthly Premium</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-indigo-900">
                                  ${policyRecommendation.recommendedPlan.annualPremium.toLocaleString()}
                                </div>
                                <div className="text-sm text-indigo-600">Annual Premium</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Coverage Details</h4>
                              <div className="space-y-2">
                                {Object.entries(policyRecommendation.recommendedPlan.coverage).map(([type, percentage]) => (
                                  <div key={type} className="flex justify-between text-sm">
                                    <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="font-medium">{percentage}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Policy Terms</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Deductible:</span>
                                  <span className="font-medium">${policyRecommendation.recommendedPlan.deductible.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Max Out-of-Pocket:</span>
                                  <span className="font-medium">${policyRecommendation.recommendedPlan.maxOutOfPocket.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Max Coverage:</span>
                                  <span className="font-medium">${policyRecommendation.recommendedPlan.maxCoverage.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {policyRecommendation.policyCustomizations.exclusions.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">Policy Exclusions</h4>
                              <ul className="text-sm space-y-1">
                                {policyRecommendation.policyCustomizations.exclusions.map((exclusion, index) => (
                                  <li key={index} className="text-red-600">• {exclusion}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {policyRecommendation.policyCustomizations.discountOpportunities.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">Available Discounts</h4>
                              <div className="space-y-2">
                                {policyRecommendation.policyCustomizations.discountOpportunities.map((discount, index) => (
                                  <div key={index} className="p-2 bg-green-50 rounded text-sm text-green-800">
                                    {discount}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Risk Analysis Tab */}
                  <TabsContent value="risk">
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed Risk Analysis</CardTitle>
                        <CardDescription>Comprehensive risk assessment breakdown</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-3">Risk Factor Breakdown</h4>
                            <div className="space-y-3">
                              {Object.entries(policyRecommendation.riskAssessment.factors).map(([factor, score]) => (
                                <div key={factor} className="flex items-center">
                                  <div className="w-24 text-sm font-medium capitalize">
                                    {factor.replace(/([A-Z])/g, ' $1')}
                                  </div>
                                  <div className="flex-1 mx-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-red-500"
                                        style={{ width: `${(score as number / 50) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="w-12 text-sm text-right">{score}/50</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Cost Predictions</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-900">
                                  ${policyRecommendation.aiInsights.costPredictions.year1.toLocaleString()}
                                </div>
                                <div className="text-sm text-blue-600">Year 1</div>
                              </div>
                              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-900">
                                  ${policyRecommendation.aiInsights.costPredictions.year3.toLocaleString()}
                                </div>
                                <div className="text-sm text-yellow-600">Year 3</div>
                              </div>
                              <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-900">
                                  ${policyRecommendation.aiInsights.costPredictions.year5.toLocaleString()}
                                </div>
                                <div className="text-sm text-red-600">Year 5</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Risk Mitigation Strategies</h4>
                            <div className="space-y-3">
                              {policyRecommendation.aiInsights.riskMitigationStrategies.map((strategy, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                                  {strategy}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* AI Insights Tab */}
                  <TabsContent value="insights">
                    <Card>
                      <CardHeader>
                        <CardTitle>AI-Powered Insights</CardTitle>
                        <CardDescription>Advanced analytics and recommendations</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-3">AI Summary</h4>
                            <p className="text-gray-700 leading-relaxed">
                              {policyRecommendation.aiInsights.summary}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Key Findings</h4>
                            <ul className="space-y-2">
                              {policyRecommendation.aiInsights.keyFindings.map((finding, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                  <span className="text-gray-700">{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Preventive Care Recommendations</h4>
                            <div className="grid gap-3">
                              {policyRecommendation.aiInsights.preventiveRecommendations.map((recommendation, index) => (
                                <div key={index} className="p-3 bg-green-50 rounded-lg">
                                  <p className="text-green-800 text-sm">{recommendation}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Competitive Analysis</h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-900 mb-2">Market Position</h5>
                                <p className="text-blue-800 text-sm">{policyRecommendation.competitiveAnalysis.marketPosition}</p>
                              </div>
                              
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <h5 className="font-medium text-purple-900 mb-2">Pricing Strategy</h5>
                                <p className="text-purple-800 text-sm">{policyRecommendation.competitiveAnalysis.pricingStrategy}</p>
                              </div>

                              <div className="p-4 bg-indigo-50 rounded-lg">
                                <h5 className="font-medium text-indigo-900 mb-2">Differentiators</h5>
                                <ul className="text-indigo-800 text-sm space-y-1">
                                  {policyRecommendation.competitiveAnalysis.differentiators.map((diff, index) => (
                                    <li key={index}>• {diff}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Alert>
                  <AlertDescription>
                    Analysis complete. Please review the results in the tabs above.
                  </AlertDescription>
                </Alert>
              )
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                    <p className="text-gray-600">
                      Choose a patient from the list to generate a comprehensive insurance analysis and policy recommendation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
