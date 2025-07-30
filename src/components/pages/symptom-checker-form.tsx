'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  symptomChecker,
  type SymptomCheckerOutput,
} from '@/ai/flows/symptom-checker';
import { UserDataStore } from '@/lib/user-data-store';
import { AuthService } from '@/lib/auth-service';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Search, AlertTriangle, Info, Clock, Phone } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIWritingAssistant } from '@/components/ui/ai-writing-assistant';
import { useSession } from '@/hooks/use-session';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in detail'),
  medicalHistory: z.string().min(5, 'Please provide relevant medical history'),
  age: z.coerce.number().min(1).max(120, 'Please enter a valid age'),
  severity: z.string().min(1, 'Please select symptom severity'),
});

export function SymptomCheckerForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomCheckerOutput | null>(null);
  const { toast } = useToast();
  const { session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      medicalHistory: '',
      age: 0,
      severity: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const currentUser = await AuthService.getCurrentUser();
      let enhancedValues = values;
      
      if (currentUser) {
        const userData = await UserDataStore.getComprehensiveUserData(currentUser.userId);
        const aiContext = await UserDataStore.prepareAIContext(currentUser.userId);
        
        enhancedValues = {
          ...values,
          age: userData.profile?.age || values.age,
          medicalHistory: `${values.medicalHistory}\n\nSTORED MEDICAL HISTORY:\n${aiContext}`,
        };
      }
      
      const analysis = await symptomChecker(enhancedValues);
      setResult(analysis);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis failed',
        description: 'Unable to analyze symptoms. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const getUrgencyColor = (urgency: string) => {
    if (urgency.toLowerCase().includes('emergency')) return 'bg-red-100 border-red-300 text-red-800';
    if (urgency.toLowerCase().includes('high')) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (urgency.toLowerCase().includes('medium')) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-green-100 border-green-300 text-green-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          This tool uses real-time medical research data for enhanced analysis. Results are preliminary - always consult a healthcare professional for proper diagnosis and treatment.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Describe Your Symptoms</FormLabel>
                    <FormControl>
                      <AIWritingAssistant
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="e.g., Headache for 2 days, fever, nausea..."
                        context="symptoms"
                        userProfile={session?.healthPreferences ? {
                          age: session.healthPreferences.age,
                          gender: session.healthPreferences.gender,
                          conditions: session.healthPreferences.conditions,
                          healthProfile: session.healthPreferences.healthProfile
                        } : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
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
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptom Severity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History & Current Medications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Diabetes, taking metformin, no known allergies..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with Latest Research...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze with Real-Time Data
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(loading || result) && (
        <div className="mt-10 space-y-6">
          {loading ? (
            <>
              <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
              <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
            </>
          ) : (
            result && (
              <>
                <Card className={`border-2 ${getUrgencyColor(result.urgencyLevel)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6" />
                      Urgency Level: {result.urgencyLevel}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-6 w-6 text-blue-600" />
                      Possible Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{result.possibleConditions}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-6 w-6 text-green-600" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{result.recommendations}</p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <Phone className="h-6 w-6" />
                      When to Seek Help
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-red-700">{result.whenToSeekHelp}</p>
                  </CardContent>
                </Card>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}