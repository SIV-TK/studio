'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Heart, 
  Brain,
  Building2,
  Calendar,
  TrendingUp,
  FileText,
  Monitor,
  Stethoscope,
  Shield,
  UserPlus,
  Bed,
  Search,
  Clock,
  Pill,
  TestTube,
  Eye,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/hooks/use-session';
import { FirestoreService } from '@/lib/firestore-service';
import { HospitalDirectoryService } from '@/lib/hospital-directory-service';
import { UserDataStore } from '@/lib/user-data-store';
import PatientConsultationForm from '@/components/pages/patient-consultation-form';

// Sample patient data - In real implementation, this would come from the database
const mockPatients = [
  {
    id: 'patient_001',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    registrationDate: '2025-01-20',
    lastVisit: '2025-01-30',
    chiefComplaint: 'Chest pain and shortness of breath',
    status: 'active',
    priority: 'high',
    room: '205A',
    vitals: {
      bloodPressure: '140/90',
      heartRate: 85,
      temperature: '98.6°F',
      oxygen: '95%',
      lastUpdated: '2025-01-31 10:30 AM'
    },
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Shellfish'],
    labResults: [
      { test: 'Complete Blood Count', date: '2025-01-30', status: 'abnormal', results: 'Elevated WBC: 12,000' },
      { test: 'Lipid Panel', date: '2025-01-29', status: 'normal', results: 'Total Cholesterol: 180 mg/dL' }
    ],
    medications: [
      { drug: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribed: '2025-01-30', status: 'active' },
      { drug: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribed: '2025-01-25', status: 'active' }
    ],
    aiRecommendations: [
      { type: 'Treatment', recommendation: 'Consider ECG and cardiac enzymes given chest pain symptoms', priority: 'urgent' },
      { type: 'Monitoring', recommendation: 'Monitor blood pressure closely, current readings elevated', priority: 'moderate' },
      { type: 'Follow-up', recommendation: 'Schedule cardiology consultation within 48 hours', priority: 'urgent' }
    ],
    progressNotes: [
      { date: '2025-01-31', doctor: 'Dr. Smith', note: 'Patient reports improved symptoms. Continue current medication regimen.' },
      { date: '2025-01-30', doctor: 'Dr. Johnson', note: 'Initial assessment completed. Started on Lisinopril for BP control.' }
    ]
  },
  {
    id: 'patient_002',
    name: 'Maria Garcia',
    age: 32,
    gender: 'Female',
    registrationDate: '2025-01-25',
    lastVisit: '2025-01-31',
    chiefComplaint: 'Pregnancy checkup and prenatal care',
    status: 'stable',
    priority: 'routine',
    room: '310B',
    vitals: {
      bloodPressure: '115/75',
      heartRate: 78,
      temperature: '98.4°F',
      oxygen: '98%',
      lastUpdated: '2025-01-31 09:15 AM'
    },
    conditions: ['Pregnancy - 24 weeks'],
    allergies: [],
    labResults: [
      { test: 'Prenatal Panel', date: '2025-01-31', status: 'normal', results: 'All values within normal range' },
      { test: 'Glucose Screening', date: '2025-01-28', status: 'normal', results: 'Blood glucose: 120 mg/dL' }
    ],
    medications: [
      { drug: 'Prenatal Vitamins', dosage: '1 tablet', frequency: 'Once daily', prescribed: '2025-01-25', status: 'active' },
      { drug: 'Iron Supplement', dosage: '65mg', frequency: 'Once daily', prescribed: '2025-01-28', status: 'active' }
    ],
    aiRecommendations: [
      { type: 'Screening', recommendation: 'Schedule 24-week anatomy scan', priority: 'routine' },
      { type: 'Nutrition', recommendation: 'Continue iron supplementation, monitor hemoglobin levels', priority: 'moderate' },
      { type: 'Education', recommendation: 'Provide gestational diabetes prevention counseling', priority: 'routine' }
    ],
    progressNotes: [
      { date: '2025-01-31', doctor: 'Dr. Williams', note: 'Routine prenatal visit. Baby developing normally. Mother feeling well.' },
      { date: '2025-01-28', doctor: 'Dr. Williams', note: 'Started iron supplement due to slightly low hemoglobin.' }
    ]
  },
  {
    id: 'patient_003',
    name: 'Robert Chen',
    age: 67,
    gender: 'Male',
    registrationDate: '2025-01-28',
    lastVisit: '2025-01-31',
    chiefComplaint: 'Post-operative recovery - knee replacement',
    status: 'recovering',
    priority: 'moderate',
    room: '415C',
    vitals: {
      bloodPressure: '125/80',
      heartRate: 72,
      temperature: '98.8°F',
      oxygen: '96%',
      lastUpdated: '2025-01-31 11:45 AM'
    },
    conditions: ['Post-surgical - Knee Replacement', 'Osteoarthritis'],
    allergies: ['Codeine'],
    labResults: [
      { test: 'Post-op CBC', date: '2025-01-31', status: 'normal', results: 'No signs of infection' },
      { test: 'Inflammatory Markers', date: '2025-01-30', status: 'improving', results: 'ESR decreasing, CRP normal' }
    ],
    medications: [
      { drug: 'Tramadol', dosage: '50mg', frequency: 'Every 6 hours as needed', prescribed: '2025-01-28', status: 'active' },
      { drug: 'Enoxaparin', dosage: '40mg', frequency: 'Once daily', prescribed: '2025-01-28', status: 'active' }
    ],
    aiRecommendations: [
      { type: 'Rehabilitation', recommendation: 'Initiate physical therapy protocol day 3 post-op', priority: 'urgent' },
      { type: 'Monitoring', recommendation: 'Watch for signs of DVT/PE, continue anticoagulation', priority: 'urgent' },
      { type: 'Pain Management', recommendation: 'Transition to oral pain medication as tolerated', priority: 'moderate' }
    ],
    progressNotes: [
      { date: '2025-01-31', doctor: 'Dr. Martinez', note: 'Post-op day 3. Wound healing well. Pain controlled. Ready for PT.' },
      { date: '2025-01-30', doctor: 'Dr. Martinez', note: 'Post-op day 2. No complications. Pain manageable with current regimen.' }
    ]
  }
];

export default function DoctorDashboard() {
  const [selectedTab, setSelectedTab] = useState('consultation');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newPrescription, setNewPrescription] = useState('');
  const { session } = useSession();

  // Filter patients based on search term
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'routine': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'stable': return 'secondary';
      case 'recovering': return 'default';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const addProgressNote = () => {
    if (newNote && selectedPatient) {
      const note = {
        date: new Date().toISOString().split('T')[0],
        doctor: session?.name || 'Current Doctor',
        note: newNote
      };
      selectedPatient.progressNotes.unshift(note);
      setNewNote('');
    }
  };

  const prescribeMedication = () => {
    if (newPrescription && selectedPatient) {
      const [drug, dosage, frequency] = newPrescription.split(',').map(s => s.trim());
      const prescription = {
        drug: drug || 'New Medication',
        dosage: dosage || 'As prescribed',
        frequency: frequency || 'As needed',
        prescribed: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      selectedPatient.medications.push(prescription);
      setNewPrescription('');
    }
  };

  return (
    <MainLayout>
      <AuthGuard>
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Doctor Portal
              </h1>
              <p className="text-xl text-gray-600">
                Patient Care Management System
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600">
                <Stethoscope className="h-4 w-4 mr-1" />
                {session?.name || 'Medical Professional'}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Patients</p>
                    <p className="text-3xl font-bold text-gray-900">{mockPatients.length}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Active cases</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Cases</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {mockPatients.filter(p => p.priority === 'high' || p.priority === 'urgent').length}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Needs attention</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-red-50">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lab Results</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {mockPatients.reduce((acc, p) => acc + p.labResults.length, 0)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TestTube className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Pending review</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <TestTube className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Alerts</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {mockPatients.reduce((acc, p) => acc + p.aiRecommendations.filter(r => r.priority === 'urgent').length, 0)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-purple-600">AI recommendations</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="consultation">AI Consultation</TabsTrigger>
              <TabsTrigger value="patients">Patient Management</TabsTrigger>
              <TabsTrigger value="overview">Quick Overview</TabsTrigger>
              <TabsTrigger value="analytics">Treatment Analytics</TabsTrigger>
            </TabsList>

            {/* AI Consultation Tab */}
            <TabsContent value="consultation" className="mt-8">
              <PatientConsultationForm />
            </TabsContent>

            {/* Patient Management Tab */}
            <TabsContent value="patients" className="mt-8">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Patient List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Patient List</span>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2"
                          />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                            selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                              <p className="text-sm text-gray-600">Room {patient.room}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant={getStatusColor(patient.status)} className="text-xs">
                                {patient.status}
                              </Badge>
                              <div className={`px-2 py-1 rounded text-xs border ${getPriorityColor(patient.priority)}`}>
                                {patient.priority}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                            {patient.chiefComplaint}
                          </p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Last visit: {patient.lastVisit}</span>
                            <span>{patient.age}y, {patient.gender}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Patient Details */}
                <div className="lg:col-span-2">
                  {selectedPatient ? (
                    <div className="space-y-6">
                      {/* Patient Overview */}
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                {selectedPatient.name}
                              </CardTitle>
                              <CardDescription>
                                {selectedPatient.age} years old • {selectedPatient.gender} • Room {selectedPatient.room}
                              </CardDescription>
                            </div>
                            <Badge variant={getStatusColor(selectedPatient.status)}>
                              {selectedPatient.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Chief Complaint</h4>
                              <p className="text-sm text-gray-700">{selectedPatient.chiefComplaint}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Registration</h4>
                              <p className="text-sm text-gray-700">
                                Registered: {selectedPatient.registrationDate}<br/>
                                Last Visit: {selectedPatient.lastVisit}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Vitals and Current Status */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Current Vitals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600">{selectedPatient.vitals.bloodPressure}</div>
                              <div className="text-xs text-gray-600">Blood Pressure</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">{selectedPatient.vitals.heartRate}</div>
                              <div className="text-xs text-gray-600">Heart Rate</div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                              <div className="text-lg font-bold text-yellow-600">{selectedPatient.vitals.temperature}</div>
                              <div className="text-xs text-gray-600">Temperature</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">{selectedPatient.vitals.oxygen}</div>
                              <div className="text-xs text-gray-600">Oxygen Sat</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Last updated: {selectedPatient.vitals.lastUpdated}
                          </p>
                        </CardContent>
                      </Card>

                      {/* AI Recommendations */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            AI Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedPatient.aiRecommendations.map((rec: any, index: number) => (
                              <div 
                                key={index} 
                                className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h5 className="font-medium">{rec.type}</h5>
                                  <Badge variant="outline" className="text-xs">
                                    {rec.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm">{rec.recommendation}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Lab Results */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TestTube className="h-5 w-5" />
                              Laboratory Results
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedPatient.labResults.map((lab: any, index: number) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-medium text-sm">{lab.test}</h5>
                                    <Badge 
                                      variant={lab.status === 'normal' ? 'default' : lab.status === 'abnormal' ? 'destructive' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {lab.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-1">{lab.date}</p>
                                  <p className="text-sm">{lab.results}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Current Medications */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Pill className="h-5 w-5" />
                              Current Medications
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedPatient.medications.map((med: any, index: number) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-medium text-sm">{med.drug}</h5>
                                    <Badge 
                                      variant={med.status === 'active' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {med.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {med.dosage} • {med.frequency}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Prescribed: {med.prescribed}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Input
                                placeholder="Drug, Dosage, Frequency (comma separated)"
                                value={newPrescription}
                                onChange={(e) => setNewPrescription(e.target.value)}
                                className="text-sm"
                              />
                              <Button size="sm" onClick={prescribeMedication}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Progress Notes */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Progress Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Add new note */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <Textarea
                                placeholder="Add progress note..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="mb-3"
                              />
                              <Button size="sm" onClick={addProgressNote} disabled={!newNote}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Note
                              </Button>
                            </div>
                            
                            {/* Existing notes */}
                            {selectedPatient.progressNotes.map((note: any, index: number) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium">{note.doctor}</div>
                                    <Badge variant="outline" className="text-xs">
                                      {note.date}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700">{note.note}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Medical History */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Medical History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">Conditions</h5>
                              <div className="flex flex-wrap gap-2">
                                {selectedPatient.conditions.map((condition: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Allergies</h5>
                              <div className="flex flex-wrap gap-2">
                                {selectedPatient.allergies.length > 0 ? (
                                  selectedPatient.allergies.map((allergy: string, index: number) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      {allergy}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-gray-500">No known allergies</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                        <p className="text-gray-600">Choose a patient from the list to view their details and manage their care.</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            {/* Quick Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Priority Patients */}
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      High Priority Patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPatients
                        .filter(p => p.priority === 'high' || p.priority === 'urgent')
                        .map((patient) => (
                          <div key={patient.id} className="p-3 bg-white rounded border-l-4 border-red-400">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-sm">{patient.name}</div>
                                <div className="text-xs text-gray-600">Room {patient.room}</div>
                              </div>
                              <Badge variant="destructive" className="text-xs">
                                {patient.priority}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-700 mt-1 line-clamp-2">
                              {patient.chiefComplaint}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Lab Results */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <TestTube className="h-5 w-5" />
                      Recent Lab Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPatients.slice(0, 2).map((patient) => (
                        <div key={patient.id}>
                          <div className="font-medium text-sm mb-2">{patient.name}</div>
                          {patient.labResults.slice(0, 1).map((lab, index) => (
                            <div key={index} className="p-2 bg-white rounded">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium">{lab.test}</span>
                                <Badge 
                                  variant={lab.status === 'normal' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {lab.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">{lab.date}</div>
                              <div className="text-xs text-gray-700">{lab.results}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights Summary */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Brain className="h-5 w-5" />
                      AI Insights Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded border-l-4 border-red-400">
                        <div className="text-xs text-red-600 font-medium">URGENT RECOMMENDATIONS</div>
                        <div className="text-sm mt-1">
                          {mockPatients.reduce((count, p) => 
                            count + p.aiRecommendations.filter(r => r.priority === 'urgent').length, 0
                          )} urgent recommendations require immediate attention
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded border-l-4 border-yellow-400">
                        <div className="text-xs text-yellow-600 font-medium">MONITORING ALERTS</div>
                        <div className="text-sm mt-1">
                          {mockPatients.reduce((count, p) => 
                            count + p.aiRecommendations.filter(r => r.priority === 'moderate').length, 0
                          )} monitoring recommendations for patient care
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded border-l-4 border-green-400">
                        <div className="text-xs text-green-600 font-medium">ROUTINE CARE</div>
                        <div className="text-sm mt-1">
                          {mockPatients.reduce((count, p) => 
                            count + p.aiRecommendations.filter(r => r.priority === 'routine').length, 0
                          )} routine care recommendations
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Treatment Analytics Tab */}
            <TabsContent value="analytics" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Status Distribution</CardTitle>
                    <CardDescription>Current patient status across all cases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['active', 'stable', 'recovering', 'critical'].map((status) => {
                        const count = mockPatients.filter(p => p.status === status).length;
                        const percentage = Math.round((count / mockPatients.length) * 100);
                        return (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{status}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    status === 'critical' ? 'bg-red-600' :
                                    status === 'active' ? 'bg-orange-600' :
                                    status === 'recovering' ? 'bg-blue-600' : 'bg-green-600'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{count} ({percentage}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Outcomes</CardTitle>
                    <CardDescription>Patient progress and recovery metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Patients Improving</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">
                            {mockPatients.filter(p => p.status === 'recovering' || p.status === 'stable').length}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stable Conditions</span>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {mockPatients.filter(p => p.status === 'stable').length}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Requiring Attention</span>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium">
                            {mockPatients.filter(p => p.status === 'active' || p.status === 'critical').length}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Recovery Time</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">5.2 days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medication Management Overview */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Medication Management Overview</CardTitle>
                    <CardDescription>Active prescriptions and medication monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Most Prescribed Medications</h4>
                        <div className="space-y-2">
                          {['Lisinopril', 'Metformin', 'Tramadol', 'Prenatal Vitamins'].map((med, index) => (
                            <div key={med} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">{med}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.floor(Math.random() * 5) + 1} patients
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Drug Interactions Detected</h4>
                        <div className="space-y-2">
                          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="text-sm font-medium text-yellow-800">Minor Interactions</div>
                            <div className="text-xs text-yellow-600">2 cases require monitoring</div>
                          </div>
                          <div className="p-2 bg-red-50 border border-red-200 rounded">
                            <div className="text-sm font-medium text-red-800">Major Interactions</div>
                            <div className="text-xs text-red-600">0 cases - all clear</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Adherence Monitoring</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">High Adherence</span>
                            <span className="text-sm font-medium text-green-600">85%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Medium Adherence</span>
                            <span className="text-sm font-medium text-yellow-600">12%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Low Adherence</span>
                            <span className="text-sm font-medium text-red-600">3%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AuthGuard>
    </MainLayout>
  );
}
