'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  analyzeLabResults,
  type LabResultsOutput,
} from '@/ai/flows/lab-results-analyzer';
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
import { Loader2, FileText, AlertTriangle, Heart, Utensils, Activity, Pill, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  labResults: z.string().min(50, 'Please provide detailed lab results'),
  patientAge: z.coerce.number().min(1).max(120, 'Please enter a valid age'),
  patientGender: z.string().min(1, 'Please select gender'),
  currentMedications: z.string(),
  existingConditions: z.string(),
});

export function LabResultsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LabResultsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      labResults: '',
      patientAge: 0,
      patientGender: '',
      currentMedications: '',
      existingConditions: '',
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
          patientAge: userData.profile?.age || values.patientAge,
          patientGender: userData.profile?.gender || values.patientGender,
          currentMedications: userData.medications?.filter(m => m.status === 'active').map(m => `${m.medication} ${m.dosage}`).join(', ') || values.currentMedications,
          existingConditions: userData.profile?.conditions.join(', ') || values.existingConditions,
          labResults: values.labResults || userData.labResults?.slice(-2).map(l => `${l.testType}: ${l.results}`).join('; ') || '',
        };
        
        // Store new lab result
        if (values.labResults) {
          await UserDataStore.addLabResult({
            userId: currentUser.userId,
            testType: 'Manual Entry',
            results: values.labResults,
            date: new Date().toISOString(),
            status: 'normal',
          });
        }
      }
      
      const analysis = await analyzeLabResults(enhancedValues);
      setResult(analysis);
      toast({
        title: 'Analysis Complete',
        description: 'Your lab results have been analyzed successfully.',
      });
    } catch (error) {
      console.error('Error analyzing lab results:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis failed',
        description: 'Unable to analyze lab results. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <FileText className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          This analysis uses real-time medical research data for enhanced accuracy. Results are for informational purposes only - always consult your healthcare provider for medical interpretation and treatment decisions.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg mb-8">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="labResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Laboratory Results</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your lab results here (CBC, metabolic panel, lipid profile, etc.)..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="patientGender"
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

              <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications & Supplements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List current medications, vitamins, supplements..."
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
                name="existingConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Diabetes, hypertension, allergies, etc..."
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
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze with Real-Time Data
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(loading || result) && (
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            result && (
              <>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Heart className="h-6 w-6" />
                      Health Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-blue-800">{result.healthStatus}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <AlertTriangle className="h-6 w-6" />
                      Critical Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-red-800">{result.criticalFindings}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <Utensils className="h-6 w-6" />
                      Nutrition Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-green-800">{result.nutritionRecommendations}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Activity className="h-6 w-6" />
                      Lifestyle Changes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-purple-800">{result.lifestyleRecommendations}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-900">
                      <Pill className="h-6 w-6" />
                      Supplements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-yellow-800">{result.supplementRecommendations}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-900">
                      <Calendar className="h-6 w-6" />
                      Follow-up Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-teal-800">{result.followUpActions}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <TrendingUp className="h-6 w-6" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-orange-800">{result.riskFactors}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-900">
                      <CheckCircle className="h-6 w-6" />
                      Positive Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-emerald-800">{result.positiveFindings}</p>
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