'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Brain, 
  User, 
  Activity, 
  TestTube, 
  Pill, 
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Stethoscope
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/layout/main-layout';
import { useSession } from '@/hooks/use-session';
import { UserDataStore } from '@/lib/user-data-store';

// Schema for doctor input
const medicalAssessmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  chiefComplaint: z.string().min(10, 'Please describe the chief complaint in detail'),
  presentingSymptoms: z.string().min(10, 'Please describe current symptoms'),
  medicalHistory: z.string(),
  currentMedications: z.string(),
  allergies: z.string(),
  vitalSigns: z.object({
    bloodPressure: z.string(),
    heartRate: z.coerce.number().min(30).max(300),
    temperature: z.coerce.number().min(90).max(110),
    respiratoryRate: z.coerce.number().min(8).max(40),
    oxygenSaturation: z.coerce.number().min(70).max(100),
  }),
  labResults: z.string(),
  diagnosticTests: z.string(),
  clinicalFindings: z.string().min(5, 'Please enter clinical findings'),
});

interface AIRecommendation {
  diagnosis: string;
  confidence: number;
  treatmentPlan: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  followUp: string;
  warnings: string[];
  additionalTests: string[];
}

interface DepartmentProps {
  department: string;
  specialization: string;
  icon: React.ReactNode;
  color: string;
}

function MedicalDepartment({ department, specialization, icon, color }: DepartmentProps) {
  const isCardiology = department.toLowerCase() === 'cardiology';
  const [loading, setLoading] = useState(false);
  const [sendingToPharmacy, setSendingToPharmacy] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [doctorTreatment, setDoctorTreatment] = useState<any>(null);
  const [finalTreatment, setFinalTreatment] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [assignedPatients, setAssignedPatients] = useState<any[]>([]);
  const [aiSymptomAnalysis, setAiSymptomAnalysis] = useState<any>(null);
  const [analyzingSymptoms, setAnalyzingSymptoms] = useState(false);
  const [doctorDecision, setDoctorDecision] = useState<string>('');
  const [selectedLabPatient, setSelectedLabPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('assigned-patients');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [isAdmissionAnalysisCollapsed, setIsAdmissionAnalysisCollapsed] = useState(false);
  const [isAdmissionDataCollapsed, setIsAdmissionDataCollapsed] = useState(false);
  const [waitingForResults, setWaitingForResults] = useState<any[]>([]);
  const [labResults, setLabResults] = useState<any[]>([]);
  const [aiNotifications, setAiNotifications] = useState<any[]>([]);
  const { toast } = useToast();
  const { session } = useSession();

  const form = useForm<z.infer<typeof medicalAssessmentSchema>>({
    resolver: zodResolver(medicalAssessmentSchema),
    defaultValues: {
      patientId: '',
      chiefComplaint: '',
      presentingSymptoms: '',
      medicalHistory: '',
      currentMedications: '',
      allergies: '',
      vitalSigns: {
        bloodPressure: '',
        heartRate: 0,
        temperature: 0,
        respiratoryRate: 0,
        oxygenSaturation: 0,
      },
      labResults: '',
      diagnosticTests: '',
      clinicalFindings: '',
    },
  });

  // Load available patients and assigned patients
  useEffect(() => {
    // Load patients from patient management system
    const storedPatients = localStorage.getItem('patients') || '[]';
    try {
      const allPatients = JSON.parse(storedPatients);
      const departmentPatients = allPatients.filter((p: any) => p.department === department);
      setAssignedPatients(departmentPatients);
      setPatients(departmentPatients);
    } catch {
      setAssignedPatients([]);
      setPatients([]);
    }
  }, [department]);

  // Simulate lab results and AI notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingForResults(prev => {
        if (prev.length === 0) return prev;
        
        // Simulate random lab result completion
        const readyIndex = Math.floor(Math.random() * prev.length);
        const readyPatient = prev[readyIndex];
        
        if (readyPatient && Math.random() > 0.7) {
          // Generate mock lab results
          const mockResults = {
            ...readyPatient,
            resultsReady: new Date().toISOString(),
            status: 'results_ready',
            results: {
              'CBC': { value: '12.5 g/dL', status: 'Normal', critical: false },
              'Glucose': { value: '180 mg/dL', status: 'High', critical: true },
              'Creatinine': { value: '1.8 mg/dL', status: 'Elevated', critical: true }
            },
            aiAnalysis: {
              urgency: Math.random() > 0.5 ? 'Critical' : 'Normal',
              recommendation: 'Immediate attention required for elevated glucose and creatinine levels',
              riskScore: Math.floor(Math.random() * 100)
            }
          };
          
          setLabResults(prevResults => [...prevResults, mockResults]);
          
          // Generate AI notification for critical cases
          if (mockResults.aiAnalysis.urgency === 'Critical') {
            setAiNotifications(prevNotifs => [{
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              patientName: mockResults.name,
              message: `URGENT: ${mockResults.name} has critical lab values requiring immediate attention`,
              timestamp: new Date().toISOString(),
              priority: 'high',
              type: 'critical_results'
            }, ...prevNotifs]);
          }
          
          return prev.filter((_, index) => index !== readyIndex);
        }
        return prev;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Analyze symptoms with AI
  const analyzeSymptoms = async (symptoms: string, complaint: string) => {
    setAnalyzingSymptoms(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysis = {
      complexSymptoms: [
        'Chest pain with radiation to left arm',
        'Shortness of breath on exertion',
        'Palpitations with dizziness',
        'Fatigue with peripheral edema'
      ],
      possibleDiseases: [
        { name: 'Coronary Artery Disease', probability: 85, severity: 'High' },
        { name: 'Hypertensive Heart Disease', probability: 72, severity: 'Medium' },
        { name: 'Arrhythmia', probability: 68, severity: 'Medium' },
        { name: 'Heart Failure', probability: 45, severity: 'High' }
      ],
      recommendedTests: [
        'ECG - 12 Lead',
        'Echocardiogram',
        'Cardiac Enzymes (Troponin)',
        'Lipid Profile',
        'BNP/NT-proBNP'
      ],
      urgencyLevel: 'High',
      confidence: 78
    };
    
    setAiSymptomAnalysis(analysis);
    setAnalyzingSymptoms(false);
    return analysis;
  };

  // Generate AI recommendations based on input
  const generateAIRecommendation = async (data: any): Promise<AIRecommendation> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI recommendation based on symptoms and department
    const mockRecommendations: Record<string, AIRecommendation> = {
      cardiology: {
        diagnosis: 'Suspected Hypertensive Heart Disease',
        confidence: 85,
        treatmentPlan: 'ACE inhibitor therapy, lifestyle modifications, and regular monitoring',
        medications: [
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '3 months',
            instructions: 'Take in morning with water'
          },
          {
            name: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            duration: '3 months',
            instructions: 'Take with or without food'
          }
        ],
        followUp: 'Return in 2 weeks for blood pressure check and medication adjustment',
        warnings: ['Monitor for hypotension', 'Check kidney function in 1 week'],
        additionalTests: ['Echocardiogram', '24-hour Holter monitor']
      },
      emergency: {
        diagnosis: 'Acute condition requiring immediate attention',
        confidence: 90,
        treatmentPlan: 'Immediate stabilization and symptomatic treatment',
        medications: [
          {
            name: 'Normal Saline',
            dosage: '1000ml',
            frequency: 'IV infusion',
            duration: 'As needed',
            instructions: 'Monitor fluid balance'
          }
        ],
        followUp: 'Continuous monitoring required',
        warnings: ['Monitor vital signs every 15 minutes'],
        additionalTests: ['CBC', 'Basic metabolic panel', 'ECG']
      },
      default: {
        diagnosis: 'Comprehensive assessment needed',
        confidence: 75,
        treatmentPlan: 'Conservative management with close monitoring',
        medications: [
          {
            name: 'Symptomatic treatment',
            dosage: 'As appropriate',
            frequency: 'As needed',
            duration: 'Until symptoms resolve',
            instructions: 'Follow standard protocols'
          }
        ],
        followUp: 'Follow up in 1-2 weeks depending on symptom progression',
        warnings: ['Monitor for worsening symptoms'],
        additionalTests: ['Complete diagnostic workup as indicated']
      }
    };

    return mockRecommendations[department.toLowerCase()] || mockRecommendations.default;
  };

  const onSubmit = async (values: z.infer<typeof medicalAssessmentSchema>) => {
    setLoading(true);
    try {
      // Generate AI symptom analysis first
      const symptoms = values.presentingSymptoms;
      const complaint = values.chiefComplaint;
      if (symptoms && complaint) {
        await analyzeSymptoms(symptoms, complaint);
      }
      
      // Generate AI recommendation
      const aiRec = await generateAIRecommendation(values);
      setAiRecommendation(aiRec);

      // Auto-switch to AI analysis tab
      setTimeout(() => {
        setActiveTab('ai-analysis');
      }, 100);

      toast({
        title: 'Complete Analysis Ready',
        description: 'AI symptom analysis and recommendations generated.',
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI recommendations. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const submitDoctorAssessment = () => {
    if (!aiRecommendation) return;

    const doctorInput = {
      diagnosis: 'Doctor confirmed diagnosis',
      treatmentPlan: 'Refined treatment plan based on clinical experience',
      modifications: 'Adjusted dosages based on patient-specific factors',
      additionalConsiderations: 'Patient counseling on lifestyle modifications'
    };

    setDoctorTreatment(doctorInput);
    
    // Harmonize AI and doctor recommendations
    const harmonized = {
      finalDiagnosis: aiRecommendation.diagnosis,
      confidence: Math.min(aiRecommendation.confidence + 10, 95), // Doctor review increases confidence
      medications: aiRecommendation.medications,
      treatmentPlan: `${aiRecommendation.treatmentPlan}. ${doctorInput.treatmentPlan}`,
      followUp: aiRecommendation.followUp,
      warnings: aiRecommendation.warnings,
      doctorNotes: doctorInput.additionalConsiderations,
      approvedBy: session?.name || 'Doctor',
      approvedAt: new Date().toISOString(),
    };

    setFinalTreatment(harmonized);

    toast({
      title: 'Treatment Plan Finalized',
      description: 'AI and doctor recommendations have been harmonized.',
    });
  };

  const sendToPharmacy = async () => {
    if (!finalTreatment) return;

    setSendingToPharmacy(true);
    try {
      // Simulate sending to pharmacy system
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real implementation, this would:
      // 1. Create prescription records
      // 2. Send to pharmacy management system
      // 3. Update patient records
      // 4. Create audit trail

      const prescriptionData = {
        patientId: form.getValues('patientId'),
        prescriptions: finalTreatment.medications,
        prescribedBy: session?.name || 'Doctor',
        department: department,
        date: new Date().toISOString(),
        status: 'sent_to_pharmacy'
      };

      // Add to patient records
      if (form.getValues('patientId')) {
        await UserDataStore.addHealthRecord({
          userId: form.getValues('patientId'),
          type: 'appointment',
          data: {
            department,
            diagnosis: finalTreatment.finalDiagnosis,
            treatment: finalTreatment.treatmentPlan,
            prescriptions: prescriptionData.prescriptions,
            doctorName: session?.name || 'Doctor'
          },
          date: new Date().toISOString(),
          notes: `${department} consultation - prescriptions sent to pharmacy`
        });
      }

      toast({
        title: 'Sent to Pharmacy',
        description: 'Prescriptions have been successfully sent to the pharmacy department.',
      });

      // Reset form for next patient and return to assigned patients
      form.reset();
      setAiRecommendation(null);
      setDoctorTreatment(null);
      setFinalTreatment(null);
      setActiveTab('assigned-patients');

    } catch (error) {
      console.error('Error sending to pharmacy:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send prescriptions to pharmacy. Please try again.',
      });
    } finally {
      setSendingToPharmacy(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-4 rounded-full ${color}`}>
            {icon}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {department} Department
            </h1>
            <p className="text-xl text-gray-600">
              {specialization} • Doctor Assessment & AI-Powered Treatment Recommendations
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-blue-600">
                <Stethoscope className="h-4 w-4 mr-1" />
                Dr. {session?.name || 'Medical Professional'}
              </Badge>
            </div>
          </div>
        </div>

        {/* AI Smart Notifications - Always Visible */}
        {aiNotifications.length > 0 && (
          <Card className={`mb-6 ${isCardiology ? 'border-red-300 bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 shadow-lg' : 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'}`}>
            <CardHeader className="bg-red-100 border-b border-red-200">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                AI Smart Notifications ({aiNotifications.length})
              </CardTitle>
              <CardDescription className="text-red-700">
                Critical cases requiring immediate doctor attention
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {aiNotifications.map((notification, notifIndex) => (
                  <div key={`notification-${notification.id}-${notifIndex}`} className="p-3 bg-white rounded border-l-4 border-red-400 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">{notification.message}</p>
                        <p className="text-sm text-red-600">{new Date(notification.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        setAiNotifications(prev => prev.filter(n => n.id !== notification.id));
                        setActiveTab('laboratory-patients');
                      }}
                    >
                      Review Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="assigned-patients">1. Assigned Patients</TabsTrigger>
            <TabsTrigger value="assessment">2. Patient Assessment</TabsTrigger>
            <TabsTrigger value="ai-analysis" disabled={!aiRecommendation}>3. AI Analysis</TabsTrigger>
            <TabsTrigger value="doctor-review" disabled={!aiRecommendation}>4. Doctor Review</TabsTrigger>
            <TabsTrigger value="final-treatment" disabled={!finalTreatment}>5. Final Treatment</TabsTrigger>
            <TabsTrigger value="laboratory-patients" className="relative">
              Laboratory Monitor
              {waitingForResults.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">{waitingForResults.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Assigned Patients Tab */}
          <TabsContent value="assigned-patients" className="mt-8">
            <Card className={isCardiology ? 'border-red-200 bg-gradient-to-br from-white via-pink-50 to-rose-50 shadow-md' : ''}>
              <CardHeader className={isCardiology ? 'bg-gradient-to-r from-red-100 to-pink-100 border-b border-red-200' : ''}>
                <CardTitle className={`flex items-center gap-2 ${isCardiology ? 'text-red-800' : ''}`}>
                  <User className={`h-5 w-5 ${isCardiology ? 'text-red-600' : ''}`} />
                  Patients Assigned to {department}
                </CardTitle>
                <CardDescription>
                  Patients currently assigned to your department from admission
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Waiting for Results Section */}
                {waitingForResults.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Waiting for Laboratory Results ({waitingForResults.length})
                    </h3>
                    <div className="grid gap-3">
                      {waitingForResults.map((patient, waitingIndex) => (
                        <div key={`waiting-${patient.id}-${waitingIndex}`} className="p-3 border rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-100 rounded-full">
                                <Clock className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{patient.name}</h4>
                                <p className="text-sm text-gray-600">Sent: {new Date(patient.sentToLab).toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800">Waiting</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {assignedPatients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No patients currently assigned to {department}</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {assignedPatients.filter(p => !waitingForResults.find(w => w.id === p.id)).map((patient, patientIndex) => (
                      <div key={`assigned-${patient.id}-${patientIndex}`} className={`p-4 border rounded-lg transition-all ${isCardiology ? 'bg-gradient-to-r from-white via-pink-50 to-rose-50 hover:from-pink-100 hover:to-red-100 border-red-200 shadow-sm' : 'bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-indigo-50'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${isCardiology ? 'bg-red-100' : 'bg-blue-100'}`}>
                              <User className={`h-5 w-5 ${isCardiology ? 'text-red-600' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{patient.name}</h3>
                              <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
                              <p className="text-sm text-gray-500">{patient.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              {patient.priority}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Auto-fill all patient data
                                form.setValue('patientId', patient.id);
                                form.setValue('chiefComplaint', patient.symptoms || '');
                                form.setValue('presentingSymptoms', patient.symptoms || '');
                                form.setValue('vitalSigns.bloodPressure', patient.bloodPressure || '');
                                form.setValue('vitalSigns.heartRate', patient.heartRate || 0);
                                form.setValue('vitalSigns.temperature', patient.temperature ? (patient.temperature * 9/5 + 32) : 0);
                                form.setValue('vitalSigns.respiratoryRate', 16);
                                form.setValue('vitalSigns.oxygenSaturation', 98);
                                // Switch to assessment tab
                                setActiveTab('assessment');
                                toast({
                                  title: 'Patient Ready for Treatment',
                                  description: `${patient.name}'s admission data combined and AI analysis ready.`,
                                });
                              }}
                            >
                              Treat Patient
                            </Button>
                          </div>
                        </div>
                        {patient.symptoms && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded text-sm border border-yellow-200">
                            <strong className="text-yellow-800">Symptoms:</strong>
                            <span className="text-yellow-700 ml-2">{patient.symptoms}</span>
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                          <span>Admitted: {new Date(patient.admittedAt).toLocaleDateString()}</span>
                          {patient.bloodPressure && <span>BP: {patient.bloodPressure}</span>}
                          {patient.temperature && <span>Temp: {patient.temperature}°C</span>}
                          {patient.heartRate && <span>HR: {patient.heartRate} bpm</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Laboratory Patients Tab */}
          <TabsContent value="laboratory-patients" className="mt-8">


            <div className="grid md:grid-cols-2 gap-6">
              {/* Waiting for Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Waiting for Results ({waitingForResults.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {waitingForResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No patients waiting for lab results</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {waitingForResults.map((patient, waitingLabIndex) => (
                        <div key={`waiting-lab-${patient.id}-${waitingLabIndex}`} className="p-3 border rounded-lg bg-orange-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{patient.name}</h4>
                              <p className="text-sm text-gray-600">Sent: {new Date(patient.sentToLab).toLocaleTimeString()}</p>
                              <p className="text-xs text-orange-600">{patient.tests?.length || 0} tests ordered</p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800">Processing</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Ready */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Results Ready ({labResults.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {labResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No results ready yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {labResults.map((patient, labResultIndex) => (
                        <div key={`lab-result-${patient.id}-${labResultIndex}`} className={`p-3 border rounded-lg ${
                          patient.aiAnalysis.urgency === 'Critical' 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{patient.name}</h4>
                              <p className="text-sm text-gray-600">Ready: {new Date(patient.resultsReady).toLocaleTimeString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={patient.aiAnalysis.urgency === 'Critical' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                              }>
                                {patient.aiAnalysis.urgency}
                              </Badge>
                              <Badge variant="outline">Risk: {patient.aiAnalysis.riskScore}%</Badge>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            <strong>AI Analysis:</strong> {patient.aiAnalysis.recommendation}
                          </div>
                          <Button 
                            size="sm" 
                            className={patient.aiAnalysis.urgency === 'Critical' 
                              ? 'bg-red-600 hover:bg-red-700 w-full' 
                              : 'bg-green-600 hover:bg-green-700 w-full'
                            }
                            onClick={async () => {
                              // Load patient data with lab results
                              form.setValue('patientId', patient.id);
                              
                              // Generate AI analysis of lab results
                              const labAnalysis = {
                                diagnosis: patient.aiAnalysis.urgency === 'Critical' 
                                  ? 'Critical condition requiring immediate intervention'
                                  : 'Stable condition with treatment recommendations',
                                confidence: 92,
                                treatmentPlan: patient.aiAnalysis.urgency === 'Critical'
                                  ? 'Immediate stabilization and targeted therapy based on lab findings'
                                  : 'Conservative management with medication adjustment',
                                medications: patient.aiAnalysis.urgency === 'Critical'
                                  ? [
                                      { name: 'Insulin', dosage: '10 units', frequency: 'As needed', duration: 'Until stable', instructions: 'Monitor blood glucose' },
                                      { name: 'Furosemide', dosage: '40mg', frequency: 'Twice daily', duration: '7 days', instructions: 'Monitor kidney function' }
                                    ]
                                  : [
                                      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take with meals' },
                                      { name: 'Lisinopril', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Monitor blood pressure' }
                                    ],
                                followUp: 'Follow up in 1 week with repeat labs',
                                warnings: patient.aiAnalysis.urgency === 'Critical' 
                                  ? ['Monitor vital signs closely', 'Check kidney function daily']
                                  : ['Monitor for hypoglycemia', 'Regular blood pressure checks'],
                                additionalTests: [],
                                labResults: patient.results
                              };
                              
                              setAiRecommendation(labAnalysis);
                              setLabResults(prev => prev.filter(p => p.id !== patient.id));
                              
                              // Switch to doctor review tab
                              setActiveTab('doctor-review');
                              
                              toast({
                                title: 'Lab Results Ready for Review',
                                description: `${patient.name}'s results and AI analysis loaded for doctor review.`,
                              });
                            }}
                          >
                            Continue Treatment
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patient Assessment Tab */}
          <TabsContent value="assessment" className="mt-8">
            {/* Combined Patient Admission Data Card */}
            {form.getValues('patientId') && (
              <Card className="mb-6 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="bg-green-100 border-b border-green-200 cursor-pointer" onClick={() => setIsAdmissionDataCollapsed(!isAdmissionDataCollapsed)}>
                  <CardTitle className="text-green-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Patient Admission Data Summary
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-800 hover:bg-green-200">
                      {isAdmissionDataCollapsed ? '+' : '−'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {!isAdmissionDataCollapsed && (
                  <CardContent className="pt-4">
                  {(() => {
                    const selectedPatient = assignedPatients.find(p => p.id === form.getValues('patientId'));
                    if (!selectedPatient) return null;
                    return (
                      <div className="space-y-4">
                        {/* Patient Header */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full">
                              <User className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-green-900">{selectedPatient.name}</h3>
                              <p className="text-green-700">{selectedPatient.age} years • {selectedPatient.gender}</p>
                              <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-red-100 text-red-800 border-red-200">{selectedPatient.priority} Priority</Badge>
                            <Badge variant="outline" className="border-green-200 text-green-700">Active</Badge>
                          </div>
                        </div>

                        {/* Clinical Information Grid */}
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 bg-white rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Chief Complaint
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">{form.getValues('chiefComplaint') || 'Not provided'}</p>
                          </div>
                          
                          <div className="p-4 bg-white rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Presenting Symptoms
                            </h4>
                            <p className="text-gray-700 text-sm leading-relaxed">{form.getValues('presentingSymptoms') || 'Not provided'}</p>
                          </div>
                          
                          <div className="p-4 bg-white rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Admission Info
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Department:</span> {selectedPatient.department}</p>
                              <p><span className="font-medium">Admitted:</span> {new Date(selectedPatient.admittedAt).toLocaleDateString()}</p>
                              <p><span className="font-medium">Time:</span> {new Date(selectedPatient.admittedAt).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Vital Signs */}
                        <div className="p-4 bg-white rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Vital Signs
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded">
                              <p className="text-xs text-green-600 font-medium">Blood Pressure</p>
                              <p className="text-lg font-bold text-green-900">{form.getValues('vitalSigns.bloodPressure') || 'N/A'}</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <p className="text-xs text-green-600 font-medium">Heart Rate</p>
                              <p className="text-lg font-bold text-green-900">{form.getValues('vitalSigns.heartRate') || 'N/A'} <span className="text-sm">bpm</span></p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <p className="text-xs text-green-600 font-medium">Temperature</p>
                              <p className="text-lg font-bold text-green-900">{form.getValues('vitalSigns.temperature') || 'N/A'}<span className="text-sm">°F</span></p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <p className="text-xs text-green-600 font-medium">Respiratory Rate</p>
                              <p className="text-lg font-bold text-green-900">{form.getValues('vitalSigns.respiratoryRate') || 'N/A'}</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded">
                              <p className="text-xs text-green-600 font-medium">O2 Saturation</p>
                              <p className="text-lg font-bold text-green-900">{form.getValues('vitalSigns.oxygenSaturation') || 'N/A'}<span className="text-sm">%</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()} 
                  </CardContent>
                )}
              </Card>
            )}



            {/* Patient Assessment Input Card */}
            <Card className={isCardiology ? 'border-red-200 bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 shadow-lg' : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'}>
              <CardHeader className={isCardiology ? 'bg-gradient-to-r from-red-100 to-pink-100 border-b border-red-200' : 'bg-green-100 border-b border-green-200'}>
                <CardTitle className={`flex items-center gap-2 ${isCardiology ? 'text-red-800' : 'text-green-800'}`}>
                  <Stethoscope className="h-5 w-5" />
                  Patient Assessment Input
                </CardTitle>
                <CardDescription className={isCardiology ? 'text-red-700' : 'text-green-700'}>
                  Enter patient information and clinical findings for AI analysis and treatment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                    {/* Additional Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="labResults"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Laboratory Results</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Recent lab results, if available..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="diagnosticTests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Diagnostic Tests</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="X-rays, ECG, imaging results..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="clinicalFindings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clinical Findings & Physical Examination</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Physical examination findings, clinical observations..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                                    <Button 
                      type="button"
                      onClick={() => {
                        const patientId = form.getValues('patientId');
                        const clinicalFindings = form.getValues('clinicalFindings');
                        if (patientId && clinicalFindings) {
                          onSubmit(form.getValues());
                        } else {
                          toast({
                            variant: 'destructive',
                            title: 'Missing Information',
                            description: 'Please select a patient and enter clinical findings.',
                          });
                        }
                      }}
                      disabled={loading} 
                      size="lg"
                      className={`w-full ${isCardiology ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg' : ''}`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Recommendations...
                        </>
                      ) : (
                        <>
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Complete Assessment
                        </>
                      )}
                    </Button>

                  </form>
                </Form>
              </CardContent>
            </Card>


          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="ai-analysis" className="mt-8">
            {aiRecommendation && (
              <div className="space-y-6">
                {/* Main Header */}
                <Card className={isCardiology ? 'border-red-200 bg-gradient-to-r from-red-50 via-pink-50 to-rose-100 shadow-lg' : 'border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50'}>
                  <CardHeader className={isCardiology ? 'bg-gradient-to-r from-red-100 to-pink-100 border-b border-red-200' : 'bg-purple-100 border-b border-purple-200'}>
                    <CardTitle className={`flex items-center gap-2 ${isCardiology ? 'text-red-800' : 'text-purple-800'}`}>
                      <Brain className="h-6 w-6" />
                      Complete AI Analysis & Clinical Decision
                    </CardTitle>
                    <CardDescription className={isCardiology ? 'text-red-700' : 'text-purple-700'}>
                      Comprehensive AI recommendations - Choose your clinical pathway
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column - Analysis */}
                  <div className="space-y-6">
                      {/* AI Analysis of Admission Data */}
                      {form.getValues('patientId') && (
                        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                          <CardHeader className="bg-purple-100 border-b border-purple-200 cursor-pointer" onClick={() => setIsAdmissionAnalysisCollapsed(!isAdmissionAnalysisCollapsed)}>
                            <CardTitle className="text-purple-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                AI Analysis of Admission Data
                              </div>
                              <Button variant="ghost" size="sm" className="text-purple-800 hover:bg-purple-200">
                                {isAdmissionAnalysisCollapsed ? '+' : '−'}
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          {!isAdmissionAnalysisCollapsed && (
                            <CardContent className="pt-4">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-purple-800 mb-3">AI Assessment</h4>
                                  <div className="space-y-2">
                                    <div className="p-2 bg-white rounded border border-purple-200 text-sm">
                                      <strong>Risk Level:</strong> <Badge className="ml-2 bg-orange-100 text-orange-800">Medium-High</Badge>
                                    </div>
                                    <div className="p-2 bg-white rounded border border-purple-200 text-sm">
                                      <strong>Urgency:</strong> Requires immediate attention
                                    </div>
                                    <div className="p-2 bg-white rounded border border-purple-200 text-sm">
                                      <strong>Complexity:</strong> Multiple symptoms present
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-purple-800 mb-3">Preliminary Recommendations</h4>
                                  <div className="space-y-2">
                                    <div className="p-2 bg-white rounded border border-purple-200 text-sm">
                                      ✓ Complete cardiovascular assessment
                                    </div>
                                    <div className="p-2 bg-white rounded border border-purple-200 text-sm">
                                      ✓ Monitor vital signs closely
                                    </div>
                                    <div className="p-2 bg-white rounded border border-purple-200 text-sm">
                                      ✓ Consider diagnostic testing
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-2">AI Confidence & Analysis</h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-blue-700">Analysis Confidence: <Badge className="ml-1 bg-blue-100 text-blue-800">82%</Badge></span>
                                  <span className="text-sm text-blue-600">Based on admission data analysis</span>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )}

                      {/* AI Symptom Analysis & Disease Suggestions */}
                      {aiSymptomAnalysis && (
                        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                          <CardHeader className="bg-purple-100 border-b border-purple-200">
                            <CardTitle className="text-purple-800 flex items-center gap-2">
                              <Brain className="h-5 w-5" />
                              AI Symptom Analysis & Disease Suggestions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-purple-800 mb-3">Complex Symptoms Identified</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {aiSymptomAnalysis.complexSymptoms.map((symptom: string, index: number) => (
                                    <div key={index} className="p-2 bg-white rounded border border-purple-200 text-sm">
                                      {symptom}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-purple-800 mb-3">Possible Diseases</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {aiSymptomAnalysis.possibleDiseases.map((disease: any, index: number) => (
                                    <div key={index} className="p-2 bg-white rounded border border-purple-200 text-sm flex justify-between items-center">
                                      <span>{disease.name}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant={disease.severity === 'High' ? 'destructive' : 'secondary'}>
                                          {disease.probability}%
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
                              <h4 className="font-semibold text-yellow-800 mb-2">AI Recommended Tests</h4>
                              <div className="grid md:grid-cols-3 gap-2">
                                {aiSymptomAnalysis.recommendedTests.map((test: string, index: number) => (
                                  <Badge key={index} variant="outline" className="justify-center">
                                    {test}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                              <span className="text-blue-800 font-medium">AI Confidence Level</span>
                              <Badge className="bg-blue-100 text-blue-800">{aiSymptomAnalysis.confidence}%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                    {/* AI Diagnosis */}
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-purple-800">AI Diagnosis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <p className="text-purple-700">{aiRecommendation.diagnosis}</p>
                          <Badge variant="secondary" className="text-purple-700">
                            {aiRecommendation.confidence}% Confidence
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Treatment Plan */}
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-800">AI Treatment Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-700">{aiRecommendation.treatmentPlan}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Clinical Decision */}
                  <div className="space-y-6">
                    {/* Clinical Decision Options */}
                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                      <CardHeader className="bg-orange-100 border-b border-orange-200">
                        <CardTitle className="text-orange-800">Clinical Decision Required</CardTitle>
                        <CardDescription className="text-orange-700">
                          Choose the appropriate treatment pathway
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant={doctorDecision === 'laboratory' ? 'default' : 'outline'}
                            onClick={() => setDoctorDecision('laboratory')}
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            size="lg"
                          >
                            <TestTube className="h-8 w-8" />
                            <div className="text-center">
                              <div className="font-medium">Send to Laboratory</div>
                              <div className="text-xs opacity-75">Need more diagnostic data</div>
                            </div>
                          </Button>
                          
                          <Button
                            variant={doctorDecision === 'medicine' ? 'default' : 'outline'}
                            onClick={() => setDoctorDecision('medicine')}
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            size="lg"
                          >
                            <Pill className="h-8 w-8" />
                            <div className="text-center">
                              <div className="font-medium">Prescribe Medicine</div>
                              <div className="text-xs opacity-75">Proceed with treatment</div>
                            </div>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                      {/* Laboratory Option */}
                      {doctorDecision === 'laboratory' && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h3 className="font-semibold text-yellow-800 mb-3">AI Recommended Tests</h3>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {aiRecommendation.additionalTests.map((test: string, index: number) => (
                                  <div key={index} className="p-2 bg-white rounded border text-sm flex items-center gap-2">
                                    <TestTube className="h-4 w-4 text-yellow-600" />
                                    {test}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-yellow-800 mb-3">Available Laboratory Tests</h3>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {[
                                  'Complete Blood Count (CBC)',
                                  'Basic Metabolic Panel',
                                  'Lipid Profile',
                                  'Liver Function Tests',
                                  'Thyroid Function Tests',
                                  'Hemoglobin A1C',
                                  'Urinalysis',
                                  'Chest X-Ray',
                                  'CT Scan',
                                  'MRI',
                                  'Ultrasound'
                                ].map((test: string, index: number) => (
                                  <label key={index} className="flex items-center gap-2 p-2 bg-white rounded border text-sm cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" className="rounded" />
                                    <TestTube className="h-4 w-4 text-blue-600" />
                                    {test}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              const patientId = form.getValues('patientId');
                              const selectedPatient = assignedPatients.find(p => p.id === patientId);
                              
                              if (selectedPatient) {
                                // Add to waiting line
                                const waitingPatient = {
                                  ...selectedPatient,
                                  sentToLab: new Date().toISOString(),
                                  status: 'waiting_for_results',
                                  tests: aiRecommendation.additionalTests
                                };
                                setWaitingForResults(prev => [...prev, waitingPatient]);
                                
                                // Reset form for next patient
                                form.reset();
                                setAiRecommendation(null);
                                setDoctorTreatment(null);
                                setDoctorDecision('');
                                
                                toast({
                                  title: 'Patient Sent to Laboratory',
                                  description: `${selectedPatient.name} added to waiting line. You can now treat other patients.`,
                                });
                              }
                            }}
                            className="w-full bg-yellow-600 hover:bg-yellow-700"
                            size="lg"
                          >
                            <TestTube className="mr-2 h-4 w-4" />
                            Send to Laboratory & Continue with Next Patient
                          </Button>
                        </div>
                      )}

                      {/* Medicine Option */}
                      {doctorDecision === 'medicine' && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-800 mb-3">AI Recommended Medications</h3>
                          <div className="space-y-2 mb-4">
                            {aiRecommendation.medications.map((med: any, index: number) => (
                              <div key={index} className="p-3 bg-white rounded border flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{med.name}</span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    {med.dosage} • {med.frequency} • {med.duration}
                                  </span>
                                </div>
                                <Pill className="h-4 w-4 text-green-600" />
                              </div>
                            ))}
                          </div>
                          
                          {aiRecommendation.warnings.length > 0 && (
                            <div className="p-3 bg-yellow-50 rounded border border-yellow-200 mb-4">
                              <h4 className="font-medium text-yellow-800 mb-2">AI Warnings</h4>
                              <ul className="list-disc list-inside text-yellow-700 text-sm">
                                {aiRecommendation.warnings.map((warning: string, index: number) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <Button
                            onClick={() => {
                              setDoctorTreatment({ route: 'medicine', medications: aiRecommendation.medications });
                              setFinalTreatment({
                                finalDiagnosis: aiRecommendation.diagnosis,
                                confidence: aiRecommendation.confidence,
                                medications: aiRecommendation.medications,
                                treatmentPlan: aiRecommendation.treatmentPlan,
                                followUp: aiRecommendation.followUp,
                                warnings: aiRecommendation.warnings,
                                approvedBy: session?.name || 'Doctor',
                                approvedAt: new Date().toISOString(),
                              });
                              setTimeout(() => {
                                setActiveTab('final-treatment');
                              }, 100);
                              toast({
                                title: 'Treatment Plan Approved',
                                description: 'AI recommendations approved. Ready to send to pharmacy.',
                              });
                            }}
                            className="w-full bg-green-600 hover:bg-green-700"
                            size="lg"
                          >
                            <Pill className="mr-2 h-4 w-4" />
                            Approve AI Medications & Send to Pharmacy
                          </Button>
                        </div>
                      )}

                {/* Results Display */}
                {doctorTreatment && (
                  <Card className={`${
                    doctorTreatment.route === 'laboratory' 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-green-200 bg-green-50'
                  }`}>
                    <CardContent className="pt-4">
                      <h4 className={`font-semibold mb-2 ${
                        doctorTreatment.route === 'laboratory' ? 'text-yellow-800' : 'text-green-800'
                      }`}>
                        {doctorTreatment.route === 'laboratory' ? 'Laboratory Orders Sent' : 'Treatment Plan Ready'}
                      </h4>
                      <p className={`text-sm ${
                        doctorTreatment.route === 'laboratory' ? 'text-yellow-700' : 'text-green-700'
                      }`}>
                        {doctorTreatment.route === 'laboratory' 
                          ? 'Patient referred to laboratory for diagnostic tests. Results will be available for follow-up.'
                          : 'Treatment plan finalized and ready for pharmacy dispatch.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Doctor Review Tab */}
          <TabsContent value="doctor-review" className="mt-8">
            <div className="space-y-6">
              {/* Laboratory Results Display */}
              {aiRecommendation?.labResults && (
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader className="bg-blue-100 border-b border-blue-200">
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <TestTube className="h-5 w-5" />
                      Laboratory Results Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(aiRecommendation.labResults).map(([test, result]: [string, any]) => (
                        <div key={test} className={`p-3 bg-white rounded border-l-4 ${
                          result.critical ? 'border-red-400' : 'border-green-400'
                        }`}>
                          <h4 className="font-medium">{test}</h4>
                          <p className="text-lg font-bold">{result.value}</p>
                          <Badge variant={result.critical ? 'destructive' : 'secondary'}>
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Analysis of Lab Results */}
              {aiRecommendation && (
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader className="bg-purple-100 border-b border-purple-200">
                    <CardTitle className="text-purple-800 flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Analysis & Treatment Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-3">AI Diagnosis</h4>
                        <div className="p-3 bg-white rounded border">
                          <p className="text-purple-700">{aiRecommendation.diagnosis}</p>
                          <Badge className="mt-2 bg-purple-100 text-purple-800">
                            {aiRecommendation.confidence}% Confidence
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-3">Treatment Plan</h4>
                        <div className="p-3 bg-white rounded border">
                          <p className="text-purple-700 text-sm">{aiRecommendation.treatmentPlan}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Available Pharmacy Medications */}
              {aiRecommendation && (
                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader className="bg-green-100 border-b border-green-200">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Available Pharmacy Medications
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      AI recommended medications available in pharmacy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {aiRecommendation.medications.map((med: any, index: number) => (
                        <div key={index} className="p-4 bg-white rounded border border-green-200 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedMedications.includes(med.name) || selectedMedications.length === 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMedications(prev => [...prev.filter(m => m !== med.name), med.name]);
                                } else {
                                  setSelectedMedications(prev => prev.filter(m => m !== med.name));
                                }
                              }}
                              className="w-4 h-4 text-green-600 rounded"
                            />
                            <div>
                              <h4 className="font-medium text-green-900">{med.name}</h4>
                              <p className="text-sm text-green-700">
                                {med.dosage} • {med.frequency} • {med.duration}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">{med.instructions}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                            <Badge variant="outline">In Stock</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {aiRecommendation.warnings.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Warnings</h4>
                        <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                          {aiRecommendation.warnings.map((warning: string, index: number) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => {
                        const finalMedications = selectedMedications.length > 0 
                          ? aiRecommendation.medications.filter((med: any) => selectedMedications.includes(med.name))
                          : aiRecommendation.medications;
                        
                        setFinalTreatment({
                          finalDiagnosis: aiRecommendation.diagnosis,
                          confidence: aiRecommendation.confidence,
                          medications: finalMedications,
                          treatmentPlan: aiRecommendation.treatmentPlan,
                          followUp: aiRecommendation.followUp,
                          warnings: aiRecommendation.warnings,
                          approvedBy: session?.name || 'Doctor',
                          approvedAt: new Date().toISOString(),
                        });
                        setActiveTab('final-treatment');
                        toast({
                          title: 'Treatment Approved',
                          description: `${finalMedications.length} medication(s) approved and ready to send to pharmacy.`,
                        });
                      }}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Pill className="mr-2 h-4 w-4" />
                      Approve & Send to Pharmacy
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Final Treatment Tab */}
          <TabsContent value="final-treatment" className="mt-8">
            {finalTreatment && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      Final Treatment Plan
                    </CardTitle>
                    <CardDescription>
                      Harmonized AI and doctor recommendations ready for pharmacy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Final Diagnosis</h3>
                        <p className="text-green-700">{finalTreatment.finalDiagnosis}</p>
                        <Badge variant="secondary" className="mt-2">
                          Confidence: {finalTreatment.confidence}%
                        </Badge>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Complete Treatment Plan</h3>
                        <p className="text-blue-700">{finalTreatment.treatmentPlan}</p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-2">Prescription Details</h3>
                        <div className="space-y-3">
                          {finalTreatment.medications.map((med: any, index: number) => (
                            <div key={index} className="p-3 bg-white rounded border-l-4 border-purple-400">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{med.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {med.dosage} • {med.frequency} • {med.duration}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{med.instructions}</p>
                                </div>
                                <Badge variant="outline">Ready to Send</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Approval Information</h3>
                        <div className="text-sm text-gray-700">
                          <p><strong>Approved by:</strong> {finalTreatment.approvedBy}</p>
                          <p><strong>Approved at:</strong> {new Date(finalTreatment.approvedAt).toLocaleString()}</p>
                          <p><strong>Department:</strong> {department}</p>
                        </div>
                      </div>

                      <Button
                        onClick={sendToPharmacy}
                        disabled={sendingToPharmacy}
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {sendingToPharmacy ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending to Pharmacy...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Prescriptions to Pharmacy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default MedicalDepartment;
