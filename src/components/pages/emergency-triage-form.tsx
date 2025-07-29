'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { emergencyTriage } from '@/ai/flows/ai-hospital-services';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, Clock, TestTube, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe symptoms in detail'),
  vitals: z.string().min(5, 'Please provide vital signs'),
  consciousness: z.string().min(3, 'Please describe consciousness level'),
  painLevel: z.number().min(1).max(10),
});

export function EmergencyTriageForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { symptoms: '', vitals: '', consciousness: '', painLevel: 5 },
  });

  const painLevel = form.watch('painLevel');

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
          symptoms: `${values.symptoms}\n\nPATIENT CONTEXT:\n${aiContext}`,
        };
      }
      
      const analysis = await emergencyTriage(enhancedValues);
      setResult(analysis);
    } catch (error) {
      console.error('Emergency triage error:', error);
    } finally {
      setLoading(false);
    }
  }

  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    if (level <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Alert className="mb-8 border-red-200 bg-red-50">
        <Phone className="h-4 w-4" />
        <AlertDescription className="text-red-800">
          <strong>EMERGENCY:</strong> If this is a life-threatening emergency, call 911 immediately. This AI triage is for assessment only.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg mb-8">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Emergency Symptoms</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe all symptoms, when they started, severity..." className="min-h-[100px]" {...field} />
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
                    <FormLabel>Vital Signs</FormLabel>
                    <FormControl>
                      <Input placeholder="Blood pressure, heart rate, temperature, breathing rate..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consciousness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consciousness Level</FormLabel>
                    <FormControl>
                      <Input placeholder="Alert, confused, drowsy, unconscious..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="painLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Pain Level: <span className={getPainColor(painLevel)}>{painLevel}/10</span>
                    </FormLabel>
                    <FormControl>
                      <Slider min={1} max={10} step={1} value={[field.value]} onValueChange={(value) => field.onChange(value[0])} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg" className="bg-red-600 hover:bg-red-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Emergency Triage in Progress...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Start Emergency Triage
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
                Triage Level: {result.triageLevel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800">{result.immediateActions}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Clock className="h-6 w-6" />
                Estimated Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">{result.estimatedWaitTime}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <TestTube className="h-6 w-6" />
                Required Tests & Procedures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">{result.requiredTests}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}