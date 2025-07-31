'use client';

import { useState, useEffect } from 'react';
import { labResultsService, PatientLabPortal } from '@/lib/lab-results-service';
import { mockLabResults } from '@/lib/mock-lab-data';
import { 
  Beaker, 
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Cpu,
  TrendingUp,
  TrendingDown,
  Heart,
  Brain
} from 'lucide-react';

interface PatientLabResultsProps {
  patientId: string;
}

export function PatientLabResults({ patientId }: PatientLabResultsProps) {
  const [labPortal, setLabPortal] = useState<PatientLabPortal | null>(null);
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    loadPatientLabData();
  }, [patientId]);

  const loadPatientLabData = async () => {
    try {
      // For demonstration, create mock patient lab portal data
      const patientResults = mockLabResults.filter(r => r.patientId === patientId);
      
      const mockPortal: PatientLabPortal = {
        patientId,
        labResults: patientResults.map(result => ({
          id: result.id!,
          testName: result.testName,
          value: `${result.value} ${result.unit}`,
          status: result.status === 'pending' ? 'normal' : result.status as 'normal' | 'abnormal' | 'critical',
          resultDate: result.resultDate,
          aiExplanation: result.aiAnalysis?.interpretation || 'Your test results have been processed',
          patientFriendlyInterpretation: result.aiAnalysis?.patientEducation?.[0] || 'Consult with your healthcare provider about these results',
          actionRequired: result.status === 'critical' || result.status === 'abnormal',
          recommendations: result.aiAnalysis?.lifestyleRecommendations || []
        })),
        labHistory: [
          {
            testName: 'Blood Glucose',
            results: [
              { date: '2024-07-25', value: '110 mg/dL', status: 'abnormal' },
              { date: '2024-06-25', value: '105 mg/dL', status: 'abnormal' },
              { date: '2024-05-25', value: '95 mg/dL', status: 'normal' }
            ],
            trend: 'concerning'
          },
          {
            testName: 'White Blood Cell Count',
            results: [
              { date: '2024-07-25', value: '6,800 cells/μL', status: 'normal' },
              { date: '2024-06-25', value: '6,500 cells/μL', status: 'normal' },
              { date: '2024-05-25', value: '6,200 cells/μL', status: 'normal' }
            ],
            trend: 'stable'
          }
        ],
        aiInsights: {
          overallHealthStatus: patientResults.some(r => r.status === 'critical') ? 
            'Requires immediate attention' : 
            patientResults.some(r => r.status === 'abnormal') ? 
            'Some areas need monitoring' : 'Generally healthy',
          keyFindings: patientResults
            .filter(r => r.status !== 'normal')
            .map(r => `${r.testName}: ${r.status}`),
          riskFactors: patientResults.some(r => r.status !== 'normal') ? 
            ['Abnormal lab values detected', 'Follow-up recommended'] : [],
          recommendations: [
            'Continue regular health monitoring',
            'Follow healthcare provider recommendations',
            'Maintain healthy lifestyle habits'
          ],
          followUpNeeded: patientResults.some(r => r.status !== 'normal'),
          urgentAttentionRequired: patientResults.some(r => r.status === 'critical')
        },
        upcomingTests: [
          {
            testName: '3-Month Follow-up Glucose Test',
            scheduledDate: '2024-10-25',
            preparationInstructions: ['Fast for 8-12 hours before test'],
            reason: 'Monitor blood sugar control'
          }
        ]
      };
      
      setLabPortal(mockPortal);
    } catch (error) {
      console.error('Error loading patient lab data:', error);
    }
  };

  if (!labPortal) {
    return (
      <div className="text-center py-12">
        <Beaker className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Loading Your Lab Results...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Lab Results</h2>
        <p className="text-gray-600">AI-powered insights into your health</p>
      </div>

      {/* AI Health Status Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-purple-600" />
          <h3 className="text-xl font-semibold text-purple-800">AI Health Insights</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Overall Health Status</h4>
              <p className={`text-lg font-semibold ${
                labPortal.aiInsights.urgentAttentionRequired ? 'text-red-600' :
                labPortal.aiInsights.followUpNeeded ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {labPortal.aiInsights.overallHealthStatus}
              </p>
            </div>
            
            {labPortal.aiInsights.keyFindings.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
                <ul className="space-y-1">
                  {labPortal.aiInsights.keyFindings.map((finding, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-yellow-600">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
              <ul className="space-y-1">
                {labPortal.aiInsights.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex space-x-1 bg-gray-100 p-1">
          {[
            { id: 'results', label: 'Recent Results', icon: Beaker },
            { id: 'history', label: 'Trends & History', icon: BarChart3 },
            { id: 'upcoming', label: 'Upcoming Tests', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Recent Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Lab Results</h3>
              
              <div className="grid gap-4">
                {labPortal.labResults.map((result) => (
                  <div key={result.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{result.testName}</h4>
                        <p className="text-gray-600">Result: <span className="font-medium">{result.value}</span></p>
                        <p className="text-sm text-gray-500">
                          {new Date(result.resultDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.status === 'critical' ? 'bg-red-100 text-red-800' :
                          result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {result.status}
                        </span>
                        {result.actionRequired && (
                          <p className="text-xs text-red-600 mt-1">Action Required</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">AI Explanation</span>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">{result.aiExplanation}</p>
                      <p className="text-sm text-blue-600">{result.patientFriendlyInterpretation}</p>
                    </div>
                    
                    {result.recommendations.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                        <ul className="space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <Heart className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends & History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Health Trends & History</h3>
              
              <div className="grid gap-6">
                {labPortal.labHistory.map((history, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">{history.testName}</h4>
                      <div className="flex items-center gap-2">
                        {history.trend === 'improving' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : history.trend === 'concerning' ? (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        ) : (
                          <div className="h-5 w-5 bg-gray-400 rounded-full" />
                        )}
                        <span className={`text-sm font-medium ${
                          history.trend === 'improving' ? 'text-green-600' :
                          history.trend === 'concerning' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {history.trend}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {history.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-sm text-gray-600">{new Date(result.date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{result.value}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.status === 'critical' ? 'bg-red-100 text-red-800' :
                              result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {result.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tests Tab */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Upcoming Lab Tests</h3>
              
              {labPortal.upcomingTests.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Tests</h4>
                  <p className="text-gray-600">You have no scheduled lab tests at this time.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {labPortal.upcomingTests.map((test, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-blue-900">{test.testName}</h4>
                          <p className="text-blue-700">Scheduled: {new Date(test.scheduledDate).toLocaleDateString()}</p>
                        </div>
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <p className="text-sm text-blue-800 mb-3">{test.reason}</p>
                      
                      {test.preparationInstructions.length > 0 && (
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">Preparation Instructions</h5>
                          <ul className="space-y-1">
                            {test.preparationInstructions.map((instruction, idx) => (
                              <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
