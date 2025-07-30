'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { icuMonitoring } from '@/ai/flows/ai-hospital-services';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Activity, AlertTriangle, TrendingUp, Clipboard } from 'lucide-react';

const formSchema = z.object({
  vitals: z.string().min(10, 'Please provide vital signs'),
  labValues: z.string().min(10, 'Please provide lab values'),
  medications: z.string().min(5, 'Please list current medications'),
  condition: z.string().min(5, 'Please specify the condition'),
});

export function ICUMonitoringForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { vitals: '', labValues: '', medications: '', condition: '' },
  });

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
          medications: userData.medications?.filter(m => m.status === 'active').map(m => `${m.medication} ${m.dosage}`).join(', ') || values.medications,
          condition: userData.profile?.conditions[0] || values.condition,
          vitals: `${values.vitals}\n\nPATIENT CONTEXT:\n${aiContext}`,
        };
      }
      
      const analysis = await icuMonitoring(enhancedValues);
      setResult(analysis);
    } catch (error) {
      console.error('ICU monitoring error:', error);
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
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Primary Condition</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sepsis, ARDS, Post-surgical" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vitals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Vital Signs</FormLabel>
                      <FormControl>
                        <Textarea placeholder="HR: 95, BP: 110/70, RR: 18, O2Sat: 96%, Temp: 38.2°C" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="labValues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Laboratory Values</FormLabel>
                    <FormControl>
                      <Textarea placeholder="WBC: 15.2, Hgb: 9.8, Plt: 180, Cr: 1.8, BUN: 45, Lactate: 3.2..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications & Drips</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Norepinephrine 0.1 mcg/kg/min, Propofol 20 mcg/kg/min, Vancomycin..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg" className="bg-red-600 hover:bg-red-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing ICU Data...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Generate ICU Assessment
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertTriangle className="h-6 w-6" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800 whitespace-pre-wrap">{result.criticalAlerts}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Activity className="h-6 w-6" />
                Treatment Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 whitespace-pre-wrap">{result.treatmentAdjustments}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <TrendingUp className="h-6 w-6" />
                Prognosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 whitespace-pre-wrap">{result.prognosis}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Clipboard className="h-6 w-6" />
                Nursing Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 whitespace-pre-wrap">{result.nursingOrders}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}