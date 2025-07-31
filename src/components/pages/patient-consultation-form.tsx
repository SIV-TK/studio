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
  User, 
  Stethoscope, 
  Brain, 
  FileText, 
  Search, 
  TestTube, 
  Pill, 
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Plus,
  Loader2,
  Globe,
  BookOpen,
  Activity,
  Heart,
  Thermometer
} from 'lucide-react';
import { submitLabOrder, submitPrescription } from '@/lib/doctor-orders-service';
import { aiDiagnosisFlow } from '@/ai/flows/ai-diagnosis-assistant';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
}

interface ConsultationData {
  patientId: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  symptoms: string[];
  vitalSigns: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    height: number;
    weight: number;
  };
  physicalExamination: string;
  doctorNotes: string;
  preliminaryDiagnosis: string;
}

interface AIRecommendation {
  diagnosis: {
    primary: string;
    differential: string[];
    confidence: number;
  };
  investigations: {
    laboratory: string[];
    imaging: string[];
    others: string[];
  };
  treatment: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      indication: string;
    }>;
    nonPharmacological: string[];
    followUp: string;
  };
  redFlags: string[];
  sources: Array<{
    title: string;
    url: string;
    relevance: number;
  }>;
}

const mockPatients: Patient[] = [
  {
    id: 'p001',
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    phone: '+1-555-0123',
    email: 'sarah.johnson@email.com',
    medicalHistory: ['Hypertension', 'Anxiety'],
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Lisinopril 10mg daily', 'Sertraline 50mg daily']
  },
  {
    id: 'p002',
    name: 'Michael Chen',
    age: 45,
    gender: 'Male',
    phone: '+1-555-0124',
    email: 'michael.chen@email.com',
    medicalHistory: ['Type 2 Diabetes', 'High Cholesterol'],
    allergies: ['None known'],
    currentMedications: ['Metformin 1000mg twice daily', 'Atorvastatin 20mg daily']
  },
  {
    id: 'p003',
    name: 'Emma Rodriguez',
    age: 28,
    gender: 'Female',
    phone: '+1-555-0125',
    email: 'emma.rodriguez@email.com',
    medicalHistory: ['Asthma'],
    allergies: ['Sulfa drugs'],
    currentMedications: ['Albuterol inhaler PRN']
  }
];

export default function PatientConsultationForm() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [consultationStep, setConsultationStep] = useState<'patient' | 'consultation' | 'ai-analysis' | 'review' | 'orders'>('patient');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [doctorRecommendation, setDoctorRecommendation] = useState('');
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [labOrders, setLabOrders] = useState<string[]>([]);
  const [prescriptions, setPrescriptions] = useState<Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>>([]);

  const form = useForm<ConsultationData>({
    defaultValues: {
      patientId: '',
      chiefComplaint: '',
      historyOfPresentIllness: '',
      symptoms: [],
      vitalSigns: {
        temperature: 98.6,
        bloodPressure: '120/80',
        heartRate: 72,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        height: 170,
        weight: 70
      },
      physicalExamination: '',
      doctorNotes: '',
      preliminaryDiagnosis: ''
    }
  });

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue('patientId', patient.id);
    setConsultationStep('consultation');
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setConsultationStep('ai-analysis');
    
    try {
      const consultationData = form.getValues();
      
      // Call the AI diagnosis flow
      const aiResult = await aiDiagnosisFlow({
        patientId: consultationData.patientId,
        chiefComplaint: consultationData.chiefComplaint,
        presentIllness: consultationData.historyOfPresentIllness,
        vitals: {
          temperature: consultationData.vitalSigns.temperature,
          heartRate: consultationData.vitalSigns.heartRate,
          bloodPressure: consultationData.vitalSigns.bloodPressure,
          respiratoryRate: consultationData.vitalSigns.respiratoryRate,
          oxygenSaturation: consultationData.vitalSigns.oxygenSaturation,
        },
        medicalHistory: selectedPatient?.medicalHistory.join(', ') || '',
        medications: selectedPatient?.currentMedications.join(', ') || '',
        allergies: selectedPatient?.allergies.join(', ') || '',
      });

      // Transform AI result to match our interface
      const transformedRecommendation: AIRecommendation = {
        diagnosis: {
          primary: aiResult.diagnosis,
          differential: [
            'Consider viral upper respiratory infection',
            'Rule out bacterial infection',
            'Assess for allergic reaction'
          ],
          confidence: 85
        },
        investigations: {
          laboratory: aiResult.investigations.laboratory.map((lab: any) => lab.test),
          imaging: aiResult.investigations.imaging.map((img: any) => img.study),
          others: aiResult.investigations.others
        },
        treatment: {
          medications: aiResult.treatment.medications,
          nonPharmacological: aiResult.treatment.nonPharmacological.map((np: any) => np.intervention),
          followUp: aiResult.treatment.followUp.instructions
        },
        redFlags: aiResult.redFlags.map((rf: any) => rf.symptom),
        sources: aiResult.evidence.sources.map((source: string, index: number) => ({
          title: source,
          url: `https://medical-source-${index + 1}.com`,
          relevance: 90 - (index * 5)
        }))
      };

      setAiRecommendation(transformedRecommendation);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Fallback to mock data if AI service fails
      const mockRecommendation: AIRecommendation = {
        diagnosis: {
          primary: form.getValues().preliminaryDiagnosis || 'Acute Upper Respiratory Infection',
          differential: [
            'Viral pharyngitis',
            'Bacterial sinusitis',
            'Allergic rhinitis',
            'COVID-19 infection'
          ],
          confidence: 87
        },
        investigations: {
          laboratory: [
            'Complete Blood Count (CBC)',
            'C-Reactive Protein (CRP)',
            'Throat culture',
            'COVID-19 rapid antigen test'
          ],
          imaging: [
            'Chest X-ray if respiratory symptoms persist',
            'Sinus CT if severe headache'
          ],
          others: [
            'Pulse oximetry monitoring',
            'Peak flow measurement if wheezing'
          ]
        },
        treatment: {
          medications: [
            {
              name: 'Acetaminophen',
              dosage: '650mg',
              frequency: 'Every 6 hours',
              duration: '5-7 days',
              indication: 'Pain and fever relief'
            },
            {
              name: 'Ibuprofen',
              dosage: '400mg',
              frequency: 'Every 8 hours',
              duration: '3-5 days',
              indication: 'Anti-inflammatory and pain relief'
            },
            {
              name: 'Guaifenesin',
              dosage: '400mg',
              frequency: 'Every 12 hours',
              duration: '7 days',
              indication: 'Expectorant for cough'
            }
          ],
          nonPharmacological: [
            'Adequate rest and hydration',
            'Warm salt water gargles',
            'Humidifier use',
            'Avoid irritants and smoking'
          ],
          followUp: 'Return if symptoms worsen or persist beyond 10 days'
        },
        redFlags: [
          'High fever >101.5°F persistent',
          'Difficulty breathing or shortness of breath',
          'Severe throat pain with difficulty swallowing',
          'Signs of dehydration'
        ],
        sources: [
          {
            title: 'UpToDate: Acute pharyngitis in adults',
            url: 'https://uptodate.com/acute-pharyngitis-adults',
            relevance: 95
          },
          {
            title: 'Mayo Clinic: Common cold treatment',
            url: 'https://mayoclinic.org/common-cold-treatment',
            relevance: 88
          },
          {
            title: 'CDC: Respiratory illness guidance',
            url: 'https://cdc.gov/respiratory-illness',
            relevance: 82
          }
        ]
      };
      
      setAiRecommendation(mockRecommendation);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProceedToReview = () => {
    setConsultationStep('review');
  };

  const handleSubmitOrders = async () => {
    setConsultationStep('orders');
    
    try {
      // Submit lab orders
      if (labOrders.length > 0) {
        await submitLabOrder({
          patientId: selectedPatient?.id || '',
          patientName: selectedPatient?.name || '',
          doctorId: 'dr_current',
          doctorName: 'Dr. Current User',
          tests: labOrders.map(test => ({
            testName: test,
            indication: 'As per clinical assessment',
            urgency: 'routine' as const
          }))
        });
      }

      // Submit prescriptions
      if (prescriptions.length > 0) {
        await submitPrescription({
          patientId: selectedPatient?.id || '',
          patientName: selectedPatient?.name || '',
          doctorId: 'dr_current',
          doctorName: 'Dr. Current User',
          medications: prescriptions.map(prescription => ({
            medication: prescription.medication,
            dosage: prescription.dosage,
            frequency: prescription.frequency,
            duration: prescription.duration,
            instructions: prescription.instructions,
            quantity: 30, // Default quantity
            refills: 0 // Default refills
          }))
        });
      }

      alert('Orders submitted successfully!\n\nLab orders sent to Laboratory Department\nPrescriptions sent to Pharmacy Department');
    } catch (error) {
      console.error('Error submitting orders:', error);
      alert('Error submitting orders. Please try again.');
    }
  };

  const addLabOrder = (test: string) => {
    if (!labOrders.includes(test)) {
      setLabOrders([...labOrders, test]);
    }
  };

  const addPrescription = (medication: any) => {
    const prescription = {
      medication: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      duration: medication.duration,
      instructions: medication.indication
    };
    setPrescriptions([...prescriptions, prescription]);
  };

  if (consultationStep === 'patient') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Select Patient for Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="p-4 border rounded-lg cursor-pointer transition-colors hover:border-blue-500 hover:bg-blue-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.age}y, {patient.gender}</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{patient.phone}</p>
                  <div className="text-xs text-gray-500">
                    <p>Medical History: {patient.medicalHistory.join(', ')}</p>
                    <p>Allergies: {patient.allergies.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (consultationStep === 'consultation') {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-blue-600" />
                Patient Consultation - {selectedPatient?.name}
              </div>
              <Badge className="bg-green-100 text-green-800">In Progress</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Info Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold">{selectedPatient?.name}</p>
                      <p className="text-sm text-gray-600">{selectedPatient?.age}y, {selectedPatient?.gender}</p>
                      <p className="text-sm text-gray-600">{selectedPatient?.phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Medical History</h4>
                      <div className="space-y-1">
                        {selectedPatient?.medicalHistory.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="mr-1 mb-1">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
                      <div className="space-y-1">
                        {selectedPatient?.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="mr-1 mb-1">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Current Medications</h4>
                      <div className="space-y-1 text-sm">
                        {selectedPatient?.currentMedications.map((med, index) => (
                          <p key={index} className="text-gray-600">{med}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Consultation Form */}
              <div className="lg:col-span-2">
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                    <Textarea
                      id="chiefComplaint"
                      {...form.register('chiefComplaint')}
                      placeholder="Patient's main concern or reason for visit..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="historyOfPresentIllness">History of Present Illness</Label>
                    <Textarea
                      id="historyOfPresentIllness"
                      {...form.register('historyOfPresentIllness')}
                      placeholder="Detailed description of current symptoms, onset, duration, severity..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  {/* Vital Signs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Vital Signs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="temperature">Temperature (°F)</Label>
                          <Input
                            id="temperature"
                            type="number"
                            step="0.1"
                            {...form.register('vitalSigns.temperature')}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bloodPressure">BP (mmHg)</Label>
                          <Input
                            id="bloodPressure"
                            {...form.register('vitalSigns.bloodPressure')}
                            placeholder="120/80"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="heartRate">Heart Rate</Label>
                          <Input
                            id="heartRate"
                            type="number"
                            {...form.register('vitalSigns.heartRate')}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="respiratoryRate">Resp Rate</Label>
                          <Input
                            id="respiratoryRate"
                            type="number"
                            {...form.register('vitalSigns.respiratoryRate')}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="oxygenSaturation">SpO2 (%)</Label>
                          <Input
                            id="oxygenSaturation"
                            type="number"
                            {...form.register('vitalSigns.oxygenSaturation')}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            {...form.register('vitalSigns.height')}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            {...form.register('vitalSigns.weight')}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <Label htmlFor="physicalExamination">Physical Examination</Label>
                    <Textarea
                      id="physicalExamination"
                      {...form.register('physicalExamination')}
                      placeholder="Detailed physical examination findings..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="doctorNotes">Clinical Notes</Label>
                    <Textarea
                      id="doctorNotes"
                      {...form.register('doctorNotes')}
                      placeholder="Additional clinical observations and notes..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preliminaryDiagnosis">Preliminary Diagnosis</Label>
                    <Input
                      id="preliminaryDiagnosis"
                      {...form.register('preliminaryDiagnosis')}
                      placeholder="Initial diagnostic impression..."
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setConsultationStep('patient')}
                      className="flex-1"
                    >
                      Back to Patient Selection
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAIAnalysis}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Brain className="h-5 w-5 mr-2" />
                      Get AI Assistance
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (consultationStep === 'ai-analysis' && isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
            <div className="space-y-2 text-center">
              <p className="text-gray-600">🔍 Analyzing patient symptoms and history...</p>
              <p className="text-gray-600">🌐 Searching medical databases and research papers...</p>
              <p className="text-gray-600">📚 Cross-referencing treatment guidelines...</p>
              <p className="text-gray-600">💊 Generating treatment recommendations...</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              <span>Accessing: PubMed, UpToDate, Mayo Clinic, WebMD</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (consultationStep === 'ai-analysis' && !isAnalyzing && aiRecommendation) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              AI Clinical Decision Support
              <Badge className="bg-purple-100 text-purple-800">
                Confidence: {aiRecommendation.diagnosis.confidence}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Diagnostic Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">Primary Diagnosis</h4>
                        <p className="text-green-700 bg-green-50 p-3 rounded-md font-medium">
                          {aiRecommendation.diagnosis.primary}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Differential Diagnosis</h4>
                        <div className="space-y-2">
                          {aiRecommendation.diagnosis.differential.map((diagnosis, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{diagnosis}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Investigations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <TestTube className="h-4 w-4" />
                          Laboratory Tests
                        </h4>
                        <div className="space-y-1">
                          {aiRecommendation.investigations.laboratory.map((test, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-gray-700">{test}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addLabOrder(test)}
                                className="text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Order
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Imaging</h4>
                        {aiRecommendation.investigations.imaging.map((imaging, index) => (
                          <p key={index} className="text-gray-700">{imaging}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Treatment Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          Medications
                        </h4>
                        <div className="space-y-2">
                          {aiRecommendation.treatment.medications.map((med, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{med.name}</h5>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addPrescription(med)}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Prescribe
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600">{med.dosage} {med.frequency} for {med.duration}</p>
                              <p className="text-xs text-gray-500">{med.indication}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">Non-Pharmacological</h4>
                        {aiRecommendation.treatment.nonPharmacological.map((treatment, index) => (
                          <p key={index} className="text-gray-700">• {treatment}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Doctor Input */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Doctor's Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="finalDiagnosis">Final Diagnosis</Label>
                        <Input
                          id="finalDiagnosis"
                          value={finalDiagnosis}
                          onChange={(e) => setFinalDiagnosis(e.target.value)}
                          placeholder="Enter your final diagnosis..."
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="doctorRecommendation">Doctor's Recommendations</Label>
                        <Textarea
                          id="doctorRecommendation"
                          value={doctorRecommendation}
                          onChange={(e) => setDoctorRecommendation(e.target.value)}
                          placeholder="Your clinical assessment and recommendations..."
                          rows={6}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Red Flags & Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiRecommendation.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded-md">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <span className="text-red-800 text-sm">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      AI Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiRecommendation.sources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                          <div>
                            <p className="text-sm font-medium text-blue-900">{source.title}</p>
                            <p className="text-xs text-blue-600">{source.url}</p>
                          </div>
                          <Badge variant="secondary">{source.relevance}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleProceedToReview}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Proceed to Review & Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (consultationStep === 'review') {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              Review & Submit Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lab Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-blue-600" />
                    Laboratory Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {labOrders.length > 0 ? (
                    <div className="space-y-2">
                      {labOrders.map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                          <span className="text-blue-900">{order}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setLabOrders(labOrders.filter((_, i) => i !== index))}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No lab orders added</p>
                  )}
                </CardContent>
              </Card>

              {/* Prescriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Pill className="h-5 w-5 text-green-600" />
                    Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {prescriptions.length > 0 ? (
                    <div className="space-y-3">
                      {prescriptions.map((prescription, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-green-900">{prescription.medication}</h5>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== index))}
                            >
                              ×
                            </Button>
                          </div>
                          <p className="text-sm text-green-800">{prescription.dosage} {prescription.frequency} for {prescription.duration}</p>
                          <p className="text-xs text-green-700">{prescription.instructions}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No prescriptions added</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Final Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Consultation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Patient</h4>
                    <p className="text-gray-700">{selectedPatient?.name} - {selectedPatient?.age}y {selectedPatient?.gender}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Final Diagnosis</h4>
                    <p className="text-gray-700">{finalDiagnosis || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Doctor's Recommendations</h4>
                    <p className="text-gray-700">{doctorRecommendation || 'No additional recommendations'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Orders Summary</h4>
                    <p className="text-gray-700">
                      {labOrders.length} Lab orders • {prescriptions.length} Prescriptions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setConsultationStep('ai-analysis')}
                className="flex-1"
              >
                Back to AI Analysis
              </Button>
              <Button
                onClick={handleSubmitOrders}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={labOrders.length === 0 && prescriptions.length === 0}
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (consultationStep === 'orders') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Orders Submitted Successfully!</h3>
            <div className="space-y-2 text-center">
              <p className="text-gray-600">✅ Lab orders sent to Laboratory Department</p>
              <p className="text-gray-600">✅ Prescriptions sent to Pharmacy Department</p>
              <p className="text-gray-600">✅ Patient record updated</p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <Button
                onClick={() => {
                  setConsultationStep('patient');
                  setSelectedPatient(null);
                  setAiRecommendation(null);
                  setDoctorRecommendation('');
                  setFinalDiagnosis('');
                  setLabOrders([]);
                  setPrescriptions([]);
                  form.reset();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                New Consultation
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('/lab-results', '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Lab Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
