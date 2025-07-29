'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { pharmacyConsultation } from '@/ai/flows/ai-hospital-services';
import { UserDataStore } from '@/lib/user-data-store';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Pill, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  queryType: z.string().min(1, 'Please select query type'),
  userProfile: z.string().min(1, 'Please select your health profile'),
  medications: z.string(),
  allergies: z.string(),
  conditions: z.string(),
  newPrescription: z.string().optional(),
  labResults: z.string().optional(),
  doctorNotes: z.string().optional(),
  symptoms: z.string().optional(),
});

export function PharmacyConsultationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      queryType: '',
      userProfile: '',
      medications: '',
      allergies: '',
      conditions: '',
      newPrescription: '',
      labResults: '',
      doctorNotes: '',
      symptoms: '',
    },
  });
  
  const queryType = form.watch('queryType');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // Get current user ID from localStorage
      const userId = localStorage.getItem('currentUserId');
      let enhancedValues = values;
      
      if (userId) {
        // Fetch user's comprehensive data
        const userData = await UserDataStore.getComprehensiveUserData(userId);
        const aiContext = await UserDataStore.prepareAIContext(userId);
        
        // Enhance form data with stored user information
        enhancedValues = {
          ...values,
          medications: userData.medications.filter(m => m.status === 'active').map(m => `${m.medication} ${m.dosage}`).join(', ') || values.medications,
          allergies: userData.profile?.allergies.join(', ') || values.allergies,
          conditions: userData.profile?.conditions.join(', ') || values.conditions,
          labResults: values.queryType === 'lab_based' ? (values.labResults || userData.labResults.slice(-2).map(l => `${l.testType}: ${l.results}`).join('; ')) : values.labResults,
          doctorNotes: values.queryType === 'doctor_consultation' ? (values.doctorNotes || userData.consultations.slice(-1)[0]?.recommendations || '') : values.doctorNotes,
        };
        
        // Add AI context for better recommendations
        enhancedValues.userProfile = `${enhancedValues.userProfile}\n\nSTORED DATA CONTEXT:\n${aiContext}`;
      }
      
      const analysis = await pharmacyConsultation(enhancedValues);
      setResult(analysis);
      
      // Store consultation result if user is logged in
      if (userId && values.queryType === 'doctor_consultation') {
        await UserDataStore.addConsultation({
          userId,
          doctorName: 'AI Pharmacy Consultant',
          specialty: 'Pharmacy',
          diagnosis: 'Medication Review',
          recommendations: analysis.recommendedMedicines,
          prescriptions: analysis.recommendedMedicines,
          followUp: analysis.monitoringRequirements,
          date: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Pharmacy consultation error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg mb-8">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="queryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Service Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="prescription_check">Prescription Review</SelectItem>
                          <SelectItem value="lab_based">Lab-Based Recommendations</SelectItem>
                          <SelectItem value="doctor_consultation">Doctor Consultation Follow-up</SelectItem>
                          <SelectItem value="general_query">General Medicine Query</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="userProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Health Profile</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your profile" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Adult</SelectItem>
                          <SelectItem value="pregnant">Pregnant</SelectItem>
                          <SelectItem value="pediatric">Pediatric (Child)</SelectItem>
                          <SelectItem value="elderly">Elderly (65+)</SelectItem>
                          <SelectItem value="diabetes">Diabetes</SelectItem>
                          <SelectItem value="hypertension">Hypertension</SelectItem>
                          <SelectItem value="cancer">Cancer Patient</SelectItem>
                          <SelectItem value="hiv">HIV/AIDS</SelectItem>
                          <SelectItem value="kidney_disease">Kidney Disease</SelectItem>
                          <SelectItem value="liver_disease">Liver Disease</SelectItem>
                          <SelectItem value="heart_disease">Heart Disease</SelectItem>
                          <SelectItem value="immunocompromised">Immunocompromised</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {queryType === 'prescription_check' && (
                <FormField
                  control={form.control}
                  name="newPrescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">New Prescription</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the new medication prescribed..." className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {queryType === 'lab_based' && (
                <FormField
                  control={form.control}
                  name="labResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Laboratory Results</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste your lab results here... (Leave empty to use stored lab data)" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {queryType === 'doctor_consultation' && (
                <FormField
                  control={form.control}
                  name="doctorNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Doctor's Notes/Recommendations</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter doctor's consultation notes... (Leave empty to use stored consultation data)" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {queryType === 'general_query' && (
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Symptoms or Health Concerns</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your symptoms or health concerns..." className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List all current medications and dosages..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Known Allergies</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Drug allergies, reactions..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Current health conditions..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={loading} size="lg" className="bg-green-600 hover:bg-green-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Medications...
                  </>
                ) : (
                  <>
                    <Pill className="mr-2 h-4 w-4" />
                    Get Pharmacy Consultation
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Pill className="h-6 w-6" />
                Recommended Medicines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 whitespace-pre-wrap">{result.recommendedMedicines}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Info className="h-6 w-6" />
                Medicine Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 whitespace-pre-wrap">{result.medicineDescriptions}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <RefreshCw className="h-6 w-6" />
                How Medicines Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 whitespace-pre-wrap">{result.medicineRoles}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <AlertTriangle className="h-6 w-6" />
                Side Effects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 whitespace-pre-wrap">{result.sideEffects}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <Info className="h-6 w-6" />
                Treatment Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-teal-800 whitespace-pre-wrap">{result.treatmentDuration}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertTriangle className="h-6 w-6" />
                Drug Interactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800 whitespace-pre-wrap">{result.interactions}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <Info className="h-6 w-6" />
                Special Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-800 whitespace-pre-wrap">{result.specialConsiderations}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <RefreshCw className="h-6 w-6" />
                Monitoring Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800 whitespace-pre-wrap">{result.monitoringRequirements}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}