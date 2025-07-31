'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Beaker, 
  ClipboardList, 
  Cpu, 
  Upload, 
  Save, 
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Microscope,
  TestTube,
  ArrowLeft,
  Bot,
  Activity,
  Thermometer,
  Droplets,
  TrendingUp
} from 'lucide-react';

interface PatientProcessingProps {
  patient: {
    id: string;
    patientName: string;
    age: number;
    gender: string;
    department: string;
    testsOrdered: string[];
    priority: string;
    doctorName: string;
    orderDate: string;
  };
  onBack: () => void;
  onSubmit: (results: any) => void;
}

interface TestResult {
  testName: string;
  testCode: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'high' | 'low' | 'critical';
  notes: string;
}

interface MachineData {
  equipmentId: string;
  equipmentName: string;
  testType: string;
  rawData: any;
  calibrationStatus: 'valid' | 'needs_calibration';
  lastMaintenance: string;
}

export function LabProcessingInterface({ patient, onBack, onSubmit }: PatientProcessingProps) {
  const [currentStep, setCurrentStep] = useState<'specimen' | 'input' | 'ai_review' | 'submit'>('specimen');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [machineData, setMachineData] = useState<MachineData[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [specimenProcedures, setSpecimenProcedures] = useState<any>(null);
  const [isConnectingToMachines, setIsConnectingToMachines] = useState(false);
  const [selectedTest, setSelectedTest] = useState('');

  // Mock specimen procedures based on test type
  const getSpecimenProcedures = (testType: string) => {
    const procedures = {
      'Complete Blood Count': {
        specimenType: 'Whole Blood',
        collectionMethod: 'Venipuncture',
        container: 'EDTA Tube (Lavender Top)',
        volume: '3-5 mL',
        processing: [
          'Ensure proper mixing with anticoagulant',
          'Process within 4 hours of collection',
          'Store at room temperature',
          'Mix gently by inversion 8-10 times'
        ],
        qualityChecks: [
          'Check for clots in specimen',
          'Verify proper fill level',
          'Confirm patient identification',
          'Check tube expiration date'
        ]
      },
      'Basic Metabolic Panel': {
        specimenType: 'Serum',
        collectionMethod: 'Venipuncture',
        container: 'SST Tube (Gold Top)',
        volume: '2-3 mL',
        processing: [
          'Allow blood to clot for 30 minutes',
          'Centrifuge at 3000 RPM for 10 minutes',
          'Separate serum within 2 hours',
          'Store serum at 2-8°C if not analyzed immediately'
        ],
        qualityChecks: [
          'Check for hemolysis',
          'Verify adequate serum volume',
          'Confirm complete clotting',
          'Check for lipemia or icterus'
        ]
      },
      'Lipid Panel': {
        specimenType: 'Serum (Fasting)',
        collectionMethod: 'Venipuncture',
        container: 'SST Tube (Gold Top)',
        volume: '2-3 mL',
        processing: [
          'Patient must fast 9-12 hours before collection',
          'Allow blood to clot for 30 minutes',
          'Centrifuge at 3000 RPM for 10 minutes',
          'Separate serum and analyze within 4 hours'
        ],
        qualityChecks: [
          'Confirm patient fasting status',
          'Check for hemolysis (affects results)',
          'Verify clear, non-lipemic serum',
          'Document fasting duration'
        ]
      }
    };
    return procedures[testType as keyof typeof procedures] || procedures['Complete Blood Count'];
  };

  // Mock machine data fetching
  const fetchMachineData = async (testName: string) => {
    setIsConnectingToMachines(true);
    
    // Simulate API call to laboratory equipment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockMachineData: MachineData[] = [
      {
        equipmentId: 'SYSMEX-XN1000',
        equipmentName: 'Sysmex XN-1000 Hematology Analyzer',
        testType: 'Complete Blood Count',
        rawData: {
          WBC: '7.2',
          RBC: '4.8',
          HGB: '14.2',
          HCT: '42.1',
          PLT: '285'
        },
        calibrationStatus: 'valid',
        lastMaintenance: '2025-07-28'
      },
      {
        equipmentId: 'VITROS-5600',
        equipmentName: 'Vitros 5600 Chemistry System',
        testType: 'Basic Metabolic Panel',
        rawData: {
          GLU: '95',
          BUN: '18',
          CREAT: '1.0',
          NA: '140',
          K: '4.2',
          CL: '102',
          CO2: '24'
        },
        calibrationStatus: 'valid',
        lastMaintenance: '2025-07-25'
      }
    ];
    
    setMachineData(mockMachineData);
    setIsConnectingToMachines(false);
  };

  // AI assistance for specimen procedures
  const getAISpecimenGuidance = (testType: string) => {
    const guidance = {
      'Complete Blood Count': {
        criticalSteps: [
          'Verify patient identity using two identifiers',
          'Use proper venipuncture technique to avoid hemolysis',
          'Ensure adequate mixing with EDTA anticoagulant',
          'Process sample within 4 hours for accurate platelet count'
        ],
        commonErrors: [
          'Insufficient mixing leading to micro-clots',
          'Delayed processing affecting cell morphology',
          'Improper storage temperature'
        ],
        tips: [
          'Invert tube gently 8-10 times immediately after collection',
          'Store at room temperature, never refrigerate',
          'Check for clots before processing'
        ]
      }
    };
    return guidance[testType as keyof typeof guidance] || guidance['Complete Blood Count'];
  };

  // Generate AI analysis and recommendations
  const generateAIAnalysis = (results: TestResult[]) => {
    return {
      overallAssessment: 'Results show mild deviations in lipid profile requiring physician review',
      clinicalSignificance: 'Elevated cholesterol levels may indicate cardiovascular risk factors',
      recommendations: [
        'Recommend dietary counseling for lipid management',
        'Consider repeat testing in 3 months',
        'Monitor for metabolic syndrome markers'
      ],
      criticalValues: results.filter(r => r.flag === 'critical'),
      confidence: 94,
      additionalTests: [
        'HbA1c for diabetes screening',
        'Thyroid function tests'
      ]
    };
  };

  const handleTestResultChange = (index: number, field: keyof TestResult, value: string) => {
    const updatedResults = [...testResults];
    updatedResults[index] = { ...updatedResults[index], [field]: value };
    
    // Auto-determine flag based on value and reference range
    if (field === 'value') {
      // This would normally parse reference ranges and determine flags
      updatedResults[index].flag = 'normal'; // Simplified for demo
    }
    
    setTestResults(updatedResults);
  };

  const initializeTestResults = () => {
    const initialResults = patient.testsOrdered.map(test => ({
      testName: test,
      testCode: test.substring(0, 3).toUpperCase(),
      value: '',
      unit: '',
      referenceRange: '',
      flag: 'normal' as const,
      notes: ''
    }));
    setTestResults(initialResults);
  };

  useEffect(() => {
    initializeTestResults();
  }, [patient]);

  const renderSpecimenStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">AI Specimen Guidance</h3>
        </div>
        <p className="text-blue-700 mt-2">
          AI will guide you through proper specimen collection and processing procedures for optimal test results.
        </p>
      </div>

      <div className="grid gap-6">
        {patient.testsOrdered.map((test, index) => {
          const procedure = getSpecimenProcedures(test);
          const guidance = getAISpecimenGuidance(test);
          
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TestTube className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">{test}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Specimen Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type:</span> {procedure.specimenType}</p>
                    <p><span className="font-medium">Collection:</span> {procedure.collectionMethod}</p>
                    <p><span className="font-medium">Container:</span> {procedure.container}</p>
                    <p><span className="font-medium">Volume:</span> {procedure.volume}</p>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mt-4 mb-2">Processing Steps</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {procedure.processing.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">AI Quality Recommendations</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-green-700">Critical Steps</h5>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                        {guidance.criticalSteps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-red-700">Common Errors to Avoid</h5>
                      <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                        {guidance.commonErrors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h5 className="font-medium text-gray-900 mb-2">Quality Checklist</h5>
                <div className="grid grid-cols-2 gap-2">
                  {procedure.qualityChecks.map((check, i) => (
                    <label key={i} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{check}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep('input')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          Proceed to Testing <ArrowLeft className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </div>
  );

  const renderInputStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Test Results Input</h2>
        <button
          onClick={() => fetchMachineData('all')}
          disabled={isConnectingToMachines}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
        >
          {isConnectingToMachines ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Connecting to Machines...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Fetch from Lab Equipment
            </>
          )}
        </button>
      </div>

      {machineData.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Microscope className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Connected Equipment Data</h3>
          </div>
          <div className="grid gap-3">
            {machineData.map((machine, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{machine.equipmentName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    machine.calibrationStatus === 'valid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {machine.calibrationStatus}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Equipment ID: {machine.equipmentId}</p>
                  <p>Last Maintenance: {machine.lastMaintenance}</p>
                </div>
                <button
                  onClick={() => {
                    // Auto-populate results from machine data
                    const updatedResults = testResults.map(result => {
                      if (result.testName === machine.testType) {
                        return {
                          ...result,
                          ...Object.entries(machine.rawData).reduce((acc, [key, value]) => {
                            if (result.testCode === key) {
                              acc.value = value as string;
                            }
                            return acc;
                          }, {} as Partial<TestResult>)
                        };
                      }
                      return result;
                    });
                    setTestResults(updatedResults);
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Import Data →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{result.testName}</h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Value</label>
                <input
                  type="text"
                  value={result.value}
                  onChange={(e) => handleTestResultChange(index, 'value', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter result"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  value={result.unit}
                  onChange={(e) => handleTestResultChange(index, 'unit', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="mg/dL, g/dL, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Range</label>
                <input
                  type="text"
                  value={result.referenceRange}
                  onChange={(e) => handleTestResultChange(index, 'referenceRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 70-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flag</label>
                <select
                  value={result.flag}
                  onChange={(e) => handleTestResultChange(index, 'flag', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Technical Notes</label>
              <textarea
                value={result.notes}
                onChange={(e) => handleTestResultChange(index, 'notes', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={2}
                placeholder="Add any technical observations or notes..."
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('specimen')}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Specimen
        </button>
        <button
          onClick={() => {
            setAiSuggestions(generateAIAnalysis(testResults));
            setCurrentStep('ai_review');
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          AI Analysis <Cpu className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderAIReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-800">AI Analysis & Recommendations</h2>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {aiSuggestions?.confidence}% Confidence
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Overall Assessment</h3>
            <p className="text-gray-700 mb-4">{aiSuggestions?.overallAssessment}</p>
            
            <h3 className="font-semibold text-gray-900 mb-3">Clinical Significance</h3>
            <p className="text-gray-700">{aiSuggestions?.clinicalSignificance}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations for Doctor</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {aiSuggestions?.recommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
            
            <h3 className="font-semibold text-gray-900 mb-3 mt-4">Suggested Additional Tests</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {aiSuggestions?.additionalTests.map((test: string, index: number) => (
                <li key={index}>{test}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {aiSuggestions?.criticalValues.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Critical Values Detected</h3>
            </div>
            <div className="space-y-1">
              {aiSuggestions.criticalValues.map((value: TestResult, index: number) => (
                <p key={index} className="text-red-700 text-sm">
                  {value.testName}: {value.value} {value.unit} (Reference: {value.referenceRange})
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Results Summary</h3>
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <span className="font-medium">{result.testName}</span>
                <span className="text-gray-600 ml-2">
                  {result.value} {result.unit}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                result.flag === 'critical' ? 'bg-red-100 text-red-800' :
                result.flag === 'high' ? 'bg-orange-100 text-orange-800' :
                result.flag === 'low' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {result.flag}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('input')}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Input
        </button>
        <button
          onClick={() => setCurrentStep('submit')}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          Prepare Report <FileText className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderSubmitStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-400 p-6">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-green-800">Ready to Submit Comprehensive Report</h2>
        </div>
        <p className="text-green-700 mt-2">
          Complete lab analysis ready for doctor review with AI-powered recommendations
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
            <div className="text-sm space-y-1 text-gray-700">
              <p><span className="font-medium">Name:</span> {patient.patientName}</p>
              <p><span className="font-medium">Age:</span> {patient.age}</p>
              <p><span className="font-medium">Gender:</span> {patient.gender}</p>
              <p><span className="font-medium">Department:</span> {patient.department}</p>
              <p><span className="font-medium">Ordering Doctor:</span> {patient.doctorName}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Processing Information</h4>
            <div className="text-sm space-y-1 text-gray-700">
              <p><span className="font-medium">Lab Technician:</span> Current User</p>
              <p><span className="font-medium">Processing Date:</span> {new Date().toLocaleDateString()}</p>
              <p><span className="font-medium">AI Analysis:</span> {aiSuggestions?.confidence}% Confidence</p>
              <p><span className="font-medium">Quality Control:</span> Passed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor's Report Package</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Complete lab results with reference ranges</span>
          </div>
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>AI-generated clinical interpretation</span>
          </div>
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Treatment recommendations</span>
          </div>
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Suggested follow-up tests</span>
          </div>
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Critical value alerts (if any)</span>
          </div>
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>Quality control documentation</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('ai_review')}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Review
        </button>
        <button
          onClick={() => {
            const completeReport = {
              patient,
              results: testResults,
              aiAnalysis: aiSuggestions,
              technician: 'Current User',
              timestamp: new Date().toISOString(),
              status: 'completed'
            };
            onSubmit(completeReport);
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 flex items-center gap-2 font-semibold"
        >
          <Send className="h-5 w-5" />
          Submit to Doctor
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lab Processing - {patient.patientName}</h1>
                <p className="text-gray-600">Department: {patient.department} | Tests: {patient.testsOrdered.join(', ')}</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
              {[
                { id: 'specimen', label: 'Specimen', icon: TestTube },
                { id: 'input', label: 'Input Results', icon: ClipboardList },
                { id: 'ai_review', label: 'AI Review', icon: Cpu },
                { id: 'submit', label: 'Submit', icon: Send }
              ].map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep === step.id ? 'bg-blue-600 border-blue-600 text-white' :
                    ['specimen', 'input', 'ai_review', 'submit'].indexOf(currentStep) > index ? 'bg-green-600 border-green-600 text-white' :
                    'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep === step.id ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && <ArrowLeft className="h-4 w-4 text-gray-400 ml-4 rotate-180" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentStep === 'specimen' && renderSpecimenStep()}
        {currentStep === 'input' && renderInputStep()}
        {currentStep === 'ai_review' && renderAIReviewStep()}
        {currentStep === 'submit' && renderSubmitStep()}
      </div>
    </div>
  );
}
