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

export default function MedicalDepartment({ department, specialization, icon, color }: DepartmentProps) {
  const [loading, setLoading] = useState(false);
  const [sendingToPharmacy, setSendingToPharmacy] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [doctorTreatment, setDoctorTreatment] = useState<any>(null);
  const [finalTreatment, setFinalTreatment] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
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

  // Load available patients
  useEffect(() => {
    // In real implementation, this would load patients from database
    setPatients([
      { id: 'patient_001', name: 'John Smith', age: 45, gender: 'Male' },
      { id: 'patient_002', name: 'Maria Garcia', age: 32, gender: 'Female' },
      { id: 'patient_003', name: 'Robert Chen', age: 67, gender: 'Male' },
    ]);
  }, []);

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
      // Generate AI recommendation
      const aiRec = await generateAIRecommendation(values);
      setAiRecommendation(aiRec);

      toast({
        title: 'AI Analysis Complete',
        description: 'Review the AI recommendations and provide your clinical assessment.',
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

      // Reset form for next patient
      form.reset();
      setAiRecommendation(null);
      setDoctorTreatment(null);
      setFinalTreatment(null);

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

        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessment">Patient Assessment</TabsTrigger>
            <TabsTrigger value="ai-analysis" disabled={!aiRecommendation}>AI Analysis</TabsTrigger>
            <TabsTrigger value="doctor-review" disabled={!aiRecommendation}>Doctor Review</TabsTrigger>
            <TabsTrigger value="final-treatment" disabled={!finalTreatment}>Final Treatment</TabsTrigger>
          </TabsList>

          {/* Patient Assessment Tab */}
          <TabsContent value="assessment" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Assessment Input
                </CardTitle>
                <CardDescription>
                  Enter patient information and clinical findings for AI analysis and treatment recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Patient Selection */}
                    <FormField
                      control={form.control}
                      name="patientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Patient</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose patient for assessment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  {patient.name} - {patient.age}y {patient.gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Clinical Assessment */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="chiefComplaint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chief Complaint</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Primary reason for visit..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="presentingSymptoms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Presenting Symptoms</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Current symptoms and their characteristics..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Vital Signs */}
                    <div className="grid md:grid-cols-5 gap-4">
                      <FormField
                        control={form.control}
                        name="vitalSigns.bloodPressure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Pressure</FormLabel>
                            <FormControl>
                              <Input placeholder="120/80" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vitalSigns.heartRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heart Rate</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="72" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vitalSigns.temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature (°F)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="98.6" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vitalSigns.respiratoryRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Respiratory Rate</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="16" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vitalSigns.oxygenSaturation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>O2 Saturation (%)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="98" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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

                    <Button type="submit" disabled={loading} size="lg" className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating AI Recommendations...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Generate AI Treatment Recommendations
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI Analysis & Recommendations
                    </CardTitle>
                    <CardDescription>
                      AI-powered analysis based on clinical data and medical evidence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-purple-800">Suggested Diagnosis</h3>
                          <p className="text-purple-700">{aiRecommendation.diagnosis}</p>
                        </div>
                        <Badge variant="secondary" className="text-purple-700">
                          {aiRecommendation.confidence}% Confidence
                        </Badge>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Treatment Plan</h3>
                        <p className="text-blue-700">{aiRecommendation.treatmentPlan}</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Recommended Medications</h3>
                        <div className="space-y-2">
                          {aiRecommendation.medications.map((med, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                              <div>
                                <span className="font-medium">{med.name}</span>
                                <span className="text-sm text-gray-600 ml-2">
                                  {med.dosage} • {med.frequency} • {med.duration}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">{med.instructions}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {aiRecommendation.warnings.length > 0 && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h3 className="font-semibold text-yellow-800 mb-2">Warnings & Precautions</h3>
                          <ul className="list-disc list-inside text-yellow-700">
                            {aiRecommendation.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Follow-up Care</h3>
                        <p className="text-gray-700">{aiRecommendation.followUp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Doctor Review Tab */}
          <TabsContent value="doctor-review" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  Doctor Review & Clinical Decision
                </CardTitle>
                <CardDescription>
                  Review AI recommendations and provide clinical expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">
                      Review the AI recommendations above and provide your clinical assessment. 
                      Your expertise will be combined with AI analysis to create the final treatment plan.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">AI Recommendation Summary</h4>
                      {aiRecommendation && (
                        <div className="space-y-2 text-sm">
                          <p><strong>Diagnosis:</strong> {aiRecommendation.diagnosis}</p>
                          <p><strong>Medications:</strong> {aiRecommendation.medications.length} prescribed</p>
                          <p><strong>Confidence:</strong> {aiRecommendation.confidence}%</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Clinical Decision</h4>
                      <div className="space-y-2">
                        <Button
                          onClick={submitDoctorAssessment}
                          disabled={!!doctorTreatment}
                          className="w-full"
                        >
                          {doctorTreatment ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Assessment Approved
                            </>
                          ) : (
                            <>
                              <Stethoscope className="mr-2 h-4 w-4" />
                              Approve & Harmonize Treatment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {doctorTreatment && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Doctor Assessment Complete</h4>
                      <p className="text-green-700">
                        AI recommendations have been reviewed and approved by Dr. {session?.name || 'Doctor'}.
                        Treatment plan has been harmonized and is ready for finalization.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
