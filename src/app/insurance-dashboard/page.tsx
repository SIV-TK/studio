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

interface InsuranceSession {
  userId: string;
  email: string;
  name: string;
  companyName: string;
  role: string;
  department: string;
  permissions: string[];
  loginTime: number;
  expiresAt: number;
}

export default function InsuranceDashboardPage() {
  const [session, setSession] = useState<InsuranceSession | null>(null);
  const [patients, setPatients] = useState<PatientHealthSummary[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<PatientHealthSummary | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentSession = InsuranceAuthService.getSession();
    if (!currentSession) {
      router.push('/insurance-login');
      return;
    }

    setSession(currentSession);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsData, analyticsData] = await Promise.all([
        InsuranceDataService.getAllPatientsHealthSummary(),
        InsuranceDataService.getInsuranceAnalytics()
      ]);
      
      setPatients(patientsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patient: PatientHealthSummary) => {
    setSelectedPatient(patient);
    try {
      const analysis = await InsuranceDataService.analyzePatientRisk(patient.patientId);
      setRiskAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing patient risk:', error);
    }
  };

  const handleLogout = () => {
    InsuranceAuthService.logout();
    router.push('/insurance-login');
  };

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
          <p className="mt-4 text-gray-600">Loading insurance dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Insurance Analytics Portal</h1>
                <p className="text-sm text-gray-600">{session.companyName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/insurance-management')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Advanced Analysis
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.name}</p>
                <p className="text-xs text-gray-600">{session.role} • {session.department}</p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patient Data</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalPatients || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    In insurance database
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.averageRiskScore?.toFixed(1) || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Out of 100
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Claims Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics?.totalClaimsValue?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Historical claims
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(analytics?.riskDistribution?.high || 0) + (analytics?.riskDistribution?.critical || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Require special attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Risk Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Patient distribution across risk levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.riskDistribution && Object.entries(analytics.riskDistribution).map(([risk, count]) => (
                    <div key={risk} className="flex items-center">
                      <div className="w-20 text-sm font-medium capitalize">{risk}</div>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getRiskBadgeColor(risk).split(' ')[0]}`}
                            style={{ width: `${((count as number) / analytics.totalPatients) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-right">{count as number}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Health Database</CardTitle>
                <CardDescription>
                  Access to patient health records for insurance risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div
                      key={patient.patientId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium text-gray-900">{patient.name}</h3>
                            <p className="text-sm text-gray-600">
                              {patient.age} years old • {patient.gender} • {patient.chronicConditions.length} chronic conditions
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={getRiskBadgeColor(patient.riskLevel)}>
                          {patient.riskLevel} Risk
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium">Risk Score: {patient.riskScore}</div>
                          <div className="text-xs text-gray-600">
                            ${patient.claimsHistory.totalAmount.toLocaleString()} in claims
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk-analysis" className="space-y-6">
            {selectedPatient && riskAnalysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Risk Profile</CardTitle>
                    <CardDescription>{selectedPatient.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Risk Score</span>
                      <Badge className={getRiskBadgeColor(selectedPatient.riskLevel)}>
                        {riskAnalysis.overallRiskScore}/100
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Risk Factors</h4>
                      <div className="space-y-2">
                        {riskAnalysis.riskFactors.map((factor: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{factor.factor}</span>
                            <Badge variant="outline" className={
                              factor.impact === 'High' ? 'border-red-300 text-red-700' :
                              factor.impact === 'Medium' ? 'border-yellow-300 text-yellow-700' :
                              'border-green-300 text-green-700'
                            }>
                              {factor.impact}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Health Summary</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Chronic Conditions:</span> {selectedPatient.chronicConditions.join(', ') || 'None'}</p>
                        <p><span className="font-medium">Allergies:</span> {selectedPatient.allergies.join(', ') || 'None'}</p>
                        <p><span className="font-medium">Recent Hospitalizations:</span> {selectedPatient.recentHospitalizations}</p>
                        <p><span className="font-medium">Medication Compliance:</span> {selectedPatient.medicationCompliance}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Insurance Recommendations</CardTitle>
                    <CardDescription>AI-powered plan suggestions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Recommended Plan</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-900">{riskAnalysis.recommendations.planType}</div>
                        <div className="text-sm text-blue-700">
                          Monthly Premium: ${riskAnalysis.recommendations.premium}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Coverage Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {riskAnalysis.recommendations.coverage.map((coverage: string, index: number) => (
                          <Badge key={index} variant="secondary">{coverage}</Badge>
                        ))}
                      </div>
                    </div>

                    {riskAnalysis.recommendations.exclusions.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Exclusions</h4>
                        <ul className="text-sm space-y-1">
                          {riskAnalysis.recommendations.exclusions.map((exclusion: string, index: number) => (
                            <li key={index} className="text-red-600">• {exclusion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2">AI Cost Projections</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Predicted Annual Claims:</span>
                          <span className="font-medium">{riskAnalysis.aiInsights.predictedClaims}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Annual Cost:</span>
                          <span className="font-medium">${riskAnalysis.aiInsights.costEstimate.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  Select a patient from the Patients tab to view detailed risk analysis.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insurance Analytics</CardTitle>
                <CardDescription>
                  Advanced analytics and predictions for insurance underwriting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Common Health Conditions</h3>
                    <div className="space-y-2">
                      {analytics?.commonConditions?.slice(0, 8).map((condition: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="capitalize">{condition.condition.replace('_', ' ')}</span>
                          <Badge variant="outline">{condition.count} patients</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Average Premiums by Risk Level</h3>
                    <div className="space-y-2">
                      {analytics?.averagePremiumByRisk && Object.entries(analytics.averagePremiumByRisk).map(([risk, premium]) => (
                        <div key={risk} className="flex items-center justify-between">
                          <span className="capitalize">{risk} Risk</span>
                          <span className="font-medium">${(premium as number).toLocaleString()}/month</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">AI Recommendations</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Preventive Care Focus</h4>
                        <p className="text-sm text-green-800">
                          Implementing preventive care programs could reduce claims by 15-20% across the portfolio.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Risk-Based Pricing</h4>
                        <p className="text-sm text-blue-800">
                          Current risk distribution supports tiered pricing strategy with 4 distinct risk categories.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-2">High-Risk Patient Management</h4>
                        <p className="text-sm text-yellow-800">
                          {(analytics?.riskDistribution?.high || 0) + (analytics?.riskDistribution?.critical || 0)} patients require specialized case management.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
