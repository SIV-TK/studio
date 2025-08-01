'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, UserPlus, Heart, Thermometer, Droplets, Zap, Search, Filter, Bot, Wifi, WifiOff, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/layout/main-layout';

const patientSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Valid phone required'),
  age: z.coerce.number().min(1).max(120),
  gender: z.string().min(1, 'Gender required'),
  bloodPressure: z.string().optional(),
  temperature: z.coerce.number().optional(),
  heartRate: z.coerce.number().optional(),
  symptoms: z.string().min(1, 'Symptoms required'),
  department: z.string().min(1, 'Department required'),
  priority: z.string().min(1, 'Priority required'),
  insurance: z.string().optional(),
});

export default function PatientManagementPage() {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiRecommending, setAiRecommending] = useState(false);
  const [vitalMachines] = useState([
    { id: 'bp1', name: 'BP Monitor A', type: 'bloodPressure', status: 'online', location: 'Room 101' },
    { id: 'temp1', name: 'Thermometer B', type: 'temperature', status: 'online', location: 'Room 102' },
    { id: 'hr1', name: 'Heart Monitor C', type: 'heartRate', status: 'offline', location: 'Room 103' },
  ]);
  const [fetchingVitals, setFetchingVitals] = useState<string | null>(null);
  const [patientCredentials, setPatientCredentials] = useState<any>(null);
  const [fetchingInsurance, setFetchingInsurance] = useState(false);
  const [isDoctorStatusCollapsed, setIsDoctorStatusCollapsed] = useState(false);
  const [insuranceOptions] = useState([
    'NHIF - National Hospital Insurance Fund',
    'AAR Insurance',
    'Jubilee Insurance',
    'Madison Insurance',
    'CIC Insurance',
    'Self-Pay',
    'Other'
  ]);
  const [doctorAvailability, setDoctorAvailability] = useState({
    Emergency: { name: 'Dr. Smith', status: 'present' },
    Cardiology: { name: 'Dr. Johnson', status: 'absent' },
    Surgery: { name: 'Dr. Williams', status: 'present' },
    ICU: { name: 'Dr. Brown', status: 'present' },
    Pediatrics: { name: 'Dr. Davis', status: 'absent' },
    General: { name: 'Dr. Wilson', status: 'present' },
  });
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('patients') || '[]';
    try {
      setPatients(JSON.parse(stored));
    } catch {
      setPatients([]);
    }
  }, []);

  const getAiRecommendation = async (symptoms: string, age: number) => {
    setAiRecommending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const keywords = symptoms.toLowerCase();
    let recommendation = 'General';
    
    if (keywords.includes('chest') || keywords.includes('heart')) recommendation = 'Cardiology';
    else if (keywords.includes('emergency') || keywords.includes('urgent')) recommendation = 'Emergency';
    else if (keywords.includes('surgery') || keywords.includes('operation')) recommendation = 'Surgery';
    else if (age < 18) recommendation = 'Pediatrics';
    else if (keywords.includes('critical') || keywords.includes('icu')) recommendation = 'ICU';
    
    // Check if recommended doctor is available, find alternative if not
    const doctorStatus = doctorAvailability[recommendation as keyof typeof doctorAvailability];
    if (doctorStatus?.status === 'absent') {
      // Find available alternative department
      const availableDepts = Object.entries(doctorAvailability)
        .filter(([_, doctor]) => doctor.status === 'present')
        .map(([dept]) => dept);
      
      if (availableDepts.length > 0) {
        recommendation = availableDepts[0]; // Use first available department
      }
    }
    
    setAiRecommending(false);
    return recommendation;
  };

  const fetchVitalSigns = async (machineId: string) => {
    setFetchingVitals(machineId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const machine = vitalMachines.find(m => m.id === machineId);
    let value = '';
    
    if (machine?.type === 'bloodPressure') value = '120/80';
    else if (machine?.type === 'temperature') value = '36.5';
    else if (machine?.type === 'heartRate') value = '72';
    
    setFetchingVitals(null);
    return value;
  };

  const fetchInsuranceData = async (patientName: string, phone: string) => {
    setFetchingInsurance(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulate database lookup
    const mockDatabase = {
      'john doe': { provider: 'NHIF - National Hospital Insurance Fund', policy: 'NHIF001234', status: 'Active' },
      'jane smith': { provider: 'AAR Insurance', policy: 'AAR567890', status: 'Active' },
      'mike johnson': { provider: 'Jubilee Insurance', policy: 'JUB123456', status: 'Expired' }
    };
    
    const key = patientName.toLowerCase();
    const insuranceData = mockDatabase[key as keyof typeof mockDatabase];
    
    setFetchingInsurance(false);
    return insuranceData || null;
  };

  const toggleDoctorStatus = (department: string) => {
    setDoctorAvailability(prev => ({
      ...prev,
      [department]: {
        ...prev[department as keyof typeof prev],
        status: prev[department as keyof typeof prev].status === 'present' ? 'absent' : 'present'
      }
    }));
  };

  const generateCredentials = (patientName: string) => {
    const username = `patient_${Date.now().toString().slice(-6)}`;
    const password = Math.random().toString(36).slice(-8);
    return { username, password, portalUrl: '/patient-portal' };
  };

  const addPatient = (data: any) => {
    const sanitizedData = {
      name: String(data.name || '').replace(/[\r\n]/g, ' '),
      phone: String(data.phone || '').replace(/[\r\n]/g, ' '),
      age: Number(data.age) || 0,
      gender: String(data.gender || '').replace(/[\r\n]/g, ' '),
      bloodPressure: String(data.bloodPressure || '').replace(/[\r\n]/g, ' '),
      temperature: Number(data.temperature) || 0,
      heartRate: Number(data.heartRate) || 0,
      symptoms: String(data.symptoms || '').replace(/[\r\n]/g, ' '),
      department: String(data.department || '').replace(/[\r\n]/g, ' '),
      priority: String(data.priority || '').replace(/[\r\n]/g, ' '),
      insurance: String(data.insurance || '').replace(/[\r\n]/g, ' '),
    };
    const credentials = generateCredentials(sanitizedData.name);
    const newPatient = {
      id: Date.now(),
      ...sanitizedData,
      credentials,
      status: 'Active',
      admittedAt: new Date().toISOString(),
      treatmentTracking: {
        enabled: true,
        currentStep: 'admission',
        startedAt: new Date().toISOString()
      }
    };
    const updated = [...patients, newPatient];
    setPatients(updated);
    try {
      localStorage.setItem('patients', JSON.stringify(updated));
    } catch (error) {
      console.error('Storage error');
    }
    return newPatient;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      phone: '',
      age: 0,
      gender: '',
      bloodPressure: '',
      temperature: 0,
      heartRate: 0,
      symptoms: '',
      department: '',
      priority: '',
      insurance: '',
    },
  });

  function onSubmit(values: z.infer<typeof patientSchema>) {
    setLoading(true);
    try {
      const patient = addPatient(values);
      setPatientCredentials(patient.credentials);
      toast({
        title: 'Success',
        description: 'Patient registered successfully.',
      });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const sanitizedSearch = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(sanitizedSearch) ||
    patient.department?.toLowerCase().includes(sanitizedSearch)
  );

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-xl text-gray-600">Streamlined Patient Care & Administration</p>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register Patient</TabsTrigger>
            <TabsTrigger value="patients">Patient List</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-6">
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader className="bg-orange-100 border-b border-orange-200 cursor-pointer" onClick={() => setIsDoctorStatusCollapsed(!isDoctorStatusCollapsed)}>
                <CardTitle className="flex items-center justify-between text-orange-800">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    Doctor Availability Status
                  </div>
                  {isDoctorStatusCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
              {!isDoctorStatusCollapsed && (
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(doctorAvailability).map(([dept, doctor]) => (
                      <div key={dept} className={`p-3 rounded-lg border ${
                        doctor.status === 'present' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{dept}</h4>
                            <p className="text-xs text-gray-600">{doctor.name}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDoctorStatus(dept)}
                            className={`h-6 text-xs ${
                              doctor.status === 'present' 
                                ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
                                : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                            }`}
                          >
                            {doctor.status === 'present' ? 'Present' : 'Absent'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="bg-blue-100 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  Patient Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+254712345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 mb-4">
                      <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-green-600" />
                        Connected Vital Machines
                      </h3>
                      <div className="grid md:grid-cols-3 gap-3 mb-4">
                        {vitalMachines.map((machine) => (
                          <div key={machine.id} className={`p-3 rounded border text-sm ${
                            machine.status === 'online' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{machine.name}</span>
                              {machine.status === 'online' ? 
                                <Wifi className="h-3 w-3 text-green-600" /> : 
                                <WifiOff className="h-3 w-3 text-red-600" />
                              }
                            </div>
                            <p className="text-xs text-gray-600">{machine.location}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          Vital Signs
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const onlineMachines = vitalMachines.filter(m => m.status === 'online');
                            if (onlineMachines.length > 0) {
                              for (const machine of onlineMachines) {
                                const value = await fetchVitalSigns(machine.id);
                                if (machine.type === 'bloodPressure') form.setValue('bloodPressure', value);
                                else if (machine.type === 'temperature') form.setValue('temperature', Number(value));
                                else if (machine.type === 'heartRate') form.setValue('heartRate', Number(value));
                              }
                              toast({ title: 'Vitals Fetched', description: 'All available vital signs updated' });
                            } else {
                              toast({ variant: 'destructive', title: 'No Machines', description: 'No online machines available' });
                            }
                          }}
                          disabled={fetchingVitals !== null}
                          className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                        >
                          {fetchingVitals ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              Fetching...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Fetch All Vitals
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="bloodPressure"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Droplets className="h-4 w-4" />
                                Blood Pressure
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="120/80" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="temperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4" />
                                Temperature (°C)
                              </FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" placeholder="36.5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="heartRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Heart Rate (bpm)
                              </FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="72" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between">
                              Department
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  const symptoms = form.getValues('symptoms');
                                  const age = form.getValues('age');
                                  if (symptoms && age) {
                                    const recommendation = await getAiRecommendation(symptoms, age);
                                    const doctorStatus = doctorAvailability[recommendation as keyof typeof doctorAvailability];
                                    field.onChange(recommendation);
                                    toast({
                                      title: 'AI Recommendation',
                                      description: `Recommended: ${recommendation} - Doctor ${doctorStatus?.status === 'present' ? 'Available' : 'Unavailable'}`,
                                      variant: doctorStatus?.status === 'absent' ? 'destructive' : 'default',
                                    });
                                  } else {
                                    toast({
                                      variant: 'destructive',
                                      title: 'Missing Info',
                                      description: 'Please fill symptoms and age first.',
                                    });
                                  }
                                }}
                                disabled={aiRecommending}
                                className="h-6 text-xs"
                              >
                                {aiRecommending ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    AI...
                                  </>
                                ) : (
                                  <>
                                    <Bot className="h-3 w-3 mr-1" />
                                    AI
                                  </>
                                )}
                              </Button>
                            </FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                const doctorStatus = doctorAvailability[value as keyof typeof doctorAvailability];
                                if (doctorStatus?.status === 'absent') {
                                  toast({
                                    variant: 'destructive',
                                    title: 'Doctor Unavailable',
                                    description: `${doctorStatus.name} is currently absent. Please select another department.`,
                                  });
                                  return;
                                }
                                field.onChange(value);
                                toast({
                                  title: 'Department Selected',
                                  description: `Assigned to ${value} - ${doctorStatus?.name} is available`,
                                });
                              }} 
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(doctorAvailability)
                                  .filter(([_, doctor]) => doctor.status === 'present')
                                  .map(([dept, doctor]) => (
                                    <SelectItem key={dept} value={dept}>
                                      <div className="flex items-center justify-between w-full">
                                        <span>{dept === 'General' ? 'General Medicine' : dept}</span>
                                        <span className="text-xs ml-2 text-green-600">
                                          ✓ {doctor.name} Available
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))
                                }
                                {Object.entries(doctorAvailability)
                                  .filter(([_, doctor]) => doctor.status === 'absent')
                                  .map(([dept, doctor]) => (
                                    <SelectItem key={dept} value={dept} disabled className="text-red-400 bg-red-50">
                                      <div className="flex items-center justify-between w-full">
                                        <span>{dept === 'General' ? 'General Medicine' : dept}</span>
                                        <span className="text-xs ml-2 text-red-500">
                                          ✗ {doctor.name} Unavailable
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="insurance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between">
                              Insurance
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  const name = form.getValues('name');
                                  const phone = form.getValues('phone');
                                  if (name && phone) {
                                    const insuranceData = await fetchInsuranceData(name, phone);
                                    if (insuranceData) {
                                      field.onChange(insuranceData.provider);
                                      toast({
                                        title: 'Insurance Found',
                                        description: `${insuranceData.provider} - ${insuranceData.status}`,
                                      });
                                    } else {
                                      toast({
                                        title: 'No Insurance Found',
                                        description: 'Please select from options below',
                                      });
                                    }
                                  } else {
                                    toast({
                                      variant: 'destructive',
                                      title: 'Missing Info',
                                      description: 'Please fill name and phone first.',
                                    });
                                  }
                                }}
                                disabled={fetchingInsurance}
                                className="h-6 text-xs"
                              >
                                {fetchingInsurance ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    Fetching...
                                  </>
                                ) : (
                                  'Auto-Fetch'
                                )}
                              </Button>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select insurance" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {insuranceOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="symptoms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Symptoms & Chief Complaint</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe current symptoms and primary reason for visit..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering Patient...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register Patient
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {patientCredentials && (
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                <CardHeader className="bg-green-100 border-b border-green-200">
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Patient Portal Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-700"><strong>Username:</strong> {patientCredentials.username}</p>
                      <p className="text-green-700"><strong>Password:</strong> {patientCredentials.password}</p>
                    </div>
                    <div>
                      <p className="text-green-700"><strong>Portal URL:</strong> {patientCredentials.portalUrl}</p>
                      <p className="text-green-600 text-xs mt-2">Provide these credentials to the patient</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setPatientCredentials(null)}
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="bg-purple-100 border-b border-purple-200">
                <CardTitle className="flex items-center justify-between text-purple-800">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Patient List ({patients.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {patients.length === 0 ? 'No patients registered yet' : 'No patients match your search'}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredPatients.map((patient) => (
                      <div key={patient.id} className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{String(patient.name || 'Unknown')}</h3>
                              <p className="text-gray-600">{patient.age || 0} years • {String(patient.gender || 'N/A')}</p>
                              <p className="text-sm text-gray-500">{String(patient.phone || 'N/A')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {String(patient.department || 'N/A')}
                            </Badge>
                            <Badge className={getPriorityColor(String(patient.priority || 'Low'))}>
                              {String(patient.priority || 'Low')}
                            </Badge>
                            <Badge variant="secondary">
                              {patient.status}
                            </Badge>
                          </div>
                        </div>
                        {patient.symptoms && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                            <strong>Symptoms:</strong> {String(patient.symptoms).substring(0, 200)}
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                          <span>Admitted: {new Date(patient.admittedAt || Date.now()).toLocaleDateString()}</span>
                          {patient.bloodPressure && <span>BP: {String(patient.bloodPressure)}</span>}
                          {patient.temperature && <span>Temp: {Number(patient.temperature)}°C</span>}
                          {patient.heartRate && <span>HR: {Number(patient.heartRate)} bpm</span>}
                        </div>
                        {patient.insurance && (
                          <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded text-xs">
                            <strong className="text-blue-700">Insurance:</strong> <span className="text-blue-600">{String(patient.insurance)}</span>
                          </div>
                        )}
                        {patient.credentials && (
                          <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded text-xs">
                            <strong className="text-green-700">Portal Access:</strong> <span className="text-green-600">{patient.credentials.username}</span>
                          </div>
                        )}
                        {patient.department && (
                          <div className={`mt-2 p-2 rounded text-xs border ${
                            doctorAvailability[patient.department as keyof typeof doctorAvailability]?.status === 'present'
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                          }`}>
                            <strong className={doctorAvailability[patient.department as keyof typeof doctorAvailability]?.status === 'present' ? 'text-green-700' : 'text-red-700'}>
                              Doctor Status:
                            </strong>
                            <span className={doctorAvailability[patient.department as keyof typeof doctorAvailability]?.status === 'present' ? 'text-green-600' : 'text-red-600'}>
                              {' '}{doctorAvailability[patient.department as keyof typeof doctorAvailability]?.name} - {doctorAvailability[patient.department as keyof typeof doctorAvailability]?.status === 'present' ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}