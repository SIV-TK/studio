'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { 
  Heart, 
  Brain, 
  Activity, 
  User, 
  RefreshCw, 
  Monitor, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Thermometer
} from 'lucide-react';

interface ICUPatient {
  id: string;
  name: string;
  age: number;
  condition: string;
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Stable';
  admissionDate: string;
  vitals: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    oxygenSaturation: number;
    temperature: number;
    respiratoryRate: number;
    centralVenousPressure: number;
    ph: number;
    pco2: number;
    po2: number;
    lactate: number;
    glucose: number;
  };
  medications: Array<{
    name: string;
    dosage: string;
    route: string;
    frequency: string;
  }>;
  connectedSystems: string[];
  aiAnalysis?: {
    confidence: number;
    riskFactors: string[];
    recommendations: string[];
  };
}

interface ConnectedSystem {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline' | 'Warning';
  lastUpdate: string;
}

const mockPatients: ICUPatient[] = [
  {
    id: 'icu-001',
    name: 'Sarah Johnson',
    age: 45,
    condition: 'Acute Respiratory Distress Syndrome (ARDS)',
    severity: 'Critical',
    admissionDate: '2024-01-15',
    vitals: {
      heartRate: 115,
      bloodPressure: { systolic: 85, diastolic: 55 },
      oxygenSaturation: 88,
      temperature: 38.2,
      respiratoryRate: 28,
      centralVenousPressure: 12,
      ph: 7.25,
      pco2: 55,
      po2: 65,
      lactate: 3.2,
      glucose: 180
    },
    medications: [
      { name: 'Norepinephrine', dosage: '0.15 mcg/kg/min', route: 'IV', frequency: 'Continuous' },
      { name: 'Propofol', dosage: '50 mg/hr', route: 'IV', frequency: 'Continuous' },
      { name: 'Fentanyl', dosage: '100 mcg/hr', route: 'IV', frequency: 'Continuous' }
    ],
    connectedSystems: ['philips-mx800', 'drager-evita', 'abbott-istat'],
    aiAnalysis: {
      confidence: 87,
      riskFactors: ['Severe hypoxemia', 'Acidosis', 'Hypotension'],
      recommendations: ['Consider ECMO', 'Increase PEEP', 'Fluid resuscitation']
    }
  },
  {
    id: 'icu-002',
    name: 'Michael Chen',
    age: 62,
    condition: 'Post-operative Cardiac Surgery',
    severity: 'Severe',
    admissionDate: '2024-01-16',
    vitals: {
      heartRate: 95,
      bloodPressure: { systolic: 110, diastolic: 70 },
      oxygenSaturation: 96,
      temperature: 36.8,
      respiratoryRate: 18,
      centralVenousPressure: 8,
      ph: 7.38,
      pco2: 42,
      po2: 95,
      lactate: 1.8,
      glucose: 145
    },
    medications: [
      { name: 'Milrinone', dosage: '0.5 mcg/kg/min', route: 'IV', frequency: 'Continuous' },
      { name: 'Heparin', dosage: '1000 units/hr', route: 'IV', frequency: 'Continuous' },
      { name: 'Furosemide', dosage: '5 mg/hr', route: 'IV', frequency: 'Continuous' }
    ],
    connectedSystems: ['philips-mx800', 'fresenius-dialysis'],
    aiAnalysis: {
      confidence: 92,
      riskFactors: ['Post-surgical bleeding risk', 'Mild heart failure'],
      recommendations: ['Monitor cardiac output', 'Continue diuresis', 'Watch for arrhythmias']
    }
  }
];

const mockSystems: ConnectedSystem[] = [
  {
    id: 'philips-mx800',
    name: 'Philips MX800 Patient Monitor',
    type: 'Monitoring',
    status: 'Online',
    lastUpdate: '2024-01-17 14:32:15'
  },
  {
    id: 'drager-evita',
    name: 'Dräger Evita V500 Ventilator',
    type: 'Ventilation',
    status: 'Online',
    lastUpdate: '2024-01-17 14:32:10'
  },
  {
    id: 'abbott-istat',
    name: 'Abbott i-STAT Blood Analyzer',
    type: 'Laboratory',
    status: 'Online',
    lastUpdate: '2024-01-17 14:31:45'
  },
  {
    id: 'fresenius-dialysis',
    name: 'Fresenius MultiFilterPRO',
    type: 'Dialysis',
    status: 'Warning',
    lastUpdate: '2024-01-17 14:30:22'
  }
];

interface FormData {
  primaryCondition: string;
  vitals: string;
  labValues: string;
  medications: string;
  clinicalNotes: string;
  recommendations: string;
}

export default function ICUMonitoringForm() {
  const [selectedPatient, setSelectedPatient] = useState<ICUPatient | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [connectedSystems] = useState<ConnectedSystem[]>(mockSystems);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const form = useForm<FormData>({
    defaultValues: {
      primaryCondition: '',
      vitals: '',
      labValues: '',
      medications: '',
      clinicalNotes: '',
      recommendations: ''
    }
  });

  // Auto-populate form when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      fetchRealTimeData();
    }
  }, [selectedPatient]);

  const fetchRealTimeData = async () => {
    if (!selectedPatient) return;
    
    setFetchingData(true);
    
    // Simulate real-time data fetching
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Auto-populate Primary Condition
    form.setValue('primaryCondition', selectedPatient.condition);
    
    // Auto-populate Current Vital Signs
    const vitalsText = [
      `Heart Rate: ${selectedPatient.vitals.heartRate} bpm (Philips MX800, ${new Date().toLocaleTimeString()})`,
      `Blood Pressure: ${selectedPatient.vitals.bloodPressure.systolic}/${selectedPatient.vitals.bloodPressure.diastolic} mmHg`,
      `SpO2: ${selectedPatient.vitals.oxygenSaturation}% (Philips MX800)`,
      `Temperature: ${selectedPatient.vitals.temperature}°C`,
      `Respiratory Rate: ${selectedPatient.vitals.respiratoryRate}/min`,
      `Central Venous Pressure: ${selectedPatient.vitals.centralVenousPressure} mmHg`
    ].join('\\n');
    
    form.setValue('vitals', vitalsText);
    
    // Auto-populate Laboratory Values
    const pfratio = Math.round((selectedPatient.vitals.po2 / (selectedPatient.vitals.oxygenSaturation / 100)) * 10) / 10;
    const labText = [
      `Blood Gas Analysis (Abbott i-STAT, ${new Date().toLocaleTimeString()}):`,
      `• pH: ${selectedPatient.vitals.ph}`,
      `• PCO2: ${selectedPatient.vitals.pco2} mmHg`,
      `• PO2: ${selectedPatient.vitals.po2} mmHg`,
      `• P/F Ratio: ${pfratio}`,
      `• Lactate: ${selectedPatient.vitals.lactate} mmol/L`,
      `• Glucose: ${selectedPatient.vitals.glucose} mg/dL`
    ].join('\\n');
    
    form.setValue('labValues', labText);
    
    // Auto-populate Current Medications & Drips
    const medicationsText = selectedPatient.medications.map(med => 
      `• ${med.name}: ${med.dosage} ${med.route} ${med.frequency}`
    ).join('\\n');
    
    form.setValue('medications', medicationsText);
    
    setFetchingData(false);
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis = `## AI ICU Assessment Report
**Patient**: ${selectedPatient?.name}
**Generated**: ${new Date().toLocaleString()}

### Risk Stratification
- **Overall Risk Score**: ${selectedPatient?.aiAnalysis?.confidence || 87}%
- **Severity Level**: ${selectedPatient?.severity}
- **Trending**: Stable with monitoring required

### Key Clinical Findings
1. **Hemodynamic Status**: ${selectedPatient?.vitals.bloodPressure.systolic < 90 ? 'Hypotensive - requires intervention' : 'Stable'}
2. **Respiratory Function**: ${selectedPatient?.vitals.oxygenSaturation < 92 ? 'Concerning - consider ventilator adjustments' : 'Adequate'}
3. **Metabolic Profile**: ${selectedPatient?.vitals.lactate > 2 ? 'Elevated lactate indicates tissue hypoperfusion' : 'Normal'}

### Real-Time System Integration
- **Philips MX800**: Continuous vital sign monitoring active
- **Abbott i-STAT**: Latest lab values integrated
- **Connected Devices**: ${selectedPatient?.connectedSystems.length || 0} systems online

### AI Recommendations
${selectedPatient?.aiAnalysis?.recommendations?.map(rec => `• ${rec}`).join('\\n') || '• Continue current monitoring\\n• Regular reassessment every 2 hours'}

### Immediate Actions Required
- Monitor trends closely over next 4 hours
- Consider medication adjustment if vitals deteriorate
- Ensure all connected systems remain operational

*This assessment was generated using real-time data from connected ICU systems.*`;

    setAnalysisResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Severe': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSystemStatusIcon = (status: string) => {
    switch (status) {
      case 'Online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Offline': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Monitor className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI ICU Monitoring & Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedPatient ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Patient for AI Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className="p-4 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      </div>
                      <Badge className={getSeverityColor(patient.severity)}>
                        {patient.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{patient.condition}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span>{patient.vitals.heartRate} bpm</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-blue-500" />
                        <span>{patient.vitals.oxygenSaturation}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-orange-500" />
                        <span>{patient.vitals.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Monitor className="h-3 w-3 text-green-500" />
                        <span>{patient.connectedSystems.length} systems</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                    <p className="text-gray-600">Age: {selectedPatient.age} • Admitted: {selectedPatient.admissionDate}</p>
                  </div>
                  <Badge className={getSeverityColor(selectedPatient.severity)}>
                    {selectedPatient.severity}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={fetchRealTimeData}
                  disabled={fetchingData}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-5 w-5 ${fetchingData ? 'animate-spin' : ''} text-green-600`} />
                  {fetchingData ? 'Fetching Data...' : 'Refresh Data'}
                </Button>
              </div>

              {/* Connected Systems Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Connected Systems
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {connectedSystems.map((system) => (
                      <div
                        key={system.id}
                        className="p-3 border rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getSystemStatusIcon(system.status)}
                          <div>
                            <p className="font-medium text-sm">{system.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {system.lastUpdate}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={system.status === 'Online' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {system.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Assessment Form */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="primaryCondition">Primary Condition</Label>
                    <Input
                      id="primaryCondition"
                      {...form.register('primaryCondition')}
                      placeholder="Auto-populated from patient data"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {fetchingData ? 'Loading from patient records...' : 'Fetched from patient overview'}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="vitals">Current Vital Signs</Label>
                    <Textarea
                      id="vitals"
                      {...form.register('vitals')}
                      placeholder="Auto-populated from connected monitors"
                      rows={6}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {fetchingData ? 'Loading from Philips MX800...' : 'Real-time data from connected monitors'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="labValues">Laboratory Values</Label>
                    <Textarea
                      id="labValues"
                      {...form.register('labValues')}
                      placeholder="Auto-populated from lab analyzers"
                      rows={6}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {fetchingData ? 'Loading from Abbott i-STAT...' : 'Latest results from blood analyzers'}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="medications">Current Medications & Drips</Label>
                    <Textarea
                      id="medications"
                      {...form.register('medications')}
                      placeholder="Auto-populated from medication systems"
                      rows={6}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {fetchingData ? 'Loading from medication systems...' : 'Current active medications and infusions'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="clinicalNotes">Additional Clinical Notes</Label>
                  <Textarea
                    id="clinicalNotes"
                    {...form.register('clinicalNotes')}
                    placeholder="Enter any additional observations or concerns"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing || fetchingData}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-5 w-5 mr-2 animate-pulse" />
                      AI Analyzing Patient Data...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Generate AI Assessment & Recommendations
                    </>
                  )}
                </Button>

                {/* AI Analysis Results */}
                {analysisResult && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-6 w-6" />
                        AI Assessment Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="recommendations">AI Recommendations</Label>
                        <Textarea
                          id="recommendations"
                          {...form.register('recommendations')}
                          placeholder="AI recommendations will appear here"
                          rows={4}
                          className="mt-1"
                          defaultValue="Based on current data and connected systems analysis, recommend continued monitoring with attention to hemodynamic stability and respiratory function. Consider medication adjustments if trends deteriorate."
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedPatient(null)}
                    className="flex-1"
                  >
                    Select Different Patient
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Assessment
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
