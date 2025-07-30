'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { surgeryPlanning } from '@/ai/flows/ai-hospital-services';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Activity, AlertTriangle, Heart, Calendar, Info } from 'lucide-react';

const formSchema = z.object({
  procedure: z.string().min(5, 'Please specify the surgical procedure'),
  patientProfile: z.string().min(10, 'Please provide patient profile details'),
  medicalHistory: z.string().min(10, 'Please provide medical history'),
  riskFactors: z.string(),
});

export function SurgeryPlanningForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { procedure: '', patientProfile: '', medicalHistory: '', riskFactors: '' },
  });

  // Auto-fill form with user health profile data
  useEffect(() => {
    const loadUserHealthProfile = async () => {
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        try {
          const userData = await UserDataStore.getComprehensiveUserData(userId);
          if (userData.profile) {
            const patientProfile = `Age: ${userData.profile.age}, Gender: ${userData.profile.gender}, Health Profile: ${userData.profile.healthProfile}`;
            const medicalHistory = `Conditions: ${userData.profile.conditions.join(', ') || 'None'}\nAllergies: ${userData.profile.allergies.join(', ') || 'None'}\nCurrent Medications: ${userData.medications?.filter(m => m.status === 'active').map(m => `${m.medication} ${m.dosage}`).join(', ') || 'None'}`;
            const riskFactors = `Allergies: ${userData.profile.allergies.join(', ') || 'None'}\nAge: ${userData.profile.age}\nExisting Conditions: ${userData.profile.conditions.join(', ') || 'None'}`;
            
            form.reset({
              procedure: '',
              patientProfile: patientProfile,
              medicalHistory: medicalHistory,
              riskFactors: riskFactors,
            });
          }
        } catch (error) {
          console.error('Error loading user health profile:', error);
        }
      }
    };

    loadUserHealthProfile();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      let enhancedValues = values;
      
      if (currentUser) {
        const userData = await UserDataStore.getComprehensiveUserData(currentUser.userId);
        const aiContext = await UserDataStore.prepareAIContext(currentUser.userId);
        
        enhancedValues = {
          ...values,
          patientProfile: `${values.patientProfile}\n\nSTORED PATIENT DATA:\n${aiContext}`,
          medicalHistory: userData.profile?.conditions.join(', ') || values.medicalHistory,
          riskFactors: `${values.riskFactors}\nAllergies: ${userData.profile?.allergies.join(', ') || 'None'}`,
        };
      }
      
      const analysis = await surgeryPlanning(enhancedValues);
      setResult(analysis);
    } catch (error) {
      console.error('Surgery planning error:', error);
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
              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Surgical Procedure</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Laparoscopic Cholecystectomy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Profile</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Age, weight, general health status..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Previous surgeries, chronic conditions..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riskFactors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Factors</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Smoking, obesity, medications..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg" className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Planning Surgery...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Create Surgery Plan
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
                <Info className="h-6 w-6" />
                Pre-Operative Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 whitespace-pre-wrap">{result.preOpPlan}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertTriangle className="h-6 w-6" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800 whitespace-pre-wrap">{result.riskAssessment}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Heart className="h-6 w-6" />
                Post-Operative Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 whitespace-pre-wrap">{result.postOpCare}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertTriangle className="h-6 w-6" />
                Potential Complications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800 whitespace-pre-wrap">{result.complications}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}