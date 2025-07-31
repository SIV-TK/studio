'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, UserPlus, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/layout/main-layout';

const admissionSchema = z.object({
  age: z.coerce.number().min(1).max(120),
  gender: z.string().min(1, 'Please select gender'),
  medicalHistory: z.string().min(1, 'Please provide medical history'),
  currentSymptoms: z.string().min(1, 'Please describe current symptoms'),
  vitalSigns: z.string().min(1, 'Please provide vital signs'),
  insurance: z.string().min(1, 'Please provide insurance information'),
  admissionType: z.string().min(1, 'Please select admission type'),
  chiefComplaint: z.string().min(1, 'Please describe chief complaint'),
  referringPhysician: z.string(),
});

export default function PatientManagementPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof admissionSchema>>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      age: 0,
      gender: '',
      medicalHistory: '',
      currentSymptoms: '',
      vitalSigns: '',
      insurance: '',
      admissionType: '',
      chiefComplaint: '',
      referringPhysician: '',
    },
  });

  async function onSubmit(values: z.infer<typeof admissionSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'patient-management',
          data: {
            patientInfo: {
              age: values.age,
              gender: values.gender,
              medicalHistory: values.medicalHistory,
              currentSymptoms: values.currentSymptoms,
              vitalSigns: values.vitalSigns,
              insurance: values.insurance,
            },
            admissionType: values.admissionType,
            chiefComplaint: values.chiefComplaint,
            referringPhysician: values.referringPhysician || undefined,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get admission plan');
      }

      const admission = await response.json();

      setResults(admission);
      toast({
        title: 'Admission Plan Generated',
        description: 'Patient admission assessment completed successfully.',
      });
    } catch (error) {
      console.error('Admission planning error:', error);
      toast({
        variant: 'destructive',
        title: 'Planning Failed',
        description: 'Unable to generate admission plan. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'text-red-600 bg-red-50 border-red-200';
    if (priority <= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return 'Critical';
    if (priority === 2) return 'High';
    if (priority === 3) return 'Moderate';
    if (priority === 4) return 'Low';
    return 'Routine';
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Management System</h1>
          <p className="text-xl text-gray-600">Intelligent Patient Admission and Care Coordination</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Admission Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                Patient Admission
              </CardTitle>
              <CardDescription>
                Complete patient information for optimal admission planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Patient Demographics */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="45" {...field} />
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

                  {/* Admission Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="admissionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                              <SelectItem value="elective">Elective</SelectItem>
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
                          <FormLabel>Insurance Information</FormLabel>
                          <FormControl>
                            <Input placeholder="Medicare, Private, Self-pay..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Chief Complaint */}
                  <FormField
                    control={form.control}
                    name="chiefComplaint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chief Complaint</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Primary reason for admission..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Current Symptoms */}
                  <FormField
                    control={form.control}
                    name="currentSymptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Symptoms</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of current symptoms..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Medical History */}
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Past medical history, surgeries, chronic conditions..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Vital Signs */}
                  <FormField
                    control={form.control}
                    name="vitalSigns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vital Signs</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="BP: 120/80, HR: 72, Temp: 98.6°F, RR: 16, O2 Sat: 98%"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Referring Physician */}
                  <FormField
                    control={form.control}
                    name="referringPhysician"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referring Physician (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Smith, Internal Medicine" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Admission...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Generate Admission Plan
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-indigo-700">Admission Plan & Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Priority Level */}
                <div className={`p-4 rounded-lg border ${getPriorityColor(results.priorityLevel)}`}>
                  <h3 className="font-semibold mb-2">Priority Level</h3>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">
                      {results.priorityLevel}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{getPriorityLabel(results.priorityLevel)}</span>
                      <span className="text-sm opacity-75">
                        {results.priorityLevel <= 2 ? 'Immediate attention required' : 
                         results.priorityLevel <= 3 ? 'Prompt care needed' : 'Standard processing'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Department Assignment */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Department Assignment</h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">{results.departmentAssignment}</p>
                  </div>
                </div>

                {/* Preliminary Diagnosis */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Preliminary Diagnosis</h3>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-purple-800">{results.preliminaryDiagnosis}</p>
                  </div>
                </div>

                {/* Estimated Stay */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Estimated Stay</h3>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                      <p className="text-green-800 font-medium">{results.estimatedStayDuration}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Status</h3>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">Plan Generated</span>
                    </div>
                  </div>
                </div>

                {/* Immediate Orders */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Immediate Orders</h3>
                  <div className="space-y-2">
                    {results.immediateOrders?.map((order: string, index: number) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
                        <Activity className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-yellow-800">{order}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Requirements */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Resource Requirements</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{results.resourceRequirements}</p>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Risk Assessment
                  </h3>
                  <p className="text-orange-800 whitespace-pre-wrap">{results.riskAssessment}</p>
                </div>

                {/* Admission Plan */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Comprehensive Admission Plan</h3>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-indigo-800 whitespace-pre-wrap">{results.admissionPlan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
